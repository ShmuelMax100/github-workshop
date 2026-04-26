# Artifacts — Persisting & Sharing Build Outputs

Artifacts let you save files from a workflow run and share them between jobs or download them afterward.

---

## Uploading Artifacts

```yaml
- name: Upload test results
  uses: actions/upload-artifact@v4
  with:
    name: test-results              # artifact name (shown in the UI)
    path: |                         # one or more paths
      test-results.xml
      coverage/
      logs/*.log
    retention-days: 30              # default: 90 days
    if-no-files-found: warn         # warn | error | ignore
```

### Upload even on failure

```yaml
- uses: actions/upload-artifact@v4
  if: always()                      # runs even if previous steps failed
  with:
    name: debug-logs
    path: '*.log'
```

---

## Downloading Artifacts in Another Job

Each job gets a fresh VM — use artifacts to pass files between jobs.

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: python -m build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: dist
          path: ./dist             # where to put the files locally

      - run: ls -la ./dist
      - run: ./deploy.sh
```

### Download all artifacts from a run

```yaml
- uses: actions/download-artifact@v4
  # no 'name' → downloads ALL artifacts into separate directories
  with:
    path: ./all-artifacts
```

---

## Downloading Artifacts via `gh` CLI

```bash
# List artifacts for the latest run
gh run view <run-id> --json artifacts --jq '.artifacts[].name'

# Download all artifacts from a run
gh run download <run-id>

# Download a specific artifact
gh run download <run-id> --name test-results --dir ./results

# Download from the latest run on current branch
gh run download
```

---

## Common Artifact Patterns

### Test results

```yaml
- name: Run tests
  run: pytest src/ --junitxml=test-results.xml

- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: test-results-py${{ matrix.python-version }}
    path: test-results.xml
    retention-days: 14
```

### Build output passed to deploy

```yaml
# In build job
- uses: actions/upload-artifact@v4
  with:
    name: dist-${{ steps.version.outputs.tag }}
    path: dist/

# In deploy job
- uses: actions/download-artifact@v4
  with:
    name: dist-${{ needs.build.outputs.version }}
    path: dist/
```

### Coverage report

```yaml
- run: pytest src/ --cov=src --cov-report=html

- uses: actions/upload-artifact@v4
  with:
    name: coverage-report
    path: htmlcov/
    retention-days: 7
```

---

## Artifact Limits

| Limit | Value |
|-------|-------|
| Max artifact size | 10 GB per artifact |
| Max total storage | Depends on GitHub plan |
| Default retention | 90 days |
| Minimum retention | 1 day |
| Maximum retention | 400 days (enterprise) |

---

## Artifacts vs. Caching

| | Artifacts | Cache |
|-|-----------|-------|
| **Purpose** | Store build outputs to download later | Speed up builds by reusing files |
| **Shared between** | Jobs in the same run, or downloaded externally | Runs on the same branch |
| **Survives after run** | Yes (until retention expires) | Yes (until evicted by size limit) |
| **Action** | `upload-artifact` / `download-artifact` | `actions/cache` |
| **Example** | `dist/`, test results, logs | `~/.cache/pip`, `node_modules` |
