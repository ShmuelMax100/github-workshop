# Getting Started — Login, Clone & Fork with `gh`

This guide walks through the first things every developer does when joining a GitHub-based team: authenticate, get the code, and set up a fork for isolated work.

---

## 1. Install GitHub CLI

| OS | Command |
|----|---------|
| macOS | `brew install gh` |
| Ubuntu/Debian | `sudo apt install gh` |
| Windows (winget) | `winget install --id GitHub.cli` |
| Windows (scoop) | `scoop install gh` |

Verify:
```bash
gh --version
# gh version 2.x.x (...)
```

---

## 2. Login — `gh auth login`

```bash
gh auth login
```

You'll be prompted step by step:

```
? Where do you use GitHub?
  > GitHub.com
    GitHub Enterprise Server

? What is your preferred protocol for Git operations on this host?
  > HTTPS
    SSH

? How would you like to authenticate GitHub CLI?
  > Login with a web browser
    Paste an authentication token
```

### Login with a web browser (recommended)

```
! First copy your one-time code: ABCD-1234
Press Enter to open github.com in your browser...
```

1. Copy the 8-character code shown in the terminal
2. Press **Enter** — your browser opens `https://github.com/login/device`
3. Paste the code and click **Authorize**
4. Done ✅

### Login with a token (CI / headless environments)

```bash
# Create a token at: github.com → Settings → Developer settings
# → Personal access tokens → Fine-grained tokens → Generate new token
# Scopes needed: repo (read/write), workflow

gh auth login --with-token <<< "github_pat_XXXXXXXXXXXX"
```

### Verify authentication

```bash
gh auth status
```

```
github.com
  ✓ Logged in to github.com account shmuelmax (keyring)
  - Active account: true
  - Git operations protocol: https
  - Token: gho_****
  - Token scopes: gist, read:org, repo, workflow
```

---

## 3. Clone a Repository — `gh repo clone`

`gh repo clone` is a wrapper around `git clone` that resolves short names and sets up the `gh` context automatically.

```bash
# Full URL
gh repo clone https://github.com/securithings/github-workshop

# Short form (owner/repo) — much faster to type
gh repo clone securithings/github-workshop

# Clone into a specific directory
gh repo clone securithings/github-workshop my-workshop

# Clone and immediately open in VS Code
gh repo clone securithings/github-workshop && code github-workshop
```

After cloning, verify the remote:

```bash
cd github-workshop
git remote -v
# origin  https://github.com/securithings/github-workshop (fetch)
# origin  https://github.com/securithings/github-workshop (push)
```

### Clone vs. Download ZIP

| | Clone | Download ZIP |
|-|-------|-------------|
| Git history | ✅ Full history | ❌ None |
| Push changes | ✅ Yes | ❌ No |
| Branch switching | ✅ Yes | ❌ No |
| Updates (`git pull`) | ✅ Yes | ❌ Manual re-download |

Always clone.

---

## 4. Fork a Repository — `gh repo fork`

A **fork** is your personal copy of a repository on GitHub. You push to your fork, then open a PR to the upstream repo. This is the standard model for open-source contributions and team isolation.

```bash
# Fork and clone in one step (most common)
gh repo fork securithings/github-workshop --clone

# Fork without cloning (creates fork on GitHub only)
gh repo fork securithings/github-workshop

# Fork into a specific directory
gh repo fork securithings/github-workshop --clone --remote -- my-fork
```

### What `--clone` does

After `gh repo fork securithings/github-workshop --clone`:

```bash
cd github-workshop
git remote -v
# origin    https://github.com/YOUR-USERNAME/github-workshop (fetch)   ← your fork
# origin    https://github.com/YOUR-USERNAME/github-workshop (push)
# upstream  https://github.com/securithings/github-workshop (fetch)    ← original repo
# upstream  https://github.com/securithings/github-workshop (push)
```

`gh` automatically adds `upstream` pointing to the original — you don't need to do it manually.

### Keeping your fork up to date

```bash
# Fetch latest changes from the original repo
git fetch upstream

# Merge upstream/main into your local main
git checkout main
git merge upstream/main

# Push the updated main to your fork
git push origin main
```

Or via `gh`:

```bash
gh repo sync                          # sync your fork's default branch with upstream
gh repo sync --branch main            # specify branch explicitly
```

---

## 5. Full First-Day Workflow

Here's the sequence from zero to your first PR:

```bash
# Step 1 — Authenticate
gh auth login

# Step 2 — Fork + clone the repo
gh repo fork securithings/github-workshop --clone
cd github-workshop

# Step 3 — Confirm your remotes
git remote -v

# Step 4 — Create a feature branch (never work directly on main)
git checkout -b feature/<your-name>/my-first-change

# Step 5 — Make your change, then commit
git add .
git commit -m "feat: my first change"

# Step 6 — Push to YOUR fork
git push -u origin feature/<your-name>/my-first-change

# Step 7 — Open a PR against the upstream repo
gh pr create \
  --repo securithings/github-workshop \
  --base main \
  --title "feat: my first change" \
  --body "Description of what I changed and why."
```

---

## 6. Useful Auth & Config Commands

```bash
# Switch between multiple accounts
gh auth switch

# Log out
gh auth logout

# Set default protocol to SSH instead of HTTPS
gh config set git_protocol ssh --host github.com

# Set your preferred editor (for PR bodies, etc.)
gh config set editor "code --wait"

# View current config
gh config list

# Set a default repository for the current directory
gh repo set-default securithings/github-workshop
```

---

## Quick Reference

```bash
gh auth login                                    # authenticate
gh auth status                                   # verify login

gh repo clone <owner>/<repo>                     # clone
gh repo clone <owner>/<repo> <local-dir>         # clone to named dir

gh repo fork <owner>/<repo> --clone             # fork + clone
gh repo sync                                     # sync fork with upstream

git remote -v                                    # verify remotes
git fetch upstream && git merge upstream/main    # update fork manually
```
