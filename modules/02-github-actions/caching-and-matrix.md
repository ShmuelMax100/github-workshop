# Performance & Scale: Caching and Matrix Builds

> **TL;DR** — For 80% of projects, `cache: 'pip'|'npm'|'gradle'` on the language's `setup-*` action is all you need; reach for `actions/cache@v4` only for custom paths like cargo or buildx. A `strategy: matrix:` runs the same job in parallel across versions/OSes — pair with `fail-fast: false` when you want full results.

Two built-inGitHub Actions features that turn slow, repetitive pipelines into fast, thorough ones — without extra infrastructure.

---

## Caching — Optimize Build Times

Every job starts on a **fresh VM**. Without caching, you reinstall dependencies on every run.

### Default approach: built-in cache via `setup-*` actions

For most projects, the simplest and recommended way to cache dependencies is to enable the `cache:` input on the language's `setup-*` action. GitHub maintains the path and key for you.

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'yarn'                    # 'npm' | 'yarn' | 'pnpm'
    cache-dependency-path: yarn.lock # optional, auto-detected

- uses: actions/setup-python@v5
  with:
    python-version: '3.12'
    cache: 'pip'                     # also: 'pipenv', 'poetry'

- uses: actions/setup-java@v4
  with:
    distribution: 'temurin'
    java-version: '21'
    cache: 'gradle'                  # also: 'maven', 'sbt'
```

| `setup-*` action | `cache:` values |
|------------------|-----------------|
| `setup-node` | `npm`, `yarn`, `pnpm` |
| `setup-python` | `pip`, `pipenv`, `poetry` |
| `setup-java` | `maven`, `gradle`, `sbt` |
| `setup-go` | `true` (auto) |
| `setup-dotnet` | `true` (auto, since v4) |
| `setup-ruby` | (use built-in `bundler-cache: true`) |

This covers the **80% case** — drop down to `actions/cache@v4` only when you need to cache something the `setup-*` action doesn't handle.

### When to use `actions/cache@v4` directly

Use it when you need:

- **Custom paths** — Docker buildx layers, ccache, Bazel, `~/.cargo`, build outputs
- **Unsupported languages** — Rust, C/C++, Swift, etc.
- **Multiple paths or a custom key strategy** (e.g. partial-match fallback chains)

```yaml
- uses: actions/cache@v4
  with:
    path: |
      ~/.cargo/registry
      target/
    key: ${{ runner.os }}-cargo-${{ hashFiles('Cargo.lock') }}
    restore-keys: |
      ${{ runner.os }}-cargo-
```

- **`key`** — exact match to restore. If it matches, cache is restored and the step reports a hit.
- **`restore-keys`** — prefix fallback. Restores the most recent partial match if the exact key is a miss.
- **`path`** — directory (or list of directories) to save/restore.

The cache is saved automatically at job end if the key was a miss.

### Common manual-cache patterns (when `setup-*` isn't an option)

| Ecosystem | path | key |
|-----------|------|-----|
| Rust (cargo) | `~/.cargo/registry`, `target/` | `${{ runner.os }}-cargo-${{ hashFiles('Cargo.lock') }}` |
| Docker buildx | `/tmp/.buildx-cache` | `${{ runner.os }}-buildx-${{ github.sha }}` |
| ccache | `~/.ccache` | `${{ runner.os }}-ccache-${{ github.sha }}` |
| Bazel | `~/.cache/bazel` | `${{ runner.os }}-bazel-${{ hashFiles('WORKSPACE', '**/BUILD*') }}` |

### Full Python example (using `setup-python` cache)

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4

      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
          cache: "pip"                     # built-in pip cache, keyed on requirements files

      - run: pip install -r requirements.txt   # fast on cache hit
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
