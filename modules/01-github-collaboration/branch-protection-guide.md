# Branch Protection Rules — Setup Guide

> **TL;DR** — Branch protection makes `main` require a PR, an approval, and green status checks before merge — and blocks force-pushes and deletions. Configure it in **Settings → Branches** (or use Rulesets for org-wide policy with bypass lists and audit logs).

Branch protection rulesprevent accidental (or malicious) direct pushes to critical branches and enforce code review standards.

---

## Configuring Branch Protection (UI)

1. Go to your repository → **Settings** → **Branches**
2. Click **Add branch protection rule** (or edit an existing one)
3. Set **Branch name pattern**: `main` (or `release/*` for release branches)

---

## Recommended Rules for `main`

### Require a pull request before merging

```
✅ Require a pull request before merging
   ✅ Required number of approvals before merging: 1
   ✅ Dismiss stale pull request approvals when new commits are pushed
   ✅ Require review from Code Owners
```

### Status checks

```
✅ Require status checks to pass before merging
   ✅ Require branches to be up to date before merging
   Search and add required checks:
     - ci / build
     - ci / test
     - ci / lint
```

### Additional protections

```
✅ Require conversation resolution before merging
✅ Block force pushes
✅ Restrict deletions
```

---

## Configuring via GitHub CLI

```bash
# View current protection rules
gh api repos/{owner}/{repo}/branches/main/protection

# Enable branch protection (requires admin token)
gh api --method PUT repos/{owner}/{repo}/branches/main/protection \
  --field required_status_checks='{"strict":true,"contexts":["ci / build","ci / test"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null
```

---

## Rulesets (Newer Alternative)

GitHub Rulesets are the modern replacement for branch protection rules and offer more flexibility (org-wide policies, bypass lists, audit logs).

**Settings** → **Rules** → **Rulesets** → **New ruleset**

Advantages over classic branch protection:
- Can apply to multiple branches and tags with patterns
- Support bypass lists (break-glass for admins)
- Full audit log of rule evaluations
- Can be enforced org-wide without touching each repo

---

## Testing Your Rules

```bash
# This should fail if protection is correctly configured
git push origin main

# Expected output:
# remote: error: GH006: Protected branch update failed for refs/heads/main.
# remote: error: At least 1 approving review is required by reviewers with write access.
```

---

## Environment Protection Rules

For deployment gates (staging / production), use **Environments** instead of branch rules.

**Settings** → **Environments** → **New environment**

```yaml
# In your workflow, reference the environment to trigger the gate
jobs:
  deploy-prod:
    environment: production        # ← triggers approval gate
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying to production"
```

Configure on the environment:
- **Required reviewers** — specific people or teams must approve
- **Wait timer** — delay deployment N minutes after trigger
- **Deployment branches** — only allow from `main` or `release/*`
