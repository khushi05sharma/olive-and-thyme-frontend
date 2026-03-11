import { type Recipe } from "../types/recipe";
import { type FilterState } from "../components/recipe/FilterSidebar";

/**
 * Applies selected filters to recipe array
 * Returns filtered recipes based on meal type, cuisine, and diet
 */
export const filterRecipes = (
  recipes: Recipe[],
  filters: FilterState,
): Recipe[] => {
  let result = recipes;

  // FILTER BY MEAL TYPE

  if (filters.mealType.length > 0) {
    result = result.filter((recipe) =>
      filters.mealType.includes(recipe.mealType),
    );
  }

  // FILTER BY CUISINE

  if (filters.cuisine.length > 0) {
    result = result.filter((recipe) =>
      filters.cuisine.includes(recipe.cuisine),
    );
  }

  // FILTER BY DIET
  // A recipe can have multiple diet tags
  // Match if recipe has ANY of the selected diets
  if (filters.diet.length > 0) {
    result = result.filter((recipe) =>
      recipe.diet.some((diet) => filters.diet.includes(diet)),
    );
  }

  // FILTER BY HEALTH GOALS 
  if (filters.healthGoals.length > 0) {
    result = result.filter((recipe) =>
      recipe.healthGoals?.some((goal) =>
        filters.healthGoals.includes(goal)
      )
    );
  }

  return result;
};
