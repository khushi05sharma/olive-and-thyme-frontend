// TEMPORARY test page to preview RecipeCard
// We'll delete this once Home page is built

import { type FC } from 'react';
import { mockRecipes } from '../data/mockRecipes';
import RecipeCard from '../components/recipe/RecipeCard';

const TestRecipeCard: FC = () => {
  return (
    <div className="min-h-screen p-8 bg-primary-light">
      <div className="mx-auto max-w-7xl">
        
        {/* Page Title */}
        <h1 className="mb-8 text-3xl font-bold text-gray-800">
          Recipe Card Preview
        </h1>

        {/* Single Card Test */}
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">
            Single Card
          </h2>
          <div className="max-w-sm">
            <RecipeCard recipe={mockRecipes[0]} />
          </div>
        </section>

        {/* Grid Test - Responsive */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-700">
            Responsive Grid (resize browser to test)
          </h2>
          
          {/* Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TestRecipeCard;