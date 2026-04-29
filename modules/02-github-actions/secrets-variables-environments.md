# Secrets, Variables & Environments

> **TL;DR** — `secrets.*` are masked, `vars.*` are plain config, and both can be scoped at org / repo / environment (most-specific wins). Always pass secrets through `env:` rather than interpolating them into `run:` blocks, and pair production deploys with an `environment:` for required reviewers.

---

## The Three Types

| Type | Syntax | Visible in logs | Use for |
|------|--------|-----------------|---------|
| **Secret** | `${{ secrets.NAME }}` | ❌ Masked | Passwords, tokens, keys |
| **Variable** | `${{ vars.NAME }}` | ✅ Visible | Non-sensitive config values |
| **Env var** | `${{ env.NAME }}` | ✅ Visible | Values set within the workflow |

---

## Secrets

Secrets are encrypted and never appear in logs. GitHub automatically masks them if they accidentally appear in output.

### Using secrets in a workflow

```yaml
steps:
  - name: Deploy
    run: ./deploy.sh
    env:
      API_KEY: ${{ secrets.PROD_API_KEY }}       # pass via env var — safest way
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

> Never interpolate secrets directly into `run:` — always pass through an environment variable.

```yaml
# ❌ Risk of exposure in shell history / process list
- run: curl -H "Authorization: ${{ secrets.TOKEN }}" https://api.example.com

# ✅ Safe
- run: curl -H "Authorization: $TOKEN" https://api.example.com
  env:
    TOKEN: ${{ secrets.TOKEN }}
```

### Managing secrets via CLI

```bash
gh secret set MY_SECRET                          # prompts for value (no shell history)
gh secret set MY_SECRET --body "value"
gh secret set MY_SECRET --env staging            # environment-scoped
gh secret set MY_SECRET --org myorg             # org-scoped

gh secret list
gh secret list --env staging
gh secret delete MY_SECRET
```

---

## Variables

Variables store non-sensitive configuration. They are visible in logs.

```yaml
steps:
  - run: echo "Deploying to ${{ vars.DEPLOY_URL }}"
  - run: ./deploy.sh --region ${{ vars.AWS_REGION }}
```

### Managing variables via CLI

```bash
gh variable set DEPLOY_URL --body "https://staging.example.com"
gh variable set DEPLOY_URL --env staging
gh variable list
```

---

## Scopes & Precedence

Secrets and variables can be set at three scopes. More specific scopes override broader ones.

```
Organization
  └── Repository
        └── Environment     ← highest precedence
```

| Scope | Where to configure | Accessible from |
|-------|-------------------|-----------------|
| **Organization** | Org Settings → Secrets & Variables | All repos (or selected repos) |
| **Repository** | Repo Settings → Secrets & Variables | Any workflow in the repo |
| **Environment** | Repo Settings → Environments → select env | Only jobs referencing that environment |

---

## Environments

Environments add a **deployment gate** to a job — required reviewers must approve before the job runs.

### Defining an environment in a workflow

```yaml
jobs:
  deploy-staging:
    environment: staging           # references the "staging" environment in Settings
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
        env:
          TOKEN: ${{ secrets.STAGING_TOKEN }}    # environment-scoped secret

  deploy-production:
    needs: deploy-staging
    environment: production        # separate gate for prod
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
        env:
          TOKEN: ${{ secrets.PROD_TOKEN }}
```

### Configuring an environment

**Settings → Environments → New environment (or edit existing)**

| Setting | Description |
|---------|-------------|
| **Required reviewers** | Named people or teams who must approve the deployment |
| **Wait timer** | Delay N minutes after trigger before running |
| **Deployment branches** | Restrict which branches can deploy to this environment |
| **Secrets** | Env-specific secrets (override repo-level) |
| **Variables** | Env-specific variables |

### Environment protection in practice

```
PR merged to main
      │
      ▼
  deploy-staging job starts immediately
      │
      ▼
  deploy-production job is PAUSED
      │  ← GitHub sends notification to required reviewers
      ▼
  Reviewer approves in the UI (or gh CLI)
      │
      ▼
  deploy-production job runs
```

```bash
# Approve a pending deployment via CLI
gh run view <run-id>         # find the pending deployment
# UI approval is usually easier — GitHub sends an email/notification
```

---

## The `GITHUB_TOKEN`

Every workflow gets an automatically provisioned `GITHUB_TOKEN` — no setup needed.

```yaml
steps:
  - uses: actions/checkout@v4
    with:
      token: ${{ secrets.GITHUB_TOKEN }}    # often implicit

  - name: Create a release
    run: gh release create v1.0.0
    env:
      GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Always restrict its permissions:**

```yaml
permissions:
  contents: read          # default — read repo contents
  pull-requests: write    # only add if the job posts PR comments
  packages: write         # only add if the job pushes to GitHub Packages
```

**Default permission** (if `permissions:` is omitted): depends on repo settings. Best practice: always declare `permissions:` explicitly so the scope is visible in code.

---

## Common Patterns

### Passing a secret to a reusable workflow

```yaml
jobs:
  call-deploy:
    uses: ./.github/workflows/deploy.yml
    secrets:
      DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
    # or inherit all secrets:
    secrets: inherit
```

### Dynamic environment selection

```yaml
jobs:
  deploy:
    environment: ${{ github.ref_name == 'main' && 'production' || 'staging' }}
    runs-on: ubuntu-latest
```
