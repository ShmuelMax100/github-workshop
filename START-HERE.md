# Start Here — Workshop Setup

Complete these steps **before the session starts**. It takes about 10 minutes.

---

## Step 1 — Install & authenticate `gh`

```bash
# macOS
brew install gh

# Windows
winget install --id GitHub.cli

# Verify
gh --version
```

```bash
gh auth login
# Choose: GitHub.com → HTTPS → Login with a web browser
# Copy the one-time code, press Enter, paste it in the browser
```

Verify it worked:

```bash
gh auth status
# ✓ Logged in to github.com account <your-handle>
```

---

## Step 2 — Fork & clone this repo

```bash
gh repo fork ShmuelMax100/github-workshop --clone
cd github-workshop
```

Confirm your remotes:

```bash
git remote -v
# origin    https://github.com/<your-handle>/github-workshop  ← your fork
# upstream  https://github.com/ShmuelMax100/github-workshop   ← original
```

---

## Step 3 — Create your personal branch

```bash
git checkout -b workshop/<your-name>
# example: git checkout -b workshop/alice
```

---

## Step 4 — Verify the sample app runs

```bash
pip install -r requirements.txt
cd src
pytest -v
```

Expected output:
```
collected 9 items
test_app.py::test_add PASSED
test_app.py::test_subtract PASSED
...
9 passed in 0.XXs
```

---

## Step 5 — Enable branch protection on your fork (for the exercises)

1. Go to your fork on GitHub: `https://github.com/<your-handle>/github-workshop`
2. **Settings → Branches → Add branch protection rule**
3. Branch name pattern: `main`
4. Enable:
   - ✅ Require a pull request before merging
   - ✅ Required approvals: 1
   - ✅ Require status checks to pass before merging
5. Click **Create**

> You'll feel the protection rules in action during Module 1's exercise.

---

## You're ready

Open the [workshop README](./README.md) and keep it handy throughout the session — every topic links directly to its guide.

Find a partner for the PR review exercise in Module 1. You'll be reviewing each other's code.
