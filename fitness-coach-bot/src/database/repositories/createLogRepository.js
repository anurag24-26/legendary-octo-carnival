import { eq, and, gte, desc } from "drizzle-orm";
import { db } from "../db.js";

/**
 * Builds a small repository with common operations shared by every
 * "daily metric" table (sleep, recovery, protein, water, weight, waist...).
 */
export function createLogRepository(table) {
  return {
    add(data) {
      return db.insert(table).values(data).returning().get();
    },

    latestForDate(userId, date) {
      return db
        .select()
        .from(table)
        .where(and(eq(table.userId, userId), eq(table.date, date)))
        .orderBy(desc(table.id))
        .get();
    },

    sinceDate(userId, sinceDate) {
      return db
        .select()
        .from(table)
        .where(and(eq(table.userId, userId), gte(table.date, sinceDate)))
        .orderBy(desc(table.date))
        .all();
    },

    mostRecent(userId, limit = 1) {
      return db
        .select()
        .from(table)
        .where(eq(table.userId, userId))
        .orderBy(desc(table.id))
        .limit(limit)
        .all();
    },

    all(userId) {
      return db.select().from(table).where(eq(table.userId, userId)).orderBy(desc(table.date)).all();
    },
  };
}
