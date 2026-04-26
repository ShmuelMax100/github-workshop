# Repository Lifecycle — CODEOWNERS, Merge Controls & Metadata

How a repository is configured shapes every developer's daily experience. This guide covers the settings that matter most.

---

## CODEOWNERS

The `CODEOWNERS` file (`/.github/CODEOWNERS`) automatically assigns reviewers based on which files are changed in a PR. GitHub enforces it through branch protection rules.

### File format

```
# Pattern                Owner(s)
*                        @org/platform-team          # default: everything
src/auth/                @alice @bob                 # specific directory
*.yml                    @org/devops-team            # file extension
docs/                    @org/tech-writers           # docs team
src/payments/            @carol                      # single person
```

Rules:
- Patterns follow `.gitignore` syntax
- Later rules override earlier ones for the same file
- Multiple owners: all must approve (or any one, depending on branch protection settings)
- Teams are referenced as `@org/team-name`

### Viewing who owns a file

```bash
# In the UI: open any file → "Code owners" section appears in the PR sidebar
# Via API:
gh api repos/{owner}/{repo}/contents/.github/CODEOWNERS
```

### Enabling enforcement

CODEOWNERS is only enforced when **branch protection** has "Require review from Code Owners" enabled.

Settings → Branches → Edit rule → ✅ **Require review from Code Owners**

→ See [branch-protection-guide.md](./branch-protection-guide.md) for the full setup.

---

## Merge Controls

Configure which merge strategies are available to contributors.

**Settings → General → Pull Requests**

### Merge strategies

| Strategy | Setting to enable | Result on `main` |
|----------|-------------------|-----------------|
| **Merge commit** | ✅ Allow merge commits | Preserves all commits + adds a merge commit |
| **Squash merge** | ✅ Allow squash merging | Collapses all PR commits into one |
| **Rebase merge** | ✅ Allow rebase merging | Replays each commit linearly |

**SecuriThings recommendation:** Enable only **Squash merge** on feature repos. This keeps `main` history clean — one commit per feature/fix.

### Auto-delete head branches

**Settings → General → Pull Requests → ✅ Automatically delete head branches**

After a PR is merged, GitHub automatically deletes the source branch. Keeps the repo tidy without requiring developers to remember.

### Auto-merge

Allows a PR to merge automatically once all required checks and approvals are satisfied.

```bash
# Enable auto-merge on a specific PR
gh pr merge 42 --auto --squash

# Disable auto-merge
gh pr merge 42 --disable-auto
```

In the UI: open the PR → **Enable auto-merge** button.

---

## Repository Metadata

Well-configured repository metadata improves discoverability and sets expectations.

### Description & topics

**Settings → General → Description / Topics**

```bash
# Set via CLI
gh repo edit --description "SecuriThings IoT security platform"
gh repo edit --add-topic "iot,security,python"
```

Topics are searchable across GitHub and show up in org-level views.

### Default branch

**Settings → General → Default branch**

Rename `master` → `main`:
```bash
gh api --method POST repos/{owner}/{repo}/branches/master/rename \
  --field new_name=main
```

### Visibility

```bash
gh repo edit --visibility private    # private
gh repo edit --visibility internal   # internal (org members only)
gh repo edit --visibility public     # public
```

### Repository features — enable/disable what you use

**Settings → General → Features**

| Feature | When to enable |
|---------|----------------|
| Wikis | Team documentation that lives close to the code |
| Issues | Bug tracking and task management |
| Projects | Kanban/roadmap planning |
| Discussions | Q&A, RFCs, team announcements |
| Sponsorships | Open source only |

Disable features your team won't use — less noise, cleaner UI.

---

## Repository Insights

Useful dashboards built into every repo:

| Insight | Location | What it shows |
|---------|----------|---------------|
| Contributors | Insights → Contributors | Commits per person over time |
| Traffic | Insights → Traffic | Clones, views, referring sites |
| Network | Insights → Network | Visual branch/fork graph |
| Dependency graph | Insights → Dependency graph | All dependencies and security alerts |
| Code frequency | Insights → Code frequency | Additions/deletions over time |

---

## Recommended Repository Checklist

When setting up a new team repository:

- [ ] Description and topics set
- [ ] Default branch is `main`
- [ ] `CODEOWNERS` file created (`.github/CODEOWNERS`)
- [ ] PR template created (`.github/PULL_REQUEST_TEMPLATE.md`)
- [ ] Branch protection enabled on `main` (required reviews + status checks)
- [ ] Only **Squash merge** enabled
- [ ] **Auto-delete head branches** enabled
- [ ] Unused features (Wiki, Discussions) disabled
- [ ] Dependabot alerts enabled (Settings → Security)
- [ ] At least 2 admins configured
