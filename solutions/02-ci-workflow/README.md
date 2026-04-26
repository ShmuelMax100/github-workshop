# Solution — Exercise 2: CI Workflow

## What was built

A complete CI pipeline with lint → test (matrix) → build → deploy-staging.

## File to copy

```bash
cp solutions/02-ci-workflow/.github/workflows/ci.yml .github/workflows/ci.yml
```

## TODOs that were filled in

| TODO | Solution |
|------|----------|
| Set up Python using `actions/setup-python` | `uses: actions/setup-python@...` with `python-version: "3.11"` |
| Add matrix for Python versions | `strategy: matrix: python-version: ["3.10", "3.11", "3.12"]` |
| Set up Python from matrix variable | `python-version: ${{ matrix.python-version }}` |
| Upload test results always | `uses: actions/upload-artifact@... if: always()` |
| Make build wait for lint AND test | `needs: [lint, test]` |
| Only deploy on push to main | `if: github.ref == 'refs/heads/main'` |
| Reference the staging secret | `DEPLOY_TOKEN: ${{ secrets.STAGING_DEPLOY_TOKEN }}` |

## Key things to observe after pushing

- Three parallel test jobs appear (one per Python version)
- Build job is blocked until all three pass
- deploy-staging only runs on `main`, not on PRs
- The PR cannot be merged until `lint`, `test`, and `build` are green
- Artifact appears in the run summary as `dist-vYYYYMMDD-N`
