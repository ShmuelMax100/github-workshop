# Exercise 2 — Build a CI Pipeline

> **TL;DR** — In ~20 minutes you'll build `ci.yml` (lint → test matrix → build) and open a PR to watch it run as required status checks.

**Duration:** ~20 minutes
**Goal:** A working CI workflow running on every PR as required status checks.

---

## Setup

```bash
BRANCH="feature/$(whoami)/ci-workflow"
git checkout -b "$BRANCH"
mkdir -p .github/workflows
```

---

## Part A — Build `ci.yml` (15 min)

Create `.github/workflows/ci.yml` — lint, test, and build.

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# TODO ①: Set default permissions to read-only at workflow level

jobs:
  # ── Job 1: Lint ────────────────────────────────────────────────────
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4

      # TODO ②: Set up Python 3.11 using actions/setup-python

      - name: Cache pip
        uses: actions/cache@v4
        with:
          path: ~/.cache/pip
          key: ${{ runner.os }}-pip-${{ hashFiles('requirements.txt') }}
          restore-keys: ${{ runner.os }}-pip-

      - name: Install linter
        run: pip install ruff

      - name: Run lint
        run: ruff check src/

  # ── Job 2: Test ────────────────────────────────────────────────────
  test:
    name: Test
    runs-on: ubuntu-latest
    # TODO ③: Add a matrix for python-version: ["3.10", "3.11", "3.12"]

    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4

      # TODO ④: Set up Python from the matrix variable

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Run tests
        run: pytest src/ --junitxml=test-results.xml

      # TODO ⑤: Upload test-results.xml as an artifact (always, even on failure)

  # ── Job 3: Build ───────────────────────────────────────────────────
  build:
    name: Build
    # TODO ⑥: Make this job wait for lint AND test to succeed
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4

      - name: Build distribution
        run: |
          pip install build
          python -m build

      - name: Upload dist artifact
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
```

### 💡 Stuck on a CI TODO? Hints with deep links

Read the linked section first. Open the solution (`solutions/02-ci-workflow/`) only as a last resort.

| # | TODO | Concept | Read this |
|---|---|---|---|
| ① | Set default permissions to read-only | `permissions:` key at workflow level | [10-permissions.md → "The `permissions:` key"](../10-permissions.md?plain=1#L34) |
| ② | Set up Python 3.11 | Using a third-party action via `uses:` | [core-concepts.md → "Steps"](../core-concepts.md?plain=1#L140) |
| ③ | Add a matrix for python versions | `strategy: matrix:` | [caching-and-matrix.md → "Basic matrix"](../caching-and-matrix.md?plain=1#L116) |
| ④ | Use the matrix value in setup-python | `${{ matrix.<key> }}` reference | [caching-and-matrix.md → "Basic matrix"](../caching-and-matrix.md?plain=1#L116) |
| ⑤ | Upload artifact even on failure | `actions/upload-artifact` + `if: always()` | [03-operations-debugging/artifacts.md → "Upload even on failure"](../../03-operations-debugging/artifacts.md?plain=1#L24) |
| ⑥ | Make `build` wait for `lint` AND `test` | `needs: [lint, test]` | [job-orchestration.md → "`needs:`"](../job-orchestration.md?plain=1#L21) |

---

## Part B — Push and validate CI on a PR (5 min)

Push your branch and open a PR so `ci.yml` runs as required status checks.

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add lint, test matrix, and build workflow"
git push -u origin "$BRANCH"
```

Open a PR and watch the checks:

```bash
gh pr create \
  --title "ci: add CI workflow" \
  --body "Adds ci.yml (lint, test matrix, build)."

gh pr checks --watch
```

**Verify on the PR's "Checks" tab:**
- [ ] `lint` runs and passes
- [ ] `test (3.10)`, `test (3.11)`, `test (3.12)` all run in parallel and pass
- [ ] `build` waits for `lint` and `test` to finish, then runs and passes
- [ ] `test-results.xml` artifact is attached to the run
- [ ] The PR cannot be merged until all CI checks pass

> **If a check fails:** click the failing job in the PR's Checks tab → expand the failing step to read the logs. Fix locally, commit, push — the PR re-runs CI automatically.

---

## Bonus Challenges

1. **SHA-pin your actions** — replace `@v4` tags with their full commit SHAs
2. **Add a concurrency group** so a new push to the same PR cancels in-flight runs
3. **Add a `CODEOWNERS` rule** that requires platform-team review for any `.github/workflows/` change

---

## Solution Reference

→ [solutions/02-ci-workflow/.github/workflows/ci.yml](../../../solutions/02-ci-workflow/.github/workflows/ci.yml)
