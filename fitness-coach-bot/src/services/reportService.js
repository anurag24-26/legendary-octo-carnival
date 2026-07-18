import { workoutRepository } from "../database/repositories/workoutRepository.js";
import { sleepRepository, weightRepository, waistRepository, waterRepository, proteinRepository } from "../database/repositories/logRepositories.js";
import { reportRepository } from "../database/repositories/reportRepository.js";
import { getDailyNutritionTotals } from "./nutritionService.js";
import { getOwedWorkout, getStreak } from "./workoutService.js";
import { average } from "./coachService.js";
import { today, daysAgo, startOfWeek, startOfMonth, formatHuman } from "../utils/dateUtils.js";
import { REPORT_TYPES } from "../constants/app.js";

export function buildDailyReport(user, settings) {
  const nutrition = getDailyNutritionTotals(user.id, today());
  const workout = getOwedWorkout(user);
  const streak = getStreak(user.id);
  const sleepToday = sleepRepository.latestForDate(user.id, today());
  const recoveryScore = sleepToday ? Math.min(10, Math.round((sleepToday.hours / 8) * 10)) : null;

  return {
    date: today(),
    dateHuman: formatHuman(today()),
    workout: { emoji: workout.emoji, label: workout.label, exercises: workout.exercises },
    cardio: workout.key === "fatloss_core" ? "Included in today's session" : "Optional 15-20min brisk walk",
    nutrition,
    targets: {
      protein: settings.proteinTarget,
      calories: settings.calorieTarget,
      water: settings.waterTarget,
    },
    sleepGoalHours: 7,
    recoveryScore,
    streak,
  };
}

export function buildWeeklyReport(user) {
  const since = daysAgo(7);
  const workouts = workoutRepository.sinceDate(user.id, since);
  const completed = workouts.filter((w) => !w.notes?.startsWith("SKIPPED"));
  const sleepEntries = sleepRepository.sinceDate(user.id, since);
  const proteinEntries = proteinRepository.sinceDate(user.id, since);
  const waterEntries = waterRepository.sinceDate(user.id, since);
  const weightEntries = weightRepository.sinceDate(user.id, since);
  const waistEntries = waistRepository.sinceDate(user.id, since);

  return {
    periodStart: since,
    periodEnd: today(),
    workoutsCompleted: completed.length,
    workoutsSkipped: workouts.length - completed.length,
    avgSleep: average(sleepEntries.map((s) => s.hours)),
    avgProtein: average(proteinEntries.map((p) => p.grams)),
    avgWater: average(waterEntries.map((w) => w.liters)),
    weightChange: deltaOf(weightEntries.map((w) => w.kg)),
    waistChange: deltaOf(waistEntries.map((w) => w.cm)),
  };
}

export function buildMonthlyReport(user) {
  const since = daysAgo(30);
  const workouts = workoutRepository.sinceDate(user.id, since);
  const completed = workouts.filter((w) => !w.notes?.startsWith("SKIPPED"));
  const weightEntries = weightRepository.sinceDate(user.id, since);
  const waistEntries = waistRepository.sinceDate(user.id, since);

  return {
    periodStart: since,
    periodEnd: today(),
    workoutsCompleted: completed.length,
    weightChange: deltaOf(weightEntries.map((w) => w.kg)),
    waistChange: deltaOf(waistEntries.map((w) => w.cm)),
  };
}

export function persistReport(userId, type, content) {
  return reportRepository.save({ userId, type, date: today(), content });
}

function deltaOf(values) {
  if (values.length < 2) return null;
  const ordered = [...values].reverse();
  return Math.round((ordered[ordered.length - 1] - ordered[0]) * 10) / 10;
}

export { REPORT_TYPES };
