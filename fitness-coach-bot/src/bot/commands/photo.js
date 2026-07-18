import { PHOTO_TYPES } from "../../constants/app.js";

export async function photoCommand(ctx) {
  await ctx.reply(
    `📸 Send a photo now with a caption of "front", "side", or "back" (${PHOTO_TYPES.join(
      " / "
    )}).\n\nExample: attach a photo and caption it "front".`
  );
}
