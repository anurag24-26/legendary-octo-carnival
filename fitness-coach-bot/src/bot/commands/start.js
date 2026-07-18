export async function startCommand(ctx) {
  const { user } = ctx.state;
  await ctx.reply(
    `👋 Welcome back, ${user.name}.\n\n` +
      `I'm your AI physique coach — built around your goals: wider shoulders, upper chest, ` +
      `bigger arms, better posture, lower body fat, and a stronger V-taper.\n\n` +
      `Send /help to see everything I can track for you, or /today to see what's on the plan.`
  );
}
