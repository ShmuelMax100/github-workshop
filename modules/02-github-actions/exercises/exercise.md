# Exercise 2 — Build a CI Pipeline and a CD Pipeline

> **TL;DR** — In ~30 minutes you'll build **two separate workflow files**: `ci.yml` (lint → test matrix → build, runs on every push/PR) and `cd.yml` (deploy, runs on `workflow_dispatch` and push to main, gated by an environment). Splitting the two is the GitHub-native pattern — Jenkins habits push everything into one giant pipeline; here, verification and release live in different files.

**Duration:** ~30 minutes
**Goal:** Two workflows, one pull request, branch protection enforcing every required check before merge.

---

## Why two files?

| Concern | CI (`ci.yml`) | CD (`cd.yml`) |
|---|---|---|
| **What it does** | Verify the code is green | Release a build to an environment |
| **When it runs** | Every push and PR | Push to `main` (auto-staging) + manual dispatch |
| **Needs secrets?** | No | Yes — env-scoped `DEPLOY_TOKEN` |
| **Needs `environment:`?** | No | Yes — that's where approval gates live |
| **Permissions** | `contents: read` | `contents: read` (+ `id-token: write` if using OIDC) |

Mixing the two in one file is the Jenkinsfile reflex. Resist it.

---

## Setup

```bash
git checkout -b feature/<your-name>/ci-workflow
mkdir -p .github/workflows
```

---

## Part A — Build `ci.yml` (15 min)

Create `.github/workflows/ci.yml`. This file is **verification only** — no deploys, no secrets, no environments.

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

## Part B — Build `cd.yml` (10 min)

Create `.github/workflows/cd.yml`. This file is **release only** — it picks an environment, downloads the dist, and deploys.

> **Why a fallback for `environment:`?** On `workflow_dispatch`, `inputs.environment` is set by the user. On `push`, inputs don't exist — so we default to `staging` with `inputs.environment || 'staging'`. Without the fallback, push-to-main deploys would have no environment scope, no approval gate, and no env-scoped secrets.

```yaml
name: CD

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      environment:
        description: "Target environment"
        required: true
        type: choice
        options: [staging, production]

permissions:
  contents: read

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    # TODO ⑦: Use the input if provided, otherwise default to "staging"
    environment: # ⬅ fill this in

    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4

      - name: Build distribution
        run: |
          pip install build
          python -m build

      - name: Deploy
        run: echo "Deploying to ${{ inputs.environment || 'staging' }}..."
        env:
          # TODO ⑧: Reference the DEPLOY_TOKEN secret (resolved per environment)
          DEPLOY_TOKEN: # ⬅ fill this in
```

> **Where does `DEPLOY_TOKEN` come from?** When `environment:` is set, GitHub resolves `${{ secrets.DEPLOY_TOKEN }}` from that environment's secrets. So `staging` and `production` each have their own `DEPLOY_TOKEN` value, and the same line works for both.

> **Note:** This workshop's `cd.yml` rebuilds the dist for simplicity. In production you'd typically trigger CD from a successful CI run via the `workflow_run` trigger or a release tag, and download the artifact CI already built.

### 💡 Stuck on a CD TODO? Hints with deep links

| # | TODO | Concept | Read this |
|---|---|---|---|
| ⑦ | Pick the environment dynamically with a fallback | Expression: `${{ inputs.<x> \|\| 'default' }}` | [secrets-variables-environments.md → "Dynamic environment selection"](../secrets-variables-environments.md?plain=1#L204) |
| ⑧ | Reference the deploy secret | `${{ secrets.<NAME> }}` resolves per environment | [secrets-variables-environments.md → "Using secrets in a workflow"](../secrets-variables-environments.md?plain=1#L21) |

---

## Part C — Push and Validate PR Checks (5 min)

```bash
git add .github/workflows/ci.yml .github/workflows/cd.yml
git commit -m "ci/cd: add verification and release workflows"
git push -u origin feature/<your-name>/ci-workflow
```

Open a PR:

```bash
gh pr create \
  --title "ci/cd: add CI and CD workflows" \
  --body "Adds ci.yml (lint/test/build) and cd.yml (env-gated deploy)."
```

**Watch the checks run:**

```bash
gh pr checks --watch
```

**Verify:**
- [ ] `lint`, `test (matrix x3)`, and `build` all appear as PR status checks (from `ci.yml`)
- [ ] `deploy` does **not** run on the PR (it's not triggered by `pull_request`)
- [ ] The PR cannot be merged until all CI checks pass
- [ ] After merge to `main`, `cd.yml` runs and deploys to `staging`
- [ ] Manually trigger `cd.yml` with `gh workflow run cd.yml -f environment=production` to test the choice input

---

## Bonus Challenges

1. **SHA-pin your actions** — replace `@v4` tags with their full commit SHAs
2. **Trigger CD from CI** — replace `cd.yml`'s `push` trigger with `workflow_run` so it only runs after CI succeeds, and download the dist artifact from the CI run instead of rebuilding
3. **Add OIDC** — use `permissions: id-token: write` and `aws-actions/configure-aws-credentials` instead of a static `DEPLOY_TOKEN`
4. **Add a `CODEOWNERS` rule** that requires platform-team review for any `.github/workflows/` change

---

## Solution Reference

→ [solutions/02-ci-workflow/.github/workflows/ci.yml](../../../solutions/02-ci-workflow/.github/workflows/ci.yml)
→ [solutions/02-ci-workflow/.github/workflows/cd.yml](../../../solutions/02-ci-workflow/.github/workflows/cd.yml)
