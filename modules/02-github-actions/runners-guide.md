# GitHub Actions Runners — Complete Guide

> **TL;DR** — `ubuntu-latest` covers the 90% case with a fresh, ephemeral VM and pre-installed tooling. Reach for self-hosted only when you need private-network access, GPUs, or persistent caches — and **never** point self-hosted runners at a public repo, since fork PRs can execute arbitrary code on them.

---

## What is a Runner?

A runner is the machine (VM or container) that executes your workflow jobs. GitHub provides hosted runners; you can also register your own.

---

## GitHub-Hosted Runners

GitHub manages these — no setup required.

| Label | OS | CPU | RAM | Storage |
|-------|----|-----|-----|---------|
| `ubuntu-latest` | Ubuntu 24.04 | 4 | 16 GB | 14 GB |
| `ubuntu-22.04` | Ubuntu 22.04 | 4 | 16 GB | 14 GB |
| `windows-latest` | Windows Server 2022 | 4 | 16 GB | 14 GB |
| `macos-latest` | macOS 14 (M-series) | 3 (M1) | 7 GB | 14 GB |
| `macos-13` | macOS 13 (Intel) | 4 | 14 GB | 14 GB |

**Larger runners** (GitHub Team/Enterprise only):

| Label | CPU | RAM |
|-------|-----|-----|
| `ubuntu-latest-4-cores` | 4 | 16 GB |
| `ubuntu-latest-8-cores` | 8 | 32 GB |
| `ubuntu-latest-16-cores` | 16 | 64 GB |

### Key characteristics

- **Fresh VM** per job — clean state every time
- **Ephemeral** — no artifacts persist between runs (use `actions/upload-artifact`)
- **Pre-installed tools** — Docker, Node, Python, Go, Java, AWS/GCP CLIs, and more
- **Internet access** — can reach public registries and APIs
- **Billing** — free tier: 2,000 min/month (public repos: unlimited)

---

## Self-Hosted Runners

You register and manage these yourself. The runner agent software connects outbound to GitHub.

### When to use self-hosted

| Use Case | Reason |
|----------|--------|
| Access to private network resources | VPNs, internal services |
| Large builds (Docker layers, large models) | Persistent cache between runs |
| Specialized hardware (GPU, ARM) | GitHub-hosted doesn't offer it |
| Cost optimization at scale | Very high minute usage |
| Compliance / data residency | Keep artifacts on-prem |

### Registration

```bash
# 1. Go to: Settings → Actions → Runners → New self-hosted runner
# 2. Follow the OS-specific instructions, or use the runner script:

# Download runner agent
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.317.0.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.317.0/actions-runner-linux-x64-2.317.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.317.0.tar.gz

# Configure (get token from Settings → Runners → New runner)
./config.sh --url https://github.com/<org>/<repo> --token <TOKEN>

# Run as a service
sudo ./svc.sh install
sudo ./svc.sh start
```

### Labeling runners for targeting

```bash
# During registration, add custom labels:
./config.sh --labels build,docker,linux,large

# In your workflow:
jobs:
  build:
    runs-on: [self-hosted, linux, large]
```

---

## Choosing the Right Runner

```
Are you accessing private network resources (databases, internal APIs)?
├── Yes → Self-hosted runner
└── No
    │
    ├── Do you need specialized hardware (GPU, high memory)?
    │   ├── Yes → Self-hosted or GitHub-hosted larger runner
    │   └── No
    │       │
    │       ├── Is build time > 30 min due to downloads?
    │       │   ├── Yes → Self-hosted with persistent cache, or actions/cache
    │       │   └── No → GitHub-hosted (ubuntu-latest)
    │       │
    │       └── What OS?
    │           ├── Linux  → ubuntu-latest
    │           ├── Windows → windows-latest
    │           └── macOS  → macos-latest
```

---

## Security Considerations

| Concern | GitHub-hosted | Self-hosted |
|---------|--------------|-------------|
| Code execution isolation | ✅ Fresh VM | ⚠️ Shared environment risk |
| Secrets exposure | ✅ Ephemeral | ⚠️ Possible residual state |
| Public repo fork PRs | ✅ Safe | ❌ **Never use for public repos** |
| Network access control | Limited | Full control |

> **Warning:** Never use self-hosted runners for public repositories. A malicious PR could execute arbitrary code on your runner.

### Hardening self-hosted runners

```yaml
# Run runner inside Docker (ephemeral container per job)
# Use Runner Scale Sets (ARC — Actions Runner Controller) for Kubernetes
# Restrict which workflows can use specific runner groups:
# Settings → Actions → Runner groups → restrict to specific workflows
```

---

## Runner Groups (Enterprise)

Organize runners into groups to control access:

- **Default group** — available to all repos in org
- **Custom groups** — restrict to specific repos or workflows
- Configure at: **Org Settings → Actions → Runner groups**

---

## Real-World Runner Labels

```yaml
# Standard CI — use GitHub-hosted
jobs:
  test:
    runs-on: ubuntu-latest

# Large Docker builds — self-hosted with Docker cache
  docker-build:
    runs-on: [self-hosted, linux, docker]

# Deploy to internal infra — self-hosted in VPC
  deploy:
    runs-on: [self-hosted, linux, deploy]

# Windows-specific tests
  test-windows:
    runs-on: windows-latest

# macOS + Xcode build
  ios-build:
    runs-on: macos-latest
```
