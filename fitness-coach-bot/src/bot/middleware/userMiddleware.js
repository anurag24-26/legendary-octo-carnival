import { getOrCreateUser, getSettings } from "../../services/userService.js";

export async function userMiddleware(ctx, next) {
  if (!ctx.from) return next();

  const user = getOrCreateUser(ctx.from.id, ctx.from.first_name);
  ctx.state = ctx.state || {};
  ctx.state.user = user;
  ctx.state.settings = getSettings(user.id);

  return next();
}
