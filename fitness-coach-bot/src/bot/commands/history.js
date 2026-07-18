import { workoutRepository } from "../../database/repositories/workoutRepository.js";
import { formatHuman } from "../../utils/dateUtils.js";

export async function historyCommand(ctx) {
  const { user } = ctx.state;
  const logs = workoutRepository.mostRecent(user.id, 10);

  if (logs.length === 0) {
    return ctx.reply("No workout history yet. Log your first session with /done.");
  }

  const lines = logs.map((l) => {
    const status = l.notes?.startsWith("SKIPPED") ? "⏭ skipped" : "✅ done";
    return `${formatHuman(l.date)} — ${l.dayLabel} (${status})`;
  });

  await ctx.reply(`📜 *Recent Workout History*\n\n${lines.join("\n")}`, { parse_mode: "Markdown" });
}
