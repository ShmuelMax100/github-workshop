# GitHub Workshop — SecuriThings Developers

> **Duration:** 3.5 hours &nbsp;|&nbsp; **Format:** Hands-on &nbsp;|&nbsp; **Audience:** Developers transitioning from GitLab & Jenkins

---

## Prerequisites

- GitHub account with access to this repository
- [GitHub CLI (`gh`)](https://cli.github.com/) installed and authenticated
- Git configured locally

```bash
gh auth status && git --version && gh --version
```

---

## Module 1 — GitHub Collaboration & CI Flow (60 min)

| Topic | Guide |
|-------|-------|
| Login, clone & fork with `gh` | [gh-login-clone-fork.md](./modules/01-github-collaboration/gh-login-clone-fork.md) |
| GitLab → GitHub terminology mapping | [gitlab-github-mapping.md](./modules/01-github-collaboration/gitlab-github-mapping.md) |
| PR lifecycle: create, review, approve, merge | [pr-lifecycle.md](./modules/01-github-collaboration/pr-lifecycle.md) |
| Draft PRs & PR templates | [draft-prs-and-templates.md](./modules/01-github-collaboration/draft-prs-and-templates.md) |
| GitHub CLI for daily workflows | [gh-cli-daily-workflows.md](./modules/01-github-collaboration/gh-cli-daily-workflows.md) |
| Branch protection rules | [branch-protection-guide.md](./modules/01-github-collaboration/branch-protection-guide.md) |
| Repository lifecycle: CODEOWNERS, merge controls, metadata | [repository-lifecycle.md](./modules/01-github-collaboration/repository-lifecycle.md) |
| Quick UI flows: search, blame, compare | [quick-ui-flows.md](./modules/01-github-collaboration/quick-ui-flows.md) |
| **Hands-on exercise** | [exercises/exercise.md](./modules/01-github-collaboration/exercises/exercise.md) |

---

## Module 2 — GitHub Actions Deep Dive (80 min)

| Topic | Guide |
|-------|-------|
| Jenkins → GitHub Actions comparison | [jenkins-github-actions-comparison.md](./modules/02-github-actions/jenkins-github-actions-comparison.md) |
| Core concepts: triggers, jobs, steps, runners | [core-concepts.md](./modules/02-github-actions/core-concepts.md) |
| Secrets, variables & environments | [secrets-variables-environments.md](./modules/02-github-actions/secrets-variables-environments.md) |
| Job orchestration: needs, parallel, conditional, data passing | [job-orchestration.md](./modules/02-github-actions/job-orchestration.md) |
| Reusable workflows & composite actions | [reusable-workflows.md](./modules/02-github-actions/reusable-workflows.md) |
| Matrix builds & caching | [examples/matrix-build.yml](./modules/02-github-actions/examples/matrix-build.yml) |
| Security best practices & SHA pinning | [security-best-practices.md](./modules/02-github-actions/security-best-practices.md) |
| Runners: hosted vs self-hosted | [runners-guide.md](./modules/02-github-actions/runners-guide.md) |
| Manual triggers (`workflow_dispatch`) | [manual-triggers.md](./modules/02-github-actions/manual-triggers.md) |
| **Hands-on exercise** | [exercises/exercise.md](./modules/02-github-actions/exercises/exercise.md) |

---

## Module 3 — Day-to-Day Operations & Debugging (30 min)

| Topic | Guide |
|-------|-------|
| Monitoring runs, logs & re-running jobs | [monitoring-and-reruns.md](./modules/03-operations-debugging/monitoring-and-reruns.md) |
| Artifacts: upload, download, share | [artifacts.md](./modules/03-operations-debugging/artifacts.md) |
| Debugging: step debug, annotations, summaries | [debugging-guide.md](./modules/03-operations-debugging/debugging-guide.md) |
| **Hands-on exercise** | [exercises/exercise.md](./modules/03-operations-debugging/exercises/exercise.md) |

---

## Example Workflows

| Workflow | What it demonstrates |
|----------|----------------------|
| [01-basic-ci.yml](./.github/workflows/01-basic-ci.yml) | Full CI pipeline: lint → test (matrix) → build → deploy |
| [02-matrix-build.yml](./.github/workflows/02-matrix-build.yml) | Cross-OS, multi-Python matrix with dynamic combinations |
| [03-reusable-workflow.yml](./.github/workflows/03-reusable-workflow.yml) | Callable deploy workflow with inputs, secrets & outputs |
| [04-manual-trigger.yml](./.github/workflows/04-manual-trigger.yml) | `workflow_dispatch` with typed inputs and validation |

---

## Quick Reference

- [Cheat Sheet](./resources/cheatsheet.md) — one page covering all topics
- [GitHub Docs](https://docs.github.com)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [GitHub CLI Manual](https://cli.github.com/manual/)
