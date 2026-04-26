# GitLab → GitHub Concepts Mapping

A side-by-side reference for teams transitioning from GitLab to GitHub.

---

## Terminology

| Concept | GitLab | GitHub |
|---------|--------|--------|
| Code review request | Merge Request (MR) | Pull Request (PR) |
| CI/CD definition file | `.gitlab-ci.yml` | `.github/workflows/*.yml` |
| CI/CD system | GitLab CI | GitHub Actions |
| CI executor | Runner | Runner |
| Reusable CI | `include:` / templates | Reusable workflows / Composite actions |
| CI job cache | `cache:` | `actions/cache` |
| Artifacts | `artifacts:` | `actions/upload-artifact` |
| Environment variables | CI/CD Variables | Secrets / Variables / Env |
| Protected environments | Protected environments | Environments + protection rules |
| Code ownership | CODEOWNERS | CODEOWNERS (same file format) |
| Branch rules | Protected branches | Branch protection rules |
| Group | Group | Organization |
| Project | Project | Repository |
| Fork | Fork | Fork |
| Wiki | Wiki | Wiki |
| Snippets | Snippets | Gists |
| Issue board | Issue board | Projects (beta) |
| Package registry | Package Registry | GitHub Packages |
| Container registry | Container Registry | GitHub Container Registry (ghcr.io) |
| Release | Release | Release |
| Webhook | Webhook | Webhook |
| API token | Personal access token | Personal access token (classic / fine-grained) |

---

## CI/CD Concepts

### Job triggers

| GitLab | GitHub Actions |
|--------|----------------|
| `only: [main]` | `on: push: branches: [main]` |
| `rules:` | `if:` conditions |
| `workflow:rules:` | `on:` event filters |
| `when: manual` | `workflow_dispatch:` or `environment` approvals |
| `schedules` | `on: schedule: cron:` |

### Job structure

| GitLab | GitHub Actions |
|--------|----------------|
| `stages:` | Job ordering via `needs:` |
| `stage: build` | Belongs to implicit graph via `needs:` |
| `script:` | `steps: run:` |
| `before_script:` | Earlier `steps:` in same job |
| `after_script:` | `if: always()` step at end |
| `image:` | `runs-on:` + `container:` |
| `services:` | `services:` (same concept) |
| `tags:` | `runs-on: [self-hosted, label]` |
| `parallel:` | `strategy: matrix:` |
| `cache:` | `actions/cache` action |
| `artifacts:` | `actions/upload-artifact` / `actions/download-artifact` |
| `needs: [job]` | `needs: [job]` (same!) |
| `extends:` | Composite actions / Reusable workflows |

### Variables & Secrets

| GitLab | GitHub Actions |
|--------|----------------|
| CI/CD Variable (masked) | Secret (`${{ secrets.NAME }}`) |
| CI/CD Variable (plain) | Variable (`${{ vars.NAME }}`) |
| Group-level variable | Organization secret/variable |
| Project-level variable | Repository secret/variable |
| Environment variable | Environment secret/variable |
| `$CI_COMMIT_SHA` | `${{ github.sha }}` |
| `$CI_COMMIT_BRANCH` | `${{ github.ref_name }}` |
| `$CI_PIPELINE_ID` | `${{ github.run_id }}` |
| `$CI_JOB_NAME` | `${{ github.job }}` |
| `$CI_PROJECT_NAME` | `${{ github.repository }}` |

---

## Predefined Variable Mapping

| GitLab Variable | GitHub Equivalent | Notes |
|-----------------|-------------------|-------|
| `$CI_COMMIT_SHA` | `${{ github.sha }}` | Full commit SHA |
| `$CI_COMMIT_SHORT_SHA` | `${{ github.sha }}` truncated | No built-in short SHA |
| `$CI_COMMIT_BRANCH` | `${{ github.ref_name }}` | Branch name |
| `$CI_MERGE_REQUEST_IID` | `${{ github.event.pull_request.number }}` | PR number |
| `$CI_PIPELINE_URL` | `${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}` | |
| `$CI_PROJECT_DIR` | `${{ github.workspace }}` | Checkout path |
| `$CI_REGISTRY` | `ghcr.io` | GitHub Container Registry |
| `$CI_REGISTRY_USER` | `${{ github.actor }}` | |
| `$CI_REGISTRY_PASSWORD` | `${{ secrets.GITHUB_TOKEN }}` | |

---

## Key Differences to Watch Out For

1. **No stages** — GitHub Actions uses a dependency graph (`needs:`) instead of sequential stages.
2. **Each job runs on a fresh VM** — Unlike GitLab where jobs in the same stage share an environment (with cache/artifacts), each GitHub Actions job starts clean.
3. **Secrets are not echoed** — GitHub masks secret values in logs; no need to set `masked: true`.
4. **`GITHUB_TOKEN`** is auto-provisioned — you get a token for the current repo automatically; no need to create a personal access token for basic CI operations.
5. **Workflow files must be on the default branch** — Changes to workflows in a branch PR won't run against `main`'s rules until merged.
