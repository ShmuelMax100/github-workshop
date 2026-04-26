# Module 3 — Day-to-Day Operations & Debugging

**Duration:** 30 minutes

---

## Learning Objectives

By the end of this module you will be able to:

- Monitor workflow runs and read structured logs
- Re-run specific failed jobs without re-running the entire workflow
- Persist and share build outputs using artifacts
- Enable step-level and runner-level debug logging
- Use `gh` CLI for all common operational tasks

---

## Concepts

### 1. Monitoring Workflow Runs

**In the UI:**
- Repository → **Actions** tab
- Filter by workflow, branch, actor, or status
- Click any run to see the job graph, then click a job to see step logs

**Via CLI:**

```bash
# List recent runs for a workflow
gh run list --workflow ci.yml --limit 10

# List runs on a specific branch
gh run list --branch main

# View a specific run (summary + job statuses)
gh run view <run-id>

# Watch a running workflow in real time
gh run watch

# View specific job logs
gh run view <run-id> --job <job-id> --log
```

---

### 2. Re-Running Jobs

```bash
# Re-run all failed jobs in a run
gh run rerun <run-id> --failed

# Re-run all jobs in a run
gh run rerun <run-id>

# Re-run with debug logging enabled
gh run rerun <run-id> --failed --debug
```

**In the UI:**
- Click a failed run → **Re-run failed jobs** or **Re-run all jobs**
- Check **Enable debug logging** before re-running

---

### 3. Artifacts

Artifacts let you persist files between jobs and download them after a run.

**Uploading:**

```yaml
- name: Upload test results
  uses: actions/upload-artifact@v4
  if: always()                    # Upload even if tests fail
  with:
    name: test-results
    path: |
      test-results.xml
      coverage/
    retention-days: 30            # Default: 90 days
```

**Downloading in another job:**

```yaml
- uses: actions/download-artifact@v4
  with:
    name: test-results
    path: ./results
```

**Downloading via CLI:**

```bash
# List artifacts for a run
gh run view <run-id> --json artifacts

# Download all artifacts
gh run download <run-id>

# Download a specific artifact
gh run download <run-id> --name test-results --dir ./results
```

---

### 4. Debugging Workflows

#### Enable debug logging

Set these as **repository secrets** (or re-run with `--debug`):

| Secret / Variable | Effect |
|-------------------|--------|
| `ACTIONS_STEP_DEBUG = true` | Verbose step-level debug output |
| `ACTIONS_RUNNER_DEBUG = true` | Runner-level infrastructure logs |

> Set via: **Settings → Secrets and variables → Actions → New repository secret**

```bash
# Set via CLI
gh secret set ACTIONS_STEP_DEBUG --body "true"
gh secret set ACTIONS_RUNNER_DEBUG --body "true"
```

#### Print debug messages in your steps

```yaml
- name: Debug context
  run: |
    echo "Runner OS: $RUNNER_OS"
    echo "Working dir: $GITHUB_WORKSPACE"
    echo "Ref: $GITHUB_REF"
    echo "SHA: $GITHUB_SHA"
    echo "Actor: $GITHUB_ACTOR"

# Write to the step summary (shown in the run UI)
- name: Post summary
  run: |
    echo "## Test Results" >> $GITHUB_STEP_SUMMARY
    echo "| Test | Result |" >> $GITHUB_STEP_SUMMARY
    echo "|------|--------|" >> $GITHUB_STEP_SUMMARY
    echo "| Unit | ✅ Pass |" >> $GITHUB_STEP_SUMMARY
```

#### Useful debug annotations

```yaml
- name: Check environment
  run: |
    # These show as annotations in the workflow UI
    echo "::notice file=src/app.py,line=1::File processed"
    echo "::warning::This is a warning message"
    echo "::error::This is an error message"

    # Group log lines
    echo "::group::Dependency tree"
    pip show requests
    echo "::endgroup::"
```

---

### 5. Common Operational Patterns

#### Cancel in-progress runs on new push

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

#### Skip CI for doc-only changes

```yaml
on:
  push:
    paths-ignore:
      - '**.md'
      - 'docs/**'
```

#### Skip a specific run

Add to commit message:
```bash
git commit -m "chore: update readme [skip ci]"
```

---

## Hands-On Exercise

**Time:** ~15 minutes

→ [Exercise: Debug a Failing Workflow](./exercises/exercise.md)

**What you'll do:**
1. Trigger a workflow that intentionally fails
2. Inspect the logs and identify the failure
3. Enable debug logging and re-run
4. Fix the issue and download the artifact
5. Practice `gh run` CLI commands throughout

---

## Reference: `gh run` Cheat Sheet

```bash
gh run list                          # All recent runs
gh run list --workflow ci.yml        # Filter by workflow
gh run list --branch main            # Filter by branch
gh run list --status failure         # Filter by status

gh run view <id>                     # Summary
gh run view <id> --log               # Full logs
gh run view <id> --log-failed        # Only failed step logs

gh run watch                         # Live run in terminal

gh run rerun <id>                    # Re-run all jobs
gh run rerun <id> --failed           # Re-run only failed jobs
gh run rerun <id> --failed --debug   # Re-run with debug logging

gh run download <id>                 # Download all artifacts
gh run download <id> --name <name>   # Download specific artifact

gh run cancel <id>                   # Cancel a running workflow
```
