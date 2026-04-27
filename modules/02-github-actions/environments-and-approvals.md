# Environments: Approvals & Protection Rules

GitHub Environments are named deployment targets (e.g. `staging`, `production`) that let you add approval gates, scoped secrets, and wait timers — without any plugins.

---

## Why Environments Replace Jenkins Manual Approval

| Jenkins | GitHub Actions |
|---------|----------------|
| `input` step — blocks the build agent | Environment protection rule — no agent blocked |
| Approval stored in Jenkins | Approval logged in GitHub deployment history |
| Per-pipeline configuration | Configured once, reused by any workflow |
| No automatic audit trail | Full audit trail in the Deployments tab |

---

## Creating an Environment

**Settings → Environments → New environment**

Recommended settings per environment:

| Setting | Staging | Production |
|---------|---------|------------|
| Required reviewers | — | ✅ 1–2 engineers |
| Wait timer | — | Optional (e.g. 5 min) |
| Deployment branches | `main` only | `main` only |
| Environment secrets | `STAGING_TOKEN` | `PROD_TOKEN` |

---

## Using an Environment in a Workflow

```yaml
jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging          # links the job to the environment
    steps:
      - run: ./scripts/deploy.sh staging

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://app.securithings.com   # shown in the Deployments tab
    steps:
      - run: ./scripts/deploy.sh production
        env:
          TOKEN: ${{ secrets.PROD_TOKEN }}  # environment-scoped secret
```

> When the `deploy-production` job starts, GitHub pauses it and notifies the required reviewers. The job only runs after someone approves.

---

## Scoped Secrets and Variables

Secrets and variables can be scoped at three levels. The most specific level wins:

```
Organization  ← widest
  └── Repository
        └── Environment  ← narrowest (overrides repo-level)
```

**Example:** Set a `DATABASE_URL` variable differently per environment:

```
Repo variable:        DATABASE_URL = postgres://db-dev/app
staging environment:  DATABASE_URL = postgres://db-staging/app
production environment: DATABASE_URL = postgres://db-prod/app
```

In the workflow, reference it the same way regardless of environment:

```yaml
- run: echo "Connecting to $DATABASE_URL"
  env:
    DATABASE_URL: ${{ vars.DATABASE_URL }}
```

---

## Protection Rules

| Rule | What it does |
|------|-------------|
| **Required reviewers** | Named users/teams must approve before the job runs |
| **Wait timer** | Delays execution N minutes after the job is triggered |
| **Deployment branches** | Only branches matching the pattern can deploy to this environment |
| **Prevent self-review** | Reviewer cannot be the person who triggered the workflow |

---

## Managing Environments via CLI

```bash
# List deployments for an environment
gh api repos/{owner}/{repo}/deployments --field environment=production

# View environment protection rules (requires admin)
gh api repos/{owner}/{repo}/environments/production
```

---

## Full Staging → Production Gate Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4
      - run: ./scripts/deploy.sh
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
          APP_ENV: staging

  smoke-test:
    needs: deploy-staging
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4
      - run: pytest tests/smoke/ --base-url=https://staging.securithings.com

  deploy-production:
    needs: smoke-test
    runs-on: ubuntu-latest
    environment:                          # approval gate here
      name: production
      url: https://app.securithings.com
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4
      - run: ./scripts/deploy.sh
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
          APP_ENV: production
```

Flow: `deploy-staging` → `smoke-test` → **approval gate** → `deploy-production`
