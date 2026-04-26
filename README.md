# GitHub Workshop — SecuriThings Developers

> **Duration:** 3.5 hours | **Format:** Hands-on | **Audience:** Developers transitioning from GitLab & Jenkins

---

## Overview

This workshop will take you from GitLab/Jenkins workflows to GitHub-native collaboration and CI/CD. By the end of the session, you'll be comfortable with Pull Requests, GitHub Actions pipelines, and day-to-day operational debugging.

---

## Agenda

| # | Module | Duration |
|---|--------|----------|
| 1 | [GitHub Collaboration & CI Flow](./modules/01-github-collaboration/) | 60 min |
| 2 | [GitHub Actions Deep Dive](./modules/02-github-actions/) | 80 min |
| — | Break | 10 min |
| 3 | [Day-to-Day Operations & Debugging](./modules/03-operations-debugging/) | 30 min |

**Total: 3.5 hours**

---

## Prerequisites

- GitHub account with access to this repository
- [GitHub CLI (`gh`)](https://cli.github.com/) installed and authenticated
- Git configured locally (`git config --global user.name / user.email`)
- Basic familiarity with Git (commit, push, branch)

```bash
# Verify your setup
gh auth status
git --version
gh --version
```

---

## Repository Structure

```
github-workshop/
├── .github/
│   ├── workflows/          # Example GitHub Actions workflows
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── CODEOWNERS
│   └── ISSUE_TEMPLATE/
├── modules/
│   ├── 01-github-collaboration/   # Module 1 — concepts & exercises
│   ├── 02-github-actions/         # Module 2 — concepts & exercises
│   └── 03-operations-debugging/   # Module 3 — concepts & exercises
├── resources/
│   └── cheatsheet.md              # Quick reference card
└── src/                           # Sample app used in CI exercises
```

---

## Quick Links

- [GitLab → GitHub Mapping](./modules/01-github-collaboration/gitlab-github-mapping.md)
- [Jenkins → GitHub Actions Comparison](./modules/02-github-actions/jenkins-github-actions-comparison.md)
- [Runners Guide](./modules/02-github-actions/runners-guide.md)
- [Security Best Practices](./modules/02-github-actions/security-best-practices.md)
- [Debugging Guide](./modules/03-operations-debugging/debugging-guide.md)
- [Cheat Sheet](./resources/cheatsheet.md)

---

## Getting Started

```bash
# Clone the workshop repo
gh repo clone <org>/github-workshop
cd github-workshop

# Create your personal working branch
git checkout -b workshop/<your-name>
```

---

## Resources

- [GitHub Docs](https://docs.github.com)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [GitHub CLI Manual](https://cli.github.com/manual/)
- [act — run Actions locally](https://github.com/nektos/act)
