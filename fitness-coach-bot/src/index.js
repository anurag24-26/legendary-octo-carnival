import { runMigrations } from "./database/db.js";
import { createBot } from "./bot/bot.js";
import { startSchedulers } from "./scheduler/index.js";
import { startKeepAliveServer } from "./utils/keepAlive.js";
import { logger } from "./utils/logger.js";

async function main() {
  runMigrations();
  startKeepAliveServer();

  const bot = createBot();

  startSchedulers(bot);

  bot.start({
    onStart: (botInfo) => {
      logger.info({ username: botInfo.username }, "🤖 Fitness Coach Bot is running");
    },
  });

  process.once("SIGINT", () => bot.stop());
  process.once("SIGTERM", () => bot.stop());
}

main().catch((error) => {
  logger.error({ err: error }, "Fatal startup error");
  process.exit(1);
});
