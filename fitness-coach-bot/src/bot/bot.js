import { Bot } from "grammy";
import { env } from "../config/env.js";
import { userMiddleware } from "./middleware/userMiddleware.js";
import { registerErrorHandler } from "./middleware/errorHandler.js";
import { registerCommands } from "./handlers/index.js";

export function createBot() {
  const bot = new Bot(env.BOT_TOKEN);

  bot.use(userMiddleware);
  registerCommands(bot);
  registerErrorHandler(bot);

  return bot;
}
