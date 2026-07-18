import { coachNoteRepository } from "../../database/repositories/coachNoteRepository.js";
import { noteSchema, parseOrNull } from "../../utils/validation.js";
import { today } from "../../utils/dateUtils.js";
import { NOTE_SOURCE } from "../../constants/app.js";

export async function noteCommand(ctx) {
  const { user } = ctx.state;
  const raw = (ctx.match || "").trim();

  if (!raw) return ctx.reply("Usage: /note <your note>");

  const parsed = parseOrNull(noteSchema, { note: raw });
  if (!parsed) return ctx.reply("Note is too long or empty.");

  coachNoteRepository.add({ userId: user.id, date: today(), note: parsed.note, source: NOTE_SOURCE.USER });

  await ctx.reply("📝 Note saved.");
}
