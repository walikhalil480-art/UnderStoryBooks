#!/usr/bin/env bash
set -e

cd /mnt/e/Ebook
npm run build

FRONTEND_POD=$(kubectl get pods -n understory -l app.kubernetes.io/component=frontend -o jsonpath='{.items[0].metadata.name}')

echo "Syncing updated dist/ and nginx.conf into $FRONTEND_POD..."
kubectl cp /mnt/e/Ebook/dist/index.html "understory/${FRONTEND_POD}:/usr/share/nginx/html/index.html"
kubectl cp /mnt/e/Ebook/dist/assets "understory/${FRONTEND_POD}:/usr/share/nginx/html/"
kubectl cp /mnt/e/Ebook/nginx.conf "understory/${FRONTEND_POD}:/etc/nginx/conf.d/default.conf"
kubectl exec -n understory "$FRONTEND_POD" -- sh -c "touch /usr/share/nginx/html/pdf.worker.min.mjs && nginx -s reload"

docker cp /mnt/e/Ebook/dist/index.html understory-frontend:/usr/share/nginx/html/index.html
docker cp /mnt/e/Ebook/dist/assets/. understory-frontend:/usr/share/nginx/html/assets/
docker cp /mnt/e/Ebook/nginx.conf understory-frontend:/etc/nginx/conf.d/default.conf
docker exec understory-frontend sh -c "touch /usr/share/nginx/html/pdf.worker.min.mjs && nginx -s reload"

echo "Verified /pdf.worker.min.mjs?v=2 headers in K8s pod:"
kubectl exec -n understory "$FRONTEND_POD" -- wget -S -O /dev/null "http://127.0.0.1:80/pdf.worker.min.mjs?v=2" 2>&1 | grep -E "HTTP/|Content-Type|Cache-Control"
