import { foodRepository } from "../../database/repositories/foodRepository.js";
import { today } from "../../utils/dateUtils.js";
import { askCoachJSON } from "../../services/aiService.js";

export async function foodCommand(ctx) {
  const { user } = ctx.state;
  const description = (ctx.match || "").trim();

  if (!description) {
    return ctx.reply("Usage: /food <what you ate>\nExample: /food 2 roti, dal, curd bowl");
  }

  await ctx.reply("🧮 Estimating macros...");

  const estimate = await askCoachJSON([
    {
      role: "user",
      content: `Estimate calories, protein (g), fat (g), and carbs (g) for this vegetarian meal: "${description}".
Reply as JSON: {"calories": number, "protein": number, "fat": number, "carbs": number}`,
    },
  ]);

  const macros = estimate || { calories: 0, protein: 0, fat: 0, carbs: 0 };

  foodRepository.add({
    userId: user.id,
    date: today(),
    description,
    calories: macros.calories || 0,
    protein: macros.protein || 0,
    fat: macros.fat || 0,
    carbs: macros.carbs || 0,
  });

  await ctx.reply(
    `🍽 Logged: ${description}\n` +
      `~${Math.round(macros.calories || 0)} kcal · ${Math.round(macros.protein || 0)}g protein · ` +
      `${Math.round(macros.fat || 0)}g fat · ${Math.round(macros.carbs || 0)}g carbs`
  );
}
