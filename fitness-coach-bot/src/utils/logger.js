import pino from "pino";
import fs from "fs-extra";
import { env } from "../config/env.js";

fs.ensureDirSync("./logs");

export const logger = pino(
  {
    level: env.LOG_LEVEL,
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  pino.transport({
    targets: [
      {
        target: "pino-pretty",
        level: env.LOG_LEVEL,
        options: { colorize: true, translateTime: "SYS:standard" },
      },
      {
        target: "pino/file",
        level: env.LOG_LEVEL,
        options: { destination: "./logs/app.log", mkdir: true },
      },
    ],
  })
);
