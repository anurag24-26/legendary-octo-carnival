import { eq, desc } from "drizzle-orm";
import { db } from "../db.js";
import { photos } from "../schema.js";

export const photoRepository = {
  add(data) {
    return db.insert(photos).values(data).returning().get();
  },

  mostRecent(userId, limit = 3) {
    return db.select().from(photos).where(eq(photos.userId, userId)).orderBy(desc(photos.date)).limit(limit).all();
  },

  mostRecentByType(userId, type) {
    return db
      .select()
      .from(photos)
      .where(eq(photos.userId, userId))
      .orderBy(desc(photos.date))
      .all()
      .find((p) => p.type === type);
  },

  all(userId) {
    return db.select().from(photos).where(eq(photos.userId, userId)).orderBy(desc(photos.date)).all();
  },
};
