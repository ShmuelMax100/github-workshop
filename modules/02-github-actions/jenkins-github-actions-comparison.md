# Jenkins → GitHub Actions: Side-by-Side Comparison

A practical reference for translating Jenkinsfile declarative pipelines into GitHub Actions workflows.

---

## Basic Pipeline Structure

**Jenkinsfile (Declarative)**

```groovy
pipeline {
    agent { label 'linux' }

    environment {
        APP_VERSION = '1.0.0'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

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
                always {
                    junit 'report.xml'
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([string(credentialsId: 'DEPLOY_TOKEN', variable: 'TOKEN')]) {
                    sh './scripts/deploy.sh'
                }
            }
        }
    }

    post {
        failure {
            mail to: 'team@securithings.com', subject: 'Build failed'
        }
    }
}
```

**GitHub Actions equivalent**

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
    runs-on: ubuntu-latest         # equivalent to agent { label 'linux' }
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4
      - run: pip install -r requirements.txt

  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4
      - run: pytest src/ --junitxml=report.xml
      - uses: actions/upload-artifact@v4           # replaces junit plugin
        if: always()                               # replaces post { always {} }
        with:
          name: test-results
          path: report.xml

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'            # replaces when { branch 'main' }
    runs-on: ubuntu-latest
    environment: production                        # approval gate (replaces manual gates)
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4
      - run: ./scripts/deploy.sh
        env:
          TOKEN: ${{ secrets.DEPLOY_TOKEN }}       # replaces withCredentials()
```

---

## Common Patterns

### Credentials / Secrets

| Jenkins | GitHub Actions |
|---------|----------------|
| `withCredentials([string(...)])` | `env: MY_SECRET: ${{ secrets.MY_SECRET }}` |
| `withCredentials([usernamePassword(...)])` | Two separate secrets |
| `credentials('ID')` in `environment {}` | `${{ secrets.NAME }}` in `env:` |

### Conditional Execution

| Jenkins | GitHub Actions |
|---------|----------------|
| `when { branch 'main' }` | `if: github.ref == 'refs/heads/main'` |
| `when { changeRequest() }` | `if: github.event_name == 'pull_request'` |
| `when { expression { ... } }` | `if: ${{ expression }}` |
| `when { not { ... } }` | `if: !condition` |

### Parallel Execution

**Jenkinsfile:**
```groovy
stage('Parallel Tests') {
    parallel {
        stage('Unit') { steps { sh 'pytest tests/unit/' } }
        stage('Integration') { steps { sh 'pytest tests/integration/' } }
    }
}
```

**GitHub Actions:**
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

  # Both run in parallel (no 'needs:' between them)
```

### Build Parameters → `workflow_dispatch` Inputs

**Jenkinsfile:**
```groovy
parameters {
    string(name: 'DEPLOY_ENV', defaultValue: 'staging')
    booleanParam(name: 'DRY_RUN', defaultValue: false)
}
```

**GitHub Actions:**
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

### Post Actions

| Jenkins `post {}` | GitHub Actions |
|-------------------|----------------|
| `always {}` | `if: always()` |
| `success {}` | `if: success()` |
| `failure {}` | `if: failure()` |
| `cleanup {}` | `if: always()` (last step) |

### Stashing Files

| Jenkins | GitHub Actions |
|---------|----------------|
| `stash includes: 'dist/**'` | `actions/upload-artifact` |
| `unstash 'build'` | `actions/download-artifact` |

---

## Shared Libraries → Reusable Workflows

**Jenkins shared library:**
```groovy
// vars/deployApp.groovy
def call(String env) {
    sh "./deploy.sh ${env}"
}
```

**GitHub Actions reusable workflow:**
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
```

**Caller:**
```yaml
jobs:
  call-deploy:
    uses: ./.github/workflows/deploy.yml
    with:
      environment: staging
```

---

## Key Mental Model Shifts

| Jenkins thinking | GitHub Actions thinking |
|------------------|------------------------|
| Stages run sequentially by default | Jobs run in parallel by default — use `needs:` to sequence |
| One agent per pipeline | Each job gets its own fresh VM |
| Plugins for everything | Actions from Marketplace (or write your own) |
| Groovy DSL | YAML + shell |
| Credentials plugin | Repository/Org secrets |
| Manual approval via Input step | Environment protection rules (no plugin needed) |
| Build artifacts stored on Jenkins master | Artifacts uploaded to GitHub (90-day retention) |
