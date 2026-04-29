# Permissions in GitHub Actions — Least-Privilege by Default

> **TL;DR** — Every workflow run gets a freshly-minted `GITHUB_TOKEN`. It expires when the run ends. Default is **read-only**. You explicitly grant write scopes only to the jobs that need them. For cloud credentials, **prefer OIDC over static secrets**.

This guide is the deeper companion to slide 18 of the workshop deck.

---

## 1. Why this is different from Jenkins

In Jenkins, credentials are typically **stored globally** and any pipeline running on the master can use any credential it has access to. Scoping is by convention.

In GitHub Actions:
- A token (`GITHUB_TOKEN`) is **auto-injected** at the start of every workflow run.
- It is **scoped to the repo** that the workflow lives in.
- It **expires** when the job finishes.
- Its **scopes** are decided by the `permissions:` key in the YAML — not by an admin in a UI.

**Mental model:** treat each job as its own ephemeral identity. Give it the minimum it needs.

---

## 2. The default

Since GitHub's 2023 hardening change, the default token is **read-only on `contents`** (and most other scopes) for new repos and orgs that opted in.

You can check / change the org default at:
`Org → Settings → Actions → General → Workflow permissions`

**Recommendation:** set the org-wide default to *Read repository contents and packages permissions*. Force every workflow that needs more to request it explicitly.

---

## 3. The `permissions:` key

You set permissions at two levels:

```yaml
# Workflow-level — default for all jobs
permissions:
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    # Inherits contents: read
    steps: [...]

  release:
    runs-on: ubuntu-latest
    # Override — only this job gets to write
    permissions:
      contents: write     # push tags / create release
      id-token: write     # OIDC for cloud auth
    steps: [...]
```

**Rules:**
- A job-level `permissions:` block **fully replaces** the workflow-level one for that job — it does not merge.
- Setting `permissions: {}` (empty) at workflow level disables the token entirely. Useful for paranoid CI-only workflows.
- Setting `permissions: read-all` or `permissions: write-all` is shorthand. Avoid `write-all`.

---

## 4. The scopes you'll actually use

| Scope | What it gates | Common need |
|---|---|---|
| `contents` | Read/write repo content, push tags, create releases | Releases, tag-based deploys, generated commits |
| `pull-requests` | Read/write PRs and PR comments | Bot comments, auto-labeling, PR-it scripts |
| `issues` | Read/write issues and issue comments | Stale-bot, triage automation |
| `id-token` | Mint OIDC tokens | Cloud auth (AWS/GCP/Azure), npm provenance |
| `packages` | Read/write GitHub Packages | Publishing container images / npm packages |
| `actions` | Read/write workflow runs | Re-running jobs, cancelling, audit |
| `checks` | Write check runs | Custom check publishers |
| `deployments` | Manage deployments | Deployment dashboards |
| `security-events` | Upload SARIF | CodeQL, third-party scanners |

Full list: [docs.github.com/actions/security-guides/automatic-token-authentication](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#permissions-for-the-github_token)

---

## 5. Common errors → fix

### `Resource not accessible by integration` (HTTP 403)
The token doesn't have the scope you need.

```yaml
- uses: actions/github-script@v7
  # ❌ fails with default read-only token
  with:
    script: |
      github.rest.issues.createComment({...})
```

**Fix:** add the right scope at the workflow or job level.

```yaml
permissions:
  pull-requests: write   # to comment on PRs
  issues: write          # to comment on issues
```

### `refusing to allow a GitHub App to create or update workflow without workflows permission`
The default token cannot edit `.github/workflows/*` files. Even with `contents: write`. This is intentional — it prevents a workflow from rewriting itself or planting a new one.

**Fix:** use a separate PAT or GitHub App token, *not* `GITHUB_TOKEN`, for that operation. And think hard about whether you really need it.

### `denied: permission_denied: write_package`
Publishing to GHCR or Packages.

```yaml
permissions:
  contents: read
  packages: write
```

### `Could not assume role` (AWS) / cloud auth failures
You're trying to use OIDC but didn't grant `id-token: write`.

```yaml
permissions:
  id-token: write
  contents: read
```

---

## 6. Forked-PR workflows are special

When a workflow runs from a **fork's PR**:
- Token is **read-only** regardless of what `permissions:` says.
- **Secrets are not available**.
- This is a security boundary you cannot override from the PR.

If you need write actions on PRs from forks (e.g., post a coverage comment), use the `pull_request_target` trigger — but only for steps that **don't check out untrusted code**. Misusing `pull_request_target` is the #1 way Actions get exploited.

Safe pattern:

```yaml
on:
  pull_request_target:
    types: [opened, synchronize]

permissions:
  pull-requests: write   # to comment

jobs:
  comment:
    runs-on: ubuntu-latest
    steps:
      # NOTE: we do NOT checkout the PR branch.
      # We only post a comment using metadata.
      - run: gh pr comment $PR --body "Thanks for the PR!"
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          PR: ${{ github.event.pull_request.number }}
```

---

## 7. OIDC for cloud credentials

This is the modern replacement for storing AWS/GCP/Azure keys in Secrets.

**How it works:**
1. The workflow asks GitHub for an OIDC ID token (requires `id-token: write`).
2. The cloud provider trusts GitHub as an OIDC issuer and exchanges the ID token for a short-lived credential.
3. Your job uses that credential and it expires automatically.

**AWS example:**

```yaml
permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/gh-deploy
          aws-region: us-east-1
      - run: aws s3 sync ./build s3://my-bucket
```

**No long-lived `AWS_ACCESS_KEY_ID` to rotate. No leak risk.**

The cloud-side setup (trust policy on the IAM role) is a one-time configuration. See:
- AWS: https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services
- GCP: https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-google-cloud-platform
- Azure: https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-azure

---

## 8. Decision tree — what to use

```
Need to do something with the repo (PR comments, push tag, release)?
  → GITHUB_TOKEN with the right `permissions:` scope.

Need to call a cloud API (AWS/GCP/Azure)?
  → OIDC. Always. Don't store cloud keys.

Need to call a 3rd-party SaaS that has no OIDC?
  → Repo or Environment secret. Rotate on a schedule.

Need to push to ANOTHER repo, or edit workflow files, or do something
GITHUB_TOKEN can't?
  → Fine-grained PAT (preferred) or GitHub App token. Never a classic PAT.
  → Store in a secret, scope it as tightly as the API allows.
```

---

## 9. Checklist for a new workflow

- [ ] `permissions:` block at workflow level is set explicitly (don't rely on defaults).
- [ ] Top level is `read` for almost everything; only specific jobs get `write`.
- [ ] Anything calling a cloud uses OIDC, not static keys.
- [ ] No `permissions: write-all` anywhere.
- [ ] Third-party actions are pinned to a SHA (see `security-best-practices.md`).
- [ ] Forked-PR workflows assume read-only and have no secret access.
- [ ] `pull_request_target` workflows do **not** check out the PR head ref.

---

## 10. References

- Automatic token authentication: https://docs.github.com/en/actions/security-guides/automatic-token-authentication
- Hardening for GitHub Actions: https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions
- OIDC in cloud providers: https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect
- Permissions for the GITHUB_TOKEN: https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/controlling-permissions-for-github_token
