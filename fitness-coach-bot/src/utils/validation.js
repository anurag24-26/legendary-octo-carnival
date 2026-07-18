import { z } from "zod";

export const sleepSchema = z.object({
  hours: z.coerce.number().min(0).max(16),
  quality: z.coerce.number().min(1).max(10).optional().default(7),
});

export const foodSchema = z.object({
  description: z.string().min(1),
  calories: z.coerce.number().min(0).optional().default(0),
  protein: z.coerce.number().min(0).optional().default(0),
  fat: z.coerce.number().min(0).optional().default(0),
  carbs: z.coerce.number().min(0).optional().default(0),
});

export const proteinSchema = z.object({
  grams: z.coerce.number().min(0).max(500),
});

export const waterSchema = z.object({
  liters: z.coerce.number().min(0).max(15),
});

export const weightSchema = z.object({
  kg: z.coerce.number().min(20).max(300),
});

export const waistSchema = z.object({
  cm: z.coerce.number().min(30).max(200),
});

export const noteSchema = z.object({
  note: z.string().min(1).max(1000),
});

export function parseOrNull(schema, input) {
  const result = schema.safeParse(input);
  if (!result.success) return null;
  return result.data;
}
