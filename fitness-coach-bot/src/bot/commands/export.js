import fs from "fs-extra";
import path from "path";
import { InputFile } from "grammy";
import { workoutRepository } from "../../database/repositories/workoutRepository.js";
import { foodRepository } from "../../database/repositories/foodRepository.js";
import { photoRepository } from "../../database/repositories/photoRepository.js";
import { coachNoteRepository } from "../../database/repositories/coachNoteRepository.js";
import { reportRepository } from "../../database/repositories/reportRepository.js";
import {
  sleepRepository,
  recoveryRepository,
  proteinRepository,
  waterRepository,
  weightRepository,
  waistRepository,
} from "../../database/repositories/logRepositories.js";
import { generateId } from "../../utils/id.js";

export async function exportCommand(ctx) {
  const { user, settings } = ctx.state;

  const data = {
    exportedAt: new Date().toISOString(),
    user,
    settings,
    workouts: workoutRepository.all(user.id),
    sleep: sleepRepository.all(user.id),
    recovery: recoveryRepository.all(user.id),
    food: foodRepository.all(user.id),
    protein: proteinRepository.all(user.id),
    water: waterRepository.all(user.id),
    weight: weightRepository.all(user.id),
    waist: waistRepository.all(user.id),
    photos: photoRepository.all(user.id),
    coachNotes: coachNoteRepository.all(user.id),
    reports: reportRepository.all(user.id),
  };

  const tmpDir = "./data/exports";
  await fs.ensureDir(tmpDir);
  const filePath = path.join(tmpDir, `export_${user.id}_${generateId()}.json`);
  await fs.writeJson(filePath, data, { spaces: 2 });

  await ctx.replyWithDocument(new InputFile(filePath), {
    caption: "📦 Your full data export.",
  });

  await fs.remove(filePath);
}
