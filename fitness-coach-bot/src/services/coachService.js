import { sleepRepository, weightRepository, waistRepository } from "../database/repositories/logRepositories.js";
import { workoutRepository } from "../database/repositories/workoutRepository.js";
import { coachNoteRepository } from "../database/repositories/coachNoteRepository.js";
import { askCoach } from "./aiService.js";
import { getDailyNutritionTotals } from "./nutritionService.js";
import { today, daysAgo } from "../utils/dateUtils.js";
import { SLEEP_THRESHOLD_HOURS } from "../constants/app.js";
import { NOTE_SOURCE } from "../constants/app.js";

/**
 * Pure rule-based evidence gathering. No AI here — this produces the
 * factual signals the AI is later asked to reason about, so the model
 * never has to invent trends on its own.
 */
export function gatherEvidence(userId) {
  const sinceWeek = daysAgo(7);

  const sleepEntries = sleepRepository.sinceDate(userId, sinceWeek);
  const avgSleep = average(sleepEntries.map((s) => s.hours));

  const weightEntries = weightRepository.sinceDate(userId, daysAgo(30));
  const waistEntries = waistRepository.sinceDate(userId, daysAgo(30));

  const waistTrend = trendDirection(waistEntries.map((w) => w.cm).reverse());
  const weightTrend = trendDirection(weightEntries.map((w) => w.kg).reverse());

  const recentWorkouts = workoutRepository.sinceDate(userId, sinceWeek);
  const completedThisWeek = recentWorkouts.filter((w) => !w.notes?.startsWith("SKIPPED")).length;

  const nutrition = getDailyNutritionTotals(userId, today());

  return {
    avgSleepLast7Days: avgSleep,
    sleepBelowThreshold: avgSleep !== null && avgSleep < SLEEP_THRESHOLD_HOURS,
    waistTrend,
    weightTrend,
    workoutsCompletedLast7Days: completedThisWeek,
    todayCalories: nutrition.calories,
    todayProtein: nutrition.protein,
  };
}

export function average(arr) {
  const vals = arr.filter((v) => typeof v === "number" && !Number.isNaN(v));
  if (vals.length === 0) return null;
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}

function trendDirection(values) {
  if (values.length < 2) return "insufficient_data";
  const first = values[0];
  const last = values[values.length - 1];
  const delta = last - first;
  if (Math.abs(delta) < 0.3) return "stable";
  return delta > 0 ? "increasing" : "decreasing";
}

/**
 * Produces a short adaptive coaching note grounded in the evidence object.
 * Persists it to coach_notes and returns the text.
 */
export async function generateCoachNote(user) {
  const evidence = gatherEvidence(user.id);

  const prompt = `Here is this week's evidence for ${user.name}:
- Average sleep (last 7 days): ${evidence.avgSleepLast7Days ?? "no data"} hours
- Workouts completed (last 7 days): ${evidence.workoutsCompletedLast7Days}
- Waist trend (last 30 days): ${evidence.waistTrend}
- Bodyweight trend (last 30 days): ${evidence.weightTrend}
- Today's logged calories: ${evidence.todayCalories}
- Today's logged protein: ${evidence.todayProtein}g

Give a short (3-5 sentence) coach note. Apply these adaptive rules where relevant:
- If sleep is consistently under ${SLEEP_THRESHOLD_HOURS}h, recommend reducing workout volume.
- If waist is decreasing, acknowledge genuine fat loss progress.
- If waist is increasing, flag a likely calorie surplus.
- If workouts are consistent and recovery looks fine, suggest a small progressive overload step.
- If there is insufficient data for a signal, say so plainly instead of guessing.
Do not fabricate numbers not given above.`;

  const note = await askCoach([{ role: "user", content: prompt }], { maxTokens: 300 });

  coachNoteRepository.add({
    userId: user.id,
    date: today(),
    note,
    source: NOTE_SOURCE.AI,
  });

  return note;
}

export async function chatWithCoach(user, userMessage) {
  const evidence = gatherEvidence(user.id);
  const recentNotes = coachNoteRepository.mostRecent(user.id, 3);

  const context = `Recent evidence: avg sleep ${evidence.avgSleepLast7Days ?? "n/a"}h,
workouts last 7 days: ${evidence.workoutsCompletedLast7Days}, waist trend: ${evidence.waistTrend},
weight trend: ${evidence.weightTrend}. Recent coach notes: ${recentNotes.map((n) => n.note).join(" | ") || "none"}.`;

  return askCoach([
    { role: "system", content: context },
    { role: "user", content: userMessage },
  ]);
}
