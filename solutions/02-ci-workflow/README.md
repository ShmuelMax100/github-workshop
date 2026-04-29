# Solution — Exercise 2: CI + CD Workflows

> ## ⚠️ SPOILER — Try the exercise first
>
> This is the **reference solution** for Exercise 2.
> Open it only **after** you've:
> 1. Read the linked guides for each TODO (the hint tables in the exercise),
> 2. Made a real attempt at filling in the TODOs yourself,
> 3. Been stuck for 10+ minutes on a specific item.
>
> Copy-pasting from here without the struggle defeats the workshop.

> **TL;DR** — Reference solution for Exercise 2. `ci.yml` runs lint → test (matrix x3) → build on every push/PR. `cd.yml` runs on push to main and `workflow_dispatch`, deploys to the chosen environment with an `inputs.environment || 'staging'` fallback so the same job handles auto-staging and manual production releases.

## What was built

- **`ci.yml`** — lint → test (3-version matrix) → build → upload `dist` artifact. Runs on every push and PR.
- **`cd.yml`** — single `deploy` job, gated by an environment chosen via `workflow_dispatch` input (defaults to `staging` on auto-runs). Uses env-scoped `DEPLOY_TOKEN`.

## Files to copy

```bash
cp solutions/02-ci-workflow/.github/workflows/ci.yml .github/workflows/ci.yml
cp solutions/02-ci-workflow/.github/workflows/cd.yml .github/workflows/cd.yml
```

## TODOs that were filled in

### `ci.yml`

| # | TODO | Solution |
|---|------|----------|
| ① | Default permissions to read-only | `permissions: { contents: read }` at workflow level |
| ② | Set up Python 3.11 in lint | `uses: actions/setup-python@<sha>` with `python-version: "3.11"` |
| ③ | Matrix for Python versions | `strategy: matrix: python-version: ["3.10", "3.11", "3.12"]` |
| ④ | Use matrix value | `python-version: ${{ matrix.python-version }}` |
| ⑤ | Upload test results always | `actions/upload-artifact` + `if: always()` |
| ⑥ | Build waits for lint AND test | `needs: [lint, test]` |

### `cd.yml`

| # | TODO | Solution |
|---|------|----------|
| ⑦ | Pick environment dynamically with fallback | `environment: ${{ inputs.environment \|\| 'staging' }}` |
| ⑧ | Reference the deploy secret | `DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}` (resolved per environment) |

## Key things to observe

- Three parallel test jobs run in the matrix (one per Python version)
- `build` is blocked until all three test jobs and lint pass
- On a PR: only `ci.yml` runs — `cd.yml` does not (no `pull_request` trigger)
- After merge to `main`: `cd.yml` runs automatically and deploys to `staging`
- Manual production deploy: `gh workflow run cd.yml -f environment=production` — triggers the `production` environment's approval gate (if configured)
- The `DEPLOY_TOKEN` secret resolves to a different value depending on which environment runs — the same YAML line works for both
