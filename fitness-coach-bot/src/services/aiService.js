import OpenAI from "openai";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { buildSystemPrompt } from "../prompts/systemPrompt.js";
import { USER_PROFILE } from "../constants/foods.js";

const client = new OpenAI({
  apiKey: env.GROQ_API_KEY,
  baseURL: env.GROQ_BASE_URL,
});

const SYSTEM_PROMPT = buildSystemPrompt(USER_PROFILE);

/**
 * Sends a chat completion request to Groq.
 * @param {Array<{role: string, content: string}>} messages
 * @param {object} options
 */
export async function askCoach(messages, options = {}) {
  try {
    const response = await client.chat.completions.create({
      model: options.model || env.MODEL_NAME,
      temperature: options.temperature ?? 0.6,
      max_tokens: options.maxTokens ?? 800,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    });

    return response.choices[0]?.message?.content?.trim() ?? "";
  } catch (error) {
    logger.error({ err: error }, "AI service request failed");
    throw new Error("The AI coach is temporarily unavailable. Please try again shortly.");
  }
}

export async function askCoachJSON(messages, options = {}) {
  const raw = await askCoach(
    [
      ...messages,
      {
        role: "system",
        content: "Respond ONLY with valid JSON. No markdown, no commentary, no code fences.",
      },
    ],
    options
  );

  const cleaned = raw.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (error) {
    logger.warn({ raw }, "Failed to parse AI JSON response");
    return null;
  }
}
