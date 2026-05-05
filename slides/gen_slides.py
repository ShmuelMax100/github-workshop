"""Generate slides.md mirroring GitHub-Workshop.pptx (71 slides)."""

REPO_TOUR = [
    (0.8, 11.02, "Code", "Browse files, branches, and history. Your repo's home — like the project root in GitLab."),
    (8.6, 11.02, "Issues", "Track bugs, features, and tasks. Replaces Jira tickets for many teams — built into the repo."),
    (18.4, 11.02, "Pull Requests", "Code review and merge gate. The heart of GitHub Flow — every change ships through a PR."),
    (30.1, 11.02, "Agents", "GitHub's new AI coding agent — assigns issues, opens PRs autonomously. Optional, paid feature."),
    (38.3, 11.02, "Actions", "CI/CD workflows. Defined in YAML under .github/workflows/ — this is what we'll build today."),
    (46.9, 11.02, "Projects", "Kanban boards / tables linked to Issues & PRs. Lightweight project management inside GitHub."),
    (53.9, 11.02, "Wiki", "Free-form documentation pages. Markdown with its own git history — separate from the main repo."),
    (63.7, 11.02, "Security", "Dependabot, secret scanning, code scanning, advisories. Your security command center."),
    (76.2, 11.02, "Insights", "Traffic, contributors, dependency graph, network. Charts about how the repo is being used."),
    (85.6, 11.02, "Settings", "Branch protection, collaborators, secrets, webhooks, Actions permissions. Admins only."),
    (55.5, 21.33, "Pin", "Pin this repo to your profile so visitors see it first. Vanity feature — useful for portfolios."),
    (63.8, 21.33, "Watch", "Subscribe to repo activity — issues, PRs, releases. Choose 'all activity', 'only mentions', etc."),
    (75.6, 21.33, "Fork", "Make your own copy of the repo to propose changes. The starting point for OSS contribution."),
    (87.5, 21.33, "Star ⭐", "Bookmark a repo to find it again later. Public stars also signal popularity."),
    (70.7, 31.11, "About", "Description, website link, topics. Edit via the gear icon — make it discoverable."),
    (72.7, 46.22, "Readme", "Quick-link to the project's README rendered below. The front page of your repo."),
    (72.7, 50.67, "Activity", "Recent events on the repo — commits, releases, issues. Your repo's pulse."),
    (71.9, 72.36, "Releases", "Tagged versions with notes & artifacts. Often produced automatically by a release workflow."),
]

PR_TOUR = [
    (18.38, 33.23, "Conversation", "The unified PR thread — description, comments, reviews, and event log."),
    (26.03, 33.23, "Commits", "Browse the individual commits in this PR. Useful for stacked-diff reviews."),
    (32.75, 33.23, "Checks", "Status of every CI run for this PR: tests, linters, security scans, deploys."),
    (40.15, 33.23, "Files changed", "The full diff. Leave inline comments, suggested changes, and approvals here."),
    (57.45, 29.38, "Reviewers", "Request review from people or teams. CODEOWNERS auto-fills here."),
    (57.45, 36.53, "Assignees", "Who is responsible for landing this PR. Often the author, sometimes a shepherd."),
    (57.45, 43.60, "Labels", "Categorise the PR: bug, feature, area/api, needs-triage. Drives filters & automation."),
    (57.45, 50.75, "Projects", "Add to a GitHub Project board — Kanban, roadmap, or sprint tracking."),
    (57.45, 57.82, "Milestone", "Group PRs by release or iteration (e.g. v1.2.0, Sprint 14)."),
    (57.45, 64.98, "Development", 'Link issues. "Closes #123" in the description auto-closes them on merge.'),
]


def tour_slide(image, x, y, term, desc):
    # The hand emoji is positioned relative to the image, not the whole slide.
    # Image takes ~85.5% of slide height in original; on web we let it size naturally.
    return f"""---
class: tour-slide
---

<div class="tour">
  <div class="tour-frame">
    <img src="/img/{image}" class="tour-img" />
    <div class="tour-hand" style="left: {x}%; top: {y / 0.855:.2f}%;">👆</div>
  </div>
  <div class="tour-caption">
    <strong>{term}</strong> &mdash; {desc}
  </div>
</div>
"""


SLIDES = []

# 1. Title
SLIDES.append("""---
theme: seriph
title: GitHub Workshop
info: |
  From GitLab & Jenkins to GitHub-Native Development.
  Hands-on · 3 modules · Collaboration · Actions · Operations.
class: text-center
highlighter: shiki
lineNumbers: false
drawings:
  persist: false
transition: slide-left
mdc: true
---

# GitHub Workshop 🚀

From **GitLab & Jenkins** to **GitHub-Native Development**

<div class="pt-10 text-base opacity-80">
  <span class="px-3 py-1 rounded bg-white bg-opacity-10">3.5 Hours</span>
  <span class="px-3 py-1 rounded bg-white bg-opacity-10 ml-2">Hands-On</span>
  <span class="px-3 py-1 rounded bg-white bg-opacity-10 ml-2">3 Modules · Collaboration · Actions · Operations</span>
</div>

<div class="abs-br m-6 text-sm opacity-60">
  Shmuel Max · Marina Marenkov
</div>
""")

# 2. Shmuel
SLIDES.append("""---
layout: two-cols
---

<div class="text-xs uppercase tracking-widest opacity-60">Introduction</div>

# Shmuel Max

**Sr Solution Engineer · Microsoft**

- Helping engineering teams move faster with GitHub & DevOps
- Focus on developer productivity and cloud-native delivery
- Your guide for the next 3.5 hours — GitLab + Jenkins → GitHub

<div class="pt-6 text-sm opacity-70">
📧 shmuelmax@microsoft.com · 🔗 linkedin.com/in/shmuel-max · 📍 Herzliya, IL
</div>

::right::

<img src="/img/shmuel.jpg" class="rounded-2xl shadow-2xl mx-auto mt-12" style="max-height: 360px;" />
""")

# 3. Marina
SLIDES.append("""---
layout: two-cols
---

<div class="text-xs uppercase tracking-widest opacity-60">Introduction</div>

# Marina Marenkov

**Sr Cloud and AI Specialist · Microsoft**
Specialist Sales — OPEX, Israel

- Drive AI & cloud adoption for digital-native customers
- Advise on architecture and scale Azure solutions
- Link technology to business impact and growth

<div class="pt-6 text-sm opacity-70">
📧 mmarenkov@microsoft.com · 📍 Herzliya, IL
</div>

::right::

<img src="/img/marina.jpg" class="rounded-2xl shadow-2xl mx-auto mt-12" style="max-height: 360px;" />
""")

# 4. Agenda
SLIDES.append("""---
---

# Agenda

<div class="text-sm opacity-70 mb-3">
Format: Hands-on · Audience: Developers transitioning from GitLab & Jenkins
</div>

<div class="grid grid-cols-2 gap-6 text-xs">

<div class="border-l-4 border-blue-500 pl-3">

### 01 · GitHub Collaboration & CI Flow

- GitLab → GitHub terminology & concepts mapping
- Pull Requests lifecycle: create, review, approve, merge
- Draft PRs & PR templates (best practices)
- GitHub CLI (`gh`) for daily workflows
- Branch protection: PR-only main, approvals, status checks
- Repo lifecycle: CODEOWNERS, merge controls, metadata
- Quick UI flows: search, blame, compare

> **Hands-on:** Create a branch → open a PR → request review → merge (UI + `gh` CLI)

</div>

<div class="border-l-4 border-purple-500 pl-3">

### 02 · GitHub Actions Deep Dive

- GitLab CI / Jenkins → GitHub Actions mapping
- Jenkinsfile → Actions YAML (side-by-side)
- Core: `on`, `jobs`, `steps`, `runs-on`
- Secrets, variables & environments
- Environments: approvals & protection (staging / prod gates)
- Orchestration: `needs`, parallel jobs, conditionals
- Reusable workflows & composite actions
- Performance: `actions/cache`, matrix builds
- Security: SHA pinning for third-party actions
- Runners: hosted vs self-hosted, choosing right
- Triggers: `workflow_dispatch` (manual)

> **Hands-on:** Build a complete CI workflow from scratch, push code, validate PR checks

</div>

</div>
""")

# 5. Before we start
SLIDES.append("""---
layout: center
---

# Before We Start

<div class="grid grid-cols-3 gap-6 pt-4 text-center">
  <div class="p-4 rounded-lg bg-white bg-opacity-5">
    <div class="text-3xl mb-2">🐙</div>
    <strong>GitHub account</strong><br>
    <span class="text-sm opacity-70">with repository access</span>
  </div>
  <div class="p-4 rounded-lg bg-white bg-opacity-5">
    <div class="text-3xl mb-2">⚙️</div>
    <strong>GitHub CLI (gh)</strong><br>
    <span class="text-sm opacity-70">installed and authenticated</span>
  </div>
  <div class="p-4 rounded-lg bg-white bg-opacity-5">
    <div class="text-3xl mb-2">📦</div>
    <strong>Git</strong><br>
    <span class="text-sm opacity-70">configured locally</span>
  </div>
</div>

```bash
gh auth status && git --version && gh --version
```

<div class="text-center pt-2 text-sm opacity-70">
Full setup guide → <code>START-HERE.md</code>
</div>
""")

# 6-23: Repo tour
for x, y, term, desc in REPO_TOUR:
    SLIDES.append(tour_slide("repo-tour.png", x, y, term, desc))

# 24. Module 1 divider
SLIDES.append("""---
layout: section
---

<div class="text-sm uppercase tracking-widest opacity-60 mb-4">Module 1</div>

# GitHub Collaboration<br>& CI Flow

<div class="text-lg opacity-70 pt-4">⏱️ 60 minutes</div>
""")

# 25. gh login/clone/fork
SLIDES.append("""---
---

# Login, Clone & Fork with `gh`

<div class="text-sm opacity-70 mb-3">First five minutes on a new machine — without ever opening a browser</div>

<div class="grid grid-cols-2 gap-6 text-sm">

<div>

### 1 · Authenticate

```bash
gh auth login
# choose: GitHub.com
# protocol: HTTPS
# auth: web browser

gh auth status
gh auth refresh -s read:org
```

- Stores token in OS keychain
- Configures git credential helper
- Use `-s` to add scopes (org, gist, etc.)

</div>

<div>

### 2 · Clone & Fork

```bash
# Clone (you have write access)
gh repo clone owner/repo

# Fork + clone + set upstream
gh repo fork owner/repo --clone

# Sync your fork later
gh repo sync owner/repo
```

- `fork --clone` sets `upstream` automatically
- `repo sync` pulls in changes from upstream

</div>
</div>
""")

# 26. GitLab→GitHub mapping (use plain backticks, no Vue {{ }})
SLIDES.append("""---
---

# GitLab → GitHub: Same Concepts, New Names

| GitLab | GitHub |
|---|---|
| Merge Request (MR) | **Pull Request (PR)** |
| `.gitlab-ci.yml` | `.github/workflows/*.yml` |
| Pipeline | Workflow / Actions |
| Runner | Runner |
| Protected Branch | Branch Protection Rule |
| CODEOWNERS | CODEOWNERS |
| Group / Project | Organization / Repository |
| CI/CD Variables (masked) | Secrets — `secrets.NAME` |
| CI/CD Variables (plain) | Variables — `vars.NAME` |
""")

# 27. PR Lifecycle
SLIDES.append("""---
---

# Pull Request Lifecycle

```mermaid {scale: 0.7}
flowchart LR
  A[Branch<br/>git checkout -b] --> B[Push<br/>git push -u origin]
  B --> C[Open PR<br/>gh pr create]
  C --> D[Review<br/>comments, suggestions]
  D --> E[Approve<br/>gh pr review --approve]
  E --> F[Merge<br/>squash / rebase]
  F --> G[Delete Branch<br/>auto / manual]
```

<div class="pt-3 p-3 rounded bg-yellow-500 bg-opacity-10 border-l-4 border-yellow-500 text-sm">

**Branch Protection Enforces:**
Direct pushes to `main` are blocked · At least 1 approval required · All CI checks must pass before merge

</div>
""")

# 28-37: PR tour
for x, y, term, desc in PR_TOUR:
    SLIDES.append(tour_slide("pr-tour.png", x, y, term, desc))

# 38. Draft PRs & Templates
SLIDES.append("""---
---

# Draft PRs & PR Templates

<div class="grid grid-cols-2 gap-6 text-sm">

<div>

### 📝 Draft PRs

- Signals: **not ready for review**
- Reviewers not notified until ready
- Use for: WIP, early feedback, CI-first

```bash
gh pr create --draft
gh pr ready          # when done
```

</div>

<div>

### 📋 PR Templates
`.github/PULL_REQUEST_TEMPLATE.md`

- Auto-populates the PR body
- Sections: **Summary · Changes · Type · Testing · Checklist**
- Enforces team standards on every PR

> **Rule:** Write **WHY**, not what — the diff shows what.

</div>

</div>
""")

# 39. gh CLI daily driver
SLIDES.append("""---
---

# GitHub CLI — Your Daily Driver

<div class="grid grid-cols-2 gap-6 text-sm">

<div>

### Pull Requests

```bash
gh pr create
gh pr list --assignee @me
gh pr checkout 42
gh pr review --approve
gh pr merge --squash --delete-branch
gh pr checks --watch
```

</div>

<div>

### Operations

```bash
gh run list --status failure
gh run view --log-failed
gh run rerun --failed --debug
gh run download
gh secret set MY_SECRET
gh repo clone owner/repo
```

</div>

</div>
""")

# 40. Branch Protection
SLIDES.append("""---
---

# Branch Protection Rules

<div class="text-sm opacity-70 mb-3">Enforce your standards automatically — no discipline required</div>

<div class="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">

<div>✅ Require pull request before merging</div>
<div>✅ Required approvals: <strong>1+</strong></div>

<div>✅ Dismiss stale reviews when new commits are pushed</div>
<div>✅ Require status checks to pass <em>(CI must be green)</em></div>

<div>✅ Require branches to be up to date before merging</div>
<div>✅ Block force pushes</div>

<div>✅ Restrict deletions</div>
<div>✅ Require signed commits <em>(compliance)</em></div>

</div>

<div class="pt-6 text-sm opacity-70">
📍 <strong>Settings</strong> → <strong>Branches</strong> → <strong>Add branch protection rule</strong>
</div>
""")

# 41. Repo Lifecycle
SLIDES.append("""---
---

# Repository Lifecycle

<div class="grid grid-cols-2 gap-6 text-sm">

<div>

### CODEOWNERS

```
*                       @org/platform-team
src/                    @org/dev-leads
.github/workflows/      @org/platform-team
```

- Auto-requests reviewers based on touched paths
- Enforced when "Require code owner review" is on

</div>

<div>

### Merge Controls

- **Enable:** Squash merge only
- **Auto-delete head branches:** ON
- **Auto-merge:** available per PR

> Auto-merge: PR merges *itself* once all checks pass and required approvals are in.

</div>

</div>
""")

# 42. UI Power Shortcuts
SLIDES.append("""---
---

# GitHub UI — Power Shortcuts

| Action | Shortcut / How |
|---|---|
| Fuzzy file finder | Press <kbd>T</kbd> in any repo |
| Jump to line | Press <kbd>L</kbd> when viewing a file |
| Blame view | Press <kbd>B</kbd> or click **Blame** |
| Permanent link (SHA) | Press <kbd>Y</kbd> to convert URL |
| Keyboard shortcut list | Press <kbd>?</kbd> on any page |
| VS Code in browser | Press <kbd>.</kbd> (period) in any repo |
| Compare branches | `/compare/main...my-branch` in URL |
| Inline code suggestion | ± icon in a review comment |
""")

# 43. Module 1 hands-on
SLIDES.append("""---
layout: center
class: text-center
---

<div class="text-sm uppercase tracking-widest opacity-60">Hands-On</div>

# Module 1 Exercise

<div class="text-lg opacity-80 mb-6">Build a complete PR workflow from scratch</div>

<div class="text-left max-w-2xl mx-auto text-sm">

1. Create a feature branch
2. Add `greet()` function to `src/app.py`
3. Open a PR — fill in the template properly (**WHY**, not what)
4. Request a review from your partner
5. Review their PR — leave at least one comment
6. Approve and merge: `gh pr merge --squash --delete-branch`

</div>

<div class="pt-8 text-sm opacity-70">
⏱️ ~25 min  ·  <code>modules/01-github-collaboration/exercises/exercise.md</code>
</div>
""")

# 44. Module 2 divider
SLIDES.append("""---
layout: section
---

<div class="text-sm uppercase tracking-widest opacity-60 mb-4">Module 2</div>

# GitHub Actions<br>Deep Dive

<div class="text-lg opacity-70 pt-4">⏱️ 80 minutes</div>
""")

# 45. Jenkins → Actions
SLIDES.append("""---
---

# Jenkins → GitHub Actions

| Jenkinsfile | GitHub Actions |
|---|---|
| `pipeline { ... }` | workflow file (`*.yml`) |
| `stage('Build')` | `jobs: build:` |
| `steps { sh '...' }` | `steps: - run: ...` |
| `agent { label 'linux' }` | `runs-on: [self-hosted, linux]` |
| `withCredentials([...])` | `secrets.MY_SECRET` |
| `when { branch 'main' }` | `if: github.ref == 'refs/heads/main'` |
| `parallel { ... }` | jobs without `needs:` (parallel by default) |
| `post { always { ... } }` | `if: always()` |
| Shared Library | Reusable Workflow / Composite Action |
""")

# 46. Actions core concepts
SLIDES.append("""---
---

# GitHub Actions — Core Concepts

```yaml {all|3-5|7-9|10|12|14}
name: CI

on:                              # 🎯 TRIGGER — push, PR, schedule, manual
  push:
    branches: [main]

jobs:                            # 🧱 JOBS — parallel by default
  build:
    runs-on: ubuntu-latest       # 🖥️ RUNNER — where the job runs
    steps:
      - uses: actions/checkout@v4   # 📦 ACTION — pre-built, from Marketplace

      - run: pytest src/             # ⚡ COMMAND — any shell script
```
""")

# 47. Permissions
SLIDES.append("""---
---

# Permissions — Least-Privilege by Default

<div class="text-sm opacity-70 mb-3"><code>GITHUB_TOKEN</code> is auto-injected on every run · You decide what it can do</div>

<div class="grid grid-cols-2 gap-6 text-sm">

<div>

### Why it matters

- Jenkins creds were implicitly **global**. Actions tokens are scoped per workflow.
- Default since 2023: **read-only** on most resources.
- Forked PR workflows get **no secrets** + read-only token by design.
- Common errors: `403 on PR comment`, can't push tag, can't write Packages.
- Cloud creds? Use **OIDC** — short-lived, no static keys to rotate.

</div>

<div>

### How — set `permissions:` in YAML

```yaml
# Workflow level — applies to all jobs
permissions:
  contents: read

jobs:
  release:
    # Override: only this job can write
    permissions:
      contents: write   # push tag/release
      id-token: write   # OIDC for cloud
    runs-on: ubuntu-latest
```

</div>

</div>

<div class="pt-2 text-xs opacity-70">
🧭 Rule of thumb: <strong>start read-only</strong>, grant write per-job, prefer OIDC over PATs.
</div>
""")

# 48. Secrets / Vars / Env
SLIDES.append("""---
---

# Secrets, Variables & Environments

<div class="grid grid-cols-3 gap-4 text-sm">

<div class="p-4 rounded-lg bg-red-500 bg-opacity-10 border-l-4 border-red-500">

### 🔒 Secrets
`secrets.NAME`

- Encrypted, masked in logs
- Passwords, tokens, API keys
- Scope: Org → Repo → Environment

</div>

<div class="p-4 rounded-lg bg-blue-500 bg-opacity-10 border-l-4 border-blue-500">

### 📋 Variables
`vars.NAME`

- Plain text, visible in logs
- Non-sensitive config (URLs, regions)
- Scope: Org → Repo → Environment

</div>

<div class="p-4 rounded-lg bg-purple-500 bg-opacity-10 border-l-4 border-purple-500">

### 🌐 Environments
*staging / production*

- Named deployment targets
- **Required reviewers** = approval gate
- Replaces Jenkins manual approval

</div>

</div>

<div class="pt-3 text-xs opacity-70 text-center">
More specific scope overrides broader → <strong>Environment > Repository > Organization</strong>
</div>
""")

# 49. Environments approvals
SLIDES.append("""---
---

# Environments — Approvals & Protection Rules

<div class="text-sm opacity-70 mb-3">Native replacement for Jenkins manual-approval plugins — gates, reviewers, scoped secrets</div>

<div class="grid grid-cols-2 gap-6 text-sm">

<div>

```yaml
jobs:
  deploy-prod:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://app.example.com
    steps:
      - run: ./deploy.sh
        env:
          API_KEY: ${{ secrets.PROD_API_KEY }}
```

</div>

<div>

### Protection Rules

- 👤 Required reviewers (up to 6)
- ⏱️ Wait timer before deploy
- 🌿 Allowed deployment branches
- 🔒 Environment-scoped secrets & vars
- 🧩 Custom protection rules (Apps)
- 📜 Deployment history & rollback

📍 *Settings → Environments → New environment*

</div>

</div>

<div class="pt-2 text-xs opacity-70 text-center">
Job pauses on Reviewers gate until approved in UI.
</div>
""")

# 50. Job orchestration
SLIDES.append("""---
---

# Job Orchestration

```mermaid {scale: 0.7}
flowchart LR
  lint --> build
  test --> build
  build --> deploy[deploy<br/>main only]
  build --> notify[notify<br/>if always]
  classDef cond fill:#fde047,stroke:#854d0e,color:#000
  class deploy,notify cond
```

<div class="grid grid-cols-2 gap-4 text-xs pt-3">

<div>

- **Parallel by default** — jobs without `needs:`
- **Sequential** — `needs: [lint, test]`
- **Conditional** — `if: github.ref == 'refs/heads/main'`
- **On failure only** — `if: failure()`
- **Always runs** — `if: always()` *(notify)*

</div>

<div>

- **Matrix** — `strategy: matrix:` for parallel variants
- **Cancel stale runs** — `concurrency: cancel-in-progress: true`

</div>

</div>
""")

# 51. Passing data
SLIDES.append("""---
---

# Passing Data Between Steps & Jobs

<div class="text-sm opacity-70 mb-2">Each job is a fresh VM — pick the right channel for the data you're moving</div>

| Mechanism | Scope | Use For |
|---|---|---|
| `$GITHUB_OUTPUT` | step → step | Named values referenced by step `id` (small) |
| `$GITHUB_ENV` | step → step | Env vars for all later steps in the job |
| `env:` at job/step | static | Constants known at workflow author time |
| `jobs.<j>.outputs` | job → job | Small strings between dependent jobs (`needs`) |
| `actions/cache` | run → run | Reusable deps (pip / npm / gradle) across runs |
| `upload`/`download-artifact` | job → job / run | Files: builds, test reports, coverage |

```yaml
# step output
- id: ver
  run: echo "tag=v1.2.${{ github.run_number }}" >> $GITHUB_OUTPUT
- run: echo "${{ steps.ver.outputs.tag }}"
```
""")

# 52. Reusable workflows / composite
SLIDES.append("""---
---

# Reusable Workflows & Composite Actions

<div class="grid grid-cols-2 gap-6 text-sm">

<div class="p-4 rounded bg-blue-500 bg-opacity-10 border-l-4 border-blue-500">

### 🔁 Reusable Workflow
`workflow_call`

- A full workflow called from another workflow
- Has its **own runner** and jobs
- Pass `inputs`, `secrets`, get `outputs`
- Best for: shared **deploy / release** pipelines

</div>

<div class="p-4 rounded bg-purple-500 bg-opacity-10 border-l-4 border-purple-500">

### 🧩 Composite Action
`action.yml`

- Steps packaged as a single `uses:` call
- Runs on the **caller's runner**
- Best for: shared **setup** (install, cache, auth)

</div>

</div>

```yaml
jobs:
  deploy:
    uses: ./.github/workflows/deploy.yml
    with:
      environment: staging
    secrets: inherit
```
""")

# 53. Caching & matrix
SLIDES.append("""---
---

# Performance & Scale — Caching & Matrix

<div class="text-sm opacity-70 mb-2">Two levers that pay off on every run: cache dependencies, parallelize across versions</div>

<div class="grid grid-cols-2 gap-6 text-sm">

<div>

### Built-in cache via `setup-*`

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'yarn'
    cache-dependency-path: yarn.lock

- uses: actions/setup-python@v5
  with:
    python-version: '3.12'
    cache: 'pip'
```

- **One line** — keys & paths handled for you
- Works for: npm, yarn, pnpm, pip, gradle, maven
- Drop to `actions/cache@v4` only for custom paths

</div>

<div>

### `strategy: matrix`

```yaml
strategy:
  fail-fast: false
  matrix:
    python: ['3.10', '3.11', '3.12']
    os: [ubuntu-latest, windows-latest]
    exclude:
      - { os: windows-latest, python: '3.10' }
```

- **N parallel variants** from one job definition
- `fail-fast: false` — let all variants finish
- `include` / `exclude` — fine-tune combinations

</div>

</div>
""")

# 54. SHA pinning
SLIDES.append("""---
---

# Security Best Practices & SHA Pinning

<div class="text-sm opacity-70 mb-2">Tags can move, SHAs cannot — pin third-party actions and lock down permissions</div>

<div class="grid grid-cols-2 gap-6 text-sm">

<div>

### 🔐 SHA Pinning

```yaml
# ❌ tag — can be moved
- uses: actions/checkout@v4

# ✅ pinned to immutable SHA
- uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683
  # v4.2.2
```

> Use **Dependabot** to keep pinned SHAs up to date.

</div>

<div>

### 🛡️ Workflow Hardening

- ✅ `permissions: contents: read` *(minimal default token)*
- ❌ `pull_request_target` — runs with write token on forks
- ✅ Secrets via `env:` — never inline in `run:` scripts
- ✅ **OIDC** → cloud — no long-lived AWS / Azure keys
- ✅ CODEOWNERS on `.github/workflows/` — workflow changes need review
- ✅ `concurrency:` — prevent overlapping deploys

</div>

</div>
""")

# 55. Runners
SLIDES.append("""---
---

# Runners — Where Your Jobs Execute

| | GitHub-Hosted | Self-Hosted |
|---|---|---|
| **Setup** | Zero config | You manage |
| **Cost** | Per-minute billing | Your infra |
| **Isolation** | Fresh VM per job | Shared (configurable) |
| **Private network** | No | Yes |
| **Custom tools** | Install each run | Pre-installed |
| **Best for** | Standard CI | Large builds, private infra |

<div class="pt-4 text-xs opacity-70 text-center">
Use self-hosted when: <strong>private network access</strong> · <strong>large Docker cache</strong> · <strong>specialized hardware (GPU)</strong> · <strong>cost at scale</strong>
</div>
""")

# 56. workflow_dispatch
SLIDES.append("""---
---

# Manual Triggers — `workflow_dispatch`

<div class="grid grid-cols-2 gap-6 text-sm">

<div>

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        options: [staging, production]
      dry-run:
        type: boolean
        default: true
```

</div>

<div>

**Trigger from UI**
*Actions tab → select workflow → Run workflow*

**Trigger from CLI**
```bash
gh workflow run deploy.yml \\
  --field environment=staging \\
  --field dry-run=false
```

**Use cases:**
On-demand deploy · Hotfix release · Database migration · Manual smoke test

</div>

</div>
""")

# 57. push trigger
SLIDES.append("""---
---

# Code Triggers — `push`

<div class="grid grid-cols-2 gap-6 text-sm">

<div>

```yaml
on:
  push:
    branches:
      - main
      - 'release/**'
    branches-ignore:
      - 'feature/**'
    paths:
      - 'src/**'
      - '!**/*.md'
    tags:
      - 'v*.*.*'
```

</div>

<div>

**When it fires**
On every `git push` to matching branches, paths, or tags.

**Tag-only push (releases)**
```bash
git tag v1.2.0
git push origin v1.2.0
# fires on: push.tags only
```

**Use cases:**
CI on every push · Tag-based releases · Path-scoped builds · Multi-branch pipeline

</div>

</div>
""")

# 58. PR trigger
SLIDES.append("""---
---

# PR Triggers — `pull_request`

<div class="grid grid-cols-2 gap-6 text-sm">

<div>

```yaml
on:
  pull_request:
    types:
      - opened
      - synchronize
      - reopened
      - ready_for_review
    branches: [main]
    paths: ['src/**']
```

</div>

<div>

**Default types**
`opened, synchronize, reopened` — that's what runs the CI on every PR push.

**Skip drafts**
```yaml
jobs:
  test:
    if: '!github.event.pull_request.draft'
    runs-on: ubuntu-latest
```

**Use cases:**
Lint & test PRs · Required checks · Auto-label PRs · Preview deploys

</div>

</div>
""")

# 59. schedule
SLIDES.append("""---
---

# Scheduled Triggers — `schedule`

<div class="grid grid-cols-2 gap-6 text-sm">

<div>

```yaml
on:
  schedule:
    # 02:00 UTC every day
    - cron: '0 2 * * *'
    # 09:00 UTC every Monday
    - cron: '0 9 * * MON'
    # Every 6 hours
    - cron: '0 */6 * * *'
```

</div>

<div>

**Cron syntax (UTC)**
minute · hour · day · month · day-of-week — times are in **UTC**.

**Important**
- Runs only on default branch
- May be delayed under load
- Minimum interval: 5 min

**Use cases:**
Nightly builds · Security scans · Dependency updates · Stale issue cleanup

</div>

</div>
""")

# 60. repository_dispatch
SLIDES.append("""---
---

# External Triggers — `repository_dispatch`

<div class="grid grid-cols-2 gap-6 text-sm">

<div>

```yaml
on:
  repository_dispatch:
    types:
      - build-trigger
      - deploy-prod

jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - run: echo "${{ github.event.client_payload.version }}"
```

</div>

<div>

**Fired via REST API**
Any external system with a token can trigger the workflow.

**`curl` example**
```bash
curl -X POST \\
  -H "Authorization: token $GH_PAT" \\
  https://api.github.com/repos/O/R/dispatches \\
  -d '{"event_type":"build-trigger"}'
```

**Use cases:**
External CI bridge · Cross-repo trigger · 3rd-party webhook · Custom automation

</div>

</div>
""")

# 61. workflow_run
SLIDES.append("""---
---

# Chained Triggers — `workflow_run`

<div class="grid grid-cols-2 gap-6 text-sm">

<div>

```yaml
on:
  workflow_run:
    workflows: ["CI"]
    types: [completed]
    branches: [main]

jobs:
  deploy:
    if: github.event.workflow_run.conclusion == 'success'
    runs-on: ubuntu-latest
```

</div>

<div>

**Run after another workflow**
Chain workflows: CI green → deploy. Access conclusion and artifacts of the previous run.

**Get the source run's outputs**
```yaml
- uses: actions/download-artifact@v4
  with:
    run-id: ${{ github.event.workflow_run.id }}
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

**Use cases:**
Deploy after CI · Notify on success · Cleanup after build · Promote artifacts

</div>

</div>
""")

# 62. Marketplace
SLIDES.append("""---
---

# GitHub Actions Marketplace

<div class="grid grid-cols-2 gap-6 text-sm">

<div>

```yaml
# Pin to a SHA, not a tag
- name: Publish Release
  uses: softprops/action-gh-release@de2c0eb89ae2a093876385947365aca7b0e5f25c
    # v2.0.4
  with:
    files: dist/*
    body: ${{ github.event.head_commit.message }}
    draft: false
    prerelease: false
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

</div>

<div>

**Find an action**
Marketplace → search by task. Evaluate: **Verified creator**, star count, last commit, community size, source on GitHub.

**Pin to SHA, not `@v2`**
```yaml
# tag — convenient, but movable
uses: org/action@v2  # ❌
# SHA — immutable, recommended
uses: org/action@de2c0eb...  # ✅
```

**Best practices:**
Verified creators · Audit `action.yml` · SHA pinning · Dependabot updates

</div>

</div>
""")

# 63. Module 2 hands-on
SLIDES.append("""---
layout: center
class: text-center
---

<div class="text-sm uppercase tracking-widest opacity-60">Hands-On</div>

# Module 2 Exercise

<div class="text-lg opacity-80 mb-6">Build a complete CI workflow from scratch</div>

<div class="text-left max-w-2xl mx-auto text-sm">

1. Create `.github/workflows/ci.yml`
2. Add **lint** job (`ruff check src/`)
3. Add **test** job with matrix (Python 3.10, 3.11, 3.12)
4. Add **build** job — `needs: [lint, test]`
5. Add **deploy-staging** — only on `main` branch
6. Push and watch PR checks enforce the gates
7. Trigger manually: `gh workflow run ci.yml`

</div>

<div class="pt-8 text-sm opacity-70">
⏱️ ~30 min  ·  <code>modules/02-github-actions/exercises/exercise.md</code>  ·  Stuck? → <code>solutions/02-ci-workflow/</code>
</div>
""")

# 64. Break
SLIDES.append("""---
layout: center
class: text-center
---

# ☕ Break

<div class="text-2xl opacity-80 pt-2">10 minutes</div>

<div class="pt-8 text-sm opacity-70">
Grab coffee · Ask questions · Browse <code>resources/cheatsheet.md</code>
</div>
""")

# 65. Module 3 divider
SLIDES.append("""---
layout: section
---

<div class="text-sm uppercase tracking-widest opacity-60 mb-4">Module 3</div>

# Day-to-Day Operations<br>& Debugging

<div class="text-lg opacity-70 pt-4">⏱️ 30 minutes</div>
""")

# 66. Monitoring runs
SLIDES.append("""---
---

# Monitoring Workflow Runs

<div class="grid grid-cols-2 gap-6 text-sm">

<div>

### In the UI

- **Actions tab** → filter by workflow, branch, status
- **Click run** → job graph with status indicators
- **Click job** → step logs with timestamps
- `$GITHUB_STEP_SUMMARY` → rich markdown on summary page

</div>

<div>

### Via `gh` CLI

```bash
gh run list --workflow ci.yml
gh run list --status failure
gh run view <id>
gh run view <id> --log-failed
gh run view <id> --log
gh run watch
# Re-run options
gh run rerun <id> --failed
gh run rerun <id> --failed --debug
gh run cancel <id>
```

</div>

</div>
""")

# 67. Artifacts
SLIDES.append("""---
---

# Artifacts — Persist & Share Build Outputs

<div class="grid grid-cols-2 gap-6 text-sm">

<div>

```yaml
# Upload (in any job)
- uses: actions/upload-artifact@v4
  if: always()          # capture even on failure
  with:
    name: test-results
    path: test-results.xml
    retention-days: 30

# Download (in another job)
- uses: actions/download-artifact@v4
  with:
    name: test-results
    path: ./results
```

```bash
# CLI
gh run download <id> --name test-results
```

</div>

<div>

### Key Points

- Each job gets a **fresh VM** — artifacts are the bridge between jobs
- `if: always()` — capture outputs even when tests fail
- Default retention: **90 days**
- Use artifacts for: test results, `dist/`, logs, coverage reports

</div>

</div>
""")

# 68. Debugging
SLIDES.append("""---
---

# Debugging Workflows

<div class="grid grid-cols-2 gap-6 text-sm">

<div>

### Enable Debug Logging

```bash
gh secret set ACTIONS_STEP_DEBUG --body "true"
gh run rerun <id> --failed --debug
gh secret delete ACTIONS_STEP_DEBUG
```

### Workflow commands

```bash
echo "::notice::Deploy started"
echo "::warning::Approaching rate limit"
echo "::error file=src/app.py,line=10::Syntax error"
echo "::group::Logs" && cat build.log && echo "::endgroup::"
```

</div>

<div>

### Common Failure Patterns

| Symptom | Fix |
|---|---|
| Permission denied | Add `permissions:` to the job |
| Secret empty | Check name, scope, environment match |
| Job skipped | Check `if:` — use `refs/heads/main` not `main` |
| Cache miss every time | Check `hashFiles()` pattern matches your lockfile |

</div>

</div>
""")

# 69. Module 3 hands-on
SLIDES.append("""---
layout: center
class: text-center
---

<div class="text-sm uppercase tracking-widest opacity-60">Hands-On</div>

# Module 3 Exercise

<div class="text-lg opacity-80 mb-6">Trigger a failure, debug it, fix it, download artifacts</div>

<div class="text-left max-w-2xl mx-auto text-sm">

1. Add an intentional failing test to `src/test_app.py`
2. Push and open a PR — watch CI fail
3. Identify failure: `gh run view --log-failed`
4. Enable debug: `gh secret set ACTIONS_STEP_DEBUG true`
5. Re-run: `gh run rerun --failed --debug`
6. Fix the test and push — watch all checks go green
7. Download artifacts: `gh run download`

</div>

<div class="pt-8 text-sm opacity-70">
⏱️ ~15 min  ·  <code>modules/03-operations-debugging/exercises/exercise.md</code>  ·  Stuck? → <code>solutions/03-debugging/</code>
</div>
""")

# 70. Key Takeaways
SLIDES.append("""---
---

# Key Takeaways

<div class="grid grid-cols-3 gap-4 text-sm pt-2">

<div class="p-4 rounded bg-blue-500 bg-opacity-10 border-l-4 border-blue-500">

### 🤝 Collaboration

- PRs are the **unit of collaboration** — use them for everything
- **Branch protection + CODEOWNERS** = automated code review standards
- `gh` CLI brings the full GitHub experience into your terminal

</div>

<div class="p-4 rounded bg-purple-500 bg-opacity-10 border-l-4 border-purple-500">

### ⚡ Actions

- Your **Jenkinsfile** becomes a YAML workflow — same concepts, new syntax
- Jobs run **in parallel by default**; use `needs:` to sequence
- **Environments** replace Jenkins manual approvals — no plugin required

</div>

<div class="p-4 rounded bg-green-500 bg-opacity-10 border-l-4 border-green-500">

### 🔧 Operations

- `gh run` is your **first debugging tool** — faster than reading the UI
- `ACTIONS_STEP_DEBUG` reveals what normal logs hide
- `if: always()` + `upload-artifact` = never lose test results

</div>

</div>
""")

# 71. Resources
SLIDES.append("""---
layout: center
class: text-center
---

# Resources & Next Steps

<div class="grid grid-cols-2 gap-6 text-sm text-left max-w-3xl mx-auto pt-4">

<div>

**📚 Workshop Repo**
[github.com/ShmuelMax100/github-workshop](https://github.com/ShmuelMax100/github-workshop)
`resources/cheatsheet.md` · all guides linked from `README.md`

**📖 GitHub Docs**
[docs.github.com](https://docs.github.com)

</div>

<div>

**🛒 Actions Marketplace**
[github.com/marketplace?type=actions](https://github.com/marketplace?type=actions)

**⚙️ GitHub CLI Manual**
[cli.github.com/manual](https://cli.github.com/manual)

**🧪 `act` — run Actions locally**
[github.com/nektos/act](https://github.com/nektos/act)

</div>

</div>

<div class="pt-10 text-2xl">
Thank you 🙏 — Questions?
</div>
""")


content = "\n".join(SLIDES)
with open("slides.md", "w", encoding="utf-8", newline="\n") as f:
    f.write(content)

print(f"Wrote slides.md with {len(SLIDES)} slides ({len(content)} chars)")
