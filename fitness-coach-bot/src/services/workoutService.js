import { getWorkoutByIndex, WORKOUT_SPLIT } from "../constants/workoutSplit.js";
import { workoutRepository } from "../database/repositories/workoutRepository.js";
import { userRepository } from "../database/repositories/userRepository.js";
import { today, daysAgo } from "../utils/dateUtils.js";

/** Returns the workout the user currently owes (does not mutate state). */
export function getOwedWorkout(user) {
  return getWorkoutByIndex(user.splitIndex);
}

/**
 * Marks today's owed workout as done, logs it, and advances the split cursor.
 * Because the cursor only moves forward on completion, any previously skipped
 * day is naturally "caught up" the next time the user trains.
 */
export function completeWorkout(user, notes = null) {
  const workout = getOwedWorkout(user);
  const log = workoutRepository.logCompletion({
    userId: user.id,
    date: today(),
    dayKey: workout.key,
    dayLabel: workout.label,
    notes,
  });

  const nextIndex = (user.splitIndex + 1) % WORKOUT_SPLIT.length;
  const updatedUser = userRepository.advanceSplitIndex(user.id, nextIndex);

  return { log, workout, user: updatedUser };
}

/**
 * Explicitly skips today without advancing the cursor — tomorrow's /today
 * will show the SAME owed workout, which is how the whole week shifts.
 */
export function skipWorkout(user, reason = null) {
  const workout = getOwedWorkout(user);
  const log = workoutRepository.logCompletion({
    userId: user.id,
    date: today(),
    dayKey: workout.key,
    dayLabel: workout.label,
    notes: reason ? `SKIPPED: ${reason}` : "SKIPPED",
  });
  // splitIndex intentionally NOT advanced
  return { log, workout };
}

export function getStreak(userId) {
  const recentLogs = workoutRepository.mostRecent(userId, 90);
  const completedDates = new Set(
    recentLogs.filter((l) => l.completed && !l.notes?.startsWith("SKIPPED")).map((l) => l.date)
  );

  let streak = 0;
  let cursor = today();
  // A rest/recovery day shouldn't break the streak; we simply count
  // consecutive calendar days where the user did not go fully dark.
  while (completedDates.has(cursor)) {
    streak += 1;
    cursor = daysAgo(streak);
  }
  return streak;
}

export function daysSinceLastWorkout(userId) {
  const recent = workoutRepository.mostRecent(userId, 1);
  if (recent.length === 0) return null;
  const last = recent[0].date;
  const diff = Math.floor((new Date(today()) - new Date(last)) / (1000 * 60 * 60 * 24));
  return diff;
}
