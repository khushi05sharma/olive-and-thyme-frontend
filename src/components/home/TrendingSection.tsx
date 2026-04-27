import { type FC } from "react";
import { TrendingUp } from "lucide-react";
import { type Recipe } from "../../types/recipe";
import RecipeCard from "../recipe/RecipeCard";

interface TrendingSectionProps {
  recipes: Recipe[];
  isLoading?: boolean; // NEW — so we can show skeleton instead of null
}

const TrendingSection: FC<TrendingSectionProps> = ({
  recipes,
  isLoading = false,
}) => {

  // CHANGED — instead of returning null when empty,
  // show a skeleton while loading so component stays in DOM
  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg">
              <TrendingUp size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                Trending Now
              </h2>
              <p className="text-sm text-gray-600">Most popular recipes</p>
            </div>
          </div>
          {/* Skeleton cards while API loads */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden bg-gray-100 rounded-xl animate-pulse"
              >
                <div className="w-full h-40 bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="w-3/4 h-3 bg-gray-200 rounded" />
                  <div className="w-1/2 h-3 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Only hide if not loading AND truly no recipes
  if (!isLoading && recipes.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg">
            <TrendingUp size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
              Trending Now
            </h2>
            <p className="text-sm text-gray-600">Most popular recipes</p>
          </div>
        </div>

        <div className="mx-4 overflow-x-auto sm:mx-0">
          <div className="inline-flex gap-4 px-4 py-2 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="flex-shrink-0 w-72 sm:w-auto">
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