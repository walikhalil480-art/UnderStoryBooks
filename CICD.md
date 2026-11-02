# eBaro CI/CD Automation Guide (GitHub Actions)

This document describes the automated Continuous Integration and Continuous Delivery (CI/CD) pipeline for the **eBaro / Veritas Press Digital Publishing Platform**.

---

## 1. Pipeline Architecture Overview

The pipeline is implemented via GitHub Actions in [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml). It provides automated quality verification, test execution, container builds, security scans, and registry publishing.

```mermaid
flowchart TD
    subgraph Triggers["Pipeline Triggers"]
        P["Push to 'main'"]
        PR["Pull Request to 'main'"]
        TAG["Release Tag 'v*.*.*'"]
        MAN["Manual Dispatch"]
    end

    subgraph StageA["Stage A: Code Quality & Automated Tests"]
        A1["actions/checkout@v4"]
        A2["actions/setup-node@v4 (Node 22)"]
        A3["npm ci (dependency cache)"]
        A4["npm run lint (TypeScript strict check)"]
        A5["npm test (41 Unit & E2E Platform Tests)"]
        A6["npm run build (Vite production bundle)"]
        A7["npm audit --omit=dev (Dependency scan)"]
    end

    subgraph StageB["Stage B: Docker Build & Vulnerability Scan"]
        B1["docker/setup-buildx-action@v3"]
        B2["Build Frontend Image (GHA cache)"]
        B3["Build Backend Image (GHA cache)"]
        B4["Trivy Security Scan: Frontend"]
        B5["Trivy Security Scan: Backend"]
    end

    subgraph StageC["Stage C: Continuous Delivery (Registry Publishing)"]
        C1{"Event == push && (main || tag)?"}
        C2["Verify DOCKERHUB_USERNAME & TOKEN"]
        C3["docker/login-action@v3"]
        C4["docker/metadata-action@v5 (sha-, latest, tags)"]
        C5["Publish Frontend Image to Docker Hub"]
        C6["Publish Backend Image to Docker Hub"]
    end

    P --> A1
    PR --> A1
    TAG --> A1
    MAN --> A1

    A1 --> A2 --> A3 --> A4 --> A5 --> A6 --> A7
    A7 -->|Pass| B1
    B1 --> B2 --> B3 --> B4 --> B5

    B5 -->|Pass| C1
    C1 -->|Yes| C2 --> C3 --> C4 --> C5 --> C6
    C1 -->|No (Pull Request)| Stop["Stop: PRs never publish to registry"]
```

---

## 2. Workflow Triggers

The workflow runs automatically under the following conditions:

| Trigger | Description | Target Branch | CD Publishing Triggered? |
|---|---|---|---|
| `push: main` | Direct merge or push to primary branch | `main` | **Yes** (Tags: `latest`, `sha-<short-sha>`) |
| `push: tags` | Git tag push for releases (e.g. `v1.2.0`) | `v*.*.*` | **Yes** (Tags: `1.2.0`, `sha-<short-sha>`) |
| `pull_request` | PR opened or synchronized | `main` | **No** (Runs Stages A & B only) |
| `workflow_dispatch` | Manual run from GitHub Actions UI | Any | Runs configured stages |

> [!IMPORTANT]
> **PR Isolation Guarantee**: Pull requests from forks or untrusted branches are executed strictly in isolation. Stage C (`publish-images`) will never execute on Pull Request events.

---

## 3. Pipeline Stages & Quality Gates

### Stage A: Code Quality & Automated Tests (`quality-check`)
1. **Dependency Installation**: Uses `npm ci` with GitHub Actions caching for deterministic builds.
2. **Type Checking & Linting**: Executes `npm run lint` (`tsc --noEmit`) to enforce TypeScript safety.
3. **Automated Test Suite**: Executes `npm test`, running:
   - **Unit & Schema Tests** (`server/tests/api.test.ts`): Verifies database connection, table schemas, pricing invariants (free books = $0, paid books > $0), authentication validation rules, and admin role enforcement.
   - **End-to-End Platform Verification** (`tests/platform_verification.cjs`): Validates 37 comprehensive platform scenarios (EPUB/PDF streaming, EVC Plus mobile checkout, author uploads, copyright takedowns, and admin book lifecycle).
4. **Production Build Validation**: Compiles Vite SPA assets (`npm run build`) to ensure bundling integrity.
5. **Dependency Audit**: Runs `npm audit --omit=dev --audit-level=high` to detect high/critical vulnerabilities in production libraries.

### Stage B: Docker Build & Vulnerability Scan (`docker-build-and-scan`)
- **Docker Buildx & Layer Caching**: Leverages `docker/setup-buildx-action` and GitHub Actions cache (`type=gha`) to avoid redundant compilation of unmodified layers.
- **Image Validation**: Builds both `Dockerfile.frontend` and `Dockerfile.backend` locally.
- **Trivy Vulnerability Scan**: Scans images using Aqua Security's Trivy scanner:
  - Scans OS packages (Alpine Linux) and application runtime libraries.
  - Filters out unfixed CVEs (`ignore-unfixed: true`).
  - Summarizes results directly in the GitHub Actions workflow output.

### Stage C: Continuous Delivery (`publish-images`)
- Authenticates with Docker Hub using repository secrets.
- Generates standards-compliant OCI image tags:
  - `sha-<commit>` (Short commit SHA, e.g. `sha-9f61199`)
  - `latest` (pointing to the most recent build on `main`)
  - `vX.Y.Z` (semantic release tag if tagged)
- Pushes both images:
  - `<your-username>/ebaro-frontend`
  - `<your-username>/ebaro-backend`

---

## 4. Required GitHub Secrets Setup

To enable automated image publishing, configure the following secrets in your GitHub repository:

1. Navigate to: **GitHub Repository $\rightarrow$ Settings $\rightarrow$ Secrets and variables $\rightarrow$ Actions**.
2. Click **New repository secret** and add:

| Secret Name | Description | Where to find |
|---|---|---|
| `DOCKERHUB_USERNAME` | Your Docker Hub account or organization name | Your Docker Hub profile |
| `DOCKERHUB_TOKEN` | Docker Hub Personal Access Token (PAT) with `Read & Write` scope | [Docker Hub Security Settings](https://hub.docker.com/settings/security) $\rightarrow$ New Access Token |

> [!NOTE]
> If credentials are not yet configured in GitHub Secrets, Stage C logs an informational warning and safely skips the publishing step without failing the workflow.

---

## 5. Local Pre-Flight Verification

Before pushing code to GitHub, developers can run all Stage A checks locally:

```bash
# 1. Verify TypeScript types & linting
npm run lint

# 2. Run automated tests (41 test assertions)
npm test

# 3. Verify production compilation
npm run build

# 4. Check production dependencies
npm audit --omit=dev --audit-level=high
```

---

## 6. Troubleshooting Failed Pipeline Runs

### 1. Test Failures in Stage A
- Run `npm test` locally to reproduce test failures.
- Check TAP output for failed assertions in `server/tests/api.test.ts` or `tests/platform_verification.cjs`.

### 2. TypeScript Compilation Errors
- Run `npm run lint` locally. Fix any mismatched types or missing imports before committing.

### 3. Docker Build Failures in Stage B
- Verify the build locally:
  ```bash
  docker build -f Dockerfile.frontend -t ebaro-frontend:test .
  docker build -f Dockerfile.backend -t ebaro-backend:test .
  ```

### 4. Image Publishing Failure in Stage C
- Verify `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` in GitHub Secrets.
- Ensure the Docker Hub token has **Read & Write** access permissions.
- Ensure the repository exists or the account has permission to create new public/private repositories.
