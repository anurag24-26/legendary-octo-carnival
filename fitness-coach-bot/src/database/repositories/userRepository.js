import { eq } from "drizzle-orm";
import { db } from "../db.js";
import { users } from "../schema.js";

export const userRepository = {
  findByTelegramId(telegramId) {
    return db.select().from(users).where(eq(users.telegramId, String(telegramId))).get();
  },

  findById(id) {
    return db.select().from(users).where(eq(users.id, id)).get();
  },

  create(data) {
    return db.insert(users).values(data).returning().get();
  },

  update(id, data) {
    return db.update(users).set(data).where(eq(users.id, id)).returning().get();
  },

  advanceSplitIndex(id, nextIndex) {
    return db.update(users).set({ splitIndex: nextIndex }).where(eq(users.id, id)).returning().get();
  },

  all() {
    return db.select().from(users).all();
  },
};
