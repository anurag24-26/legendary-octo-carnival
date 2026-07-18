import { sleepRepository } from "../../database/repositories/logRepositories.js";
import { sleepSchema, parseOrNull } from "../../utils/validation.js";
import { today } from "../../utils/dateUtils.js";
import { SLEEP_THRESHOLD_HOURS } from "../../constants/app.js";

export async function sleepCommand(ctx) {
  const { user } = ctx.state;
  const args = (ctx.match || "").trim().split(/\s+/).filter(Boolean);

  if (args.length === 0) {
    return ctx.reply("Usage: /sleep <hours> [quality 1-10]\nExample: /sleep 7.5 8");
  }

  const parsed = parseOrNull(sleepSchema, { hours: args[0], quality: args[1] });
  if (!parsed) {
    return ctx.reply("Couldn't parse that. Usage: /sleep <hours> [quality 1-10]");
  }

  sleepRepository.add({ userId: user.id, date: today(), hours: parsed.hours, quality: parsed.quality });

  const warning = parsed.hours < SLEEP_THRESHOLD_HOURS ? "\n⚠ That's below your recovery threshold — expect today's coach note to account for it." : "";
  await ctx.reply(`😴 Logged ${parsed.hours}h sleep (quality ${parsed.quality}/10).${warning}`);
}
