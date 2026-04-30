# Solution — Exercise 3: Release Pipeline

> ## ⚠️ SPOILER — Try the exercise first
>
> This is the **reference solution** for Exercise 3.
> Open it only **after** you've:
> 1. Read the linked guides for each TODO (the hint table in the exercise),
> 2. Made a real attempt at filling in the TODOs yourself,
> 3. Been stuck for 10+ minutes on a specific item.
>
> Copy-pasting from here without the struggle defeats the workshop.

> **TL;DR** — Reference solution for Exercise 3. A `release.yml` triggered by `workflow_dispatch` (with `version` / `prerelease` / `quick` inputs) **or** by a `v*` git tag → calls a reusable validation workflow that fans out across a 3 OS × 3 Python matrix (via a composite action) → builds wheel/sdist → publishes a GitHub Release.

## What was built

```
.github/
├── actions/
│   └── setup-python-project/action.yml   ← composite action
└── workflows/
    ├── reusable-validate.yml             ← workflow_call + matrix
    └── release.yml                       ← dispatch + tags
```

- **`setup-python-project/action.yml`** — composite action: checkout + setup-python + cache + `pip install -r requirements.txt`.
- **`reusable-validate.yml`** — `workflow_call`-triggered. Accepts `python-versions` and `os-list` JSON inputs and fans out via `strategy.matrix` using `fromJSON()`.
- **`release.yml`** — dispatch + tag trigger. Resolves the version, calls the reusable validator, builds, and publishes a GitHub Release with `softprops/action-gh-release`.

## Files to copy

```bash
cp -r solutions/03-release-workflow/.github/actions/setup-python-project .github/actions/
cp solutions/03-release-workflow/.github/workflows/reusable-validate.yml .github/workflows/
cp solutions/03-release-workflow/.github/workflows/release.yml .github/workflows/
```

## TODOs that were filled in

| # | TODO | Solution |
|---|------|----------|
| ① | Composite action declaration | `runs.using: "composite"` |
| ② | Use input in setup-python | `python-version: ${{ inputs.python-version }}` |
| ③ | `pip install -r requirements.txt` step | `shell: bash` + guarded by `if: inputs.install-requirements == 'true'` |
| ④ | Make workflow callable | `on: workflow_call: inputs: { python-versions, os-list }` |
| ⑤ | Dynamic matrix from JSON input | `matrix: { os: ${{ fromJSON(inputs.os-list) }}, python-version: ${{ fromJSON(inputs.python-versions) }} }` |
| ⑥ | Use composite action in matrix job | `uses: ./.github/actions/setup-python-project` |
| ⑦ | `workflow_dispatch` inputs | `version` (string, required), `prerelease` (boolean), `quick` (boolean) |
| ⑧ | Call reusable workflow | `jobs.validate.uses: ./.github/workflows/reusable-validate.yml` |
| ⑨ | Reuse composite action in build | `uses: ./.github/actions/setup-python-project` |
| ⑩ | Create GitHub Release | `softprops/action-gh-release@<sha>` with `tag_name`, `files: dist/*`, `generate_release_notes: true` |

## Bonus features included

- **Concurrency group** (`release-${{ github.ref }}`) with `cancel-in-progress: false` so two release runs don't race.
- **All third-party actions SHA-pinned** to specific commits (matches `solutions/02-ci-workflow/.github/workflows/ci.yml` style).
- **`quick` dispatch input** — when true, narrows matrix to `ubuntu-latest` × Python 3.11 only.
- **Least-privilege permissions** — `contents: read` workflow-wide, escalated to `contents: write` only on the `publish` job.

## Key things to observe

- **One `gh workflow run release.yml -f version=v0.1.0`** drives the whole pipeline: validate → build → publish.
- The `validate` job in the Actions UI shows up to **9 parallel matrix combinations** (3 OS × 3 Python). The reusable workflow renders as a nested job in the run graph.
- Pushing a tag (`git tag v0.1.1 && git push origin v0.1.1`) triggers the same pipeline without any manual input — the `resolve` job reads the version from `GITHUB_REF`.
- The `publish` job creates a GitHub Release on the **Releases** tab with auto-generated notes (commits since the previous tag) and `dist/*` files attached.
- No external registry credentials needed — `softprops/action-gh-release` uses the auto-injected `GITHUB_TOKEN`.

## How the pieces compose

| Layer | Mechanism | Reusable from |
|---|---|---|
| Step | Composite action (`setup-python-project`) | Any job in any workflow in this repo |
| Job | Reusable workflow (`reusable-validate.yml`) | Any workflow in this repo (or, if moved to a `.github` org repo, any repo in the org) |
| Workflow | `workflow_dispatch` + `push: tags:` | Triggered manually via UI/CLI or by tag push |
