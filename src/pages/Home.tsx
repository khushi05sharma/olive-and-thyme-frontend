import { type FC, useState, useEffect } from "react";
import { mockRecipes } from "../data/mockRecipes";
import { fetchRecipes, fetchTrendingRecipes } from "../services/spoonacularApi";
import { type Recipe } from "../types/recipe";
import { useSearchParams, useNavigate } from "react-router-dom";

import HeroSection from "../components/home/HeroSection";
import TrendingSection from "../components/home/TrendingSection";
import FilterSidebar, {
  type FilterState,
} from "../components/recipe/FilterSidebar";
import RecipeGrid from "../components/recipe/RecipeGrid";

const Home: FC = () => {
  // ─── FILTER STATE ──
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    mealType: [],
    cuisine: [],
    diet: [],
    healthGoals: [], 
  });

  // ─ RECIPE STATE ─
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // initialise with mock so TrendingSection is never empty on first render
  // once API responds, this gets replaced with real data automaticaly
  const [trendingRecipes, setTrendingRecipes] = useState<Recipe[]>(
    mockRecipes.slice(0, 4),
  );

  // tracks if trending is still loading from API
  const [isTrendingLoading, setIsTrendingLoading] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── SEARCH PARAMS ─
  // reads /?search=pasta from URL
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get("search") ?? "";

  // ─ EFFECT 1: TRENDING ───
  useEffect(() => {
    const loadTrending = async () => {
      setIsTrendingLoading(true);

      try {
        const data = await fetchTrendingRecipes();
        console.log("=== TRENDING DEBUG ===");
        console.log("data received:", data);
        console.log("data length:", data.length);
        console.log("data[0]:", data[0]); // see first recipe if any

        if (data.length > 0) {
          setTrendingRecipes(data);
          console.log("SET REAL TRENDING DATA");
        } else {
          console.log("EMPTY — staying on mock");
        }
      } catch (err) {
        console.error("TRENDING ERROR:", err);
      } finally {
        setIsTrendingLoading(false);
      }
    };

    loadTrending();
  }, []);

  // ─── EFFECT 2: ALL RECIPES with debounce ─
  // also watches searchQuery so search trigger a fetch
  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchRecipes(
          searchQuery || "healthy", // use search query, fallback to "healthy"
          selectedFilters.healthGoals,
          selectedFilters.mealType[0] ?? "",
          selectedFilters.cuisine[0] ?? "",
          selectedFilters.diet[0] ?? "",
        );

        if (data.length > 0) {
          setRecipes(data);
        } else {
          // API limit hit — fall back to mock with local filtring
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
    }, 500); // 500ms debounce for filters

    return () => clearTimeout(timer);
  }, [selectedFilters, searchQuery]); //  searchQuery added as dependecy

  // ─── RENDER ──
  return (
    <div className="min-h-screen bg-primary-light">
      <HeroSection />

      {/* pass isLoading so TrendingSection shows skeleton */}
      <TrendingSection
        recipes={trendingRecipes}
        isLoading={isTrendingLoading}
      />

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

          {/*=search indicator banner */}
          {searchQuery && (
            <div className="p-3 mb-6 text-sm border border-orange-200 rounded-lg bg-orange-50">
              <span className="text-orange-700">
                Showing results for: <strong>"{searchQuery}"</strong>
              </span>

              <button
                onClick={() => navigate("/")}
                className="ml-2 text-orange-500 underline hover:text-orange-700"
              >
                Clear search
              </button>
            </div>
          )}

          <div className="flex flex-col gap-8 lg:flex-row">
            <FilterSidebar
              selectedFilters={selectedFilters}
              onFilterChange={setSelectedFilters}
              recipeCount={recipes.length}
            />

            <div className="flex-1">
              {error && (
                <div className="flex items-center justify-center p-8 border border-red-200 rounded-lg bg-red-50">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

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
