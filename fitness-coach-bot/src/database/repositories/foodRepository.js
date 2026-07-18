import { eq, and, desc } from "drizzle-orm";
import { db } from "../db.js";
import { foodLogs } from "../schema.js";

export const foodRepository = {
  add(data) {
    return db.insert(foodLogs).values(data).returning().get();
  },

  forDate(userId, date) {
    return db
      .select()
      .from(foodLogs)
      .where(and(eq(foodLogs.userId, userId), eq(foodLogs.date, date)))
      .all();
  },

  all(userId) {
    return db.select().from(foodLogs).where(eq(foodLogs.userId, userId)).orderBy(desc(foodLogs.date)).all();
  },
};
