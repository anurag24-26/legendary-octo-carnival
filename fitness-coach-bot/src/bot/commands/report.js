import { buildDailyReport, buildWeeklyReport, buildMonthlyReport, persistReport, REPORT_TYPES } from "../../services/reportService.js";
import { formatHuman } from "../../utils/dateUtils.js";

export async function reportCommand(ctx) {
  const { user, settings } = ctx.state;
  const arg = (ctx.match || "").trim().toLowerCase() || "daily";

  if (arg === "weekly" || arg === "week") {
    const report = buildWeeklyReport(user);
    persistReport(user.id, REPORT_TYPES.WEEKLY, report);
    return ctx.reply(formatWeekly(report), { parse_mode: "Markdown" });
  }

  if (arg === "monthly" || arg === "month") {
    const report = buildMonthlyReport(user);
    persistReport(user.id, REPORT_TYPES.MONTHLY, report);
    return ctx.reply(formatMonthly(report), { parse_mode: "Markdown" });
  }

  const report = buildDailyReport(user, settings);
  persistReport(user.id, REPORT_TYPES.DAILY, report);
  return ctx.reply(formatDaily(report), { parse_mode: "Markdown" });
}

function formatDaily(r) {
  return (
    `📅 *${r.dateHuman}*\n\n` +
    `${r.workout.emoji} *${r.workout.label}*\n` +
    `🏃 Cardio: ${r.cardio}\n` +
    `🥗 Logged today: ${r.nutrition.calories} kcal, ${r.nutrition.protein}g protein\n` +
    `🥛 Protein target: ${r.targets.protein}g\n` +
    `🔥 Calorie target: ${r.targets.calories} kcal\n` +
    `💧 Water target: ${r.targets.water}L (logged: ${r.nutrition.water}L)\n` +
    `😴 Sleep goal: ${r.sleepGoalHours}h\n` +
    `📈 Recovery score: ${r.recoveryScore ?? "no data"}${r.recoveryScore ? "/10" : ""}\n` +
    `🔥 Streak: ${r.streak} days\n\n` +
    `Next action: run /coach for an adaptive note, or /today for your full workout.`
  );
}

function formatWeekly(r) {
  return (
    `📅 *Weekly Report* (${formatHuman(r.periodStart)} → ${formatHuman(r.periodEnd)})\n\n` +
    `✅ Workouts completed: ${r.workoutsCompleted}\n` +
    `⏭ Workouts skipped: ${r.workoutsSkipped}\n` +
    `😴 Avg sleep: ${r.avgSleep ?? "no data"}h\n` +
    `🥛 Avg protein: ${r.avgProtein ?? "no data"}g\n` +
    `💧 Avg water: ${r.avgWater ?? "no data"}L\n` +
    `⚖️ Weight change: ${formatDelta(r.weightChange, "kg")}\n` +
    `📏 Waist change: ${formatDelta(r.waistChange, "cm")}`
  );
}

function formatMonthly(r) {
  return (
    `📅 *Monthly Report* (${formatHuman(r.periodStart)} → ${formatHuman(r.periodEnd)})\n\n` +
    `✅ Workouts completed: ${r.workoutsCompleted}\n` +
    `⚖️ Weight change: ${formatDelta(r.weightChange, "kg")}\n` +
    `📏 Waist change: ${formatDelta(r.waistChange, "cm")}`
  );
}

function formatDelta(delta, unit) {
  if (delta === null) return "no data";
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta}${unit}`;
}
