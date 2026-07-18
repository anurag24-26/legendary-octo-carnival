import cron from "node-cron";
import { userRepository } from "../database/repositories/userRepository.js";
import { getSettings } from "../services/userService.js";
import { buildDailyReport, persistReport, REPORT_TYPES } from "../services/reportService.js";
import { logger } from "../utils/logger.js";
import { env } from "../config/env.js";

function cronExpressionFromTime(time) {
  const [hour, minute] = time.split(":").map(Number);
  return `${minute} ${hour} * * *`;
}

export function scheduleDailyReports(bot) {
  const expression = cronExpressionFromTime(env.DAILY_REPORT_TIME);

  cron.schedule(
    expression,
    async () => {
      const users = userRepository.all();
      for (const user of users) {
        try {
          const settings = getSettings(user.id);
          const report = buildDailyReport(user, settings);
          persistReport(user.id, REPORT_TYPES.DAILY, report);
          await bot.api.sendMessage(user.telegramId, formatMorningBrief(report));
        } catch (error) {
          logger.error({ err: error, userId: user.id }, "Failed to send daily report");
        }
      }
    },
    { timezone: env.TIMEZONE }
  );

  logger.info({ expression, timezone: env.TIMEZONE }, "Daily report scheduler active");
}

function formatMorningBrief(r) {
  return (
    `☀️ Good morning, here's your plan.\n\n` +
    `📅 ${r.dateHuman}\n` +
    `${r.workout.emoji} ${r.workout.label}\n` +
    `🏃 Cardio: ${r.cardio}\n` +
    `🥗 Diet target: ${r.targets.calories} kcal\n` +
    `🥛 Protein goal: ${r.targets.protein}g\n` +
    `🔥 Calories goal: ${r.targets.calories} kcal\n` +
    `💧 Water goal: ${r.targets.water}L\n` +
    `😴 Sleep goal: ${r.sleepGoalHours}h\n` +
    `📈 Recovery score: ${r.recoveryScore ?? "log sleep to see this"}${r.recoveryScore ? "/10" : ""}\n` +
    `🤖 Coach note: run /coach for a data-grounded take\n\n` +
    `Next action: open /today for exercises.`
  );
}
