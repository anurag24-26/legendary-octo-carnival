import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  BOT_TOKEN: z.string().min(1, "BOT_TOKEN is required"),
  GROQ_API_KEY: z.string().min(1, "GROQ_API_KEY is required"),
  MODEL_NAME: z.string().default("llama-3.3-70b-versatile"),
  GROQ_BASE_URL: z.string().default("https://api.groq.com/openai/v1"),
  TIMEZONE: z.string().default("Asia/Kolkata"),
  DAILY_REPORT_TIME: z.string().default("06:30"),
  PROTEIN_TARGET: z.coerce.number().default(120),
  CALORIE_TARGET: z.coerce.number().default(2400),
  WATER_TARGET: z.coerce.number().default(3.5),
  DATABASE_PATH: z.string().default("./data/fitness.db"),
  LOG_LEVEL: z.string().default("info"),
});

function loadEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("❌ Invalid environment configuration:");
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
  }
  return parsed.data;
}

export const env = loadEnv();
