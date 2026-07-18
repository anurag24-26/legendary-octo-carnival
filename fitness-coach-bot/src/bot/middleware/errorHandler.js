import { logger } from "../../utils/logger.js";

export function registerErrorHandler(bot) {
  bot.catch((err) => {
    const ctx = err.ctx;
    logger.error(
      { err: err.error, update: ctx?.update?.update_id },
      "Unhandled bot error"
    );

    if (ctx) {
      ctx
        .reply("⚠ Something went wrong on my end. Please try again in a moment.")
        .catch(() => {});
    }
  });
}
