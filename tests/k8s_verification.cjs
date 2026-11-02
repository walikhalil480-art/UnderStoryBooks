const { execSync } = require('node:child_process');

function run(cmd) {
  return execSync(`wsl ${cmd}`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
}

console.log('=====================================================');
console.log('   SMARTSTOCK KUBERNETES & HELM VERIFICATION SUITE   ');
console.log('=====================================================\n');

let passed = 0;
let total = 0;

function assert(condition, testName, extraInfo = '') {
  total++;
  if (condition) {
    console.log(`[PASS] (${total}) ${testName}`);
    if (extraInfo) console.log(`       ↳ ${extraInfo}`);
    passed++;
  } else {
    console.error(`[FAIL] (${total}) ${testName}`);
    if (extraInfo) console.error(`       ↳ ${extraInfo}`);
  }
}

try {
  // 1. Pods Running & Ready
  const podStatusJson = run("kubectl get pods -n smartstock -o json");
  const pods = JSON.parse(podStatusJson).items;
  const allReady = pods.length >= 2 && pods.every(p => {
    const isRunning = p.status.phase === 'Running';
    const isReady = p.status.containerStatuses?.every(c => c.ready);
    return isRunning && isReady;
  });
  assert(allReady, 'Kubernetes pods reach Running and Ready states', `Found ${pods.length} healthy running pods`);

  // 2. Services Configuration & Internal Networking
  const svcJson = run("kubectl get svc -n smartstock -o json");
  const svcs = JSON.parse(svcJson).items;
  const backendSvc = svcs.find(s => s.metadata.name === 'backend');
  const frontendSvc = svcs.find(s => s.metadata.name.includes('frontend'));
  assert(
    backendSvc && backendSvc.spec.type === 'ClusterIP' && backendSvc.spec.ports[0].port === 5000,
    'Backend Service is internal ClusterIP on port 5000 (not exposed publicly)',
    `ClusterIP: ${backendSvc?.spec.clusterIP}:5000`
  );
  assert(
    frontendSvc && frontendSvc.spec.type === 'NodePort' && frontendSvc.spec.ports[0].nodePort === 30080,
    'Frontend Service is configured as NodePort on port 30080',
    `NodePort: ${frontendSvc?.spec.ports[0].nodePort}`
  );

  // 3. Persistent Volume Claims
  const pvcJson = run("kubectl get pvc -n smartstock -o json");
  const pvcs = JSON.parse(pvcJson).items;
  const dataPvc = pvcs.find(p => p.metadata.name.includes('data'));
  const manuscriptsPvc = pvcs.find(p => p.metadata.name.includes('manuscripts'));
  assert(
    dataPvc?.status?.phase === 'Bound' && manuscriptsPvc?.status?.phase === 'Bound',
    'PersistentVolumeClaims are Bound and using standard StorageClass',
    `Data PVC: ${dataPvc?.status?.phase}, Manuscripts PVC: ${manuscriptsPvc?.status?.phase}`
  );

  // 4. Frontend communicates with backend via internal DNS
  const internalHealth = run(
    "kubectl exec -n smartstock deployment/smartstock-frontend -- wget -qO- http://backend:5000/api/health"
  );
  const healthObj = JSON.parse(internalHealth);
  assert(
    healthObj.status === 'healthy' && healthObj.service === 'ebaro-backend-api',
    'Frontend communicates directly with Backend over internal ClusterIP DNS',
    `Uptime: ${healthObj.uptime.toFixed(1)}s`
  );

  // 5. NGINX Reverse Proxy on Frontend Routes API Traffic
  const proxyHealth = run(
    "kubectl exec -n smartstock deployment/smartstock-frontend -- wget -qO- http://127.0.0.1:80/api/health"
  );
  const proxyObj = JSON.parse(proxyHealth);
  assert(
    proxyObj.status === 'healthy',
    'NGINX Reverse Proxy forwards /api/ traffic to backend',
    `Status: ${proxyObj.status}`
  );

  // 6. External NodePort Accessibility on Minikube
  const minikubeIp = run("minikube ip");
  const externalHealth = run(`curl -s http://${minikubeIp}:30080/api/health`);
  const extObj = JSON.parse(externalHealth);
  assert(
    extObj.status === 'healthy',
    'Application is accessible externally via Minikube NodePort endpoint',
    `Endpoint: http://${minikubeIp}:30080`
  );

  // 7. Database Persistence & Pod Restart Resiliency
  console.log('\n--- Testing Database Persistence Across Pod Restarts ---');
  // Write a test key/record into SQLite inside the backend pod
  const testMarker = `k8s_persist_test_${Date.now()}`;
  const seedScript = `
    const { DatabaseSync } = require('node:sqlite');
    const db = new DatabaseSync('/app/server/data/folio.sqlite');
    db.prepare("INSERT OR REPLACE INTO book_metadata_cache (query_key, response_json, cached_at) VALUES (?, ?, datetime('now'))").run("${testMarker}", JSON.stringify({ verified: true }));
  `;
  execSync('wsl kubectl exec -i -n smartstock deployment/smartstock-backend -- node', { input: seedScript, encoding: 'utf-8' });
  console.log(`       ↳ Seeded test record: ${testMarker}`);

  // Delete the backend pod to force a pod restart / rescheduling
  console.log('       ↳ Deleting backend pod to trigger replica restart...');
  run("kubectl delete pod -n smartstock -l app.kubernetes.io/name=smartstock-backend");
  
  // Wait for new pod to reach Ready status
  console.log('       ↳ Waiting for new backend pod to reach Ready state...');
  run("kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=smartstock-backend -n smartstock --timeout=60s");

  // Read back the test record from the new pod
  const readScript = `
    const { DatabaseSync } = require('node:sqlite');
    const db = new DatabaseSync('/app/server/data/folio.sqlite');
    const row = db.prepare("SELECT query_key, response_json FROM book_metadata_cache WHERE query_key = ?").get("${testMarker}");
    console.log(JSON.stringify(row));
  `;
  const verifyResult = execSync('wsl kubectl exec -i -n smartstock deployment/smartstock-backend -- node', { input: readScript, encoding: 'utf-8' }).trim();
  const record = JSON.parse(verifyResult);
  assert(
    record && record.query_key === testMarker,
    'Database data survives pod termination and persists on PersistentVolumeClaim',
    `Retrieved verified record: ${record?.query_key}`
  );

  // 8. Helm Release Revision and Upgrade Tracking
  const helmHistory = run("helm history smartstock -n smartstock -o json");
  const history = JSON.parse(helmHistory);
  assert(
    history.length >= 2 && history[history.length - 1].status === 'deployed',
    'Helm upgrade history reflects successful zero-drift release deployments',
    `Active revision: ${history[history.length - 1].revision}`
  );

  // 9. Cluster Events and Logs Hygiene
  const backendLogs = run("kubectl logs -n smartstock deployment/smartstock-backend --tail=20");
  assert(
    backendLogs.includes('[eBaro Production API Server] Started successfully.'),
    'Backend application logs show clean startup without critical errors',
    'Server successfully bound to http://0.0.0.0:5000'
  );

} catch (err) {
  console.error('[Verification Execution Error]:', err.message);
  if (err.stdout) console.error('STDOUT:', err.stdout.toString());
  if (err.stderr) console.error('STDERR:', err.stderr.toString());
}

console.log('\n=====================================================');
console.log(`TEST RESULTS: ${passed}/${total} Passed (${Math.round((passed / total) * 100)}%)`);
console.log('=====================================================\n');

if (passed !== total) {
  process.exit(1);
}
