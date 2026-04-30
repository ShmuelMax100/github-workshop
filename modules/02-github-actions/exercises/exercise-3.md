# Exercise 3 — Release Pipeline: Dispatch, Reusable Workflows, Matrix & Composite Actions

> **TL;DR** — In ~30 minutes you'll build a release pipeline that ties together five core Actions concepts: a **composite action**, a **reusable workflow** with a **matrix**, a `release.yml` triggered by **`workflow_dispatch` _and_ git tags**, all wired up using third-party **`uses:`** actions to publish a GitHub Release.

**Duration:** ~30 minutes
**Prerequisites:** Exercise 2 (`ci.yml`) merged to `main`.
**Goal:** A release workflow you can fire manually with a version input (or by pushing a `v*` tag) that validates → builds → publishes a GitHub Release with attached artifacts.

---

## What you'll build

```
┌──────────────────────────────────────────────────────────────────┐
│  release.yml          (workflow_dispatch + push tags 'v*')       │
│                                                                  │
│   ┌───────────────────┐     ┌───────────────┐    ┌────────────┐  │
│   │ validate (calls   │ ──▶ │ build         │──▶ │ publish    │  │
│   │ reusable-         │     │ (uses         │    │ (creates   │  │
│   │ validate.yml)     │     │ composite     │    │ GitHub     │  │
│   │  matrix: 3 OS ×   │     │ action)       │    │ Release)   │  │
│   │          3 Python │     │               │    │            │  │
│   └───────────────────┘     └───────────────┘    └────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

**Files you'll create:**

```
.github/
├── actions/
│   └── setup-python-project/
│       └── action.yml          ← composite action (Part A)
└── workflows/
    ├── reusable-validate.yml   ← callable workflow w/ matrix (Part B)
    └── release.yml             ← dispatch + tag trigger (Part C)
```

---

## Setup

```bash
git checkout main && git pull
BRANCH="feature/$(whoami)/release-workflow"
git checkout -b "$BRANCH"
mkdir -p .github/actions/setup-python-project
mkdir -p .github/workflows
```

---

## Part A — Composite Action: `setup-python-project` (5 min)

A **composite action** bundles repeated steps into one reusable `uses:` block. We'll wrap "checkout + setup-python + cache + install deps" so every job in every workflow gets it for free.

Create `.github/actions/setup-python-project/action.yml`:

```yaml
name: Setup Python Project
description: Checkout, install Python, restore pip cache, install requirements

inputs:
  python-version:
    description: Python version to install
    required: false
    default: "3.11"

# TODO ①: Declare this as a composite action
# Hint: runs.using: "composite"

runs:
  using: "composite"
  steps:
    - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4

    # TODO ②: Set up Python using inputs.python-version
    # Hint: with: python-version: ${{ inputs.python-version }}

    - name: Cache pip
      uses: actions/cache@v4
      with:
        path: ~/.cache/pip
        key: ${{ runner.os }}-py${{ inputs.python-version }}-${{ hashFiles('requirements.txt') }}
        restore-keys: ${{ runner.os }}-py${{ inputs.python-version }}-

    # TODO ③: Add a step that runs `pip install -r requirements.txt`
    # Hint: composite steps that run shell commands need `shell: bash`
```

> 💡 **Why composite actions?** They live in your repo (no marketplace publish needed), are referenced as `uses: ./.github/actions/setup-python-project`, and DRY up workflows. Read more: [reusable-workflows.md → "Composite actions"](../reusable-workflows.md).

---

## Part B — Reusable Workflow with Matrix (10 min)

A **reusable workflow** is a full workflow file that other workflows can `uses:`. Unlike a composite action (which is a step), a reusable workflow is a job. Perfect for "run our full validation suite from anywhere."

Create `.github/workflows/reusable-validate.yml`:

```yaml
name: Reusable Validate

# TODO ④: Make this workflow callable from other workflows
# Hint: on: workflow_call: with `inputs:` for python-versions (string, default '["3.11"]')

permissions:
  contents: read

jobs:
  validate:
    name: Validate (${{ matrix.os }} / py${{ matrix.python-version }})
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
      # TODO ⑤: Build a matrix with:
      #   os: [ubuntu-latest, windows-latest, macos-latest]
      #   python-version: fromJSON(inputs.python-versions)
      # Hint: matrix:
      #         os: [...]
      #         python-version: ${{ fromJSON(inputs.python-versions) }}

    steps:
      # TODO ⑥: Use the composite action from Part A
      # Hint: uses: ./.github/actions/setup-python-project
      #       with: python-version: ${{ matrix.python-version }}

      - name: Lint
        run: |
          pip install ruff
          ruff check src/

      - name: Test
        run: pytest src/ --junitxml=test-results-${{ matrix.os }}-${{ matrix.python-version }}.xml

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results-${{ matrix.os }}-${{ matrix.python-version }}
          path: test-results-*.xml
```

> 💡 **Composite action vs reusable workflow:**
> | | Composite action | Reusable workflow |
> |---|---|---|
> | Granularity | A single step | A whole job (or many) |
> | Runs on | Caller's runner | Its own runner(s) |
> | Can use matrix | ❌ | ✅ |
> | Called via | `uses: ./path` (in `steps:`) | `uses: ./path` (under `jobs.<id>.uses:`) |

---

## Part C — Release Workflow: Dispatch + Tags (15 min)

Now the headline workflow. It triggers two ways:

1. **Manually** via `workflow_dispatch` with a `version` input — operator-driven release.
2. **Automatically** when someone pushes a `v*` git tag — release-by-tagging.

Create `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    tags:
      - "v*"
  # TODO ⑦: Add workflow_dispatch with a `version` input
  #   Hint:
  #     workflow_dispatch:
  #       inputs:
  #         version:
  #           description: 'Release version (e.g., v1.2.3)'
  #           required: true
  #           type: string
  #         prerelease:
  #           description: 'Mark as pre-release'
  #           type: boolean
  #           default: false

permissions:
  contents: write   # required for creating releases

jobs:
  # ── Job 1: Resolve version (from tag OR dispatch input) ─────────────
  resolve:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.v.outputs.version }}
    steps:
      - id: v
        run: |
          if [ "${{ github.event_name }}" = "workflow_dispatch" ]; then
            echo "version=${{ inputs.version }}" >> "$GITHUB_OUTPUT"
          else
            echo "version=${GITHUB_REF#refs/tags/}" >> "$GITHUB_OUTPUT"
          fi

  # ── Job 2: Validate via the reusable workflow ───────────────────────
  validate:
    needs: resolve
    # TODO ⑧: Call the reusable workflow from Part B
    # Hint: uses: ./.github/workflows/reusable-validate.yml
    #       with:
    #         python-versions: '["3.10","3.11","3.12"]'

  # ── Job 3: Build distribution ───────────────────────────────────────
  build:
    needs: [resolve, validate]
    runs-on: ubuntu-latest
    steps:
      # TODO ⑨: Use the composite action (default Python is fine)
      # Hint: uses: ./.github/actions/setup-python-project

      - name: Build wheel + sdist
        run: |
          pip install build
          python -m build

      - name: Upload dist artifact
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

  # ── Job 4: Publish GitHub Release ───────────────────────────────────
  publish:
    needs: [resolve, build]
    runs-on: ubuntu-latest
    steps:
      - name: Download dist
        uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/

      # TODO ⑩: Create a GitHub Release using softprops/action-gh-release@v2
      # Hint:
      #   - uses: softprops/action-gh-release@v2
      #     with:
      #       tag_name: ${{ needs.resolve.outputs.version }}
      #       name: Release ${{ needs.resolve.outputs.version }}
      #       generate_release_notes: true
      #       prerelease: ${{ inputs.prerelease || false }}
      #       files: dist/*
```

---

## 💡 TODO Hints — Deep Links

| # | TODO | Concept | Read this |
|---|---|---|---|
| ① | `runs.using: "composite"` | Composite action declaration | [reusable-workflows.md → "Composite actions"](../reusable-workflows.md) |
| ② | Use input in composite step | `${{ inputs.<name> }}` in actions | [core-concepts.md → "Steps"](../core-concepts.md) |
| ③ | `shell: bash` for run steps | Composite action requirement | [reusable-workflows.md](../reusable-workflows.md) |
| ④ | `on: workflow_call:` | Reusable workflow trigger | [reusable-workflows.md → "Reusable workflows"](../reusable-workflows.md) |
| ⑤ | `fromJSON()` to expand matrix | Dynamic matrix from input string | [caching-and-matrix.md → "Dynamic matrix"](../caching-and-matrix.md) |
| ⑥ | Local action via `uses: ./path` | Calling a composite action | [reusable-workflows.md](../reusable-workflows.md) |
| ⑦ | `workflow_dispatch` inputs | Manual triggers | [manual-triggers.md](../manual-triggers.md) |
| ⑧ | `jobs.<id>.uses:` | Calling a reusable workflow | [reusable-workflows.md](../reusable-workflows.md) |
| ⑨ | Reusing the composite action | DRY principle | [reusable-workflows.md](../reusable-workflows.md) |
| ⑩ | Third-party action via SHA-pinned `uses:` | Marketplace actions | [security-best-practices.md → "SHA-pin"](../security-best-practices.md) |

---

## Validate It

### Run via dispatch (no tag needed)

```bash
git add .github/
git commit -m "ci: add release pipeline (dispatch + tags + reusable + matrix)"
git push -u origin "$BRANCH"
gh pr create --title "ci: add release workflow" --body "Adds release.yml with dispatch + reusable + composite."
# After merge to main:
gh workflow run release.yml -f version=v0.1.0 -f prerelease=true
gh run watch
```

### Run via tag

```bash
git tag v0.1.1
git push origin v0.1.1
```

### ✅ Checklist

- [ ] `gh workflow run release.yml` shows the `version` and `prerelease` inputs in the UI
- [ ] `validate` job fans out to **9 matrix combinations** (3 OS × 3 Python) — visible as separate jobs
- [ ] `build` waits for all matrix combos
- [ ] A new entry appears under the repo's **Releases** page with `dist/*` files attached
- [ ] Auto-generated release notes list the commits since the previous tag

---

## Bonus Challenges

1. **Concurrency** — add `concurrency: { group: release-${{ github.ref }}, cancel-in-progress: false }` so two release runs can't race.
2. **SHA-pin everything** — replace every `@v4`/`@v2` in `release.yml` with full commit SHAs.
3. **Environment + approval** — gate the `publish` job behind `environment: production` with required reviewers.
4. **Skip matrix on dispatch** — accept a boolean `quick` input that, when true, narrows the reusable's matrix to `["3.11"]` only. (Pass it through with `with: python-versions: ${{ inputs.quick && '["3.11"]' || '["3.10","3.11","3.12"]' }}`.)
5. **Reuse from another repo** — move `reusable-validate.yml` to a shared `.github` org repo and call it as `uses: my-org/.github/.github/workflows/reusable-validate.yml@main`.

---

## Concept Recap

| Concept | Where used in this exercise |
|---|---|
| **Workflow file structure** | All three workflow files |
| **`workflow_dispatch`** with inputs | `release.yml` Part C |
| **Tag-triggered releases** | `release.yml` `on: push: tags:` |
| **Matrix builds** | `reusable-validate.yml` (OS × Python) |
| **Reusable workflows** | `reusable-validate.yml` + `release.yml` Job 2 |
| **Composite actions** | `setup-python-project/action.yml` |
| **Third-party actions via `uses:`** | `softprops/action-gh-release`, `actions/checkout`, `actions/setup-python`, `actions/cache`, `actions/upload-artifact`, `actions/download-artifact` |
| **GitHub Releases** | `publish` job |

---

## Solution Reference

- → [solutions/03-release-workflow/.github/actions/setup-python-project/action.yml](../../../solutions/03-release-workflow/.github/actions/setup-python-project/action.yml) — Part A (composite action)
- → [solutions/03-release-workflow/.github/workflows/reusable-validate.yml](../../../solutions/03-release-workflow/.github/workflows/reusable-validate.yml) — Part B (reusable workflow + matrix)
- → [solutions/03-release-workflow/.github/workflows/release.yml](../../../solutions/03-release-workflow/.github/workflows/release.yml) — Part C (dispatch + tags + publish)
- → [solutions/03-release-workflow/README.md](../../../solutions/03-release-workflow/README.md) — walkthrough notes
