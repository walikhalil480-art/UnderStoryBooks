#!/usr/bin/env bash
set -e

pod=$(kubectl get pod -n understory -l app.kubernetes.io/name=understory-backend -o jsonpath='{.items[0].metadata.name}')
echo "Target K8s backend pod: $pod"

echo "1. Removing stale WAL/SHM files..."
kubectl exec -n understory "$pod" -- rm -f /app/server/data/folio.sqlite-wal /app/server/data/folio.sqlite-shm

echo "2. Copying checkpointed SQLite database..."
kubectl cp /mnt/e/Ebook/server/data/folio.sqlite "understory/$pod:/app/server/data/folio.sqlite"

echo "3. Copying manuscripts..."
kubectl cp /mnt/e/Ebook/server/storage/manuscripts/. "understory/$pod:/app/server/storage/manuscripts/"

echo "4. Restarting deployment to reload connection with new PVC data..."
kubectl rollout restart deployment/understory-backend -n understory
kubectl rollout status deployment/understory-backend -n understory --timeout=60s

echo "✓ Data successfully synced to Kubernetes backend!"
