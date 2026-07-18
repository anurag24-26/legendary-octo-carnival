const HELP_TEXT = `🏋️ *PlacementVault Fitness Coach — Commands*

*Training*
/today — today's owed workout
/done — mark today's workout complete
/skip — skip today (schedule shifts automatically)
/history — recent workout history

*Body Metrics*
/weight <kg> — log bodyweight
/waist <cm> — log waist measurement
/photo — instructions to log a progress photo

*Nutrition*
/food <description> — log a meal (free text, AI estimates macros if omitted)
/protein <grams> — log protein grams
/water <liters> — log water intake

*Recovery*
/sleep <hours> [quality 1-10] — log sleep

*Coaching*
/coach — get an adaptive AI coach note
/progress — physique photo tracking summary
/note <text> — save a personal note
/report — daily / weekly / monthly reports

*Account*
/settings — view or update your targets
/export — export all your data as JSON
/help — show this message

You can also just message me normally to chat with your coach.`;

export async function helpCommand(ctx) {
  await ctx.reply(HELP_TEXT, { parse_mode: "Markdown" });
}
