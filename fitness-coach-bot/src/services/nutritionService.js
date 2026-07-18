import { foodRepository } from "../database/repositories/foodRepository.js";
import { proteinRepository } from "../database/repositories/logRepositories.js";
import { waterRepository } from "../database/repositories/logRepositories.js";
import { today } from "../utils/dateUtils.js";
import { askCoach } from "./aiService.js";
import { DAILY_FOODS, OCCASIONAL_FOODS } from "../constants/foods.js";

export function getDailyNutritionTotals(userId, date = today()) {
  const foods = foodRepository.forDate(userId, date);
  const proteinEntries = proteinRepository.sinceDate(userId, date);
  const waterEntries = waterRepository.sinceDate(userId, date);

  const foodTotals = foods.reduce(
    (acc, f) => ({
      calories: acc.calories + (f.calories || 0),
      protein: acc.protein + (f.protein || 0),
      fat: acc.fat + (f.fat || 0),
      carbs: acc.carbs + (f.carbs || 0),
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );

  const loggedProtein = proteinEntries
    .filter((p) => p.date === date)
    .reduce((sum, p) => sum + p.grams, 0);

  const loggedWater = waterEntries
    .filter((w) => w.date === date)
    .reduce((sum, w) => sum + w.liters, 0);

  return {
    calories: Math.round(foodTotals.calories),
    protein: Math.round(foodTotals.protein + loggedProtein),
    fat: Math.round(foodTotals.fat),
    carbs: Math.round(foodTotals.carbs),
    water: Math.round(loggedWater * 10) / 10,
    foodEntries: foods,
  };
}

export async function generateMealPlan({ proteinTarget, calorieTarget }) {
  const dailyList = DAILY_FOODS.map((f) => f.name).join(", ");
  const occasionalList = OCCASIONAL_FOODS.map((f) => f.name).join(", ");

  const prompt = `Build a vegetarian, high-protein meal plan for one day.
Daily target: ~${calorieTarget} kcal, ~${proteinTarget}g protein.
Foods available every day: ${dailyList}.
Foods available occasionally (use sparingly, 2-3x/week): ${occasionalList}.
Keep it realistic for a home cook with basic kitchen access. Structure it as
Breakfast / Lunch / Snack / Dinner with approximate protein and calories per meal,
then a one-line total. Keep the whole response under 200 words.`;

  return askCoach([{ role: "user", content: prompt }], { maxTokens: 500 });
}
