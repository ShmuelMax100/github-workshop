# Job Orchestration — needs, Parallel, Conditional & Data Passing

> **TL;DR** — Jobs run in parallel; sequence them with `needs:`. Gate jobs and steps with `if:` (`github.ref`, `success()`, `failure()`, `always()`). For repeated rapid pushes, add a `concurrency:` block with `cancel-in-progress: true` so only the latest run finishes.

---

## Default: Jobs Run in Parallel

Unless you declare dependencies, all jobs start at the same time.

```yaml
jobs:
  lint:    # ─┐
    ...    #  ├── start simultaneously
  test:    # ─┘
    ...
```

---

## `needs:` — Sequential Dependencies

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps: [...]

  test:
    runs-on: ubuntu-latest
    steps: [...]

  build:
    needs: [lint, test]       # waits for BOTH to succeed
    runs-on: ubuntu-latest
    steps: [...]

  deploy:
    needs: build              # waits for build only
    runs-on: ubuntu-latest
    steps: [...]
```

This creates a pipeline graph:

```
lint ──┐
       ├──► build ──► deploy
test ──┘
```

---

## Conditional Execution (`if:`)

### On a job

```yaml
jobs:
  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'         # only on main branch
    runs-on: ubuntu-latest
```

```yaml
  notify-failure:
    needs: [lint, test, build]
    if: failure()                               # only if any dependency failed
    runs-on: ubuntu-latest
    steps:
      - run: echo "Something failed — notify team"
```

### On a step

```yaml
steps:
  - name: Deploy to prod
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    run: ./deploy.sh

  - name: Upload logs
    if: always()                                # even if previous steps failed
    uses: actions/upload-artifact@v4
    with:
      name: logs
      path: '*.log'

  - name: Post failure comment
    if: failure()
    run: gh pr comment --body "CI failed on this PR."
    env:
      GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Common `if:` expressions

```yaml
if: github.ref == 'refs/heads/main'
if: github.ref_name == 'main'
if: github.event_name == 'pull_request'
if: github.event_name == 'push'
if: contains(github.ref, 'release')
if: startsWith(github.ref, 'refs/tags/')
if: github.actor == 'dependabot[bot]'
if: success()
if: failure()
if: always()
if: cancelled()
```

---

## Passing Data Between Steps

Use `$GITHUB_OUTPUT` to expose a step's output to later steps in the same job.

```yaml
steps:
  - name: Generate version
    id: version                                 # give the step an id
    run: echo "tag=v$(date +%Y%m%d)-${{ github.run_number }}" >> $GITHUB_OUTPUT

  - name: Print version
    run: echo "Version is ${{ steps.version.outputs.tag }}"

  - name: Use in action input
    uses: actions/upload-artifact@v4
    with:
      name: dist-${{ steps.version.outputs.tag }}
      path: dist/
```

---

## Passing Data Between Jobs

Jobs don't share a filesystem. Use `outputs:` + `needs.<job>.outputs.<name>`.

```yaml
jobs:
  prepare:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.gen.outputs.tag }}      # expose step output as job output
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

---

## Handling Partial Failures

### `continue-on-error:` — don't fail the job on step failure

```yaml
steps:
  - name: Optional lint check
    continue-on-error: true          # job continues even if this step fails
    run: ruff check src/
```

### `fail-fast: false` — let all matrix jobs finish

```yaml
strategy:
  fail-fast: false                   # default is true — cancels others on first failure
  matrix:
    python-version: ["3.10", "3.11", "3.12"]
```

### Run a job even if dependencies failed

```yaml
jobs:
  cleanup:
    needs: [build, test, deploy]
    if: always()                     # runs regardless of dependency outcomes
    runs-on: ubuntu-latest
    steps:
      - run: ./cleanup.sh
```

---

## Concurrency — Cancel Stale Runs

Prevent multiple workflows from running simultaneously on the same branch (e.g. rapid pushes during a PR).

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true           # cancels the previous run when a new one starts
```

For PRs specifically:

```yaml
concurrency:
  group: pr-${{ github.event.pull_request.number }}
  cancel-in-progress: true
```

---

## Full Orchestration Example

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: ruff check src/

  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        python-version: ["3.10", "3.11", "3.12"]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
      - run: pytest src/

  build:
    needs: [lint, test]
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.ver.outputs.tag }}
    steps:
      - uses: actions/checkout@v4
      - id: ver
        run: echo "tag=v$(date +%Y%m%d)-${{ github.run_number }}" >> $GITHUB_OUTPUT
      - run: python -m build
      - uses: actions/upload-artifact@v4
        with:
          name: dist-${{ steps.ver.outputs.tag }}
          path: dist/

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: staging
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying ${{ needs.build.outputs.version }}"

  notify:
    needs: [lint, test, build, deploy]
    if: failure()
    runs-on: ubuntu-latest
    steps:
      - run: echo "Pipeline failed — alerting team"
```
