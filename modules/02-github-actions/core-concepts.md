# GitHub Actions — Core Concepts

---

## Anatomy of a Workflow File

Every workflow lives in `.github/workflows/*.yml`. Here's the full structure:

```yaml
name: CI                        # Display name shown in the Actions UI

on:                             # TRIGGER — what events start this workflow
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:                    # Token permissions (always set explicitly)
  contents: read

env:                            # Workflow-level environment variables
  APP_ENV: production

jobs:                           # One or more jobs (run in parallel by default)
  build:                        # Job ID (used to reference via needs:)
    name: Build                 # Display name in the UI
    runs-on: ubuntu-latest      # Runner OS or label

    env:                        # Job-level environment variables
      LOG_LEVEL: debug

    steps:                      # Ordered list of tasks (run sequentially)
      - name: Checkout code
        uses: actions/checkout@v4       # Pre-built action

      - name: Set up Python
        uses: actions/setup-python@v5
        with:                           # Inputs to the action
          python-version: "3.11"

      - name: Run tests
        run: pytest src/                # Shell command
        env:                            # Step-level environment variables
          TEST_MODE: "true"
```

---

## Key Primitives

| Primitive | Purpose |
|-----------|---------|
| `name:` | Human-readable label shown in the GitHub UI |
| `on:` | One or more events that trigger the workflow |
| `permissions:` | Scope of the `GITHUB_TOKEN` for this run |
| `env:` | Environment variables (workflow / job / step level) |
| `jobs:` | Top-level parallel execution units |
| `runs-on:` | The machine/OS that executes the job |
| `steps:` | Ordered tasks inside a job |
| `uses:` | Reference a pre-built action (Marketplace or local) |
| `run:` | A shell command or multi-line script |
| `with:` | Named inputs to an action |
| `if:` | Conditional — skip the job/step if expression is false |
| `needs:` | Job dependency — wait for another job to finish first |
| `outputs:` | Expose values from a job for downstream jobs |
| `timeout-minutes:` | Kill the job/step if it runs too long |

---

## Triggers (`on:`)

### Common event triggers

```yaml
on:
  push:
    branches: [main, 'release/**']
    paths: ['src/**', '!src/docs/**']   # only when these paths change

  pull_request:
    branches: [main]
    types: [opened, synchronize, reopened]

  schedule:
    - cron: '0 9 * * 1-5'              # weekdays at 09:00 UTC

  workflow_dispatch:                    # manual button in UI / gh CLI

  workflow_call:                        # called from another workflow
```

### Path filters — avoid unnecessary runs

```yaml
on:
  push:
    paths:
      - 'src/**'           # only run when source code changes
      - 'requirements.txt'
    paths-ignore:
      - '**.md'            # skip doc-only changes
```

### Skipping a run from the commit message

```bash
git commit -m "chore: update readme [skip ci]"
```

---

## Jobs

Each job:
- Gets a **fresh virtual machine** (no shared state between jobs)
- Runs **in parallel** with other jobs by default
- Can depend on other jobs via `needs:`
- Has its own `runs-on:`, `env:`, `steps:`, and `permissions:`

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps: [...]

  test:
    runs-on: ubuntu-latest
    steps: [...]

  build:
    needs: [lint, test]           # runs only after both succeed
    runs-on: ubuntu-latest
    steps: [...]
```

---

## Steps

Steps inside a job run **sequentially** on the same machine.

```yaml
steps:
  # Action from Marketplace
  - uses: actions/checkout@v4

  # Action with inputs
  - uses: actions/setup-python@v5
    with:
      python-version: "3.11"

  # Shell command
  - run: pip install -r requirements.txt

  # Multi-line script
  - name: Build and package
    run: |
      pip install build
      python -m build
      ls -la dist/

  # Conditional step — only runs on main
  - name: Deploy
    if: github.ref == 'refs/heads/main'
    run: ./deploy.sh

  # Always runs — even if previous steps failed
  - name: Upload logs
    if: always()
    uses: actions/upload-artifact@v4
    with:
      name: logs
      path: '*.log'
```

---

## Runners (`runs-on:`)

```yaml
runs-on: ubuntu-latest          # GitHub-hosted Linux
runs-on: windows-latest         # GitHub-hosted Windows
runs-on: macos-latest           # GitHub-hosted macOS

runs-on: [self-hosted, linux]   # Self-hosted runner with labels
runs-on: [self-hosted, linux, gpu]  # Multiple labels — must match all
```

→ See the full runner guide: [runners-guide.md](./runners-guide.md)

---

## Contexts

GitHub provides built-in context objects you can reference anywhere with `${{ }}`:

| Context | Common fields |
|---------|--------------|
| `github` | `.sha`, `.ref`, `.ref_name`, `.actor`, `.event_name`, `.repository` |
| `runner` | `.os`, `.arch`, `.workspace` |
| `env` | Any environment variable set in the workflow |
| `secrets` | Repository / org / environment secrets |
| `vars` | Repository / org / environment variables |
| `steps` | Outputs and results from previous steps in the same job |
| `needs` | Outputs from jobs declared in `needs:` |
| `inputs` | Inputs from `workflow_dispatch` or `workflow_call` |

```yaml
- run: |
    echo "Actor:  ${{ github.actor }}"
    echo "Branch: ${{ github.ref_name }}"
    echo "SHA:    ${{ github.sha }}"
    echo "OS:     ${{ runner.os }}"
```

---

## Expressions & Functions

```yaml
# Conditional
if: github.ref == 'refs/heads/main'
if: github.event_name == 'pull_request'
if: failure()
if: always()
if: cancelled()
if: success() && github.ref == 'refs/heads/main'

# String functions
${{ format('Hello, {0}!', github.actor) }}
${{ contains(github.ref, 'release') }}
${{ startsWith(github.ref, 'refs/heads/') }}

# JSON
${{ toJSON(github) }}
${{ fromJSON(steps.output.outputs.data) }}

# File hash (for cache keys)
${{ hashFiles('requirements.txt') }}
${{ hashFiles('**/package-lock.json') }}
```
