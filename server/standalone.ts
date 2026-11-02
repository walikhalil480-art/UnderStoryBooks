import http from 'node:http';
import { handleApiMiddleware } from './apiPlugin';

const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = process.env.HOST || '0.0.0.0';

const server = http.createServer(async (req, res) => {
  // Global CORS headers for cross-origin or reverse-proxied requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Range, X-Requested-With');
  res.setHeader(
    'Access-Control-Expose-Headers',
    'Content-Range, Accept-Ranges, Content-Length, Content-Type, X-PDF-Page-Count'
  );

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    await handleApiMiddleware(req, res, () => {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `Route not found: ${req.method} ${req.url}` }));
    });
  } catch (err: any) {
    console.error('[Standalone Server Error]:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error', message: err?.message }));
    }
  }
});

server.listen(PORT, HOST, () => {
  console.log(`[eBaro Production API Server] Started successfully.`);
  console.log(`[eBaro Production API Server] Listening on http://${HOST}:${PORT}`);
  console.log(`[eBaro Production API Server] Health check available at: http://${HOST}:${PORT}/api/health`);
});

// Graceful container termination
const shutdown = (signal: string) => {
  console.log(`[eBaro Production API Server] Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('[eBaro Production API Server] HTTP server closed. Exiting process.');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('[eBaro Production API Server] Forcefully shutting down after timeout.');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
