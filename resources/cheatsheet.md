# GitHub Workshop — Quick Reference Cheat Sheet

---

## `gh` CLI — Pull Requests

```bash
# Create
gh pr create --title "feat: ..." --body "..." --base main
gh pr create --draft --title "WIP: ..."

# List & navigate
gh pr list
gh pr list --assignee @me
gh pr view <number>
gh pr view --web                         # open in browser
gh pr checkout <number>                  # check out PR branch locally

# Review
gh pr review --approve
gh pr review --request-changes --body "Please fix X"
gh pr review --comment --body "Nice work!"

# Manage
gh pr ready                              # mark draft as ready
gh pr edit --add-label "enhancement"
gh pr merge --squash --delete-branch
gh pr close <number>

# Watch CI status
gh pr checks
gh pr checks --watch
```

---

## `gh` CLI — Workflow Runs

```bash
# List
gh run list
gh run list --workflow ci.yml
gh run list --branch main --status failure

# Inspect
gh run view <id>
gh run view <id> --log
gh run view <id> --log-failed            # only failed steps
gh run view <id> --job <job-name> --log

# Control
gh run watch                             # live stream in terminal
gh run rerun <id>
gh run rerun <id> --failed
gh run rerun <id> --failed --debug
gh run cancel <id>

# Artifacts
gh run download <id>                     # all artifacts
gh run download <id> --name <name>       # specific artifact
```

---

## `gh` CLI — Secrets & Variables

```bash
# Secrets
gh secret set MY_SECRET                  # prompts for value
gh secret set MY_SECRET --body "value"
gh secret set MY_SECRET --env staging    # environment secret
gh secret list
gh secret delete MY_SECRET

# Variables
gh variable set MY_VAR --body "value"
gh variable list
```

---

## GitHub Actions — Core YAML Patterns

### Triggers

```yaml
on:
  push:
    branches: [main]
    paths: ['src/**']
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 9 * * 1-5'             # Weekdays at 09:00 UTC
  workflow_dispatch:
    inputs:
      env:
        type: choice
        options: [staging, production]
  workflow_call:                        # Called from another workflow
```

### Job dependencies

```yaml
jobs:
  a:
    runs-on: ubuntu-latest
    steps: [...]

  b:
    needs: a                            # waits for 'a'
    runs-on: ubuntu-latest

  c:
    needs: [a, b]                       # waits for both
    if: github.ref == 'refs/heads/main' # conditional
```

### Secrets & variables

```yaml
steps:
  - run: ./deploy.sh
    env:
      TOKEN: ${{ secrets.MY_TOKEN }}    # secret (masked)
      URL: ${{ vars.DEPLOY_URL }}       # variable (visible)
```

### Outputs between steps

```yaml
- id: my-step
  run: echo "value=hello" >> $GITHUB_OUTPUT

- run: echo "${{ steps.my-step.outputs.value }}"
```

### Outputs between jobs

```yaml
jobs:
  producer:
    outputs:
      tag: ${{ steps.gen.outputs.tag }}
    steps:
      - id: gen
        run: echo "tag=v1.0" >> $GITHUB_OUTPUT

  consumer:
    needs: producer
    steps:
      - run: echo "${{ needs.producer.outputs.tag }}"
```

### Cache

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.cache/pip
    key: ${{ runner.os }}-pip-${{ hashFiles('requirements.txt') }}
    restore-keys: ${{ runner.os }}-pip-
```

### Matrix

```yaml
strategy:
  fail-fast: false
  matrix:
    python-version: ["3.10", "3.11", "3.12"]
    os: [ubuntu-latest, windows-latest]
```

### Always run a step

```yaml
- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: results
    path: results.xml
```

---

## GitHub Actions — Security Patterns

```yaml
# Minimal permissions
permissions:
  contents: read
  pull-requests: write

# SHA pinning (replace tag with immutable SHA)
- uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4.2.2

# Safe env var interpolation (not direct shell injection)
- env:
    BRANCH: ${{ github.head_ref }}
  run: echo "Branch: $BRANCH"

# Concurrency — cancel stale runs
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

# Timeout — prevent runaway jobs
jobs:
  build:
    timeout-minutes: 15
```

---

## Debugging Quick Reference

```bash
# Enable debug logging for next run
gh secret set ACTIONS_STEP_DEBUG --body "true"
gh secret set ACTIONS_RUNNER_DEBUG --body "true"

# Re-run with debug (no secret needed)
gh run rerun <id> --failed --debug

# Remove debug secrets when done
gh secret delete ACTIONS_STEP_DEBUG
gh secret delete ACTIONS_RUNNER_DEBUG
```

```yaml
# Dump GitHub context in a step
- name: Debug
  env:
    CTX: ${{ toJSON(github) }}
  run: echo "$CTX" | jq .

# Write to step summary
- run: echo "## Build ${{ github.sha }}" >> $GITHUB_STEP_SUMMARY

# Log annotations
- run: |
    echo "::notice::Deploy started"
    echo "::warning::Approaching rate limit"
    echo "::error file=src/app.py,line=42::Syntax error"
    echo "::group::Logs"
    cat build.log
    echo "::endgroup::"
```

---

## GitLab → GitHub Quick Mapping

| GitLab | GitHub |
|--------|--------|
| Merge Request | Pull Request |
| `.gitlab-ci.yml` | `.github/workflows/*.yml` |
| `stages:` | `needs:` graph |
| `script:` | `run:` |
| `only: [main]` | `on: push: branches: [main]` |
| `when: manual` | `workflow_dispatch` / environment gate |
| `cache:` | `actions/cache` |
| `artifacts:` | `actions/upload-artifact` |
| `$CI_COMMIT_SHA` | `${{ github.sha }}` |
| `$CI_COMMIT_BRANCH` | `${{ github.ref_name }}` |
| CI/CD Variables (masked) | `${{ secrets.NAME }}` |
| CI/CD Variables (plain) | `${{ vars.NAME }}` |
| Protected environment | Environment + protection rules |
| Group-level variable | Org secret/variable |
