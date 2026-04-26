# Solution — Exercise 3: Debugging

## What you did

Introduced an intentional test failure, debugged it with `gh` CLI and debug logging, fixed it, and downloaded the artifact.

## Step-by-step reference

### 1. Introduce the failure

```python
# src/test_app.py — add this test
def test_intentional_failure():
    assert 1 == 2, "This test is intentionally broken"
```

```bash
git add src/test_app.py
git commit -m "test: intentional failure for debug exercise"
git push -u origin feature/<your-name>/debug-exercise
gh pr create --title "debug: intentional failure exercise" --body "."
```

### 2. Identify the failure

```bash
gh run list --limit 3
gh run view <run-id> --log-failed
```

**What you should see:**
```
AssertionError: This test is intentionally broken
assert 1 == 2
```

### 3. Enable debug logging and re-run

```bash
gh secret set ACTIONS_STEP_DEBUG --body "true"
gh run rerun <run-id> --failed
```

In the re-run logs, look for lines prefixed with `##[debug]` — these show action inputs, paths, and environment details that are hidden in normal runs.

### 4. Fix and verify

```python
# Remove or fix the test
def test_intentional_failure():
    assert 1 == 1, "Fixed!"
```

```bash
git add src/test_app.py
git commit -m "fix: remove intentional failure"
git push
gh pr checks --watch     # watch all checks go green
```

### 5. Clean up debug secret

```bash
gh secret delete ACTIONS_STEP_DEBUG
```

### 6. Download the artifact

```bash
gh run list --limit 1
gh run download <run-id> --name test-results-py3.11 --dir ./results
ls ./results/
```

## Key observations

- `gh run view --log-failed` shows only the failed step — much faster than reading all logs
- Debug logs add significant noise — only enable when you need them, delete the secret after
- Artifacts persist even when a run fails, as long as the upload step ran with `if: always()`
- Re-running only failed jobs saves time — passed jobs don't re-run
