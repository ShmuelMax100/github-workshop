# GitHub Actions Marketplace

> **TL;DR** — The Marketplace is GitHub's directory of pre-built actions you can drop into a workflow with one `uses:` line. Treat third-party actions like third-party code: verify, pin to a SHA, and review what permissions they request.

The vast majority of CI/CD steps you'd otherwise write by hand already exist as a Marketplace action. Need to publish a release? `softprops/action-gh-release`. Authenticate to AWS? `aws-actions/configure-aws-credentials`. Run Trivy? `aquasecurity/trivy-action`.

---

## Finding an action

Browse: https://github.com/marketplace?type=actions

```bash
# Search from the CLI
gh api -X GET search/repositories \
  -f q='topic:github-action release publish' \
  --jq '.items[] | {full_name, stargazers_count, html_url}' | head -20
```

When you read an action's listing, look for:

| Signal | What you want |
|--------|---------------|
| **Verified creator** badge | ✅ official org (e.g. `actions/`, `aws-actions/`, `docker/`) |
| **Stars / installs** | High = battle-tested |
| **Last commit / release** | Recent (< 6 months) |
| **Open issues** | Triaged, not piling up |
| **`action.yml`** | Read it. It's small. You can audit the whole thing. |
| **Required permissions** | The README usually lists them — minimum needed |

---

## Using an action

```yaml
- name: Create GitHub Release
  uses: softprops/action-gh-release@c95fe1489396fe8a9eb87c0abf8aa5b2ef267fda  # v2.2.1
  with:
    tag_name: ${{ needs.resolve.outputs.version }}
    name: Release ${{ needs.resolve.outputs.version }}
    generate_release_notes: true
    prerelease: ${{ needs.resolve.outputs.prerelease == 'true' }}
    files: dist/*
```

Three rules:

1. **Pin to a SHA.** Tags are mutable; SHAs aren't. See [security-best-practices.md → "SHA Pin Third-Party Actions"](./security-best-practices.md?plain=1#L7).
2. **Read its `action.yml`.** Inputs, outputs, and required permissions are all in one short file in the action's repo.
3. **Grant only the permissions it needs.** The release example above needs `permissions: contents: write` — granted at the *job* level only, not workflow-wide.

---

## Example: publish a GitHub Release

This is the pattern the release-pipeline exercise (TODO ⑩) builds toward.

```yaml
publish:
  needs: [build]
  runs-on: ubuntu-latest
  permissions:
    contents: write          # ← only this job can create a release
  steps:
    - name: Download dist
      uses: actions/download-artifact@fa0a91b85d4f404e444e00e005971372dc801d16  # v4.1.8
      with:
        name: dist
        path: dist/

    - name: Create GitHub Release
      uses: softprops/action-gh-release@c95fe1489396fe8a9eb87c0abf8aa5b2ef267fda  # v2.2.1
      with:
        tag_name: ${{ inputs.version }}
        name: Release ${{ inputs.version }}
        generate_release_notes: true                # auto-generate from PR titles
        prerelease: ${{ inputs.prerelease }}        # honor the dispatch input
        files: dist/*                                # attach build artifacts
```

What you get: a new entry on the repo's **Releases** page, the resolved version as a Git tag, auto-generated notes built from PR titles since the previous tag, and every file under `dist/` attached as a downloadable asset.

---

## Other commonly-used Marketplace actions

| Need | Action |
|------|--------|
| Checkout code | [`actions/checkout`](https://github.com/marketplace/actions/checkout) (first-party) |
| Setup Python | [`actions/setup-python`](https://github.com/marketplace/actions/setup-python) (first-party) |
| Cache deps | [`actions/cache`](https://github.com/marketplace/actions/cache) (first-party) |
| Upload/download artifacts | [`actions/upload-artifact`](https://github.com/marketplace/actions/upload-a-build-artifact) (first-party) |
| Build & push Docker images | [`docker/build-push-action`](https://github.com/marketplace/actions/build-and-push-docker-images) |
| Authenticate to AWS | [`aws-actions/configure-aws-credentials`](https://github.com/marketplace/actions/configure-aws-credentials-action-for-github-actions) |
| Authenticate to Azure | [`azure/login`](https://github.com/marketplace/actions/azure-login) |
| Publish a GitHub Release | [`softprops/action-gh-release`](https://github.com/marketplace/actions/gh-release) |
| Send a Slack notification | [`slackapi/slack-github-action`](https://github.com/marketplace/actions/slack-send) |
| Container vulnerability scan | [`aquasecurity/trivy-action`](https://github.com/marketplace/actions/aqua-security-trivy) |
| Dependency review | [`actions/dependency-review-action`](https://github.com/marketplace/actions/dependency-review) (first-party) |

---

## When *not* to use a Marketplace action

Sometimes a 3-line `run:` is better than a third-party dependency:

```yaml
# Don't pull in an action for this:
- run: echo "version=$(cat VERSION)" >> "$GITHUB_OUTPUT"

# Don't pull in an action for this either:
- run: |
    if [ "$ENV" = "prod" ]; then ./deploy.sh; fi
```

Rule of thumb: if the action is < 30 lines of shell, just inline it. Every dependency is a supply-chain risk.

---

→ Next: [security-best-practices.md](./security-best-practices.md) for SHA pinning and least-privilege patterns.
