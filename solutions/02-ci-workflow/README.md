# Solution — Exercise 2: CI Workflow

> ## ⚠️ SPOILER — Try the exercise first
>
> This is the **reference solution** for Exercise 2.
> Open it only **after** you've:
> 1. Read the linked guides for each TODO (the hint table in the exercise),
> 2. Made a real attempt at filling in the TODOs yourself,
> 3. Been stuck for 10+ minutes on a specific item.
>
> Copy-pasting from here without the struggle defeats the workshop.

> **TL;DR** — Reference solution for Exercise 2. `ci.yml` runs lint → test (matrix x3) → build on every push/PR.

## What was built

- **`ci.yml`** — lint → test (3-version matrix) → build → upload `dist` artifact. Runs on every push and PR.

## Files to copy

```bash
cp solutions/02-ci-workflow/.github/workflows/ci.yml .github/workflows/ci.yml
```

## TODOs that were filled in

| # | TODO | Solution |
|---|------|----------|
| ① | Default permissions to read-only | `permissions: { contents: read }` at workflow level |
| ② | Set up Python 3.11 in lint | `uses: actions/setup-python@<sha>` with `python-version: "3.11"` |
| ③ | Matrix for Python versions | `strategy: matrix: python-version: ["3.10", "3.11", "3.12"]` |
| ④ | Use matrix value | `python-version: ${{ matrix.python-version }}` |
| ⑤ | Upload test results always | `actions/upload-artifact` + `if: always()` |
| ⑥ | Build waits for lint AND test | `needs: [lint, test]` |

## Key things to observe

- Three parallel test jobs run in the matrix (one per Python version)
- `build` is blocked until all three test jobs and lint pass
- On a PR all three checks (`lint`, `test x3`, `build`) appear as required status checks
- `test-results.xml` is uploaded as an artifact even when tests fail (thanks to `if: always()`)
