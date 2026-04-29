# Solution — Exercise 1: PR Workflow

> **TL;DR** — Reference solution for Exercise 1: a `greet()` function with tests, plus the exact branch → commit → push → `gh pr create` → review → squash-merge sequence. Use it to unblock yourself, not to skip the exercise.

## What was added

A `greet()` function in `app.py` and its matching tests in `test_app.py`.

## The PR flow (reference)

```bash
# 1. Branch
git checkout -b feature/<your-name>/hello-world

# 2. Copy solution files into src/
cp solutions/01-pr-workflow/app.py src/app.py
cp solutions/01-pr-workflow/test_app.py src/test_app.py

# 3. Commit & push
git add src/
git commit -m "feat: add greet function"
git push -u origin feature/<your-name>/hello-world

# 4. Open PR
gh pr create --base main --title "feat: add greet function" --body "Adds greet() with tests."

# 5. Review & merge (with your partner)
gh pr review <number> --approve
gh pr merge --squash --delete-branch
```

## Key things to observe

- The PR template auto-filled the body structure
- Branch protection blocked merging without 1 approval
- CI ran automatically on push and on PR open
- The branch was deleted automatically after merge (if auto-delete is enabled)
