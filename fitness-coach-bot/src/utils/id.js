import { nanoid } from "nanoid";

export function generateId(prefix = "") {
  const id = nanoid(10);
  return prefix ? `${prefix}_${id}` : id;
}
