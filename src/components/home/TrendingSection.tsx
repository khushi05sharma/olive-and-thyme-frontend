// src/components/home/TrendingSection.tsx

import { type FC } from "react";
import { TrendingUp } from "lucide-react";
import { type Recipe } from "../../types/recipe";
import RecipeCard from "../recipe/RecipeCard";

// ============================================
// TYPESCRIPT INTERFACE
// ============================================

interface TrendingSectionProps {
  recipes: Recipe[];
}

// ============================================
// TRENDING SECTION COMPONENT
// ============================================

const TrendingSection: FC<TrendingSectionProps> = ({ recipes }) => {
  // Don't render if no trending recipes
  if (recipes.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg">
            <TrendingUp size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
              Trending Now
            </h2>
            <p className="text-sm text-gray-600">
              Most popular recipes this week
            </p>
          </div>
        </div>

        {/* Trending Recipe Grid */}
        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="mx-4 overflow-x-auto sm:mx-0">
          <div className="inline-flex gap-4 px-4 py-2 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="flex-shrink-0 w-72 sm:w-auto"
              >
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;