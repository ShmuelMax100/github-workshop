# Reusable Workflows & Composite Actions

> **TL;DR** — Use a **reusable workflow** (`on: workflow_call`, called from `jobs.<x>.uses:`) to share an entire pipeline with its own runners and approval gates. Use a **composite action** (`runs: using: composite`, called as a step) to DRY up 2–5 setup steps that always appear together inside a job.

Keep your CI/CD DRY— define once, call from anywhere.

---

## Two Approaches

| | Reusable Workflow | Composite Action |
|-|-------------------|-----------------|
| **What it is** | A full workflow (jobs + steps) | A single action made of steps |
| **Called from** | Another workflow's `jobs:` | A step (`uses:`) inside any job |
| **Has its own runner** | ✅ Yes (each job) | ❌ No — runs on the caller's runner |
| **Secrets** | Passed explicitly or `secrets: inherit` | Inherited from caller |
| **Best for** | Shared deploy/release pipelines | Shared setup steps (install, cache, auth) |

---

## Reusable Workflows

### 1. Define the reusable workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  workflow_call:                          # this makes it reusable
    inputs:
      environment:
        description: "Target environment"
        required: true
        type: string                      # string | boolean | number
      dry-run:
        required: false
        type: boolean
        default: false
    secrets:
      DEPLOY_TOKEN:
        required: true
    outputs:
      deploy-url:
        description: "URL of the deployed app"
        value: ${{ jobs.deploy.outputs.url }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    outputs:
      url: ${{ steps.deploy.outputs.url }}
    steps:
      - uses: actions/checkout@v4
      - id: deploy
        run: |
          echo "Deploying to ${{ inputs.environment }}..."
          echo "url=https://${{ inputs.environment }}.example.com" >> $GITHUB_OUTPUT
        env:
          TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

### 2. Call the reusable workflow

```yaml
# .github/workflows/ci.yml
jobs:
  build:
    runs-on: ubuntu-latest
    steps: [...]

  deploy-staging:
    needs: build
    uses: ./.github/workflows/deploy.yml       # same repo
    with:
      environment: staging
      dry-run: false
    secrets:
      DEPLOY_TOKEN: ${{ secrets.STAGING_TOKEN }}

  deploy-prod:
    needs: deploy-staging
    uses: org/shared-workflows/.github/workflows/deploy.yml@main   # another repo
    with:
      environment: production
    secrets: inherit                           # pass all caller secrets through
```

### Using the output

```yaml
  post-deploy:
    needs: deploy-staging
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deployed to ${{ needs.deploy-staging.outputs.deploy-url }}"
```

---

## Composite Actions

A composite action packages a sequence of steps into a single reusable `uses:` call.

### 1. Create the action

```yaml
# .github/actions/setup-python-project/action.yml
name: "Setup Python Environment"
description: "Install Python, restore pip cache, install dependencies"

inputs:
  python-version:
    description: "Python version"
    default: "3.11"
  requirements-file:
    description: "Path to requirements file"
    default: "requirements.txt"

outputs:
  cache-hit:
    description: "Whether the pip cache was restored"
    value: ${{ steps.cache.outputs.cache-hit }}

runs:
  using: composite
  steps:
    - uses: actions/setup-python@v5
      with:
        python-version: ${{ inputs.python-version }}

    - id: cache
      uses: actions/cache@v4
      with:
        path: ~/.cache/pip
        key: ${{ runner.os }}-pip-${{ inputs.python-version }}-${{ hashFiles(inputs.requirements-file) }}

    - run: pip install -r ${{ inputs.requirements-file }}
      shell: bash
```

### 2. Use the composite action

```yaml
# Any workflow in the same repo
steps:
  - uses: actions/checkout@v4

  - uses: ./.github/actions/setup-python-project  # local composite action
    with:
      python-version: "3.12"

  - run: pytest src/
```

---

## When to Use Which

**Use a reusable workflow when:**
- You want to share an entire multi-job pipeline (build + test + deploy)
- The shared logic needs its own runner and environment
- You want approval gates (`environment:`) in the shared flow
- You're sharing across repositories

**Use a composite action when:**
- You want to DRY up repeated setup steps (install tools, configure auth, set env vars)
- The logic belongs inside an existing job, not as a separate job
- You're packaging 2–5 steps that always appear together

---

## Calling from Another Repository

```yaml
# Calling a reusable workflow from a different repo
uses: org/shared-workflows/.github/workflows/deploy.yml@v2

# Calling a composite action from a different repo
uses: org/shared-actions/.github/actions/setup-env@main
```

Pin to a SHA for security:

```yaml
uses: org/shared-workflows/.github/workflows/deploy.yml@abc1234def5678
```

→ See example workflow: [examples/reusable-workflow.yml](./examples/reusable-workflow.yml)
