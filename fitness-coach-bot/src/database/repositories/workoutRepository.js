import { eq, and, desc, gte } from "drizzle-orm";
import { db } from "../db.js";
import { workoutLogs } from "../schema.js";

export const workoutRepository = {
  logCompletion({ userId, date, dayKey, dayLabel, notes }) {
    return db
      .insert(workoutLogs)
      .values({ userId, date, dayKey, dayLabel, completed: true, notes })
      .returning()
      .get();
  },

  findForDate(userId, date) {
    return db
      .select()
      .from(workoutLogs)
      .where(and(eq(workoutLogs.userId, userId), eq(workoutLogs.date, date)))
      .get();
  },

  mostRecent(userId, limit = 10) {
    return db
      .select()
      .from(workoutLogs)
      .where(eq(workoutLogs.userId, userId))
      .orderBy(desc(workoutLogs.date))
      .limit(limit)
      .all();
  },

  sinceDate(userId, sinceDate) {
    return db
      .select()
      .from(workoutLogs)
      .where(and(eq(workoutLogs.userId, userId), gte(workoutLogs.date, sinceDate)))
      .orderBy(desc(workoutLogs.date))
      .all();
  },

  all(userId) {
    return db.select().from(workoutLogs).where(eq(workoutLogs.userId, userId)).orderBy(desc(workoutLogs.date)).all();
  },
};
