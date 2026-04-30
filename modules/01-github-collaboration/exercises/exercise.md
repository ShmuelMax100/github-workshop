# Exercise 1 — Pull Request Workflow

> **TL;DR** — In ~20 minutes you'll branch, add a `greet()` function and test, open a PR (UI *and* CLI), swap reviews with a partner, address feedback, and squash-merge. The takeaway: a good PR body answers *why*, names the test, and is honest about what's still unchecked.

**Duration:**~20 minutes  
**Goal:** Create a branch, make a change, open a PR (via UI and CLI), get it reviewed, and merge it.

---

## Setup

Make sure you have the repo cloned and `gh` authenticated:

```bash
gh auth status
cd github-workshop
```

---

## Step 1 — Create a Feature Branch

```bash
# Replace <your-name> with your name or GitHub handle
git checkout -b feature/<your-name>/hello-world
```

---

## Step 2 — Make a Change

Open `src/app.py` and add a new greeting function:

```python
def greet(name: str) -> str:
    return f"Hello, {name}! Welcome to the GitHub workshop."
```

Also add a test in `src/test_app.py`:

```python
def test_greet():
    assert greet("SecuriThings") == "Hello, SecuriThings! Welcome to the GitHub workshop."
```

Commit your changes:

```bash
git add src/
git commit -m "feat: add greet function"
git push -u origin feature/<your-name>/hello-world
```

---

## Step 3A — Open a PR via the UI

1. Go to the repository on GitHub
2. You'll see a banner: **"Compare & pull request"** — click it
3. Set **Base:** `main` and **Title:** `feat: add greet function (<your-name>)`
4. The body is pre-filled by the PR template — fill in each section (see guide below)
5. Click **Create pull request**

### How to fill the PR template

The template exists so reviewers don't have to ask "what does this do?" and "how was it tested?" — answer those questions upfront.

**❌ What most people do (unhelpful):**

```
## Summary
added greet function

## Changes
- stuff

## Testing
it works
```

**✅ What a good PR looks like:**

```markdown
## Summary

Adds a `greet()` function that returns a personalised welcome message.
This is the foundation for the onboarding banner we'll add in the next sprint.

## Changes

- `src/app.py` — new `greet(name)` function with input validation
- `src/test_app.py` — two tests covering the happy path and empty-name edge case

## Type of Change

- [x] New feature

## Testing

Ran the full test suite locally — all 10 tests pass:

```bash
cd src && pytest -v
# test_greet PASSED
# test_greet_empty_name PASSED
```

## Checklist

- [x] My code follows the project's style guidelines
- [x] I have added or updated tests where applicable
- [x] CI checks are passing
- [x] I have self-reviewed this PR before requesting review
- [ ] Related issues are linked below

## Related Issues

Closes #12
```

**The three rules of a good PR body:**
1. **Summary = why, not what** — the diff already shows what changed; explain the reason
2. **Testing = be specific** — name the test, show the command, mention the edge case you covered
3. **Checklist = be honest** — uncheck boxes that don't apply rather than ticking everything blindly

---

## Step 3B — Open a PR via `gh` CLI

```bash
gh pr create \
  --base main \
  --title "feat: add greet function (<your-name>)" \
  --body "Adds a greet() function and a matching test." \
  --reviewer <partner-github-handle>
```

**Try draft mode too:**
```bash
gh pr create --draft --title "WIP: greet function"
# Then mark ready:
gh pr ready
```

---

## Step 4 — Request and Give a Review

**As the PR author:**
```bash
gh pr view --web    # Open your PR in the browser
```

**As the reviewer (swap with your partner):**
```bash
gh pr list                          # See open PRs
gh pr checkout <pr-number>          # Check out their branch locally
gh pr review <pr-number> --approve  # Or:
gh pr review <pr-number> --request-changes --body "Please update the docstring"
```

---

## Step 5 — Address Feedback (if requested)

Make the requested change, then:

```bash
git add src/app.py
git commit -m "fix: update docstring per review"
git push
```

The PR updates automatically — no need to re-open.

---

## Step 6 — Merge

Once approved and CI is green:

```bash
gh pr merge --squash --delete-branch
```

Or use the UI: click **Squash and merge** → **Confirm**.

---

## Step 7 — Sync your local `main` after merge

```bash
git checkout main
git fetch origin
git reset --hard origin/main          # discard the now-obsolete local commits
```

---

## Validation Checklist

- [ ] Branch created from `main`
- [ ] PR opened with template filled in
- [ ] Review requested from partner
- [ ] Feedback left (even if just "LGTM")
- [ ] PR merged and branch deleted
- [ ] CI checks passed before merge

---

## Bonus Challenges

- Add a label to your PR: `gh pr edit --add-label enhancement`
- Link your PR to an issue: add `Closes #1` to the body
- Try the GitHub web editor: open any file → pencil icon → creates a branch and PR automatically
- Browse the **Network graph**: repository → **Insights** → **Network**
