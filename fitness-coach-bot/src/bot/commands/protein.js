import { proteinRepository } from "../../database/repositories/logRepositories.js";
import { proteinSchema, parseOrNull } from "../../utils/validation.js";
import { today } from "../../utils/dateUtils.js";

export async function proteinCommand(ctx) {
  const { user, settings } = ctx.state;
  const raw = (ctx.match || "").trim();

  if (!raw) return ctx.reply("Usage: /protein <grams>\nExample: /protein 30");

  const parsed = parseOrNull(proteinSchema, { grams: raw });
  if (!parsed) return ctx.reply("Couldn't parse that. Usage: /protein <grams>");

  proteinRepository.add({ userId: user.id, date: today(), grams: parsed.grams });

  await ctx.reply(`🥛 Logged ${parsed.grams}g protein. Daily target: ${settings.proteinTarget}g.`);
}
