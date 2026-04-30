# Exercise 3 — Debug a Failing Workflow

> **TL;DR** — In ~15 minutes you'll deliberately break a test, locate the failure with `gh run view --log-failed`, re-run with `--debug` to see `##[debug]` lines, fix it, and pull artifacts down with `gh run download`. The point: own the full failure-to-fix loop from the terminal.

**Duration:**~15 minutes  
**Goal:** Trigger a failing workflow, inspect logs with CLI and UI, enable debug logging, fix the issue, and download artifacts.

---

## Part A — Trigger a Failing Workflow (5 min)

**Step 1:** Create a branch with a broken test:

```bash
BRANCH="feature/$(gh api user -q .login)/debug-exercise"
git checkout -b "$BRANCH"
```

**Step 2:** Open `src/test_app.py` and introduce an intentional failure:

```python
def test_intentional_failure():
    # This will fail
    assert 1 == 2, "This test is intentionally broken"
```

**Step 3:** Commit and push:

```bash
git add src/test_app.py
git commit -m "test: add intentional failure for debug exercise"
git push -u origin "$BRANCH"
```

**Step 4:** Open a PR:

```bash
gh pr create \
  --title "debug: intentional failure exercise" \
  --body "This PR intentionally fails CI to practice debugging."
```

---

## Part B — Inspect the Failure (5 min)

**Option 1: Using `gh` CLI**

```bash
# Watch the run in real time
gh run watch

# After it fails, find the run ID
gh run list --limit 3

# View the summary
gh run view <run-id>

# See only the failed step logs
gh run view <run-id> --log-failed

# Full logs for the test job
gh run view <run-id> --job <job-name> --log
```

**Option 2: Using the UI**

1. Click the failing check on your PR, or go to **Actions** tab
2. Click the failed job
3. Find the red step — expand it
4. Read the error message and identify the failing assertion

**Questions to answer:**
- Which job failed?
- Which step failed?
- What was the error message?
- How long did the run take before failing?

---

## Part C — Enable Debug Logging and Re-Run (3 min)

**Option 1: Re-run with debug flag**

```bash
gh run rerun <run-id> --failed --debug
```

**Option 2: Set secret and re-run normally**

```bash
gh secret set ACTIONS_STEP_DEBUG --body "true"
gh run rerun <run-id> --failed
```

**After the re-run completes:**
- Open the logs again
- Notice the additional verbose output (marked `##[debug]`)
- This shows action inputs, file paths, and environment details

**Clean up:**
```bash
# Remove the debug secret when done
gh secret delete ACTIONS_STEP_DEBUG
```

---

## Part D — Fix and Validate (5 min)

**Step 1:** Fix the test:

```python
# src/test_app.py — remove or fix the intentional failure
def test_intentional_failure():
    assert 1 == 1, "Fixed!"
```

**Step 2:** Commit and push:

```bash
git add src/test_app.py
git commit -m "fix: remove intentional test failure"
git push
```

**Step 3:** Watch it pass:

```bash
gh pr checks --watch
```

---

## Part E — Download Artifacts

After the workflow passes:

```bash
# See what artifacts are available
gh run list --limit 1
gh run view <run-id> --json artifacts --jq '.artifacts[].name'

# Download all artifacts from the run
gh run download <run-id>

# Or download a specific one
gh run download <run-id> --name test-results --dir ./downloaded-results

# Check what you got
ls ./downloaded-results/
```

---

## Validation Checklist

- [ ] Workflow failure spotted in the Actions tab and via `gh run list`
- [ ] Failed step identified using `gh run view --log-failed`
- [ ] Debug logging enabled and re-run completed
- [ ] Extra `##[debug]` lines visible in re-run logs
- [ ] Fix committed and all checks now pass
- [ ] Artifact downloaded locally

---

## Bonus Challenges

1. **Add a step summary** to the test job:
   ```yaml
   - name: Post test summary
     if: always()
     run: |
       echo "## Test Results" >> $GITHUB_STEP_SUMMARY
       echo "Run on: $(date)" >> $GITHUB_STEP_SUMMARY
   ```

2. **Cancel a running workflow** from the CLI:
   ```bash
   gh run cancel <run-id>
   ```

3. **Set a concurrency group** to auto-cancel in-progress runs when you push again:
   ```yaml
   concurrency:
     group: ${{ github.workflow }}-${{ github.ref }}
     cancel-in-progress: true
   ```
