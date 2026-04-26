# GitLab → GitHub: Daily Workflows & Repo Lifecycle

A deck for engineers and engineering leaders moving from GitLab to GitHub.
Format per slide: **Title**, **Bullets (3–5)**, **Speaker notes**, and (where useful) a **Visual hint**.
Slides marked `[INTERLUDE]` are short humor breaks (full-bleed quote layout, no bullets).

---

## Slide 1 — Title

**From GitLab to GitHub**
*Daily Workflows, PRs, and Repo Lifecycle*

- Audience: developers, tech leads, and engineering managers
- Goal: be productive on day one, not day thirty
- Format: concepts → workflow → guardrails → UI tips

**Speaker notes:**
Welcome the audience. Frame the session: this isn't a tools comparison contest — it's a practical migration of muscle memory. Most people in the room already know how to ship software; today is about translating habits, not relearning them.

---

## Slide 2 — Why this session

- You already know Git — the platform changes, not the fundamentals
- GitHub vocabulary differs in places (MR vs PR, Group vs Org)
- Workflow defaults shift: protections, reviews, automation
- We focus on the 20% you'll use 80% of the time

**Speaker notes:**
Set expectations. Most pain in a migration comes from terminology drift and slightly different defaults — not from missing capabilities. We'll prioritize the daily loop: branch, push, PR, review, merge.

---

## Slide 3 — Terminology Map (Part 1)

- **Merge Request → Pull Request (PR)**
- **Project → Repository**
- **Group → Organization**
- **Protected Branches → Branch Protection Rules**
- **CI/CD Variables → Secrets & Variables**

**Speaker notes:**
PR vs MR is the single most-used term — get this one wrong in a meeting and it's a giveaway. "Organization" is closer to a top-level group; nested groups don't map 1:1.

---

## Slide 4 — Terminology Map (Part 2)

- **`.gitlab-ci.yml` → `.github/workflows/*.yml`**
- **Runners → Runners (same word, similar model)**
- **Snippets → Gists**
- **Container Registry → GHCR (`ghcr.io`)**
- **Issue Board → GitHub Projects**

**Speaker notes:**
GitHub Actions lives in a folder, not one big config — multiple workflows are first-class. Self-hosted runners port over. Gists are slightly more public than Snippets — careful with secrets.

---

## Slide 5 — Mental Model Shift

- GitLab leans **monolithic**: one app, one config, one UI
- GitHub leans **composable**: Actions, Apps, CLI, API
- Expect more "small pieces, loosely joined"
- More Marketplace, fewer built-ins
- Net effect: more flexibility, slightly more assembly

**Speaker notes:**
Neither model is "better" — but if you arrive expecting one settings page to rule them all, you'll be looking for a while. GitHub assumes you'll compose Actions, Apps, and integrations.

---

## Slide 6 — [INTERLUDE] Translation glitches

**"It's a pull request, Michael."**
*— every reviewer in week one, channeling Jim Halpert*

**Speaker notes:**
Quick laugh and a reset. Expect to call PRs "MRs" for two weeks. That's normal. The team will gently correct you, like a co-worker pointing at a misspelled label on a stapler. Move on.

---

## Slide 7 — The Pull Request (a love story)

- A PR is a **proposal**, not just a diff
- It carries: code, conversation, checks, approvals, history
- Lives from `git push` to `merge` (or `close`)
- It's the unit of change — and the unit of audit
- Treat the description like a mini design doc

**Speaker notes:**
The PR is the contract. Future-you reading `git log` in 18 months will thank present-you for a good description. Compliance and audit live here too — it's not just engineering hygiene.

---

## Slide 8 — PR Lifecycle: Create

- Branch from `main` → push → "Compare & pull request"
- Title: imperative mood ("Add retry to webhook client")
- Description: **what**, **why**, **how to test**
- Link issues with `Closes #123` for auto-close on merge
- Pick reviewers and labels early, not last

**Speaker notes:**
A good title and a 4-line description save hours over a project's life. `Closes #123` is the small magic phrase that wires PRs back to issues automatically — teach it once, use it forever.

---

## Slide 9 — PR Lifecycle: Review

- Reviewers leave **comments**, **suggestions**, or **approvals**
- Use **suggested changes** for small fixes — author commits with one click
- Resolve threads when addressed; keep the conversation tidy
- Re-request review after meaningful changes
- Reviews are about the code, not the coder

**Speaker notes:**
Suggested changes are underused — they're the fastest path to "fix and move on" for nits. Resolve threads rather than letting the PR turn into a haunted comment graveyard.

---

## Slide 10 — PR Lifecycle: Approve & Merge

- Approvals satisfy branch protection rules
- Merge strategies: **merge commit**, **squash**, **rebase**
- Squash-merge keeps `main` history linear and readable
- Delete the branch on merge — it's already in `main`
- Auto-merge: queue the merge for when checks pass

**Speaker notes:**
Pick one merge strategy as a team and stick with it — most teams land on squash-merge. Auto-merge is the unsung hero for slow CI: approve, enable auto-merge, walk away.

---

## Slide 11 — Draft PRs

- Open a PR **before** it's done — signal "work in progress"
- Drafts can't be merged and don't request reviews by default
- Great for: early CI feedback, design discussion, pairing
- Mark "Ready for review" when you actually want eyes
- Cheaper than a Slack thread, more durable than a DM

**Speaker notes:**
Draft PRs replace the GitLab "WIP:" prefix convention. CI runs early, so you find problems while you still remember the code. Encourage teams to open drafts liberally.

---

## Slide 12 — PR Templates

- File: `.github/pull_request_template.md`
- Pre-fills the PR description for every new PR
- Sections that pay off: **Summary**, **Testing**, **Risk**, **Rollback**
- Multiple templates via `PULL_REQUEST_TEMPLATE/` directory + query string
- Templates are guardrails, not paperwork

**Speaker notes:**
Encode team standards once and benefit forever. Keep it short — five fields max. If the template is so long that people delete it, it has failed.

---

## Slide 13 — Best Practices for PRs

- Keep PRs **small**: < ~400 lines changed when possible
- One concern per PR — easier to review, easier to revert
- Write the description like the reviewer is busy (they are)
- Green CI before requesting review — respect reviewers' time
- Disagree in comments, decide in a call, document the outcome

**Speaker notes:**
Small PRs are reviewed faster, merged faster, broken less often. The "decide in a call" rule prevents the dreaded 80-comment philosophical PR. Always summarize the outcome back in the PR.

---

## Slide 14 — [INTERLUDE] PR size, illustrated

**"I'm not saying this PR is too big.**
**I'm saying it has its own gravitational pull."**
*— a tired reviewer, somewhere*

**Speaker notes:**
Cue the laugh. Then segue: there's a real reason small PRs win — review attention drops off a cliff after a few hundred lines. Studies say it; lived experience confirms it.

---

## Slide 15 — Meet `gh`: the GitHub CLI

- Official CLI: `winget install GitHub.cli` / `brew install gh`
- Auth once: `gh auth login`
- Works with PRs, issues, releases, Actions, gists, repos
- Scriptable, pipe-friendly, JSON output via `--json`
- Lives where you live: the terminal

**Speaker notes:**
The CLI is the productivity unlock most people miss in week one. It removes a dozen context switches per day. JSON output makes it composable with `jq`. Mention SSO if your org uses it.

---

## Slide 16 — `gh` for Daily Workflows

- `gh pr create --fill` — open a PR from current branch
- `gh pr checkout 123` — fetch & switch to PR #123 locally
- `gh pr status` — what's waiting on me?
- `gh pr view --web` — jump to browser when you need UI
- `gh run watch` — tail an Actions run live

**Speaker notes:**
Demo these if time allows. `gh pr create --fill` uses the latest commit message — perfect for the 90% case. `gh run watch` replaces a dozen browser refreshes.

---

## Slide 17 — [INTERLUDE] On the CLI

**"Not using `gh` is like using dial-up to argue on the internet.**
**Technically possible. Spiritually unwell."**
*— vaguely Silicon Valley energy*

**Speaker notes:**
Light beat. Then the serious point: CLI fluency compounds. Ten seconds saved per PR, fifty PRs a week, and suddenly you have your Friday afternoon back.

---

## Slide 18 — Branch Protection: the basics

- Applies to `main` (and any branch you name or pattern-match)
- Require **PRs** — no direct pushes
- Require **N approvals** before merge
- Require **status checks** to pass (CI, security scans, etc.)
- Require **up-to-date** branches before merge

**Speaker notes:**
The single most important quality control on GitHub. If you do nothing else after this session, turn on branch protection for `main`. "Require branches up to date" prevents semantic merge conflicts.

---

## Slide 19 — Branch Protection: the grown-up settings

- **Dismiss stale approvals** on new commits
- **Require review from Code Owners**
- **Require signed commits** for sensitive repos
- **Restrict who can push** to matching branches
- **Include administrators** — yes, even you

**Speaker notes:**
"Include administrators" separates a policy from a suggestion. If admins can bypass, the protection is theater. Dismissing stale approvals prevents the "approved at line 10, then 400 lines added" failure.

---

## Slide 20 — CODEOWNERS

- File: `.github/CODEOWNERS` (or repo root)
- Maps **paths → owners** (users or teams)
- Auto-requests review from the right people
- Pairs with branch protection: "Require review from Code Owners"
- Same syntax as GitLab — copy, paste, adjust handles

**Speaker notes:**
CODEOWNERS ports over almost verbatim. Keep it accurate — stale owners are worse than no owners because they create review bottlenecks. Review quarterly.

---

## Slide 21 — Repository Lifecycle & Metadata

- **Description, topics, README** — discoverability essentials
- **License & SECURITY.md** — set expectations early
- **Default branch, merge controls, branch protection** — quality gates
- **Environments & secrets** — deploy safety
- **Archive** when done — read-only, searchable, honest

**Speaker notes:**
Treat repos like products: born, grow, retire. Topics make repos findable in org-wide search. Archiving signals to future engineers that this code isn't a maintenance trap.

---

## Slide 22 — Merge Controls Worth Setting Once

- Allow only **squash merging** (or your team's choice)
- **Auto-delete head branches** after merge
- **Allow auto-merge**
- **Require linear history** if you squash
- **Require conversation resolution** before merge

**Speaker notes:**
Five checkboxes, one afternoon, years of cleanliness. "Require conversation resolution" prevents the "merged with 14 unresolved comments" anti-pattern. Use rulesets to apply org-wide.

---

## Slide 23 — [INTERLUDE] Branch protection energy

**"Trust, but verify.**
**Especially yourself at 4:55pm on a Friday."**

**Speaker notes:**
Light line. Then frame the next stretch: protections aren't about distrust, they're about not having to be a hero on a Friday afternoon.

---

## Slide 24 — Quick UI Flows: Search

- Top bar: code, issues, PRs, people — all searchable
- Qualifiers: `repo:`, `path:`, `language:`, `author:`, `is:open`
- `t` on a repo page → fuzzy file finder (yes, like your editor)
- Save searches you run often
- Press `?` anywhere for the full keyboard shortcut list

**Speaker notes:**
The `t` shortcut is a crowd-pleaser. Search qualifiers are the difference between "I'll grep my laptop" and "I'll find it in three seconds." Save `is:open is:pr review-requested:@me` as your daily inbox.

---

## Slide 25 — Quick UI Flows: Blame & Compare

- **Blame**: who changed this line, when, in which PR
- Click a commit in blame → straight to the originating PR
- **Compare**: `/compare/main...feature` for any two refs
- Compare across forks for open-source contributions
- Use blame to learn, not to assign blame

**Speaker notes:**
`git blame` is poorly named — it's really `git archaeology`. Blame → commit → PR → original discussion gets you from "why is this here?" to the design conversation in three clicks.

---

## Slide 26 — [INTERLUDE] On `git blame`

**"It's not blame.**
**It's context with attribution."**

**Speaker notes:**
A small reframe. Encourage the team to use blame as a learning tool. The author of that weird line probably had a reason — go read the PR before you "fix" it.

---

## Slide 27 — Putting it together: a day in the life

- Morning: `gh pr status` → triage what needs you
- Mid-day: open a **draft PR** early, let CI tell you the truth
- Afternoon: review with **suggestions**, approve, **auto-merge**
- End of day: branch deleted, issue auto-closed, history clean
- Tomorrow: repeat, slightly faster

**Speaker notes:**
The "so what" slide. CLI for speed, draft PRs for early feedback, suggestions for fast review, auto-merge for unattended completion, branch protection as the safety net.

---

## Slide 28 — Anti-patterns to avoid

- The **9,000-line PR** that nobody can review honestly
- **Direct pushes to `main`** ("just this once")
- **Approving without reading** to clear the queue
- **CODEOWNERS** that points to people who left two years ago
- **Bypassing protections as admin** — once is a precedent

**Speaker notes:**
Name the failure modes. Especially "approve to clear the queue" — well-intentioned and quietly corrosive. Cultures form around what leaders do under pressure, not what's written in the wiki.

---

## Slide 29 — Migration Checklist

- Map terminology in your team's docs (PR, Org, GHCR, …)
- Turn on branch protection on `main` for every repo
- Add `CODEOWNERS` and a `pull_request_template.md`
- Install `gh` and run `gh auth login`
- Pick a merge strategy and lock the other ones off

**Speaker notes:**
The "do this Monday" list. None of these takes more than an hour; together they prevent the most common migration regressions. For 50+ repos, use a repository ruleset or a template repo.

---

## Slide 30 — Q&A / Resources

- This deck + cheatsheet: `resources/cheatsheet.md`
- Mapping reference: `modules/01-github-collaboration/gitlab-github-mapping.md`
- Branch protection guide: `modules/01-github-collaboration/branch-protection-guide.md`
- `gh` docs: `cli.github.com`
- Questions? Now's the time.

**Speaker notes:**
Open the floor. Common questions: SSO/PAT scopes, self-hosted runners, monorepo CODEOWNERS strategies, org-wide rulesets. Thank the audience and offer async follow-up.
