# Performance & Scale: Caching and Matrix Builds

Two built-in GitHub Actions features that turn slow, repetitive pipelines into fast, thorough ones — without extra infrastructure.

---

## actions/cache — Optimize Build Times

Every job starts on a **fresh VM**. Without caching, you reinstall dependencies on every run. `actions/cache` saves a directory to GitHub's cache storage and restores it on the next run when the key matches.

### How it works

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.cache/pip          # what to cache
    key: ${{ runner.os }}-pip-${{ hashFiles('requirements.txt') }}
    restore-keys: |
      ${{ runner.os }}-pip-    # fallback if exact key not found
```

- **`key`** — exact match to restore. If it matches, cache is restored and the step reports a hit.
- **`restore-keys`** — prefix fallback. Restores the most recent partial match if the exact key is a miss.
- **`path`** — directory (or list of directories) to save/restore.

The cache is saved automatically at job end if the key was a miss.

### Common cache patterns

| Ecosystem | path | key |
|-----------|------|-----|
| Python (pip) | `~/.cache/pip` | `${{ runner.os }}-pip-${{ hashFiles('requirements.txt') }}` |
| Node (npm) | `~/.npm` | `${{ runner.os }}-npm-${{ hashFiles('package-lock.json') }}` |
| Node (yarn) | `.yarn/cache` | `${{ runner.os }}-yarn-${{ hashFiles('yarn.lock') }}` |
| Gradle | `~/.gradle/caches` | `${{ runner.os }}-gradle-${{ hashFiles('**/*.gradle*') }}` |
| Docker layers | `/tmp/.buildx-cache` | `${{ runner.os }}-buildx-${{ github.sha }}` |

### Full Python example

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4

      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      - uses: actions/cache@v4
        with:
          path: ~/.cache/pip
          key: ${{ runner.os }}-pip-${{ hashFiles('requirements.txt') }}
          restore-keys: |
            ${{ runner.os }}-pip-

      - run: pip install -r requirements.txt   # skipped on cache hit
      - run: pytest src/
```

### Cache limits

| Limit | Value |
|-------|-------|
| Max size per entry | 10 GB |
| Total cache per repo | 10 GB (oldest evicted first) |
| Retention | 7 days since last access |
| Scope | Branch-local + default branch fallback |

> Cache from `main` is accessible to all branches. Cache from a feature branch is only accessible to that branch.

---

## Matrix Builds — Multi-Version Testing in Parallel

A matrix runs the same job multiple times with different variable combinations — all in parallel.

### Basic matrix

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.10", "3.11", "3.12"]
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4
      - uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
      - run: pytest src/
```

This spawns **3 parallel jobs**, one per Python version.

### Multi-dimensional matrix

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest, macos-latest]
    python-version: ["3.11", "3.12"]
```

Produces **6 jobs** (3 OS × 2 Python versions), all running in parallel.

### Exclude specific combinations

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest, macos-latest]
    python-version: ["3.10", "3.11", "3.12"]
    exclude:
      - os: macos-latest
        python-version: "3.10"   # skip this specific combo
```

### Include extra combinations

```yaml
strategy:
  matrix:
    python-version: ["3.11", "3.12"]
    include:
      - python-version: "3.12"
        experimental: true        # add an extra variable to one variant
```

### Controlling failure behavior

```yaml
strategy:
  fail-fast: false    # default: true — let ALL matrix jobs finish even if one fails
  matrix:
    python-version: ["3.10", "3.11", "3.12"]
```

With `fail-fast: true` (default), GitHub cancels remaining jobs as soon as one fails. Set to `false` when you want results for every variant.

### Caching inside a matrix

Each matrix leg caches independently. Use `matrix.*` in the cache key:

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.cache/pip
    key: ${{ runner.os }}-py${{ matrix.python-version }}-pip-${{ hashFiles('requirements.txt') }}
```

---

## Combined Example: Matrix + Cache

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, windows-latest]
        python-version: ["3.11", "3.12"]

    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4

      - uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}

      - uses: actions/cache@v4
        with:
          path: ~/.cache/pip
          key: ${{ runner.os }}-py${{ matrix.python-version }}-pip-${{ hashFiles('requirements.txt') }}
          restore-keys: |
            ${{ runner.os }}-py${{ matrix.python-version }}-pip-

      - run: pip install -r requirements.txt
      - run: pytest src/ --junitxml=report-${{ matrix.os }}-${{ matrix.python-version }}.xml

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: results-${{ matrix.os }}-${{ matrix.python-version }}
          path: report-*.xml
```

This runs **4 jobs in parallel** (2 OS × 2 Python), each with its own cache, and uploads separate test results per variant.

---

## GitLab CI / Jenkins Equivalents

| Feature | GitLab CI | Jenkins | GitHub Actions |
|---------|-----------|---------|----------------|
| Dependency cache | `cache: paths:` | `stash` / shared workspace | `actions/cache` |
| Multi-version testing | `parallel: matrix:` | `matrix` axis (with plugin) | `strategy: matrix:` |
| Stop on first failure | `allow_failure: false` | `failFast: true` | `fail-fast: true` |
| Per-variant artifacts | `artifacts:` per job | Archived per build | `upload-artifact` with unique name |
