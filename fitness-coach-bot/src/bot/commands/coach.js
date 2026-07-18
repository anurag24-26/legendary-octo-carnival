import { generateCoachNote } from "../../services/coachService.js";

export async function coachCommand(ctx) {
  const { user } = ctx.state;
  await ctx.reply("🤖 Reviewing your data...");

  const note = await generateCoachNote(user);
  await ctx.reply(`🤖 *Coach Note*\n\n${note}`, { parse_mode: "Markdown" });
}
