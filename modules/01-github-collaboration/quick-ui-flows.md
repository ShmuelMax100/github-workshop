# Quick UI Flows — Search, Blame & Compare

> **TL;DR** — Press `?` to discover every shortcut, `t` for fuzzy file finder, `b` for blame, `y` to convert any URL into a permanent SHA-pinned link, and `.` to open the repo in browser-VS-Code. Always share `y`-permalinks with line ranges so your teammates see the exact code you saw.

GitHub's web UIhas powerful navigation shortcuts that most developers never discover. This guide covers the ones you'll use every day.

---

## Keyboard Shortcuts

Press `?` on **any** GitHub page to open the full keyboard shortcut reference.

### Most useful shortcuts

| Key | Action |
|-----|--------|
| `t` | File finder — fuzzy search by filename in current repo |
| `l` | Jump to a line number (when viewing a file) |
| `b` | Open blame view for the current file |
| `y` | Permalink — converts the URL to a permanent SHA-based link |
| `w` | Switch branches/tags quickly |
| `s` or `/` | Focus the search bar |
| `g` + `c` | Go to Code tab |
| `g` + `i` | Go to Issues tab |
| `g` + `p` | Go to Pull Requests tab |
| `g` + `a` | Go to Actions tab |

---

## Search

### Search within a repository

```
# In the search bar (s or /), type:
is:open is:pr                          # open PRs
is:open is:issue label:bug             # open bug issues
author:@me is:pr is:merged             # your merged PRs
is:pr review-requested:@me             # PRs waiting on your review
```

### File finder — `t`

Press `t` anywhere in a repository to open a fuzzy file finder:

```
Type: app      → matches src/app.py, src/app_config.py, tests/test_app.py
Type: wf ci    → matches .github/workflows/ci.yml
```

### Search code

Use the **Code** search at the top of the page or:

```
https://github.com/search?q=repo:org/repo+function+greet&type=code
```

In the search bar, prefix with `repo:owner/name` to scope to one repo.

---

## Blame

Blame shows who last changed each line of a file and in which commit.

### Opening blame

```bash
# Via UI keyboard shortcut (when viewing a file)
b

# Or: open any file → click "Blame" button in the top-right toolbar
```

### Reading the blame view

```
commit sha  author       date        │  line content
─────────────────────────────────────┼─────────────────────────────
a3f8c21     alice        3 days ago  │  def greet(name: str) -> str:
a3f8c21     alice        3 days ago  │      return f"Hello, {name}!"
d91bb04     bob          2 weeks ago │
b77cc10     carol        1 month ago │  def fibonacci(n: int):
```

Click any **commit SHA** in the blame gutter to jump to the full commit that introduced that line.

### Blame for a specific line range

```
# URL format:
https://github.com/owner/repo/blame/main/src/app.py#L10-L20
```

### Navigating blame history

In blame view, click **"View blame prior to this change"** (the left-arrow icon next to a commit) to step back through history line by line.

---

## Compare

Compare lets you diff any two branches, tags, or commits.

### Branch comparison

```bash
# URL pattern:
https://github.com/owner/repo/compare/main...feature/my-branch

# Compare two branches across forks:
https://github.com/owner/repo/compare/main...other-user:feature-branch
```

### Commit range comparison

```bash
# Two commit SHAs:
https://github.com/owner/repo/compare/abc1234...def5678

# Tag to tag:
https://github.com/owner/repo/compare/v1.0.0...v1.1.0
```

### What the compare page shows

- **Commits** — all commits between the two points
- **Files changed** — full diff of every changed file
- **Open a PR** — button to create a PR from this comparison

### Via `gh` CLI

```bash
# Open the compare page in browser
gh repo view --web   # then navigate to compare manually

# Or — compare two branches from CLI
git diff main...feature/my-branch --stat

# View a specific commit
gh browse abc1234
```

---

## Linking to Specific Lines

When sharing code with teammates, link to exact lines rather than file tops.

```bash
# Single line:
https://github.com/owner/repo/blob/main/src/app.py#L42

# Line range:
https://github.com/owner/repo/blob/main/src/app.py#L42-L55
```

**In the UI:** open a file → click a line number (or shift-click for a range) → the URL updates automatically.

> **Tip:** Press `y` to convert a branch URL to a permanent SHA URL before sharing. Branch URLs break if the file is later changed; SHA URLs always point to the exact version you saw.

---

## Navigating PRs Efficiently

| Action | How |
|--------|-----|
| See only changed files | **Files changed** tab |
| Hide whitespace changes | **Files changed** → ⚙️ → "Hide whitespace" |
| View file in full context | Click `...` → "View file" |
| Jump between files in a diff | Use the **file tree** on the left sidebar |
| Filter diff by file type | Search box in the Files changed header |
| See conversation history | **Conversation** tab |
| View a PR at a specific commit | **Commits** tab → click the commit |

---

## Other Handy UI Tricks

### Edit a file directly in the browser

Open any file → click the **pencil icon** (✏️) → GitHub creates a branch and opens a PR automatically on save.

### GitHub.dev — full VS Code in the browser

Press `.` (period) on any repository or PR to open the repo in a web-based VS Code editor.

Or navigate to: `https://github.dev/owner/repo`

### Suggested changes

In a PR review, click the **±** icon in a comment box to propose an exact edit the author can apply with one click.

### Emoji reactions

React to PR comments with 👍 👎 🎉 😕 ❤️ 🚀 — useful for quick acknowledgment without adding noise.
