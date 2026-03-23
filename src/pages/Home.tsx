import { type FC, useState, useEffect } from "react";

// Mock data — used when USE_MOCK is true
import { mockRecipes } from "../data/mockRecipes";
import { fetchRecipes, fetchTrendingRecipes } from "../services/spoonacularApi";
import { type Recipe } from "../types/recipe";

// Components
import HeroSection from "../components/home/HeroSection";
import TrendingSection from "../components/home/TrendingSection";
import FilterSidebar, {
  type FilterState,
} from "../components/recipe/FilterSidebar";
import RecipeGrid from "../components/recipe/RecipeGrid";

// ──────────────────────────────────────────────────────────────

const Home: FC = () => {
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    mealType: [],
    cuisine: [],
    diet: [],
    healthGoals: [] as const as Array<
      | "Heart Healthy"
      | "Diabetic Friendly"
      | "High Protein"
      | "Low Sodium"
      | "Low Carb"
      | "Anti-Inflammatory"
      | "Gut Friendly"
      | "Weight Management"
      | "Kidney Friendly"
      | "Immune Boosting"
    >,
  });

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [trendingRecipes, setTrendingRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── EFFECT 1: TRENDING ───────────────────────────────────────
  useEffect(() => {
    const loadTrending = async () => {
      try {
        const data = await fetchTrendingRecipes();
        console.log("TRENDING DATA:", data);
        console.log("TRENDING LENGTH:", data.length);
        setTrendingRecipes(data.length > 0 ? data : mockRecipes.slice(0, 4));
      } catch (err) {
        setTrendingRecipes(mockRecipes.slice(0, 4));
        console.error("Trending fallback to mock:", err);
      }
    };
    loadTrending();
  }, []);

  // ─── EFFECT 2: ALL RECIPES with debounce ──────────────────────
  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchRecipes(
          "healthy",
          selectedFilters.healthGoals,
          selectedFilters.mealType[0] ?? "",
          selectedFilters.cuisine[0] ?? "",
          selectedFilters.diet[0] ?? "",
        );

        if (data.length > 0) {
          // Real API data came back — use it
          setRecipes(data);
        } else {
          // API returned empty — limit hit, fall back to mock
          const filtered = mockRecipes.filter((r) => {
            const matchMeal =
              selectedFilters.mealType.length === 0 ||
              selectedFilters.mealType.includes(r.mealType);
            const matchCuisine =
              selectedFilters.cuisine.length === 0 ||
              selectedFilters.cuisine.includes(r.cuisine);
            const matchDiet =
              selectedFilters.diet.length === 0 ||
              selectedFilters.diet.some((d) => r.diet.includes(d));
            const matchGoals =
              selectedFilters.healthGoals.length === 0 ||
              selectedFilters.healthGoals.some((g: string) =>
                r.healthGoals?.includes(g as any),
              );
            return matchMeal && matchCuisine && matchDiet && matchGoals;
          });
          setRecipes(filtered);
        }
      } catch (err) {
        console.error(err);
        setRecipes(mockRecipes);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedFilters]);
  // ─── RENDER ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-primary-light">
      <HeroSection />

      <TrendingSection recipes={trendingRecipes} />

      <section id="all-recipes" className="py-12 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="mb-2 text-2xl font-bold text-gray-800 sm:text-3xl">
              All Recipes
            </h2>
            <p className="text-sm text-gray-600">
              Browse our complete collection or use filters to find exactly what
              you're looking for
            </p>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            <FilterSidebar
              selectedFilters={selectedFilters}
              onFilterChange={setSelectedFilters}
              recipeCount={recipes.length}
            />

            <div className="flex-1">
              {/* ERROR STATE */}
              {error && (
                <div className="flex items-center justify-center p-8 border border-red-200 rounded-lg bg-red-50">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              {/* LOADING STATE */}
              {isLoading && !error && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="overflow-hidden bg-white border border-gray-200 rounded-xl animate-pulse"
                    >
                      <div className="w-full h-48 bg-gray-200" />
                      <div className="p-4 space-y-3">
                        <div className="w-3/4 h-4 bg-gray-200 rounded" />
                        <div className="w-full h-3 bg-gray-100 rounded" />
                        <div className="w-1/2 h-3 bg-gray-100 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* RECIPES */}
              {!isLoading && !error && (
                <RecipeGrid
                  recipes={recipes}
                  emptyMessage="No recipes match your filters. Try adjusting your selections."
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
