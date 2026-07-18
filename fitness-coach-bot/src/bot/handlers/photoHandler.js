import { savePhoto } from "../../services/photoService.js";
import { PHOTO_TYPES } from "../../constants/app.js";
import { env } from "../../config/env.js";

export async function handlePhotoMessage(ctx) {
  const { user } = ctx.state;
  const caption = (ctx.message.caption || "").trim().toLowerCase();

  const type = PHOTO_TYPES.find((t) => caption.includes(t));
  if (!type) {
    return ctx.reply(
      `📸 Got the photo, but I need a caption of "front", "side", or "back" to know which angle it is. Please resend with that caption.`
    );
  }

  const photos = ctx.message.photo;
  const largest = photos[photos.length - 1];
  const file = await ctx.api.getFile(largest.file_id);
  const fileUrl = `https://api.telegram.org/file/bot${env.BOT_TOKEN}/${file.file_path}`;

  const response = await fetch(fileUrl);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await savePhoto(user.id, type, buffer);

  await ctx.reply(`✅ ${type} photo saved for today. Use /progress anytime for a tracking summary.`);
}
