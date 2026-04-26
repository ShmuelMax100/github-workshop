# GitHub CLI (`gh`) — Daily Workflows

`gh` brings GitHub directly into the terminal. This guide covers the commands you'll use every day.

---

## Setup

```bash
# Install (if not already done — see gh-login-clone-fork.md)
gh auth login

# Set your default repo for the current directory
gh repo set-default

# Set preferred editor for PR bodies etc.
gh config set editor "code --wait"
```

---

## Pull Requests

### Create

```bash
gh pr create                                        # interactive prompt
gh pr create --title "feat: ..." --body "..."       # non-interactive
gh pr create --draft                                # work in progress
gh pr create --base develop                         # target a non-default branch
gh pr create --reviewer alice,@org/team-name        # request reviewers
gh pr create --label "bug,priority:high"            # add labels
gh pr create --assignee @me                         # assign to yourself
gh pr create --web                                  # open browser form instead
```

### Navigate & inspect

```bash
gh pr list                                          # open PRs in this repo
gh pr list --assignee @me                           # your PRs
gh pr list --review-requested @me                   # PRs waiting on your review
gh pr list --label "priority:high"                  # filter by label
gh pr list --state merged --limit 10                # recently merged

gh pr view                                          # current branch's PR
gh pr view 42                                       # specific PR by number
gh pr view --web                                    # open in browser
gh pr view 42 --comments                            # show comments

gh pr checkout 42                                   # check out PR branch locally
gh pr diff 42                                       # show the diff
```

### Review

```bash
gh pr review                                        # review current branch's PR
gh pr review 42 --approve
gh pr review 42 --request-changes --body "Please add tests."
gh pr review 42 --comment --body "Inline thought here."
```

### Manage

```bash
gh pr ready                                         # mark draft as ready
gh pr edit 42 --title "new title"
gh pr edit 42 --add-label enhancement
gh pr edit 42 --add-reviewer carol
gh pr edit 42 --base main                           # change base branch

gh pr checks                                        # CI status of current PR
gh pr checks --watch                                # live-stream until checks complete

gh pr merge --squash --delete-branch                # squash merge + cleanup
gh pr merge --rebase
gh pr merge --merge

gh pr close 42                                      # close without merging
gh pr reopen 42
```

---

## Repositories

```bash
gh repo view                                        # summary of current repo
gh repo view --web                                  # open in browser
gh repo clone owner/repo                            # clone
gh repo fork owner/repo --clone                     # fork + clone
gh repo create my-new-repo --public                 # create new repo
gh repo list                                        # list your repos
gh repo list org-name --limit 50                    # list org repos
```

---

## Issues

```bash
gh issue list
gh issue list --assignee @me
gh issue list --label bug --state open

gh issue view 15
gh issue view 15 --web

gh issue create --title "Bug: ..." --body "..." --label bug
gh issue create --web                               # open browser form

gh issue edit 15 --add-label "priority:high"
gh issue close 15
gh issue reopen 15
gh issue comment 15 --body "Looking into this now."
```

---

## Workflow Runs (CI)

```bash
gh run list                                         # recent runs
gh run list --workflow ci.yml
gh run list --branch main --status failure

gh run view                                         # latest run for current branch
gh run view <id> --log                              # full logs
gh run view <id> --log-failed                       # only failed steps

gh run watch                                        # live stream in terminal

gh run rerun <id> --failed                          # re-run only failed jobs
gh run rerun <id> --failed --debug                  # with debug logging

gh run download <id>                                # download all artifacts
gh run cancel <id>
```

---

## Secrets & Variables

```bash
gh secret set MY_SECRET                             # prompts for value
gh secret set MY_SECRET --body "value"
gh secret set MY_SECRET --env staging               # environment-scoped secret
gh secret list
gh secret delete MY_SECRET

gh variable set MY_VAR --body "value"
gh variable list
```

---

## Releases

```bash
gh release list
gh release view v1.2.3
gh release create v1.2.3 --title "v1.2.3" --notes "Bug fixes"
gh release create v1.2.3 ./dist/*.tar.gz            # attach assets
gh release download v1.2.3                          # download assets
```

---

## GitHub Actions Workflows

```bash
gh workflow list                                    # all workflows
gh workflow view ci.yml
gh workflow run ci.yml                              # trigger manually
gh workflow run ci.yml --field environment=staging  # with inputs
gh workflow enable ci.yml
gh workflow disable ci.yml
```

---

## Aliases — Build Your Own Shortcuts

```bash
# Create custom aliases
gh alias set prc 'pr create --web'
gh alias set mypr 'pr list --assignee @me'
gh alias set waiting 'pr list --review-requested @me'

# Use them
gh prc
gh mypr
gh waiting

# List all aliases
gh alias list

# Delete an alias
gh alias delete prc
```

---

## Quick Reference Card

```bash
# --- Daily PR flow ---
gh pr create                    # open a PR
gh pr list --assignee @me       # my open PRs
gh pr checks --watch            # watch CI
gh pr review 42 --approve       # approve
gh pr merge --squash --delete-branch  # merge

# --- Review queue ---
gh pr list --review-requested @me

# --- Debugging CI ---
gh run list --status failure
gh run view --log-failed
gh run rerun --failed --debug
```
