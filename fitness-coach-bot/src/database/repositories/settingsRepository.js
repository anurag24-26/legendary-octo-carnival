import { eq } from "drizzle-orm";
import { db } from "../db.js";
import { settings } from "../schema.js";

export const settingsRepository = {
  findByUserId(userId) {
    return db.select().from(settings).where(eq(settings.userId, userId)).get();
  },

  create(data) {
    return db.insert(settings).values(data).returning().get();
  },

  update(userId, data) {
    return db.update(settings).set(data).where(eq(settings.userId, userId)).returning().get();
  },
};
