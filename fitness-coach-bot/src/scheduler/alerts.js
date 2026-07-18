import cron from "node-cron";
import { userRepository } from "../database/repositories/userRepository.js";
import { getSettings } from "../services/userService.js";
import { checkAlerts } from "../services/alertService.js";
import { logger } from "../utils/logger.js";
import { env } from "../config/env.js";

export function scheduleAlerts(bot) {
  // Runs every 6 hours; alert logic itself is idempotent-safe per condition thresholds.
  cron.schedule(
    "0 */6 * * *",
    async () => {
      const users = userRepository.all();
      for (const user of users) {
        try {
          const settings = getSettings(user.id);
          const alerts = checkAlerts(user, settings);
          for (const alert of alerts) {
            await bot.api.sendMessage(user.telegramId, alert.message);
          }
        } catch (error) {
          logger.error({ err: error, userId: user.id }, "Failed to process alerts");
        }
      }
    },
    { timezone: env.TIMEZONE }
  );

  logger.info("Alert scheduler active (every 6 hours)");
}
