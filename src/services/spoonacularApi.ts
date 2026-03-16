import { type Recipe } from "../types/recipe";

const API_KEY = import.meta.env.VITE_SPOONACULAR_KEY;
const BASE_URL = "https://api.spoonacular.com";

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

function toRecipe(s: SpoonacularRecipe): Recipe {
  return {
    id: String(s.id),
    title: s.title,
    image: s.image,
    cookingTime: s.readyInMinutes,
    servings: s.servings,
    description: s.summary.replace(/<[^>]+>/g, "").slice(0, 200) + "...",
    difficulty:
      s.readyInMinutes <= 20
        ? "Easy"
        : s.readyInMinutes <= 45
          ? "Medium"
          : "Hard",
    cuisine: s.cuisines[0] ?? "International",
    mealType: (s.dishTypes[0] as Recipe["mealType"]) ?? "Dinner",
    diet: s.diets.map((d) => d.charAt(0).toUpperCase() + d.slice(1)),
    ingredients: s.extendedIngredients.map((i) => i.original),
    instructions: s.instructions
      ? s.instructions
          .replace(/<[^>]*>/g, "")
          .split(". ")
          .filter(Boolean)
      : ["See full recipe for instructions."],
    likes: s.aggregateLikes,
    isLiked: false,
    isSaved: false,
  };
}

// ─── HEALTH GOALS → SPOONACULAR DIET MAPPING ──────────────────
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

export async function fetchRecipes(
  query: string = "healthy",
  healthGoals: string[] = [],
  mealType: string = "",
  cuisine: string = "",
  diet: string = "",
): Promise<Recipe[]> {
  const url = new URL(`${BASE_URL}/recipes/complexSearch`);
  url.searchParams.append("query", query);
  url.searchParams.append("number", "20");
  url.searchParams.append("addRecipeInformation", "true");
  url.searchParams.append("apiKey", API_KEY);

  if (mealType) url.searchParams.append("type", mealType.toLocaleLowerCase());
  if (cuisine) url.searchParams.append("cuisine", cuisine.toLocaleLowerCase());
  if (diet) url.searchParams.append("diet", diet.toLocaleLowerCase());

  const goalTag = healthGoals
    .map((g) => healthGoalToDiet[g])
    .filter(Boolean)
    .join(",");

  if (goalTag) {
    const existing = url.searchParams.get("diet");
    url.searchParams.set("diet", existing ? `${existing},${goalTag}` : goalTag);
  }

  const response = await fetch(url.toString());
  if (response.status === 429) {
    console.warn("API rate limit hit.Showing fallback recipes");
    return []; // Return empty array or some cached/fallback recipes
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
  url.searchParams.append("queue", "popular");
  url.searchParams.append("sort", "popularity");
  url.searchParams.append("number", "4");
  url.searchParams.append("addRecipeInformation", "true");
  url.searchParams.append("apiKey", API_KEY);

  const response = await fetch(url.toString());
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
