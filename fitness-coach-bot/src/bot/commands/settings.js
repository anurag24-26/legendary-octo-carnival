import { settingsRepository } from "../../database/repositories/settingsRepository.js";

export async function settingsCommand(ctx) {
  const { user, settings } = ctx.state;
  const args = (ctx.match || "").trim().split(/\s+/).filter(Boolean);

  if (args.length === 0) {
    return ctx.reply(
      `⚙️ *Your Settings*\n\n` +
        `Protein target: ${settings.proteinTarget}g\n` +
        `Calorie target: ${settings.calorieTarget} kcal\n` +
        `Water target: ${settings.waterTarget}L\n` +
        `Timezone: ${settings.timezone}\n` +
        `Daily report time: ${settings.dailyReportTime}\n\n` +
        `To update: /settings protein 130  |  /settings calories 2500  |  /settings water 4`,
      { parse_mode: "Markdown" }
    );
  }

  const [field, value] = args;
  const num = Number(value);
  if (Number.isNaN(num)) return ctx.reply("Please provide a numeric value.");

  const fieldMap = {
    protein: "proteinTarget",
    calories: "calorieTarget",
    water: "waterTarget",
  };

  const dbField = fieldMap[field.toLowerCase()];
  if (!dbField) return ctx.reply("Unknown setting. Use: protein, calories, or water.");

  settingsRepository.update(user.id, { [dbField]: num });
  await ctx.reply(`✅ Updated ${field} target to ${num}.`);
}
