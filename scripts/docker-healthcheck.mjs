#!/usr/bin/env node
import http from 'node:http';
import net from "node:net";


const port = Number(process.env.API_PORT ?? process.env.PORT ?? 3001);

const socket = net.connect({ host: "127.0.0.1", port });
export async function checkHealth(options = {}) {
  const port = Number(process.env.API_PORT ?? process.env.PORT ?? 3001);
  const prefix = process.env.API_PREFIX ? `/${process.env.API_PREFIX}` : '/api';
  const timeoutMs = options.timeoutMs ?? 2000;

  return new Promise((resolve) => {
    const req = http.get(
      {
        hostname: '127.0.0.1',
        port,
        path: `${prefix}/v1/health`,
        timeout: timeoutMs,
      },
      (res) => {
        res.resume();
        if (res.statusCode === 200) {
          resolve(0);
        } else {
          resolve(1);
        }
      },
    );

    req.on('error', () => {
      resolve(1);
});

    req.on('timeout', () => {
      req.destroy();
      resolve(1);
});
  });
}

if (process.argv[1] && process.argv[1].endsWith('docker-healthcheck.mjs')) {
  checkHealth().then((code) => {
    process.exit(code);
  });
}
