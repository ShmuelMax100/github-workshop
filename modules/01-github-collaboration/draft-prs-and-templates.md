# Draft PRs & PR Templates — Best Practices

---

## Draft Pull Requests

A Draft PR signals that work is in progress and **not yet ready for a formal review**. Reviewers are not notified, and the PR cannot be merged until you mark it ready.

### When to use a Draft PR

| Situation | Why Draft |
|-----------|-----------|
| Work in progress — not done yet | Blocks accidental merge; no review noise |
| Want early architectural feedback | Share context without triggering a full review cycle |
| CI must pass before review | Let the pipeline run; convert when green |
| Pair programming across commits | Keep the work visible to the team |
| Blocked on another PR | Show dependency; reviewers know to wait |

### Creating a Draft PR

```bash
# Via CLI
gh pr create --draft \
  --title "WIP: refactor auth service" \
  --body "Sharing for early feedback on the interface design."

# Via UI
# Click the dropdown arrow next to "Create pull request"
# → select "Create draft pull request"
```

### Converting to Ready for Review

```bash
# Via CLI
gh pr ready

# Via UI
# Open the PR → click "Ready for review" button at the bottom
```

### Draft PR tips

- Prefix the title with `WIP:` or `[WIP]` so it's obvious at a glance (even though GitHub marks it visually)
- Use the PR description to explain what's missing or what kind of feedback you want
- You can request specific reviewers on a Draft — they'll get notified when you mark it ready

---

## PR Templates

A PR template auto-populates the PR body whenever someone opens a Pull Request in your repository. It ensures contributors never forget to document their changes.

### Location

```
.github/PULL_REQUEST_TEMPLATE.md        ← single template (most common)
```

Or multiple templates (for different PR types):

```
.github/PULL_REQUEST_TEMPLATE/
  feature.md
  bugfix.md
  hotfix.md
```

With multiple templates, GitHub shows a dropdown when creating a PR.

### This repo's template

→ [../../.github/PULL_REQUEST_TEMPLATE.md](../../.github/PULL_REQUEST_TEMPLATE.md)

```markdown
## Summary

> Briefly describe what this PR does and why.

## Changes

-
-

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Refactor / cleanup
- [ ] CI / tooling
- [ ] Documentation

## Testing

> Describe how you tested this change.

## Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have added or updated tests where applicable
- [ ] CI checks are passing
- [ ] I have self-reviewed this PR before requesting review

## Related Issues

Closes #
```

### What makes a good PR template

| Section | Purpose |
|---------|---------|
| **Summary** | Forces the author to articulate the "why" |
| **Type of change** | Helps reviewers calibrate their depth of review |
| **Testing** | Makes the test plan explicit — not assumed |
| **Checklist** | Self-review gate before requesting others' time |
| **Related issues** | Auto-closes issues on merge with `Closes #N` |

### Tips

- Keep the template short — long templates get skipped
- Use checkboxes (`- [ ]`) for actionable items
- Don't ask for information that's obvious from the diff
- The `Closes #` line at the bottom auto-closes a linked issue when the PR merges

### Bypassing the template (when needed)

Append `?expand=1&template=` to the PR URL to open with a blank body:

```
https://github.com/org/repo/compare/main...my-branch?expand=1&template=
```

Or via CLI, pass `--body ""` to start with an empty body.
