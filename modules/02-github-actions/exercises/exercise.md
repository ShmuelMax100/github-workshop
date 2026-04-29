# Exercise 2 — Build a Complete CI Workflow

> **TL;DR** — In ~30 minutes you'll fill in the TODOs of a `ci.yml` skeleton (matrix test, `needs:`, `if: github.ref == 'refs/heads/main'`, artifact upload, environment secret), add a `workflow_dispatch` trigger, and watch branch protection block your PR until every required check is green.

**Duration:**~30 minutes  
**Goal:** Build a CI workflow from scratch, push code, and validate that PR checks block merges until all gates pass.

---

## Setup

```bash
git checkout -b feature/<your-name>/ci-workflow
```

---

## Part A — Create the CI Workflow (15 min)

Create the file `.github/workflows/ci.yml` with the following structure.  
Fill in each `# TODO` section using the module concepts.

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# TODO: Set default permissions to read-only at workflow level

jobs:
  # ── Job 1: Lint ────────────────────────────────────────────────────
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4

      # TODO: Set up Python 3.11 using actions/setup-python

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
    # TODO: Add a matrix for python-version: ["3.10", "3.11", "3.12"]

    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4

      # TODO: Set up Python from matrix variable

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Run tests
        run: pytest src/ --junitxml=test-results.xml

      # TODO: Upload test-results.xml as an artifact (always, even on failure)

  # ── Job 3: Build ───────────────────────────────────────────────────
  build:
    name: Build
    # TODO: Make this job wait for lint AND test to succeed
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

  # ── Job 4: Deploy Staging ──────────────────────────────────────────
  deploy-staging:
    name: Deploy → Staging
    needs: build
    # TODO: Only run on pushes to main (not PRs)
    runs-on: ubuntu-latest
    environment: staging          # Triggers approval gate (if configured)

    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4

      - name: Download dist
        uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/

      - name: Deploy
        run: echo "Deploying to staging..."
        env:
          # TODO: Reference the STAGING_DEPLOY_TOKEN secret as DEPLOY_TOKEN
```

---

## Part B — Add `workflow_dispatch` (5 min)

Add a manual trigger to the same workflow:

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:              # Add this
    inputs:
      environment:
        description: "Target environment"
        required: true
        type: choice
        options: [staging, production]
      skip-tests:
        description: "Skip tests (fast deploy)"
        type: boolean
        default: false
```

Use the input in the test job:

```yaml
  test:
    if: ${{ !inputs.skip-tests }}   # Skip test job if input is true
```

Trigger it from the CLI:

```bash
gh workflow run ci.yml \
  --field environment=staging \
  --field skip-tests=false
```

---

## Part C — Push and Validate PR Checks (10 min)

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add CI workflow with lint, test, build, and deploy jobs"
git push -u origin feature/<your-name>/ci-workflow
```

Open a PR:

```bash
gh pr create \
  --title "ci: add CI workflow" \
  --body "Adds lint, test, build, and deploy-staging jobs."
```

**Watch the checks run:**

```bash
# Watch in terminal
gh pr checks --watch

# Or watch the run
gh run list --limit 5
gh run watch
```

**Verify:**
- [ ] All three required jobs appear as PR status checks
- [ ] The PR cannot be merged until all checks pass
- [ ] A failed test blocks the merge (try breaking a test temporarily)

---

## Bonus Challenges

1. **SHA-pin your actions** — replace `@v4` tags with their full commit SHAs
2. **Add a `CODEOWNERS` rule** that requires platform-team review for any `.github/workflows/` change
3. **Add a dependency-review job** using `actions/dependency-review-action`
4. **Create a reusable deploy workflow** and call it from `ci.yml`

---

## Solution Reference

→ [../../.github/workflows/01-basic-ci.yml](../../.github/workflows/01-basic-ci.yml)  
→ [../../.github/workflows/02-matrix-build.yml](../../.github/workflows/02-matrix-build.yml)  
→ [../../.github/workflows/03-reusable-workflow.yml](../../.github/workflows/03-reusable-workflow.yml)
