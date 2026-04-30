# Manual Triggers — `workflow_dispatch`

> **TL;DR** — `workflow_dispatch` adds a **Run workflow** button (and `gh workflow run`) with typed inputs — `string`, `boolean`, `choice`, `environment`, `number`. Combine with `push`/`schedule` for nightly+manual flows, but always set defaults since `inputs.*` is empty when fired by other events.

`workflow_dispatch` letsyou trigger a workflow on demand from the GitHub UI or `gh` CLI, with optional typed input parameters.

---

## Basic Setup

```yaml
on:
  workflow_dispatch:
```

With no inputs, a **Run workflow** button appears in the Actions tab. One click, no configuration.

---

## Inputs

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: "Target environment"
        required: true
        type: choice
        options:
          - staging
          - production

      version:
        description: "Version tag (e.g. v1.2.3)"
        required: true
        type: string

      dry-run:
        description: "Simulate — no real changes"
        type: boolean
        default: true

      log-level:
        description: "Log verbosity"
        type: choice
        options: [info, debug, trace]
        default: info
```

### Input types

| Type | UI control | Notes |
|------|-----------|-------|
| `string` | Text field | Default type |
| `boolean` | Checkbox | Renders as `true` / `false` |
| `choice` | Dropdown | Requires `options:` list |
| `environment` | Environment picker | Triggers environment protection rules |
| `number` | Number field | |

### Referencing inputs in the workflow

```yaml
jobs:
  deploy:
    if: ${{ !inputs.dry-run }}          # skip if dry run is checked
    environment: ${{ inputs.environment }}
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        run: ./deploy.sh --env ${{ inputs.environment }} --version ${{ inputs.version }}

      - name: Log level
        run: echo "LOG_LEVEL=${{ inputs.log-level }}"
```

---

## Triggering from the UI

1. Go to the repository → **Actions** tab
2. Select the workflow in the left sidebar
3. Click **Run workflow** (top-right dropdown)
4. Fill in the inputs
5. Click **Run workflow**

---

## Triggering from `gh` CLI

```bash
# Run with inputs
gh workflow run deploy.yml \
  --field environment=staging \
  --field version=v1.2.3 \
  --field dry-run=false

# Run on a specific branch
gh workflow run deploy.yml \
  --ref release/1.2 \
  --field environment=production

# List available workflows
gh workflow list

# Watch the triggered run
gh run watch
```

---

## Combining with Other Triggers

`workflow_dispatch` is commonly combined with `push` and `schedule`:

```yaml
on:
  push:
    branches: [main]
  schedule:
    - cron: '0 3 * * *'       # nightly at 03:00 UTC
  workflow_dispatch:
    inputs:
      skip-tests:
        type: boolean
        default: false
```

When triggered by `push` or `schedule`, `inputs` will be empty — always provide defaults and guard with conditionals:

```yaml
jobs:
  test:
    if: ${{ !inputs.skip-tests }}     # inputs.skip-tests is '' (falsy) on push/schedule
```

---

## Real-World Use Cases

| Use case | How |
|----------|-----|
| On-demand deploy to staging | `workflow_dispatch` + `environment: staging` |
| Hotfix release to production | `workflow_dispatch` with version input + prod approval gate |
| Database migration (manual step) | `workflow_dispatch` with `dry-run` input for safety |
| Reseed test data | `workflow_dispatch` on a maintenance workflow |
| Nightly build + manual override | `schedule` + `workflow_dispatch` combined |

→ See the full working example: [./examples/04-manual-trigger.yml](./examples/04-manual-trigger.yml)
