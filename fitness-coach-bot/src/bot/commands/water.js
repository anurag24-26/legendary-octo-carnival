import { waterRepository } from "../../database/repositories/logRepositories.js";
import { waterSchema, parseOrNull } from "../../utils/validation.js";
import { today } from "../../utils/dateUtils.js";

export async function waterCommand(ctx) {
  const { user, settings } = ctx.state;
  const raw = (ctx.match || "").trim();

  if (!raw) return ctx.reply("Usage: /water <liters>\nExample: /water 0.5");

  const parsed = parseOrNull(waterSchema, { liters: raw });
  if (!parsed) return ctx.reply("Couldn't parse that. Usage: /water <liters>");

  waterRepository.add({ userId: user.id, date: today(), liters: parsed.liters });

  await ctx.reply(`💧 Logged ${parsed.liters}L water. Daily target: ${settings.waterTarget}L.`);
}
