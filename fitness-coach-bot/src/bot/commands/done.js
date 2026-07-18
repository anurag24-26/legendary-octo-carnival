import { completeWorkout, getStreak } from "../../services/workoutService.js";

export async function doneCommand(ctx) {
  const { user } = ctx.state;
  const notes = ctx.match?.trim() || null;

  const { workout } = completeWorkout(user, notes);
  const streak = getStreak(user.id);

  await ctx.reply(
    `✅ Logged: ${workout.emoji} ${workout.label}\n` +
      `🔥 Current streak: ${streak} day${streak === 1 ? "" : "s"}\n\n` +
      `Next up: check /today tomorrow.`
  );
}
