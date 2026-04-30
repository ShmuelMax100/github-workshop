# Start Here — Workshop Setup

> **TL;DR** — Install `gh`, clone the repo, create your `workshop/<name>` branch, and run the test suite. Ten minutes of setup now saves the whole room time once the session starts.

Completethese steps **before the session starts**. It takes about 10 minutes.

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

## Step 2 — Clone this repo

```bash
gh repo clone ShmuelMax100/github-workshop
cd github-workshop
```

Confirm your remote:

```bash
git remote -v
# origin    https://github.com/ShmuelMax100/github-workshop (fetch)
# origin    https://github.com/ShmuelMax100/github-workshop (push)
```

---

## Step 3 — Create your personal branch

```bash
git checkout -b "workshop/$(whoami)"
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

## You're ready

Open the [workshop README](./README.md) and keep it handy throughout the session — every topic links directly to its guide.

Find a partner for the PR review exercise in Module 1. You'll be reviewing each other's code.
