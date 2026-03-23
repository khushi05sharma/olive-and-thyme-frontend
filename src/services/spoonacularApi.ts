import { type Recipe } from "../types/recipe";

// ─── PART 1: CONFIG ───────────────────────────────────────────
const API_KEY = import.meta.env.VITE_SPOONACULAR_KEY;
const BASE_URL = "https://api.spoonacular.com";

// ─── PART 2: SPOONACULAR DATA SHAPES ──────────────────────────
interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  instructions: string;
  cuisines: string[];
  dishTypes: string[];
  diets: string[];
  extendedIngredients: { original: string }[];
  aggregateLikes: number;
}

interface SpoonacularListResponse {
  results: SpoonacularRecipe[];
  totalResults: number;
}

// ─── PART 3: MAPPINGS ───────────────

const healthGoalToDiet: Record<string, string> = {
  "Heart Healthy": "heart healthy",
  "Diabetic Friendly": "diabetic",
  "High Protein": "high protein",
  "Low Sodium": "low sodium",
  "Low Carb": "low carb",
  "Anti-Inflammatory": "anti inflammatory",
  "Gut Friendly": "fodmap friendly",
  "Weight Management": "whole30",
  "Kidney Friendly": "low potassium",
  "Immune Boosting": "immune supporting",
};

const dishTypeToMealType: Record<string, Recipe["mealType"]> = {
  "morning meal": "Breakfast",
  brunch: "Breakfast",
  breakfast: "Breakfast",
  lunch: "Lunch",
  salad: "Lunch",
  soup: "Lunch",
  "main course": "Dinner",
  "main dish": "Dinner",
  dinner: "Dinner",
  "side dish": "Dinner",
  antipasti: "Dinner",
  starter: "Dinner",
  appetizer: "Dinner",
  snack: "Snacks",
  fingerfood: "Snacks",
  dessert: "Dessert",
  beverage: "Drinks",
  drink: "Drinks",
  cocktail: "Drinks",
};

const mealTypeToApiType: Record<string, string> = {
  Breakfast: "morning meal",
  Lunch: "lunch",
  Dinner: "main course",
  Snacks: "snack",
  Dessert: "dessert",
  Drinks: "beverage",
};

// ─── PART 4: CONVERTER ────────────────────────────────────────
function toRecipe(s: SpoonacularRecipe): Recipe {
  return {
    id: String(s.id),
    title: s.title,
    description: s.summary
      ? s.summary.replace(/<[^>]*>/g, "").slice(0, 200) + "..."
      : "A delicious recipe worth trying.",
    image: s.image ?? "",
    cookingTime: s.readyInMinutes ?? 30,
    servings: s.servings ?? 2,
    difficulty:
      (s.readyInMinutes ?? 30) <= 20
        ? "Easy"
        : (s.readyInMinutes ?? 30) <= 45
          ? "Medium"
          : "Hard",
    cuisine: s.cuisines?.[0] ?? "International",
    mealType: dishTypeToMealType[s.dishTypes?.[0] ?? ""] ?? "Dinner",
    diet: (s.diets ?? []).map((d) => d.charAt(0).toUpperCase() + d.slice(1)),
    ingredients: (s.extendedIngredients ?? []).map((i) => i.original),
    instructions: s.instructions
      ? s.instructions
          .replace(/<[^>]*>/g, "")
          .split(". ")
          .filter(Boolean)
      : ["See full recipe for instructions."],
    likes: s.aggregateLikes ?? 0,
    isLiked: false,
    isSaved: false,
  };
}

// ─── PART 5: FUNCTIONS ────────────────────────────────────────

export async function fetchRecipes(
  query: string = "healthy",
  healthGoals: string[] = [],
  mealType: string = "",
  cuisine: string = "",
  diet: string = "",
): Promise<Recipe[]> {
  const url = new URL(`${BASE_URL}/recipes/complexSearch`);
  url.searchParams.set("query", query);
  url.searchParams.set("number", "8");
  url.searchParams.set("addRecipeInformation", "true");
  url.searchParams.set("apiKey", API_KEY);

  // use mealTypeToApiType mapping, not raw lowercase
  if (mealType) {
    const apiType = mealTypeToApiType[mealType];
    if (apiType) url.searchParams.set("type", apiType);
  }

  if (cuisine) url.searchParams.set("cuisine", cuisine.toLowerCase());
  if (diet) url.searchParams.set("diet", diet.toLowerCase());

  const goalTag = healthGoals
    .map((g) => healthGoalToDiet[g])
    .filter(Boolean)
    .join(",");

  if (goalTag) {
    const existing = url.searchParams.get("diet");
    url.searchParams.set("diet", existing ? `${existing},${goalTag}` : goalTag);
  }

  const response = await fetch(url.toString());

  if (response.status === 402 || response.status === 429) {
    console.warn("API limit hit — try again tomorrow");
    return [];
  }
  if (!response.ok) {
    console.error("API error:", response.status);
    return [];
  }

  const data: SpoonacularListResponse = await response.json();
  return data.results.map(toRecipe);
}

export async function fetchTrendingRecipes(): Promise<Recipe[]> {
  const url = new URL(`${BASE_URL}/recipes/complexSearch`);
  url.searchParams.set("query", "popular");
  url.searchParams.set("sort", "popularity");
  url.searchParams.set("number", "4");
  url.searchParams.set("addRecipeInformation", "true");
  url.searchParams.set("apiKey", API_KEY);

  const response = await fetch(url.toString());

  if (response.status === 402 || response.status === 429) {
    console.warn("API limit hit — trending unavailable");
    return [];
  }
  if (!response.ok) throw new Error(`API error: ${response.status}`);

  const data: SpoonacularListResponse = await response.json();
  return data.results.map(toRecipe);
}

export async function fetchRecipeById(id: string): Promise<Recipe> {
  const url = `${BASE_URL}/recipes/${id}/information?apiKey=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) throw new Error(`API error: ${response.status}`);

  const data: SpoonacularRecipe = await response.json();
  return toRecipe(data);
}

export async function searchRecipes(query: string): Promise<Recipe[]> {
  return fetchRecipes(query);
}
