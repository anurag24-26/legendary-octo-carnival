import sharp from "sharp";
import fs from "fs-extra";
import path from "path";
import { photoRepository } from "../database/repositories/photoRepository.js";
import { today } from "../utils/dateUtils.js";
import { askCoach } from "./aiService.js";
import { generateId } from "../utils/id.js";
import { logger } from "../utils/logger.js";

const PHOTOS_DIR = "./photos";

export async function savePhoto(userId, type, buffer) {
  const userDir = path.join(PHOTOS_DIR, String(userId));
  await fs.ensureDir(userDir);

  const filename = `${today()}_${type}_${generateId()}.jpg`;
  const filePath = path.join(userDir, filename);

  await sharp(buffer)
    .rotate()
    .resize({ width: 1080, withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toFile(filePath);

  const stats = await fs.stat(filePath);
  logger.info({ userId, type, sizeKb: Math.round(stats.size / 1024) }, "Photo saved");

  const record = photoRepository.add({
    userId,
    date: today(),
    type,
    filePath,
  });

  return record;
}

/**
 * Text-based progress analysis. Groq's text models can't see the image
 * pixels, so this reasons over the CADENCE of photo submissions and any
 * measurable evidence (waist/weight) as a proxy for visual progress,
 * and asks the AI to phrase a grounded, non-overclaiming update.
 */
export async function generateProgressReport(userId) {
  const allPhotos = photoRepository.all(userId);
  if (allPhotos.length < 2) {
    return "Not enough physique photos yet to generate a comparison. Upload photos consistently (front, side, back) every few weeks with /photo.";
  }

  const grouped = groupByType(allPhotos);
  const summaryLines = Object.entries(grouped).map(([type, photos]) => {
    return `${type}: ${photos.length} photos, most recent on ${photos[0].date}, earliest on ${
      photos[photos.length - 1].date
    }`;
  });

  const prompt = `Physique photo log summary:
${summaryLines.join("\n")}

Write a brief, honest note (3-4 sentences) about tracking consistency and what to
watch for in the next comparison (shoulders, upper chest, back width, posture, V-taper).
Do not claim to see specific visual changes you have no data for — only comment on
tracking cadence and what to focus on next, grounded in the priorities: shoulders,
upper chest, back, arms, body fat, posture.`;

  const analysis = await askCoach([{ role: "user", content: prompt }], { maxTokens: 250 });
  return analysis;
}

function groupByType(photos) {
  return photos.reduce((acc, p) => {
    acc[p.type] = acc[p.type] || [];
    acc[p.type].push(p);
    return acc;
  }, {});
}
