import { waistRepository } from "../../database/repositories/logRepositories.js";
import { waistSchema, parseOrNull } from "../../utils/validation.js";
import { today } from "../../utils/dateUtils.js";

export async function waistCommand(ctx) {
  const { user } = ctx.state;
  const raw = (ctx.match || "").trim();

  if (!raw) return ctx.reply("Usage: /waist <cm>\nExample: /waist 78.5");

  const parsed = parseOrNull(waistSchema, { cm: raw });
  if (!parsed) return ctx.reply("Couldn't parse that. Usage: /waist <cm>");

  waistRepository.add({ userId: user.id, date: today(), cm: parsed.cm });

  await ctx.reply(`📏 Logged waist: ${parsed.cm}cm`);
}
