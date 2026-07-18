import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  telegramId: text("telegram_id").notNull().unique(),
  name: text("name").notNull(),
  gender: text("gender"),
  birthYear: integer("birth_year"),
  heightCm: real("height_cm"),
  weightKg: real("weight_kg"),
  diet: text("diet"),
  trainingType: text("training_type"),
  splitIndex: integer("split_index").notNull().default(0),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const workoutLogs = sqliteTable("workout_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(),
  dayKey: text("day_key").notNull(),
  dayLabel: text("day_label").notNull(),
  completed: integer("completed", { mode: "boolean" }).notNull().default(true),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const sleepLogs = sqliteTable("sleep_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(),
  hours: real("hours").notNull(),
  quality: integer("quality"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const recoveryLogs = sqliteTable("recovery_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(),
  score: real("score").notNull(),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const foodLogs = sqliteTable("food_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(),
  description: text("description").notNull(),
  calories: real("calories").default(0),
  protein: real("protein").default(0),
  fat: real("fat").default(0),
  carbs: real("carbs").default(0),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const proteinLogs = sqliteTable("protein_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(),
  grams: real("grams").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const waterLogs = sqliteTable("water_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(),
  liters: real("liters").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const weightLogs = sqliteTable("weight_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(),
  kg: real("kg").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const waistLogs = sqliteTable("waist_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(),
  cm: real("cm").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const photos = sqliteTable("photos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(),
  type: text("type").notNull(),
  filePath: text("file_path").notNull(),
  aiAnalysis: text("ai_analysis"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const coachNotes = sqliteTable("coach_notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(),
  note: text("note").notNull(),
  source: text("source").notNull().default("ai"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const reports = sqliteTable("reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(),
  date: text("date").notNull(),
  content: text("content").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().unique(),
  proteinTarget: real("protein_target").notNull(),
  calorieTarget: real("calorie_target").notNull(),
  waterTarget: real("water_target").notNull(),
  timezone: text("timezone").notNull(),
  dailyReportTime: text("daily_report_time").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
