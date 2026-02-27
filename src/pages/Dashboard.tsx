// src/pages/Dashboard.tsx

import { type FC, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChefHat,
  Heart,
  Bookmark,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
} from "lucide-react";

import { mockRecipes } from "../data/mockRecipes";
import { mockCurrentUser, mockSavedRecipeIds } from "../data/mockUser";
import { type DashboardTab, type UserStats } from "../types/user";
import Button from "../components/common/Button";
import RecipeCard from "../components/recipe/RecipeCard";

// ============================================
// DASHBOARD PAGE
// ============================================

const Dashboard: FC = () => {
  const navigate = useNavigate();

  // ══════════════════════════════════════════
  // STATE
  // ══════════════════════════════════════════

  // Active tab (my-recipes, saved, activity)
  const [activeTab, setActiveTab] = useState<DashboardTab>("my-recipes");

  // User's recipes (can be deleted locally)
  const [myRecipes, setMyRecipes] = useState(
    mockRecipes.filter((r) => r.author?.id === mockCurrentUser.id)
  );

  // ══════════════════════════════════════════
  // DERIVED DATA
  // ══════════════════════════════════════════

  // Current user (Phase 3: const { user } = useAuth();)
  const currentUser = mockCurrentUser;

  // Saved recipes
  const savedRecipes = mockRecipes.filter((r) =>
    mockSavedRecipeIds.includes(r.id)
  );

  // Calculate user stats
  const userStats: UserStats = useMemo(() => {
    const totalLikes = myRecipes.reduce((sum, recipe) => sum + recipe.likes, 0);

    return {
      recipesCount: myRecipes.length,
      totalLikes,
      savedCount: savedRecipes.length,
    };
  }, [myRecipes, savedRecipes]);

  // ══════════════════════════════════════════
  // HANDLERS
  // ══════════════════════════════════════════

  const handleDeleteRecipe = (recipeId: string): void => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      // Phase 1: Remove from local state
      setMyRecipes(myRecipes.filter((r) => r.id !== recipeId));

      // Phase 3: Send DELETE request to backend
      // await fetch(`/api/recipes/${recipeId}`, { method: 'DELETE' });
      // then refetch: fetchMyRecipes();
    }
  };

  const handleEditRecipe = (recipeId: string): void => {
    // Phase 3: Navigate to edit page
    alert(`Edit functionality coming in Phase 3!\nRecipe ID: ${recipeId}`);
  };

  // ══════════════════════════════════════════
  // RENDER HELPER: Stat Card
  // ══════════════════════════════════════════

  const StatCard: FC<{
    icon: React.ReactNode;
    value: number;
    label: string;
    color: string;
  }> = ({ icon, value, label, color }) => (
    <div className={`p-6 rounded-lg shadow-sm ${color}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-3xl">{icon}</div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-800">{value}</div>
          <div className="text-sm text-gray-600">{label}</div>
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════
  // RENDER HELPER: Empty State
  // ══════════════════════════════════════════

  const EmptyState: FC<{
    icon: string;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
  }> = ({ icon, title, description, actionLabel, onAction }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-6xl">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold text-gray-800">{title}</h3>
      <p className="max-w-md mb-6 text-gray-600">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );

  // ══════════════════════════════════════════
  // RENDER HELPER: Recipe Card with Actions
  // ══════════════════════════════════════════

  const RecipeCardWithActions: FC<{ recipe: any }> = ({ recipe }) => (
    <div className="relative group">
      <RecipeCard recipe={recipe} />

      {/* Action Buttons (visible on hover on desktop, always visible on mobile) */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEditRecipe(recipe.id);
          }}
          className="p-2 text-white rounded-full bg-blue-500 hover:bg-blue-600 transition shadow-lg"
          aria-label="Edit recipe"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteRecipe(recipe.id);
          }}
          className="p-2 text-white rounded-full bg-red-500 hover:bg-red-600 transition shadow-lg"
          aria-label="Delete recipe"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

  // ══════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════

  return (
    <div className="min-h-screen bg-primary-light">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* ═══════════════════════════════════════ */}
        {/* PROFILE HEADER */}
        {/* ═══════════════════════════════════════ */}
        <div className="p-6 mb-8 bg-white rounded-lg shadow-sm sm:p-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            {/* User Info */}
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="flex items-center justify-center flex-shrink-0 w-20 h-20 text-3xl font-bold text-white rounded-full bg-primary">
                {currentUser.name.charAt(0)}
              </div>

              {/* Name & Email */}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {currentUser.name}
                </h1>
                <p className="text-gray-600">{currentUser.email}</p>
                {currentUser.createdAt && (
                  <p className="text-sm text-gray-500">
                    Member since {currentUser.createdAt}
                  </p>
                )}
              </div>
            </div>

            {/* New Recipe Button */}
            <Button
              onClick={() => navigate("/add-recipe")}
              variant="primary"
              className="gap-2 whitespace-nowrap"
            >
              <Plus size={20} />
              New Recipe
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-3">
            <StatCard
              icon={<ChefHat className="text-primary" />}
              value={userStats.recipesCount}
              label="Recipes"
              color="bg-orange-50"
            />
            <StatCard
              icon={<Heart className="text-red-500" />}
              value={userStats.totalLikes}
              label="Total Likes"
              color="bg-red-50"
            />
            <StatCard
              icon={<Bookmark className="text-blue-500" />}
              value={userStats.savedCount}
              label="Saved"
              color="bg-blue-50"
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════ */}
        {/* TAB NAVIGATION */}
        {/* ═══════════════════════════════════════ */}
        <div className="mb-6">
          <div className="flex gap-2 p-1 bg-white rounded-lg shadow-sm">
            <button
              onClick={() => setActiveTab("my-recipes")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition ${
                activeTab === "my-recipes"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              My Recipes ({myRecipes.length})
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition ${
                activeTab === "saved"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              Saved ({savedRecipes.length})
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition ${
                activeTab === "activity"
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              Activity
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════ */}
        {/* CONTENT AREA */}
        {/* ═══════════════════════════════════════ */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          {/* MY RECIPES TAB */}
          {activeTab === "my-recipes" && (
            <>
              {myRecipes.length === 0 ? (
                <EmptyState
                  icon="🍳"
                  title="No recipes yet"
                  description="You haven't uploaded any recipes yet. Start sharing your culinary creations with the community!"
                  actionLabel="Upload Your First Recipe"
                  onAction={() => navigate("/add-recipe")}
                />
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {myRecipes.map((recipe) => (
                    <RecipeCardWithActions key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* SAVED RECIPES TAB */}
          {activeTab === "saved" && (
            <>
              {savedRecipes.length === 0 ? (
                <EmptyState
                  icon="💾"
                  title="No saved recipes"
                  description="You haven't saved any recipes yet. Browse recipes and bookmark your favorites to find them easily later!"
                  actionLabel="Browse Recipes"
                  onAction={() => navigate("/")}
                />
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {savedRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* ACTIVITY TAB */}
          {activeTab === "activity" && (
            <EmptyState
              icon="📊"
              title="Activity feed coming soon"
              description="This section will show your recent activity, including likes and comments on your recipes."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;