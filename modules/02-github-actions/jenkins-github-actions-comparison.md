# GitLab CI & Jenkins → GitHub Actions: Side-by-Side Comparison

> **TL;DR** — The concepts are the same, the syntax differs, and the mental model flips: jobs default to **parallel** (use `needs:` to sequence) and each gets its **own fresh VM** (no shared workspace, no Groovy shared libraries — use reusable workflows or composite actions instead).

A practical referencefor translating GitLab CI pipelines and Jenkinsfile declarative pipelines into GitHub Actions workflows.

---

## Basic Pipeline Structure

<table>
<tr>
<th>GitLab CI (.gitlab-ci.yml)</th>
<th>Jenkinsfile (Declarative)</th>
<th>GitHub Actions</th>
</tr>
<tr>
<td valign="top">

```yaml
variables:
  APP_VERSION: "1.0.0"

stages:
  - build
  - test
  - deploy

build:
  stage: build
  tags: [linux]
  script:
    - pip install -r requirements.txt

test:
  stage: test
  script:
    - pytest src/ --junitxml=report.xml
  artifacts:
    reports:
      junit: report.xml
    when: always

deploy:
  stage: deploy
  script:
    - ./scripts/deploy.sh
  environment:
    name: production
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

</td>
<td valign="top">

```groovy
pipeline {
    agent { label 'linux' }

    environment {
        APP_VERSION = '1.0.0'
    }

    stages {
        stage('Build') {
            steps {
                sh 'pip install -r requirements.txt'
            }
        }

        stage('Test') {
            steps {
                sh 'pytest src/ --junitxml=report.xml'
            }
            post {
                always { junit 'report.xml' }
            }
        }

        stage('Deploy') {
            when { branch 'main' }
            steps {
                withCredentials([string(
                  credentialsId: 'DEPLOY_TOKEN',
                  variable: 'TOKEN')]) {
                    sh './scripts/deploy.sh'
                }
            }
        }
    }

    post {
        failure {
            mail to: 'team@securithings.com',
                 subject: 'Build failed'
        }
    }
}
```

</td>
<td valign="top">

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  APP_VERSION: "1.0.0"

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4
      - run: pip install -r requirements.txt

  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4
      - run: pytest src/ --junitxml=report.xml
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: report.xml

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4
      - run: ./scripts/deploy.sh
        env:
          TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

</td>
</tr>
</table>

---

## Common Patterns

### Credentials / Secrets

| GitLab CI | Jenkins | GitHub Actions |
|-----------|---------|----------------|
| `$MY_SECRET` (CI/CD Variable, masked) | `withCredentials([string(...)])` | `${{ secrets.MY_SECRET }}` via `env:` |
| `$CI_JOB_TOKEN` (built-in) | `withCredentials([usernamePassword(...)])` | Two separate secrets |
| Masked variable in Settings → CI/CD | `credentials('ID')` in `environment {}` | Secret scoped to repo / org / environment |

### Conditional Execution

| GitLab CI | Jenkins | GitHub Actions |
|-----------|---------|----------------|
| `rules: - if: $CI_COMMIT_BRANCH == "main"` | `when { branch 'main' }` | `if: github.ref == 'refs/heads/main'` |
| `rules: - if: $CI_PIPELINE_SOURCE == "merge_request_event"` | `when { changeRequest() }` | `if: github.event_name == 'pull_request'` |
| `rules: - if: $MY_VAR == "true"` | `when { expression { ... } }` | `if: vars.MY_VAR == 'true'` |
| `rules: - when: never` | `when { not { ... } }` | `if: !condition` |

### Parallel Execution

<table>
<tr>
<th>GitLab CI</th>
<th>Jenkinsfile</th>
<th>GitHub Actions</th>
</tr>
<tr>
<td valign="top">

```yaml
# Jobs in the same stage run in parallel
unit-test:
  stage: test
  script: pytest tests/unit/

integration-test:
  stage: test
  script: pytest tests/integration/
```

</td>
<td valign="top">

```groovy
stage('Parallel Tests') {
    parallel {
        stage('Unit') {
            steps { sh 'pytest tests/unit/' }
        }
        stage('Integration') {
            steps { sh 'pytest tests/integration/' }
        }
    }
}
```

</td>
<td valign="top">

```yaml
jobs:
  unit-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pytest tests/unit/

  integration-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pytest tests/integration/

  # Both run in parallel — no 'needs:' between them
```

</td>
</tr>
</table>

### Build Parameters → `workflow_dispatch` Inputs

<table>
<tr>
<th>GitLab CI</th>
<th>Jenkinsfile</th>
<th>GitHub Actions</th>
</tr>
<tr>
<td valign="top">

```yaml
# Triggered via API or UI with variables
variables:
  DEPLOY_ENV:
    value: "staging"
    description: "Target environment"
  DRY_RUN:
    value: "false"
    description: "Dry run mode"
```

</td>
<td valign="top">

```groovy
parameters {
    string(
      name: 'DEPLOY_ENV',
      defaultValue: 'staging'
    )
    booleanParam(
      name: 'DRY_RUN',
      defaultValue: false
    )
}
```

</td>
<td valign="top">

```yaml
on:
  workflow_dispatch:
    inputs:
      deploy_env:
        description: 'Target environment'
        default: 'staging'
        type: choice
        options: [staging, production]
      dry_run:
        description: 'Dry run mode'
        type: boolean
        default: false
```

</td>
</tr>
</table>

### Post / Always Actions

| GitLab CI | Jenkins `post {}` | GitHub Actions |
|-----------|-------------------|----------------|
| `artifacts: when: always` | `always {}` | `if: always()` |
| `after_script:` | `success {}` | `if: success()` |
| `after_script:` (check `$CI_JOB_STATUS`) | `failure {}` | `if: failure()` |

### Passing Files Between Jobs

| GitLab CI | Jenkins | GitHub Actions |
|-----------|---------|----------------|
| `artifacts: paths: [dist/]` | `stash includes: 'dist/**'` | `actions/upload-artifact` |
| `dependencies: [build]` | `unstash 'build'` | `actions/download-artifact` |

---

## Shared Libraries / Includes → Reusable Workflows

<table>
<tr>
<th>GitLab CI (include)</th>
<th>Jenkins shared library</th>
<th>GitHub Actions reusable workflow</th>
</tr>
<tr>
<td valign="top">

```yaml
# .gitlab-ci.yml (caller)
include:
  - project: 'org/shared-pipelines'
    file: '/deploy.yml'

deploy-staging:
  extends: .deploy
  variables:
    ENVIRONMENT: staging
```

</td>
<td valign="top">

```groovy
// vars/deployApp.groovy
def call(String env) {
    sh "./deploy.sh ${env}"
}

// Caller (Jenkinsfile)
@Library('my-shared-lib') _

stage('Deploy') {
    steps { deployApp('staging') }
}
```

</td>
<td valign="top">

```yaml
# .github/workflows/deploy.yml
on:
  workflow_call:
    inputs:
      environment:
        type: string
        required: true
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh ${{ inputs.environment }}

---
# Caller workflow
jobs:
  call-deploy:
    uses: ./.github/workflows/deploy.yml
    with:
      environment: staging
```

</td>
</tr>
</table>

---

## Key Mental Model Shifts

| GitLab CI thinking | Jenkins thinking | GitHub Actions thinking |
|--------------------|------------------|------------------------|
| Stages run sequentially; jobs in same stage are parallel | Stages run sequentially by default | Jobs run **in parallel** by default — use `needs:` to sequence |
| Shared runner or group runner | One agent per pipeline | Each job gets its **own fresh VM** |
| `.gitlab-ci.yml` includes / extends | Groovy shared libraries | Reusable workflows & composite actions |
| CI/CD Variables (masked = secret) | Credentials plugin | Repository / Org secrets |
| `environment:` with manual approval | Manual approval via Input step | Environment protection rules (no plugin needed) |
| Job artifacts with expiry | Build artifacts on Jenkins master | Artifacts uploaded to GitHub (90-day retention) |
| `$CI_COMMIT_SHA`, `$CI_BRANCH_NAME` | `env.GIT_COMMIT`, `env.BRANCH_NAME` | `${{ github.sha }}`, `${{ github.ref_name }}` |
