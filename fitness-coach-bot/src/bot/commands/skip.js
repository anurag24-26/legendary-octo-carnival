import { skipWorkout } from "../../services/workoutService.js";

export async function skipCommand(ctx) {
  const { user } = ctx.state;
  const reason = ctx.match?.trim() || null;

  const { workout } = skipWorkout(user, reason);

  await ctx.reply(
    `⏭ ${workout.label} skipped for today. No muscle group gets permanently dropped — ` +
      `it'll be waiting for you next time you train. Check /today whenever you're ready.`
  );
}
