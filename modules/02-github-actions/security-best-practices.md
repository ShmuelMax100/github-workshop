# GitHub Actions — Security Best Practices

> **TL;DR** — Pin third-party actions to a full SHA (tags can be moved), declare minimal `permissions:` per job, never interpolate untrusted input or secrets directly into `run:`, and prefer OIDC over long-lived cloud credentials. The checklist at the bottom is the one to copy into your repo template.

---

## 1. SHA Pin Third-Party Actions

Tags (like `@v4`) can be moved to point to different code. A SHA is immutable.

```yaml
# ❌ Vulnerable — attacker could move the tag
- uses: actions/checkout@v4

# ✅ Safe — SHA cannot be changed
- uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4.2.2
```

**Finding the SHA:**

```bash
# Option 1: GitHub UI — go to the action's releases, click a tag, copy the SHA
# Option 2: CLI
gh api repos/actions/checkout/git/refs/tags/v4 --jq '.object.sha'

# Option 3: Use a tool like pin-github-action
npx pin-github-action .github/workflows/ci.yml
```

### Example: third-party action — publish a GitHub Release

Copy this whole step into your release job. It tags the release with the resolved
version, attaches every file under `dist/` as an asset, auto-generates notes, and
honors a `prerelease` workflow input. The job needs `permissions: contents: write`.

```yaml
- name: Create GitHub Release
  uses: softprops/action-gh-release@v2
  with:
    tag_name: ${{ inputs.version }}
    name: Release ${{ inputs.version }}
    generate_release_notes: true                # auto-generate from PR titles
    prerelease: ${{ inputs.prerelease }}        # honor the dispatch input
    files: dist/*                               # attach build artifacts
```

---

## 2. Use Minimal Permissions

The `GITHUB_TOKEN` has broad permissions by default in older repos.  
Set `permissions:` explicitly — both at workflow and job level.

```yaml
# Workflow-wide default: deny everything
permissions: {}   # or read-all

jobs:
  build:
    permissions:
      contents: read          # checkout code
      packages: write         # push to GitHub Packages (only if needed)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@...

  comment-pr:
    permissions:
      pull-requests: write    # post a comment
      contents: read
    runs-on: ubuntu-latest
```

**Available permission scopes:**
`actions`, `checks`, `contents`, `deployments`, `id-token`, `issues`, `packages`, `pages`, `pull-requests`, `repository-projects`, `security-events`, `statuses`

---

## 3. Never Print Secrets

```yaml
# ❌ Secret will be masked but this is still bad practice
- run: echo "Token is ${{ secrets.MY_SECRET }}"

# ✅ Pass via environment variable only
- run: ./deploy.sh
  env:
    DEPLOY_TOKEN: ${{ secrets.MY_SECRET }}
```

---

## 4. Validate Untrusted Input

Pull request titles, branch names, and issue bodies can contain malicious content.  
Never interpolate them directly into `run:` commands.

```yaml
# ❌ Script injection risk
- run: echo "Branch: ${{ github.head_ref }}"

# ✅ Safe — pass through environment variable
- env:
    BRANCH: ${{ github.head_ref }}
  run: echo "Branch: $BRANCH"
```

---

## 5. Restrict `pull_request_target` Usage

`pull_request_target` runs in the context of the **base branch** with full secrets access.  
Use it only when you need to post comments from fork PRs, and never check out untrusted code in it.

```yaml
# ❌ Critical vulnerability — checks out fork code with secrets access
on: pull_request_target
jobs:
  build:
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.head.sha }}  # NEVER DO THIS
      - run: make build   # fork code runs with your secrets!
```

---

## 6. Use OIDC for Cloud Auth (No Long-Lived Credentials)

Instead of storing AWS/GCP/Azure credentials as secrets, use OpenID Connect (OIDC) to get short-lived tokens.

```yaml
permissions:
  id-token: write    # Required for OIDC
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: aws-actions/configure-aws-credentials@...
        with:
          role-to-assume: arn:aws:iam::123456789:role/github-actions-role
          aws-region: us-east-1
      # Now you have temporary AWS credentials — no stored secrets needed
      - run: aws s3 sync ./dist s3://my-bucket
```

---

## 7. Set `timeout-minutes`

Prevent runaway jobs from consuming minutes and money.

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 15     # Job-level timeout
    steps:
      - name: Long step
        timeout-minutes: 5  # Step-level timeout
        run: ./build.sh
```

---

## 8. Audit Third-Party Actions Before Use

Before adding an action from the Marketplace:

1. Check it's from a **verified creator** (blue checkmark)
2. Review the source code on GitHub
3. Check for recent maintenance activity
4. Pin to a specific SHA after vetting
5. Prefer **official** actions (`actions/*`, `github/*`, cloud provider official)

---

## 9. Dependency Review on PRs

```yaml
# .github/workflows/dependency-review.yml
name: Dependency Review

on: pull_request

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683
      - uses: actions/dependency-review-action@v4
```

---

## 10. Security Summary Checklist

- [ ] All third-party actions pinned to SHAs
- [ ] `permissions:` set at workflow level to restrict defaults
- [ ] No secrets interpolated directly into `run:` blocks
- [ ] No `pull_request_target` checking out untrusted code
- [ ] OIDC used for cloud provider auth (no static credentials)
- [ ] `timeout-minutes:` set on long-running jobs
- [ ] Self-hosted runners **not** used for public repos
- [ ] Dependency review action configured on PRs
- [ ] `CODEOWNERS` requires review of `.github/workflows/` changes
