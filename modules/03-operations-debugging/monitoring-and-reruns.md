# Monitoring Workflow Runs & Re-Running Jobs

> **TL;DR** — Live-stream runs with `gh run watch`, drill into failures with `gh run view <id> --log-failed`, and use `gh run rerun --failed` for transient flakes (re-run only when the cause is environmental — fix-and-push when it's your code). Add a `concurrency:` block to auto-cancel stale runs on rapid pushes.

---

## Viewing Runs in the UI

**Repository → Actions tab**

- Filter by: workflow name, branch, actor, status, date
- Click any run → see the **job graph** with status indicators
- Click a job → see all step logs with timestamps
- The **Summary** page shows step summaries written via `$GITHUB_STEP_SUMMARY`

---

## `gh run` — CLI Reference

### List runs

```bash
gh run list                                     # recent runs across all workflows
gh run list --workflow ci.yml                   # filter by workflow file
gh run list --branch main                       # filter by branch
gh run list --status failure                    # filter by status
gh run list --actor alice                       # filter by who triggered it
gh run list --limit 20                          # how many to show
```

**Status values:** `queued`, `in_progress`, `completed`, `success`, `failure`, `cancelled`, `skipped`

### Inspect a run

```bash
gh run view                                     # latest run on current branch
gh run view <run-id>                            # specific run — summary + job list
gh run view <run-id> --log                      # full logs for all jobs
gh run view <run-id> --log-failed               # only the steps that failed
gh run view <run-id> --job <job-name> --log     # specific job's logs
gh run view <run-id> --web                      # open in browser
```

### Watch a live run

```bash
gh run watch                                    # stream the current branch's run
gh run watch <run-id>                           # stream a specific run
```

The terminal updates in real time — useful during long builds or deploys.

---

## Re-Running Jobs

### Re-run options

```bash
gh run rerun <run-id>                           # re-run ALL jobs
gh run rerun <run-id> --failed                  # re-run only failed jobs (keeps passed jobs)
gh run rerun <run-id> --failed --debug          # re-run with debug logging enabled
```

**In the UI:**

1. Open the failed run
2. Click **Re-run failed jobs** (or **Re-run all jobs**)
3. Optionally check **Enable debug logging** before clicking

### When to re-run vs. fix and push

| Situation | Action |
|-----------|--------|
| Transient failure (network timeout, rate limit, flaky test) | Re-run |
| Runner went offline mid-job | Re-run |
| Test failure due to a code bug | Fix the code and push |
| Wrong secret or missing permission | Fix the config, then re-run |

---

## Cancelling a Run

```bash
gh run cancel <run-id>

# Cancel the latest run on current branch
gh run list --limit 1 --json databaseId --jq '.[0].databaseId' | xargs gh run cancel
```

In the UI: open the run → **Cancel workflow** button (top right).

---

## Workflow Run Retention

By default, logs and artifacts are retained for **90 days**. You can configure this per workflow:

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: test-results
    path: results/
    retention-days: 30      # override for this artifact
```

Organization and repository admins can change the default retention period in Settings.

---

## Concurrency — Prevent Duplicate Runs

Stop old runs automatically when a new push arrives on the same branch:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

This is especially useful for PR workflows — only the latest push matters.
