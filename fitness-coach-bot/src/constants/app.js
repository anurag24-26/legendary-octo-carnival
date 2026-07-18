export const PHOTO_TYPES = ["front", "side", "back"];

export const REPORT_TYPES = {
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
};

export const NOTE_SOURCE = {
  USER: "user",
  AI: "ai",
};

export const ALERT_TYPES = {
  WORKOUT_MISSED: "workout_missed",
  PROTEIN_LOW: "protein_low",
  SLEEP_LOW: "sleep_low",
  NO_WORKOUT_2_DAYS: "no_workout_2_days",
  WEIGHT_STALE: "weight_stale",
  WAIST_STALE: "waist_stale",
  NO_PHOTOS_30_DAYS: "no_photos_30_days",
  WEEKLY_SUMMARY: "weekly_summary",
  MONTHLY_SUMMARY: "monthly_summary",
  STREAK_MILESTONE: "streak_milestone",
  PERSONAL_BEST: "personal_best",
  RECOVERY_WARNING: "recovery_warning",
};

export const SLEEP_THRESHOLD_HOURS = 6;
export const RECOVERY_WARNING_SCORE = 4; // out of 10
export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100];
export const STALE_DAYS_WEIGHT = 5;
export const STALE_DAYS_WAIST = 7;
export const STALE_DAYS_PHOTOS = 30;
export const NO_WORKOUT_ALERT_DAYS = 2;
