import { userRepository } from "../database/repositories/userRepository.js";
import { settingsRepository } from "../database/repositories/settingsRepository.js";
import { env } from "../config/env.js";
import { USER_PROFILE } from "../constants/foods.js";

export function getOrCreateUser(telegramId, telegramName) {
  let user = userRepository.findByTelegramId(telegramId);
  if (user) return user;

  user = userRepository.create({
    telegramId: String(telegramId),
    name: USER_PROFILE.name || telegramName || "Athlete",
    gender: USER_PROFILE.gender,
    birthYear: USER_PROFILE.birthYear,
    heightCm: USER_PROFILE.heightCm,
    weightKg: USER_PROFILE.weightKg,
    diet: USER_PROFILE.diet,
    trainingType: USER_PROFILE.trainingType,
    splitIndex: 0,
  });

  settingsRepository.create({
    userId: user.id,
    proteinTarget: env.PROTEIN_TARGET,
    calorieTarget: env.CALORIE_TARGET,
    waterTarget: env.WATER_TARGET,
    timezone: env.TIMEZONE,
    dailyReportTime: env.DAILY_REPORT_TIME,
  });

  return user;
}

export function getSettings(userId) {
  let s = settingsRepository.findByUserId(userId);
  if (!s) {
    s = settingsRepository.create({
      userId,
      proteinTarget: env.PROTEIN_TARGET,
      calorieTarget: env.CALORIE_TARGET,
      waterTarget: env.WATER_TARGET,
      timezone: env.TIMEZONE,
      dailyReportTime: env.DAILY_REPORT_TIME,
    });
  }
  return s;
}
