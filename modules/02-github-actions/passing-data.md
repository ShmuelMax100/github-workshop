# Passing Data Between Steps and Jobs

> **TL;DR** — Within a job, write `key=value` to `$GITHUB_OUTPUT` (referenced as `steps.<id>.outputs.<key>`) or `$GITHUB_ENV` for plain env vars. Across jobs, use job `outputs:` for small strings and `upload-artifact`/`download-artifact` for files — there is no shared filesystem.

GitHub Actions jobsrun on isolated VMs — they share nothing by default. This guide covers every mechanism for moving data within a job and across jobs.

---

## Within a Job: Passing Data Between Steps

### `$GITHUB_OUTPUT` — step outputs

Write a `key=value` pair to `$GITHUB_OUTPUT`. Any later step in the same job can read it via `${{ steps.<step-id>.outputs.<key> }}`.

```yaml
steps:
  - name: Generate version
    id: version                                        # id is required to reference outputs
    run: echo "tag=v$(date +%Y%m%d)-${{ github.run_number }}" >> $GITHUB_OUTPUT

  - name: Use version
    run: echo "Building ${{ steps.version.outputs.tag }}"

  - uses: actions/upload-artifact@v4
    with:
      name: dist-${{ steps.version.outputs.tag }}      # reuse in action inputs too
      path: dist/
```

### `$GITHUB_ENV` — environment variables for later steps

Write `KEY=VALUE` to `$GITHUB_ENV`. The variable is available in all subsequent steps as a regular environment variable.

```yaml
steps:
  - name: Set build config
    run: |
      echo "APP_ENV=staging" >> $GITHUB_ENV
      echo "BUILD_DATE=$(date +%Y-%m-%d)" >> $GITHUB_ENV

  - name: Use config
    run: echo "Deploying $APP_ENV on $BUILD_DATE"
```

> Use `$GITHUB_OUTPUT` when you need a named output to reference by step id. Use `$GITHUB_ENV` when you want a plain env var available to all remaining steps.

### `$GITHUB_STEP_SUMMARY` — write to the job summary

Append Markdown to the job summary (visible in the Actions UI under each job):

```yaml
- name: Test summary
  run: |
    echo "## Test Results" >> $GITHUB_STEP_SUMMARY
    echo "| Suite | Result |" >> $GITHUB_STEP_SUMMARY
    echo "|-------|--------|" >> $GITHUB_STEP_SUMMARY
    echo "| Unit  | ✅ Passed |" >> $GITHUB_STEP_SUMMARY
```

---

## Across Jobs: Passing Data Between Jobs

Jobs run on separate VMs with no shared filesystem. Use one of these patterns:

### Pattern 1: Job outputs (for small values)

Expose a step output as a job-level output, then read it in a dependent job via `needs.<job>.outputs.<key>`.

```yaml
jobs:
  prepare:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.gen.outputs.tag }}            # declare job output
    steps:
      - id: gen
        run: echo "tag=v$(date +%Y%m%d)" >> $GITHUB_OUTPUT

  build:
    needs: prepare
    runs-on: ubuntu-latest
    steps:
      - run: echo "Building ${{ needs.prepare.outputs.version }}"

  deploy:
    needs: [prepare, build]
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh ${{ needs.prepare.outputs.version }}
```

> Job outputs are plain strings. For structured data, serialize to JSON and use `fromJSON()`.

### Pattern 2: Artifacts (for files)

Upload files at the end of one job and download them at the start of the next.

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: python -m build
      - uses: actions/upload-artifact@v4
        with:
          name: dist-packages
          path: dist/

  publish:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: dist-packages
          path: dist/
      - run: twine upload dist/*
        env:
          TWINE_TOKEN: ${{ secrets.PYPI_TOKEN }}
```

### Pattern 3: Cache (for dependency directories)

Use `actions/cache` to persist directories that are expensive to rebuild. Covered in detail in [caching-and-matrix.md](./caching-and-matrix.md).

---

## Choosing the Right Mechanism

| Need | Use |
|------|-----|
| Pass a string/number from one step to the next in the same job | `$GITHUB_OUTPUT` |
| Set an env var for all remaining steps in a job | `$GITHUB_ENV` |
| Pass a value from one job to a dependent job | Job `outputs:` + `needs.<job>.outputs.<key>` |
| Pass files from one job to another | `actions/upload-artifact` + `actions/download-artifact` |
| Share installed dependencies across runs | `actions/cache` |
| Write a human-readable summary visible in the Actions UI | `$GITHUB_STEP_SUMMARY` |

---

## GitLab CI / Jenkins Equivalents

| | GitLab CI | Jenkins | GitHub Actions |
|-|-----------|---------|----------------|
| Step → step (same job) | Shell variable (`export FOO=bar`) | Shell variable | `$GITHUB_OUTPUT` / `$GITHUB_ENV` |
| Job → job (value) | `dotenv` artifact report | `env.MY_VAR` (shared agent) | Job `outputs:` |
| Job → job (files) | `artifacts: paths:` + `dependencies:` | `stash` / `unstash` | `upload-artifact` + `download-artifact` |
| Across runs (deps) | `cache: paths:` | Shared workspace | `actions/cache` |

---

## Full Example

```yaml
jobs:
  prepare:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.ver.outputs.tag }}
    steps:
      - id: ver
        run: echo "tag=v$(date +%Y%m%d)-${{ github.run_number }}" >> $GITHUB_OUTPUT

  build:
    needs: prepare
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: python -m build
      - uses: actions/upload-artifact@v4
        with:
          name: dist-${{ needs.prepare.outputs.version }}
          path: dist/

  deploy:
    needs: [prepare, build]
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: dist-${{ needs.prepare.outputs.version }}
          path: dist/
      - run: ./scripts/deploy.sh ${{ needs.prepare.outputs.version }}
```
