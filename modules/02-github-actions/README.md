# Module 2 — GitHub Actions Deep Dive

**Duration:** 80 minutes

---

## Learning Objectives

By the end of this module you will be able to:

- Translate Jenkins/GitLab pipelines into GitHub Actions workflows
- Understand all core workflow concepts: triggers, jobs, steps, runners
- Manage secrets, variables, and environments with approval gates
- Orchestrate jobs with dependencies, parallelism, and conditional execution
- Pass data between steps and jobs
- Build reusable workflows and composite actions
- Apply security best practices (SHA pinning)
- Configure and choose the right runner for each workload
- Build a complete CI workflow from scratch

---

## Concepts

### 1. Core Concepts — Anatomy of a Workflow

```yaml
name: CI                          # Workflow name (shown in UI)

on:                               # TRIGGER — when does this run?
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:                             # One or more jobs (run in parallel by default)
  build:                          # Job ID
    runs-on: ubuntu-latest        # Runner — where the job executes

    steps:                        # Ordered list of actions/commands
      - uses: actions/checkout@v4             # Action (from Marketplace)
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - name: Install dependencies
        run: pip install -r requirements.txt  # Shell command
      - name: Run tests
        run: pytest src/
```

**Key primitives:**

| Concept | Description |
|---------|-------------|
| `on:` | Events that trigger the workflow |
| `jobs:` | Parallel execution units (each gets a fresh VM) |
| `steps:` | Sequential tasks within a job |
| `runs-on:` | The runner OS/label |
| `uses:` | Reference a pre-built action |
| `run:` | Shell command |
| `with:` | Inputs to an action |
| `env:` | Environment variables |

---

### 2. Jenkins → GitHub Actions Mapping

See the full comparison: [jenkins-github-actions-comparison.md](./jenkins-github-actions-comparison.md)

| Jenkinsfile | GitHub Actions |
|-------------|----------------|
| `Jenkinsfile` | `.github/workflows/*.yml` |
| `pipeline {}` | workflow file |
| `stage('Build')` | `jobs: build:` |
| `steps { sh '...' }` | `steps: - run: ...` |
| `agent { label 'linux' }` | `runs-on: [self-hosted, linux]` |
| `environment {}` | `env:` |
| `credentials('MY_SECRET')` | `${{ secrets.MY_SECRET }}` |
| `when { branch 'main' }` | `if: github.ref == 'refs/heads/main'` |
| `parallel {}` | Multiple jobs without `needs:` |
| `post { always {} }` | `if: always()` step |

---

### 3. Secrets, Variables & Environments

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production        # Triggers environment protection rules

    env:
      APP_ENV: production          # Plain variable (visible in logs)

    steps:
      - name: Deploy
        env:
          API_KEY: ${{ secrets.PROD_API_KEY }}      # Secret (masked in logs)
          DEPLOY_URL: ${{ vars.PROD_DEPLOY_URL }}   # Variable (not masked)
        run: ./scripts/deploy.sh
```

**Scopes (precedence: Environment > Repository > Organization):**

| Scope | Where to configure |
|-------|--------------------|
| Organization | Org Settings → Secrets & Variables |
| Repository | Repo Settings → Secrets & Variables |
| Environment | Repo Settings → Environments → secrets |

---

### 4. Job Orchestration

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install ruff && ruff check src/

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pytest src/

  build:
    needs: [lint, test]           # Waits for both to succeed
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t myapp .

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'   # Only on main branch
    environment: staging
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying to staging"
```

---

### 5. Passing Data Between Steps and Jobs

**Between steps (same job):**

```yaml
steps:
  - name: Generate version
    id: version
    run: echo "tag=v$(date +%Y%m%d)" >> $GITHUB_OUTPUT

  - name: Use version
    run: echo "Building ${{ steps.version.outputs.tag }}"
```

**Between jobs:**

```yaml
jobs:
  prepare:
    outputs:
      image-tag: ${{ steps.tag.outputs.tag }}
    steps:
      - id: tag
        run: echo "tag=v$(date +%Y%m%d)" >> $GITHUB_OUTPUT

  build:
    needs: prepare
    steps:
      - run: echo "Image tag is ${{ needs.prepare.outputs.image-tag }}"
```

---

### 6. Reusable Workflows & Composite Actions

**Reusable workflow** (call an entire workflow from another):

```yaml
# .github/workflows/reusable-deploy.yml
on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
    secrets:
      DEPLOY_TOKEN:
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying to ${{ inputs.environment }}"
```

```yaml
# Caller workflow
jobs:
  call-deploy:
    uses: ./.github/workflows/reusable-deploy.yml
    with:
      environment: staging
    secrets:
      DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

→ See example: [examples/reusable-workflow.yml](./examples/reusable-workflow.yml)

---

### 7. Performance & Scale

**Caching:**

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.cache/pip
    key: ${{ runner.os }}-pip-${{ hashFiles('requirements.txt') }}
    restore-keys: |
      ${{ runner.os }}-pip-
```

**Matrix builds** (test across multiple versions in parallel):

```yaml
strategy:
  matrix:
    python-version: ["3.10", "3.11", "3.12"]
    os: [ubuntu-latest, windows-latest]

runs-on: ${{ matrix.os }}
steps:
  - uses: actions/setup-python@v5
    with:
      python-version: ${{ matrix.python-version }}
```

→ See example: [examples/matrix-build.yml](./examples/matrix-build.yml)

---

### 8. Security Best Practices

See full guide: [security-best-practices.md](./security-best-practices.md)

**SHA pinning** — pin third-party actions to a specific commit SHA, not a tag:

```yaml
# ❌ Dangerous — tag can be moved
- uses: actions/checkout@v4

# ✅ Safe — SHA is immutable
- uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4.2.2
```

**Minimal permissions:**

```yaml
permissions:
  contents: read       # Default: read-only
  pull-requests: write # Only what you need
```

---

### 9. Runners

See full guide: [runners-guide.md](./runners-guide.md)

| | GitHub-hosted | Self-hosted |
|-|--------------|-------------|
| **Setup** | Zero config | You manage |
| **Cost** | Per-minute billing | Your infrastructure |
| **Isolation** | Fresh VM per job | Shared (configurable) |
| **Performance** | Standard | Your hardware |
| **Private network** | No | Yes |
| **Custom tools** | Install each run | Pre-installed |
| **Best for** | Open source, standard CI | Large builds, private infra, cost optimization |

---

### 10. Manual Triggers (`workflow_dispatch`)

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: "Target environment"
        required: true
        type: choice
        options: [staging, production]
      dry-run:
        description: "Dry run (no changes)"
        type: boolean
        default: false
```

Trigger from CLI:
```bash
gh workflow run deploy.yml --field environment=staging --field dry-run=true
```

---

## Hands-On Exercise

**Time:** ~30 minutes

→ [Exercise: Build a CI Workflow](./exercises/exercise.md)

**What you'll do:**
1. Create a complete CI workflow from scratch
2. Add lint, test, and build jobs with proper `needs:` ordering
3. Push code and validate PR checks enforce the gates
4. Experiment with `workflow_dispatch` for manual runs

---

## Next Module

→ [Module 3 — Day-to-Day Operations & Debugging](../03-operations-debugging/)
