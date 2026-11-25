#!/usr/bin/env node
import net from "node:net";

const port = Number(process.env.API_PORT ?? process.env.PORT ?? 3001);
const socket = net.connect({ host: "127.0.0.1", port });

socket.setTimeout(2000);
socket.once("connect", () => {
  socket.end();
  process.exit(0);
});
socket.once("error", () => process.exit(1));
socket.once("timeout", () => {
  socket.destroy();
  process.exit(1);
});
