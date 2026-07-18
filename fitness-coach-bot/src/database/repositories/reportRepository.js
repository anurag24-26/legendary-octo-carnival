import { eq, and, desc } from "drizzle-orm";
import { db } from "../db.js";
import { reports } from "../schema.js";

export const reportRepository = {
  save({ userId, type, date, content }) {
    return db
      .insert(reports)
      .values({ userId, type, date, content: JSON.stringify(content) })
      .returning()
      .get();
  },

  findLatestByType(userId, type) {
    const row = db
      .select()
      .from(reports)
      .where(and(eq(reports.userId, userId), eq(reports.type, type)))
      .orderBy(desc(reports.id))
      .get();
    if (!row) return null;
    return { ...row, content: JSON.parse(row.content) };
  },

  all(userId) {
    return db.select().from(reports).where(eq(reports.userId, userId)).orderBy(desc(reports.id)).all();
  },
};
