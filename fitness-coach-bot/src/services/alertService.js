import { sleepRepository, weightRepository, waistRepository, proteinRepository } from "../database/repositories/logRepositories.js";
import { photoRepository } from "../database/repositories/photoRepository.js";
import { daysSinceLastWorkout, getStreak } from "./workoutService.js";
import { today, daysAgo } from "../utils/dateUtils.js";
import { average } from "./coachService.js";
import {
  ALERT_TYPES,
  SLEEP_THRESHOLD_HOURS,
  NO_WORKOUT_ALERT_DAYS,
  STALE_DAYS_WEIGHT,
  STALE_DAYS_WAIST,
  STALE_DAYS_PHOTOS,
  STREAK_MILESTONES,
} from "../constants/app.js";

/** Returns an array of { type, message } alerts currently applicable for a user. */
export function checkAlerts(user, settings) {
  const alerts = [];

  const daysSinceWorkout = daysSinceLastWorkout(user.id);
  if (daysSinceWorkout !== null && daysSinceWorkout >= NO_WORKOUT_ALERT_DAYS) {
    alerts.push({
      type: ALERT_TYPES.NO_WORKOUT_2_DAYS,
      message: `⚠ No workout logged in ${daysSinceWorkout} days. Let's get back on track today.`,
    });
  }

  const sleepEntries = sleepRepository.sinceDate(user.id, daysAgo(7));
  const avgSleep = average(sleepEntries.map((s) => s.hours));
  if (avgSleep !== null && avgSleep < SLEEP_THRESHOLD_HOURS) {
    alerts.push({
      type: ALERT_TYPES.SLEEP_LOW,
      message: `⚠ Average sleep this week is ${avgSleep}h, below the ${SLEEP_THRESHOLD_HOURS}h target. Recovery may be compromised.`,
    });
  }

  const proteinEntries = proteinRepository.sinceDate(user.id, today());
  const todayProtein = proteinEntries.filter((p) => p.date === today()).reduce((s, p) => s + p.grams, 0);
  if (settings && todayProtein > 0 && todayProtein < settings.proteinTarget * 0.6) {
    alerts.push({
      type: ALERT_TYPES.PROTEIN_LOW,
      message: `⚠ Protein today (${todayProtein}g) is well below your ${settings.proteinTarget}g target.`,
    });
  }

  const lastWeight = weightRepository.mostRecent(user.id, 1)[0];
  if (!lastWeight || daysSince(lastWeight.date) >= STALE_DAYS_WEIGHT) {
    alerts.push({
      type: ALERT_TYPES.WEIGHT_STALE,
      message: `⚠ Weight hasn't been logged in ${lastWeight ? daysSince(lastWeight.date) : "a while"} days. Log it with /weight.`,
    });
  }

  const lastWaist = waistRepository.mostRecent(user.id, 1)[0];
  if (!lastWaist || daysSince(lastWaist.date) >= STALE_DAYS_WAIST) {
    alerts.push({
      type: ALERT_TYPES.WAIST_STALE,
      message: `⚠ Waist hasn't been logged in ${lastWaist ? daysSince(lastWaist.date) : "a while"} days. Log it with /waist.`,
    });
  }

  const photos = photoRepository.mostRecent(user.id, 1);
  if (photos.length === 0 || daysSince(photos[0].date) >= STALE_DAYS_PHOTOS) {
    alerts.push({
      type: ALERT_TYPES.NO_PHOTOS_30_DAYS,
      message: `📸 No physique photos in over ${STALE_DAYS_PHOTOS} days. Upload with /photo to track visual progress.`,
    });
  }

  const streak = getStreak(user.id);
  if (STREAK_MILESTONES.includes(streak)) {
    alerts.push({
      type: ALERT_TYPES.STREAK_MILESTONE,
      message: `🔥 ${streak}-day streak! Consistency is what actually builds the physique you want.`,
    });
  }

  return alerts;
}

function daysSince(dateStr) {
  return Math.floor((new Date(today()) - new Date(dateStr)) / (1000 * 60 * 60 * 24));
}
