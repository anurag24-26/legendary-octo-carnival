import { weightRepository } from "../../database/repositories/logRepositories.js";
import { weightSchema, parseOrNull } from "../../utils/validation.js";
import { today } from "../../utils/dateUtils.js";

export async function weightCommand(ctx) {
  const { user } = ctx.state;
  const raw = (ctx.match || "").trim();

  if (!raw) return ctx.reply("Usage: /weight <kg>\nExample: /weight 63.2");

  const parsed = parseOrNull(weightSchema, { kg: raw });
  if (!parsed) return ctx.reply("Couldn't parse that. Usage: /weight <kg>");

  weightRepository.add({ userId: user.id, date: today(), kg: parsed.kg });

  await ctx.reply(`⚖️ Logged bodyweight: ${parsed.kg}kg`);
}
