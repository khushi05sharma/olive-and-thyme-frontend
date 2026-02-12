import { type FC } from "react";
import { type Recipe } from "../../types/recipe";
import RecipeCard from "./RecipeCard";

// TYPESCRIPT INTERFACE

interface RecipeGridProps {
  recipes: Recipe[];
  title?: string;
  emptyMessage?: string; // Message when no recipes
}

// RECIPE GRID COMPONENT

const RecipeGrid: FC<RecipeGridProps> = ({
  recipes,
  title,
  emptyMessage = "No recipes found. Try adjusting your filters.",
}) => {
  return (
    <section className="w-full">
      {/* Optional Title */}
      {title && (
        <h2 className="mb-6 text-2xl font-bold text-gray-800">{title}</h2>
      )}

      {/* Empty State */}
      {recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 text-6xl">🔍</div>
          <h3 className="mb-2 text-xl font-semibold text-gray-700">
            {emptyMessage}
          </h3>
          <p className="text-sm text-gray-500">
            Try selecting different filters or browse all recipes.
          </p>
        </div>
      ) : (
        <>
          {/* Recipe Count */}
          <p className="mb-4 text-sm text-gray-600">
            {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"} found
          </p>

          {/* Responsive Grid */}
          {/* 1 column mobile, 2 columns tablet, 3 columns desktop */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default RecipeGrid;
