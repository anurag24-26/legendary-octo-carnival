import { eq, desc } from "drizzle-orm";
import { db } from "../db.js";
import { coachNotes } from "../schema.js";

export const coachNoteRepository = {
  add(data) {
    return db.insert(coachNotes).values(data).returning().get();
  },

  mostRecent(userId, limit = 10) {
    return db
      .select()
      .from(coachNotes)
      .where(eq(coachNotes.userId, userId))
      .orderBy(desc(coachNotes.id))
      .limit(limit)
      .all();
  },

  all(userId) {
    return db.select().from(coachNotes).where(eq(coachNotes.userId, userId)).orderBy(desc(coachNotes.id)).all();
  },
};
