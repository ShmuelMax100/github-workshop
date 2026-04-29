# Pull Request Lifecycle — Create, Review, Approve, Merge

> **TL;DR** — Branch → push → open PR (Draft or Ready) → review with approve / request-changes / comment → address feedback by pushing more commits → squash-merge once checks are green and approvals are in. Keep PRs under ~400 lines, one concern each, and never force-push after review starts.

A Pull Request(PR) is the core unit of collaboration on GitHub. It is how code is proposed, discussed, and merged into a shared branch.

---

## The Full Lifecycle

```
 developer
     │
     ▼
 git checkout -b feature/my-change        ← create a branch
     │
     ▼
 make commits & push                      ← do the work
     │
     ▼
 Open PR (Draft or Ready)                 ← signal intent to merge
     │
     ├──► Draft PR ──► Mark Ready         ← optional WIP state
     │
     ▼
 Reviewers notified (CODEOWNERS / manual) ← request review
     │
     ▼
 Review round
     ├── Approve         ──► proceed
     ├── Request changes ──► author fixes & pushes
     └── Comment         ──► discussion only
     │
     ▼
 All checks green + required approvals    ← gate enforced by branch protection
     │
     ▼
 Merge (Squash / Rebase / Merge commit)   ← choose your merge strategy
     │
     ▼
 Branch deleted (auto or manual)          ← keep the repo tidy
```

---

## 1. Creating a PR

### Via `gh` CLI

```bash
# Standard PR
gh pr create \
  --base main \
  --title "feat: add payment retry logic" \
  --body "Retries failed payments up to 3 times with exponential backoff." \
  --reviewer alice,bob \
  --label enhancement

# Draft PR (work in progress)
gh pr create --draft \
  --title "WIP: refactor auth module" \
  --body "Not ready for review yet — sharing for early feedback."
```

### Via UI

1. Push your branch: `git push -u origin feature/my-change`
2. GitHub shows a **"Compare & pull request"** banner — click it
3. Set **base** branch (usually `main`) and **compare** branch (your feature branch)
4. Fill in the title and body (the PR template auto-populates if configured)
5. Add reviewers, labels, assignees, and linked issues on the right panel
6. Click **Create pull request** (or **Create draft pull request**)

---

## 2. Reviewing a PR

### Leaving a review

```bash
# Approve
gh pr review 42 --approve

# Request changes with a comment
gh pr review 42 --request-changes --body "Please add a unit test for the retry logic."

# Leave a comment without a verdict
gh pr review 42 --comment --body "Left some inline thoughts."
```

### Inline comments (UI)

1. Open the PR → **Files changed** tab
2. Hover over a line number → click the **+** icon
3. Write your comment — use **Start a review** to batch multiple comments
4. Submit the review with your verdict at the top of the page

### Suggestions (UI)

In a review comment, click the **±** icon to propose an exact code change the author can apply with one click:

````
```suggestion
return retryCount <= MAX_RETRIES;
```
````

---

## 3. Addressing Review Feedback

As the PR author:

```bash
# Check out the PR branch (if you're on a different machine)
gh pr checkout 42

# Make the requested changes
git add .
git commit -m "fix: add unit test for retry logic per review"
git push

# Reply to review threads in the UI and mark them as resolved
```

> Pushing new commits to a PR branch automatically updates the PR and notifies reviewers.

---

## 4. Approving a PR

A reviewer with **write access** (or required by CODEOWNERS) clicks **Approve** in the UI or:

```bash
gh pr review 42 --approve --body "LGTM! Great edge case handling."
```

Branch protection rules can require:
- A minimum number of approvals before merge is allowed
- Stale approvals dismissed when new commits are pushed
- Approval from code owners for specific files

---

## 5. Merging a PR

Once all checks are green and approvals are in place:

```bash
# Squash merge (recommended for feature branches — clean history)
gh pr merge 42 --squash --delete-branch

# Rebase merge (linear history, no merge commit)
gh pr merge 42 --rebase --delete-branch

# Standard merge commit
gh pr merge 42 --merge --delete-branch
```

### Merge strategies compared

| Strategy | Commits on `main` | History | Best for |
|----------|-------------------|---------|----------|
| **Squash** | 1 commit per PR | Clean, linear | Feature branches with many WIP commits |
| **Rebase** | All branch commits, replayed | Linear, no merge commit | Small, clean branches |
| **Merge commit** | All + a merge commit | Preserves branch topology | Long-lived branches, release tracking |

> **SecuriThings default:** Squash merge — keeps `main` history readable.

---

## 6. After the Merge

```bash
# Switch back to main and pull the merged commit
git checkout main
git pull

# Delete your local branch
git branch -d feature/my-change

# Confirm the remote branch is gone (auto-deleted if configured)
git remote prune origin
```

---

## PR Etiquette — Best Practices

- **Keep PRs small** — aim for < 400 lines changed. Smaller PRs get faster, better reviews.
- **One concern per PR** — don't mix a bug fix with a refactor.
- **Write a clear title** — use `type: description` (e.g. `fix: handle nil pointer in auth`).
- **Fill the template** — describe what, why, and how you tested.
- **Respond to all comments** — resolve threads when addressed; reply if you disagree.
- **Don't force-push after review starts** — it invalidates existing comments.
- **Link related issues** — add `Closes #123` in the body to auto-close on merge.
