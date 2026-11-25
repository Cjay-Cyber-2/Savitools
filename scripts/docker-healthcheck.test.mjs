import test from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import { checkHealth } from './docker-healthcheck.mjs';

test.describe('docker-healthcheck', () => {
  let server;
  let port;

  test.beforeEach(async () => {
    process.env.API_PORT = '3001';
    process.env.API_PREFIX = 'api';
  });

  test.afterEach(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
      server = null;
    }
  });

  const startServer = (handler) => {
    return new Promise((resolve) => {
      server = http.createServer(handler);
      server.listen(0, '127.0.0.1', () => {
        port = server.address().port;
        process.env.API_PORT = port.toString();
        resolve();
      });
    });
  };

  test('returns success (exit 0) on HTTP 200 OK', async () => {
    await startServer((req, res) => {
      assert.strictEqual(req.url, '/api/v1/health');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
    });

    const exitCode = await checkHealth();
    assert.strictEqual(exitCode, 0);
  });

  test('returns failure (exit 1) on non-200 status code (e.g. 503 Service Unavailable)', async () => {
    await startServer((req, res) => {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'unhealthy' }));
    });

    const exitCode = await checkHealth();
    assert.strictEqual(exitCode, 1);
  });

  test('returns failure (exit 1) on connection refused', async () => {
    process.env.API_PORT = '59999';
    const exitCode = await checkHealth();
    assert.strictEqual(exitCode, 1);
  });

  test('returns failure (exit 1) on request timeout', async () => {
    await startServer((req, res) => {
      // Never respond to simulate timeout
    });

    const exitCode = await checkHealth({ timeoutMs: 50 });
    assert.strictEqual(exitCode, 1);
  });
});
