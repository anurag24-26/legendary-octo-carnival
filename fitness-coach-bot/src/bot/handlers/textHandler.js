import { chatWithCoach } from "../../services/coachService.js";

export async function handleTextMessage(ctx) {
  const { user } = ctx.state;
  const text = ctx.message.text?.trim();
  if (!text) return;

  await ctx.replyWithChatAction("typing");
  const reply = await chatWithCoach(user, text);
  await ctx.reply(reply);
}
