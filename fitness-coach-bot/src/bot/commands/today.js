import { getOwedWorkout } from "../../services/workoutService.js";
import { formatHuman } from "../../utils/dateUtils.js";
import { today as todayStr } from "../../utils/dateUtils.js";

export async function todayCommand(ctx) {
  const { user } = ctx.state;
  const workout = getOwedWorkout(user);

  const exerciseList = workout.exercises.map((e) => `• ${e}`).join("\n");

  await ctx.reply(
    `📅 ${formatHuman(todayStr())}\n\n` +
      `${workout.emoji} *${workout.label}*\n` +
      `Focus: ${workout.focus.join(", ")}\n\n` +
      `${exerciseList}\n\n` +
      `Mark it done with /done, or /skip if you can't train today (nothing gets lost — the schedule shifts).`,
    { parse_mode: "Markdown" }
  );
}
