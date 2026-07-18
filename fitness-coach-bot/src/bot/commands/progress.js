import { generateProgressReport } from "../../services/photoService.js";

export async function progressCommand(ctx) {
  const { user } = ctx.state;
  await ctx.reply("📊 Building your progress summary...");

  const summary = await generateProgressReport(user.id);
  await ctx.reply(`📈 *Progress Summary*\n\n${summary}`, { parse_mode: "Markdown" });
}
