# Module 1 — GitHub Collaboration & CI Flow

**Duration:** 60 minutes

---

## Learning Objectives

By the end of this module you will be able to:

- Authenticate with GitHub CLI and set up your local environment
- Clone a repository and fork it for isolated development
- Map GitLab and Jenkins concepts to their GitHub equivalents
- Manage the full Pull Request lifecycle (create → review → approve → merge)
- Work efficiently with GitHub CLI (`gh`) for daily tasks
- Configure branch protection rules to enforce code quality gates
- Use CODEOWNERS to automate review assignments

---

## Concepts

### 1. Login, Clone & Fork

See the full guide: [gh-login-clone-fork.md](./gh-login-clone-fork.md)

**Login:**
```bash
gh auth login        # interactive — opens browser for OAuth
gh auth status       # verify you're authenticated
```

**Clone:**
```bash
gh repo clone securithings/github-workshop
```

**Fork + clone in one step:**
```bash
gh repo fork securithings/github-workshop --clone
# gh automatically adds 'upstream' remote pointing to the original repo
```

**Keep your fork in sync:**
```bash
git fetch upstream && git merge upstream/main && git push origin main

# Or, when there are no diverging commits:
gh repo sync --branch main
```

---

### 2. GitLab → GitHub Terminology Mapping

See the full mapping reference: [gitlab-github-mapping.md](./gitlab-github-mapping.md)

| GitLab | GitHub |
|--------|--------|
| Merge Request (MR) | Pull Request (PR) |
| Pipeline | Workflow / Actions |
| Runner | Runner |
| .gitlab-ci.yml | .github/workflows/*.yml |
| Protected branch | Branch protection rule |
| CODEOWNERS | CODEOWNERS |
| Group | Organization |
| Project | Repository |

---

### 2. Pull Request Lifecycle

```
feature branch
     │
     ▼
  git push
     │
     ▼
 Open PR ──► Draft PR (WIP, not ready for review)
     │
     ▼
Request Review ──► Reviewer leaves comments
     │
     ▼
Address Feedback ──► Push commits to same branch
     │
     ▼
  Approve ──► All checks green + required approvals
     │
     ▼
   Merge ──► Squash / Rebase / Merge commit
     │
     ▼
Branch deleted (automatically if configured)
```

**Key rules in this repo:**
- Direct pushes to `main` are blocked
- At least 1 approval required
- All status checks must pass before merge

---

### 3. Draft PRs & PR Templates

**Draft PRs** signal that work is in progress. Reviewers won't be notified until you mark it ready.

```bash
# Open a draft PR via CLI
gh pr create --draft --title "WIP: my feature" --body "Work in progress"

# Mark ready for review
gh pr ready
```

**PR Templates** (`.github/PULL_REQUEST_TEMPLATE.md`) auto-populate the PR body so contributors never forget to document their changes.

→ See [../../.github/PULL_REQUEST_TEMPLATE.md](../../.github/PULL_REQUEST_TEMPLATE.md)

---

### 4. GitHub CLI (`gh`) for Daily Workflows

```bash
# Authentication
gh auth login

# Repos
gh repo clone <owner>/<repo>
gh repo view --web

# Pull Requests
gh pr create --title "My feature" --body "Description" --base main
gh pr list
gh pr view <number>
gh pr checkout <number>       # Check out a PR locally
gh pr review --approve
gh pr review --request-changes --body "Please fix X"
gh pr merge --squash --delete-branch

# Issues
gh issue create --title "Bug: ..." --label bug
gh issue list --assignee @me
```

---

### 5. Branch Protection Rules

Branch protection rules on `main` enforce your team's standards automatically.

**Recommended settings for `main`:**

| Setting | Value |
|---------|-------|
| Require PR before merging | ✅ Enabled |
| Required approvals | 1 (or more) |
| Dismiss stale reviews on new push | ✅ Enabled |
| Require status checks to pass | ✅ CI workflow |
| Require branches to be up to date | ✅ Enabled |
| Block force pushes | ✅ Enabled |
| Restrict deletions | ✅ Enabled |

→ See full guide: [branch-protection-guide.md](./branch-protection-guide.md)

---

### 6. Repository Lifecycle & Metadata

- **CODEOWNERS** — auto-assign reviewers based on file paths → [../../.github/CODEOWNERS](../../.github/CODEOWNERS)
- **Merge controls** — Squash, Rebase, or Merge commit (configure in repo settings)
- **Auto-delete head branches** — keep branches tidy after merge
- **Topics & description** — help with discoverability in GitHub search

---

### 7. Quick UI Flows

| Task | How |
|------|-----|
| Search code | `t` key in any repo → fuzzy file finder |
| Blame a file | Open file → click **Blame** |
| Compare two commits | `/compare/<sha1>...<sha2>` |
| Keyboard shortcuts | `?` key on any GitHub page |
| View PR diff inline | Click **Files changed** tab |

---

## Hands-On Exercise

**Time:** ~20 minutes

→ [Exercise: PR Workflow](./exercises/exercise.md)

**What you'll do:**
1. Create a feature branch
2. Make a change to `src/app.py`
3. Open a PR (UI and `gh` CLI)
4. Request a review from a partner
5. Address feedback, get approval, and merge

---

## Next Module

→ [Module 2 — GitHub Actions Deep Dive](../02-github-actions/)
