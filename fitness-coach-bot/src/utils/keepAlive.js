import http from "http";
import { logger } from "./logger.js";

export function startKeepAliveServer(port = process.env.PORT || 3000) {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Fitness Coach Bot is alive.");
  });

  server.listen(port, () => {
    logger.info({ port }, "Keep-alive HTTP server listening");
  });

  return server;
}
