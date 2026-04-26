# Instructor Guide

Timing, live demo script, and known stumbling points for each module.

---

## Before the Session

- Share the repo link and `START-HERE.md` **at least 30 minutes before** — participants who skip setup waste everyone's time
- Ask participants to pair up ahead of time (needed for PR review exercise)
- Have your own fork ready with branch protection enabled
- Open these tabs in your browser: repo homepage, Actions tab, a sample PR, branch protection settings

---

## Session Overview

| Segment | Time | Format |
|---------|------|--------|
| Module 1 — Collaboration | 60 min | 35 min demo + 25 min hands-on |
| Module 2 — GitHub Actions | 80 min | 50 min demo + 30 min hands-on |
| Break | 10 min | — |
| Module 3 — Operations | 30 min | 15 min demo + 15 min hands-on |

---

## Module 1 — GitHub Collaboration (60 min)

### What to demo live (35 min)

**GitLab → GitHub mapping (5 min)**
- Open `gitlab-github-mapping.md` and walk through the terminology table
- Ask the room: "What's a Merge Request called in GitHub?" — get them talking early

**PR lifecycle (10 min)**
- Live demo: create a branch, push a change, open a PR in the UI
- Show the PR template auto-populating
- Point out: Files changed tab, reviewers panel, linked issues

**`gh` CLI (10 min)**
- Switch to terminal — recreate the same flow with `gh pr create`
- Show `gh pr list`, `gh pr checkout`, `gh pr checks --watch`
- Key message: "Everything you can do in the UI, you can do in the terminal"

**Branch protection (5 min)**
- Show the settings page live
- Try pushing directly to `main` — show it gets rejected
- Key message: "The repo enforces your team's rules automatically"

**CODEOWNERS (5 min)**
- Open `.github/CODEOWNERS` — explain the pattern syntax
- Show how it auto-assigns in a PR (point to the Reviewers panel)

### Hands-on exercise (25 min)

→ `modules/01-github-collaboration/exercises/exercise.md`

**Common issues:**
- *"I can't merge my PR"* — branch protection requires 1 approval; they need to swap reviews with their partner
- *"gh pr create fails"* — usually not on the right branch, or remote not pushed yet (`git push -u origin <branch>`)
- *"I don't see the PR template"* — only appears in the UI, not in `gh pr create --body ""` override

---

## Module 2 — GitHub Actions (80 min)

### Focus topics for the live session — pick 5 of 9

With 80 minutes and a hands-on exercise, you can cover 5 topics well. The others are reference material participants can read on their own.

**Recommended live demo topics:**

1. **Core concepts (15 min)** — walk through `01-basic-ci.yml` line by line
   - Explain `on:`, `jobs:`, `steps:`, `uses:` vs `run:`
   - Show the Actions tab as you push — watch it trigger in real time
   - Key message: "This is your Jenkinsfile, but in YAML"

2. **Jenkins comparison (10 min)** — open `jenkins-github-actions-comparison.md`
   - Side-by-side: `stage('Build')` → `jobs: build:`, `withCredentials()` → `secrets`
   - Key message: "The concepts are identical, the syntax is different"

3. **Secrets & environments (10 min)**
   - Show where to add a secret in repo settings
   - Show an environment with a required reviewer — trigger the approval gate live
   - Key message: "Environments replace Jenkins' manual approval step"

4. **Job orchestration (10 min)**
   - Show the `needs:` graph in `01-basic-ci.yml` — draw it on a whiteboard
   - Show `if: github.ref == 'refs/heads/main'` — conditional deploy
   - Key message: "No stages — you define a dependency graph"

5. **Security: SHA pinning (5 min)**
   - Open `security-best-practices.md`
   - Show the difference between `@v4` and a full SHA
   - Key message: "Tags can be moved. SHAs cannot."

**Skip for live session, assign as reading:**
- Reusable workflows (complex — better as self-study)
- Matrix builds (show the example file, don't build from scratch)
- Runners guide (mention self-hosted, point to the file)
- Manual triggers (30 seconds — "there's a button in the UI")

### Hands-on exercise (30 min)

→ `modules/02-github-actions/exercises/exercise.md`

Participants build a CI workflow from scratch (lint → test → build).

**Common issues:**
- *"My workflow isn't triggering"* — check the `on:` trigger matches the branch they pushed to; workflow files must exist on the default branch to run on PRs
- *"Permission denied on GITHUB_TOKEN"* — they need `permissions: contents: read` + the specific permission their job needs
- *"The matrix test shows as one check, not three"* — normal until they add `name: Test (Python ${{ matrix.python-version }})`
- *"I can't find my workflow in the Actions tab"* — look for a syntax error in the YAML (indentation is the usual culprit)

**If someone finishes early:** point them to the SHA pinning bonus challenge or the reusable workflow example.

---

## Break (10 min)

Good moment to check in on who is stuck and pair them with someone who finished early.

---

## Module 3 — Operations & Debugging (30 min)

### What to demo live (15 min)

**Monitoring (5 min)**
- Open the Actions tab — show how to read the job graph
- Run `gh run list` and `gh run watch` in the terminal live
- Show `gh run view --log-failed` on a previously failed run

**Debug logging (5 min)**
- Set `ACTIONS_STEP_DEBUG=true` as a repo secret live
- Re-run a job with `gh run rerun --failed --debug`
- Show the extra `##[debug]` lines in the output
- Remember to delete the secret after

**Artifacts (5 min)**
- Show the artifacts panel at the bottom of a completed run
- Run `gh run download` in the terminal — show the files appear locally

### Hands-on exercise (15 min)

→ `modules/03-operations-debugging/exercises/exercise.md`

Participants introduce a failing test, debug it with the CLI, fix it, and download the artifact.

**Common issues:**
- *"I don't see the artifact download button"* — artifacts only appear after the job that uploads them completes (even partially failed runs may have artifacts if upload ran with `if: always()`)
- *"Debug logs look the same"* — make sure the secret is set at repo level, not environment level; and that they're looking at a re-run (not the original run)

---

## Closing (5 min)

- Point everyone to `resources/cheatsheet.md` — their take-home reference
- Remind them `solutions/` has the completed exercise files
- Ask for one thing they'll change in their team's workflow tomorrow

---

## Known General Issues

| Issue | Fix |
|-------|-----|
| Windows line endings break shell scripts in workflows | Add `.gitattributes` with `*.sh text eol=lf` |
| `gh` not found after install | Restart terminal / re-source shell profile |
| SSH vs HTTPS confusion | Check `gh config get git_protocol` — set to `https` for simplicity |
| Workflow doesn't run on PR from a fork | Expected — fork PRs don't get secrets by default (security) |
| Branch protection blocks even admins | Intentional — show "Include administrators" setting |
