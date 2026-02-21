import { type FC, useState, useMemo } from "react";
import { mockRecipes } from "../data/mockRecipes";
import { filterRecipes } from "../utils/filterRecipes";

import HeroSection from "../components/home/HeroSection";
import TrendingSection from "../components/home/TrendingSection";
import FilterSidebar, {
  type FilterState,
} from "../components/recipe/FilterSidebar";
import RecipeGrid from "../components/recipe/RecipeGrid";

// HOME PAGE COMPONENT

const Home: FC = () => {
  // STATE

  // Filter selections
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    mealType: [],
    cuisine: [],
    diet: [],
  });

  // DERIVED DATA
  // Trending recipes: first 4 recipes (static for now)
  // Later this will come from backend/API
  const trendingRecipes = mockRecipes.slice(0, 4);

  // All recipes available
  const allRecipes = mockRecipes;

  // Filtered recipes based on selected filters
  // useMemo prevents re-filtering on every render
  const filteredRecipes = useMemo(
    () => filterRecipes(allRecipes, selectedFilters),
    [allRecipes, selectedFilters],
  );

  // RENDER

  return (
    <div className="min-h-screen bg-primary-light">
      {/* Hero Section */}
      <HeroSection />

      {/* Trending Section */}
      <TrendingSection recipes={trendingRecipes} />

      {/* All Recipes Section with Filters */}
      <section id="all-recipes" className="py-12 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="mb-8">
            <h2 className="mb-2 text-2xl font-bold text-gray-800 sm:text-3xl">
              All Recipes
            </h2>
            <p className="text-sm text-gray-600">
              Browse our complete collection or use filters to find exactly what
              you're looking for
            </p>
          </div>

          {/* Layout: Sidebar + Grid */}
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Filter Sidebar */}
            {/* On mobile: full width above grid */}
            {/* On desktop: fixed width on left side */}
            <FilterSidebar
              selectedFilters={selectedFilters}
              onFilterChange={setSelectedFilters}
              recipeCount={filteredRecipes.length}
            />

            {/* Recipe Grid */}
            {/* Takes remaining space */}
            <div className="flex-1">
              <RecipeGrid
                recipes={filteredRecipes}
                emptyMessage="No recipes match your filters. Try adjusting your selections."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
