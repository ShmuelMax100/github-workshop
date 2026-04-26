# Workflow Debugging Reference

---

## Quick Diagnosis Checklist

When a workflow fails, work through this checklist:

```
1. Read the red step output — the error message is usually there
2. Check the "Annotations" section at the top of the run summary
3. Look at the step that failed — expand it, check exit code
4. Is it a transient error (network, rate limit)? → Re-run
5. Is it a secret/permission issue? → Check secret names and permissions:
6. Is it a logic error in your script? → Fix and push
7. Need more info? → Enable ACTIONS_STEP_DEBUG and re-run
```

---

## Reading Logs

### Log structure

Each job log has:
- **Set up job** — runner setup, secret masking
- **Your steps** — in order
- **Post steps** — cleanup (caches, etc.)
- **Complete job** — summary with duration

### Timestamps and timing

Every log line has a timestamp. Use this to identify:
- Slow steps (compare timestamps)
- Exact time of failure

### Expanding groups

Steps can group their output:
```
▶ Run pip install -r requirements.txt   (click to expand)
```

---

## Debug Environment Variables

### `ACTIONS_STEP_DEBUG`

Adds verbose output to **every** step:
- Action inputs and outputs
- File system operations
- Environment setup details

Set as a repository secret: `ACTIONS_STEP_DEBUG = true`

Or enable per-run: **Re-run jobs** → check **Enable debug logging**

### `ACTIONS_RUNNER_DEBUG`

Adds infrastructure-level logs:
- Runner registration and polling
- Network connectivity
- File system mounts

Rarely needed unless the runner itself fails to start.

---

## Common Failure Patterns

### Permission denied

```
Error: HttpError: Resource not accessible by integration
```

**Fix:** Add the required permission to the job:
```yaml
permissions:
  pull-requests: write
  contents: read
```

### Secret not found / empty

```
Error: Input required and not supplied: token
```

**Check:**
- Secret name is correct (case-sensitive)
- Secret is set at the right scope (repo vs org vs environment)
- Environment name in workflow matches the environment in settings

```bash
# List repo secrets (names only, not values)
gh secret list

# List environment secrets
gh secret list --env staging
```

### Action not found

```
Error: Can't find 'action.yml' at 'path/to/action'
```

**Check:**
- Action exists at that path/ref
- SHA is correct and not truncated
- You have access to the repo (private action)

### Cache miss every time

**Check:**
- The cache key expression is evaluated at runtime
- `hashFiles()` pattern matches your lockfile path
- The restore-keys fallback is broad enough

```yaml
# Debug: print the key
- run: echo "Cache key = ${{ runner.os }}-pip-${{ hashFiles('requirements.txt') }}"
```

### Job skipped unexpectedly

**Check the `if:` condition:**

```yaml
# Common mistake — string comparison
if: github.ref == 'main'             # ❌ wrong — ref is 'refs/heads/main'
if: github.ref == 'refs/heads/main'  # ✅ correct
if: github.ref_name == 'main'        # ✅ also correct
```

### Matrix job partial failure

By default, if one matrix job fails, the others are cancelled. Override:

```yaml
strategy:
  fail-fast: false   # Let all matrix jobs complete
  matrix:
    python-version: ["3.10", "3.11", "3.12"]
```

---

## Useful Debug Snippets

### Dump full event payload

```yaml
- name: Dump event
  run: cat "$GITHUB_EVENT_PATH" | jq .
```

### Dump all environment variables

```yaml
- name: Dump environment
  run: env | sort
```

### Dump GitHub context

```yaml
- name: Dump context
  env:
    CONTEXT: ${{ toJSON(github) }}
  run: echo "$CONTEXT" | jq .
```

### Check what files changed

```yaml
- name: Changed files
  run: git diff --name-only HEAD~1 HEAD
```

---

## Step Summary (Markdown in UI)

Write rich output to the workflow run summary page:

```yaml
- name: Test summary
  run: |
    {
      echo "## Test Results 🧪"
      echo ""
      echo "| Suite | Tests | Passed | Failed |"
      echo "|-------|-------|--------|--------|"
      echo "| Unit | 42 | 42 | 0 |"
      echo "| Integration | 8 | 7 | 1 |"
    } >> $GITHUB_STEP_SUMMARY
```

---

## Log Annotations

These appear as PR check annotations and in the run summary:

```yaml
- run: |
    echo "::notice::Build completed successfully"
    echo "::warning file=src/app.py,line=42::Deprecated API usage"
    echo "::error file=src/app.py,line=10::Syntax error"

    # Group related output
    echo "::group::Dependency installation"
    pip install -r requirements.txt
    echo "::endgroup::"

    # Mask a value from logs
    echo "::add-mask::my-secret-value"
```
