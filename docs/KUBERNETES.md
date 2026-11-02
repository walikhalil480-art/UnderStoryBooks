# Understory (eBaro) Kubernetes & Helm Operations Guide

This guide details the production-ready Kubernetes deployment architecture, Helm chart configuration, and operations workflows for running the **Understory** Ebook Platform (eBaro) on local Minikube or managed cloud clusters.

---

## 1. Architecture Overview

The system is deployed into a dedicated `understory` namespace with separated frontend, backend, configuration, and persistent storage tiers:

```
[ Ingress / NodePort 30080 ]
             │
             ▼
    [ Frontend Pods (NGINX) ]  ◄── Service: understory-frontend (NodePort: 30080)
             │
     /api/* proxy pass
             │
             ▼
    [ Backend Pod (Node 22) ]  ◄── Service: backend (ClusterIP: 5000, Internal Only)
             │
     Mounted PVC Volumes
             ├── /app/server/data                (folio.sqlite via understory-backend-data PVC)
             └── /app/server/storage/manuscripts (PDF/EPUB files via understory-backend-manuscripts PVC)
```

### Architectural Safeguards:
1. **Internal Backend Security:** The backend API service is deployed strictly as `ClusterIP: 5000`. It is never exposed publicly; all incoming traffic passes through the hardened NGINX reverse proxy.
2. **ACID Persistence for SQLite:** Because the application utilizes relational SQLite (`node:sqlite` in WAL mode), the backend deployment specifies `replicas: 1` and `strategy: Recreate` with `ReadWriteOnce` persistent volumes to prevent concurrent multi-writer filesystem lock collisions.
3. **Multi-Replica Frontend:** The NGINX frontend tier supports horizontal scaling with rolling updates (`maxSurge: 1, maxUnavailable: 0`) and liveness/readiness probes on `/healthz`.
4. **Least-Privilege Security Context:** The backend container runs unprivileged as non-root UID `1000:1000`.

---

## 2. Helm Chart Structure

The chart is located at `helm/understory/`:

```
helm/understory/
├── Chart.yaml                  # Chart metadata and app version
├── values.yaml                 # Base defaults and production references
├── values-minikube.yaml        # Local Minikube overrides (IfNotPresent, NodePort 30080)
├── values-prod.yaml            # Cloud production overrides (imagePullPolicy: Always, Ingress TLS)
└── templates/
    ├── _helpers.tpl            # Standard Helm label and name generators
    ├── configmap.yaml          # Non-sensitive runtime variables
    ├── secret.yaml             # Base64-encoded credentials and secrets
    ├── pvc-data.yaml           # SQLite storage claim (understory-backend-data)
    ├── pvc-manuscripts.yaml    # Manuscript storage claim (understory-backend-manuscripts)
    ├── backend-deployment.yaml # Backend pod specification, mounts & probes
    ├── backend-service.yaml    # Internal ClusterIP service on port 5000
    ├── frontend-deployment.yaml# NGINX frontend deployment with rolling update
    ├── frontend-service.yaml   # NodePort / ClusterIP frontend service
    └── ingress.yaml            # Optional Ingress routing rule
```

---

## 3. Deployment Commands

### Prerequisites
* Minikube `v1.38+`
* Kubectl `v1.30+`
* Helm `v3.14+`

### Step 1: Start Minikube Cluster
```bash
minikube start --driver=docker
```

### Step 2: Load Local Container Images into Minikube
```bash
minikube image load khalilart/ebaro-backend:v1.0.1
minikube image load khalilart/ebaro-frontend:latest
```

### Step 3: Lint Helm Chart
```bash
helm lint ./helm/understory
```

### Step 4: Install or Upgrade Release
```bash
helm upgrade --install understory ./helm/understory \
  -f ./helm/understory/values-minikube.yaml \
  -n understory \
  --create-namespace
```

---

## 4. Verification & Health Monitoring

### Inspect Pods & Services
```bash
kubectl get all,pvc
```

### Check Backend Logs
```bash
kubectl logs deployment/understory-backend -f
```

### Check Frontend NGINX Logs
```bash
kubectl logs deployment/understory-frontend -f
```

### Verify End-to-End Cluster Communication
Run the automated verification suite:
```bash
node tests/k8s_verification.cjs
```

---

## 5. Accessing the Application

### Option A: Via Minikube NodePort (Inside WSL / Linux host)
```bash
# Get Minikube IP
MINIKUBE_IP=$(minikube ip)

# Access frontend
curl -I http://${MINIKUBE_IP}:30080

# Access API health
curl -s http://${MINIKUBE_IP}:30080/api/health
```

### Option B: Via Minikube Tunnel / Service URL
```bash
minikube service understory-frontend --url
```

### Option C: Via Port-Forwarding (Direct localhost access)
```bash
kubectl port-forward svc/understory-frontend 8089:80
# Visit http://localhost:8089 in your browser
```

---

## 6. Upgrades & Rollbacks

### Upgrading an Image Tag
To deploy a new backend version (e.g. `v1.0.2` or commit SHA):
```bash
helm upgrade understory ./helm/understory \
  -f ./helm/understory/values-minikube.yaml \
  --set backend.image.tag=v1.0.2
```

### Viewing Release History
```bash
helm history understory
```

### Rolling Back to a Previous Revision
```bash
helm rollback understory 1
```

---

## 7. Safe Teardown

To remove all application deployments, services, configmaps, and secrets:
```bash
helm uninstall understory -n understory
```

To also delete persistent data volumes and namespace:
```bash
kubectl delete namespace understory
```
