import { type FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChefHat, Heart, Bookmark, Plus, Edit, Trash2 } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { fetchRecipeById } from "../services/spoonacularApi";
import { type Recipe } from "../types/recipe";
import { type DashboardTab } from "../types/user";
import Button from "../components/common/Button";
import RecipeCard from "../components/recipe/RecipeCard";

const Dashboard: FC = () => {
  const navigate = useNavigate();
  const { user, savedRecipes } = useAuth();

  const [activeTab, setActiveTab] = useState<DashboardTab>("my-recipes");

  // saved recipes fetched from Spoonacular using saved IDs
  const [savedRecipeDetails, setSavedRecipeDetails] = useState<Recipe[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);

  // My recipes — still mock for now (until Add Recipe saves to DB)
  // Phase 3 later: fetch from GET /api/recipes/my
  const myRecipes: Recipe[] = []; // empty until Add Recipe backend is done

  // ---- FETCH SAVED RECIPE DETAILS ----
  // savedRecipes in AuthContext is just an array of IDs like ["1234, "5678"]
  // We need to fetch full recipe details from Spoonacular for each ID
  // Only fetch when user switches to Saved tab — saves API quota

  useEffect(() => {
    const loadSavedRecipes = async () => {
      if (savedRecipes.length === 0) {
        setSavedRecipeDetails([]);
        return;
      }

      setIsLoadingSaved(true);

      try {
        const recipes = await Promise.all(
          savedRecipes.map((id) => fetchRecipeById(id)),
        );
        setSavedRecipeDetails(recipes);
      } catch (error) {
        console.error("Failed to load saved recipes:", error);
      } finally {
        setIsLoadingSaved(false);
      }
    };

    if (activeTab === "saved") {
      loadSavedRecipes();
    }
  }, [savedRecipes, activeTab]);

  // ---- STATS -------
  // totalLikes = likes received on my uploaded recipes

  // (.reduce =  "take all items -> combine into ONE value")
  // (and sum -> running total, r -> current recipe so it will add each recipe's likes to the total)
  const totalLikes = myRecipes.reduce((sum, r) => sum + r.likes, 0);

  // ----- HANDLERS ---

  const handleDeleteRecipe = (recipeId: string): void => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      console.log("Deleting recipe with ID:", recipeId);
    }
  };

  const handleEditRecipe = (recipeId: string): void => {
    // Phase 3: navigate to edit page
    alert(`Edit coming in Phase 3! Recipe ID: ${recipeId}`);
  };

  // ---- STAT CARD --------
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

  // ----- EMPTY STATE ----------
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

  // ─── RECIPE CARD WITH ACTIONS ─────────────────────────────
  const RecipeCardWithActions: FC<{ recipe: Recipe }> = ({ recipe }) => (
    <div className="relative group">
      <RecipeCard recipe={recipe} />
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEditRecipe(recipe.id);
          }}
          className="p-2 text-white rounded-full bg-blue-500 hover:bg-blue-600 transition shadow-lg"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteRecipe(recipe.id);
          }}
          className="p-2 text-white rounded-full bg-red-500 hover:bg-red-600 transition shadow-lg"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

  // ─── RENDER ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-primary-light">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* PROFILE HEADER */}
        <div className="p-6 mb-8 bg-white rounded-lg shadow-sm sm:p-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              {/* Avatar — real first letter from AuthContext */}
              <div className="flex items-center justify-center flex-shrink-0 w-20 h-20 text-3xl font-bold text-white rounded-full bg-primary">
                {user?.name?.charAt(0).toUpperCase() ?? "U"}
              </div>
              <div>
                {/* Real name and email from AuthContext */}
                <h1 className="text-2xl font-bold text-gray-800">
                  {user?.name ?? "User"}
                </h1>
                <p className="text-gray-600">{user?.email ?? ""}</p>
                <p className="text-sm text-gray-500">
                  {/* createdAt comes from /me endpoint — added to AuthUser type below */}
                  Member since{" "}
                  {(user as any)?.createdAt
                    ? new Date((user as any).createdAt).toLocaleDateString(
                        "en-US",
                        { month: "long", year: "numeric" },
                      )
                    : "Recently"}
                </p>
              </div>
            </div>
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
              value={myRecipes.length}
              label="Recipes"
              color="bg-orange-50"
            />
            <StatCard
              icon={<Heart className="text-red-500" />}
              value={totalLikes}
              label="Total Likes"
              color="bg-red-50"
            />
            <StatCard
              icon={<Bookmark className="text-blue-500" />}
              value={savedRecipes.length} // real count from AuthContext
              label="Saved"
              color="bg-blue-50"
            />
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="mb-6">
          <div className="flex gap-2 p-1 bg-white rounded-lg shadow-sm">
            {[
              { key: "my-recipes", label: `My Recipes (${myRecipes.length})` },
              { key: "saved", label: `Saved (${savedRecipes.length})` },
              { key: "activity", label: "Activity" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as DashboardTab)}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition ${
                  activeTab === tab.key
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          {/* MY RECIPES TAB */}
          {activeTab === "my-recipes" &&
            (myRecipes.length === 0 ? (
              <EmptyState
                icon="🍳"
                title="No recipes yet"
                description="You haven't uploaded any recipes yet. Start sharing your culinary creations!"
                actionLabel="Upload Your First Recipe"
                onAction={() => navigate("/add-recipe")}
              />
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {myRecipes.map((recipe) => (
                  <RecipeCardWithActions key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ))}

          {/* SAVED RECIPES TAB */}
          {activeTab === "saved" &&
            (isLoadingSaved ? (
              /* Loading skeleton while fetching from Spoonacular */
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="overflow-hidden bg-gray-100 rounded-xl animate-pulse"
                  >
                    <div className="w-full h-48 bg-gray-200" />
                    <div className="p-4 space-y-2">
                      <div className="w-3/4 h-4 bg-gray-200 rounded" />
                      <div className="w-1/2 h-3 bg-gray-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : savedRecipeDetails.length === 0 ? (
              <EmptyState
                icon="🔖"
                title="No saved recipes"
                description="Browse recipes and bookmark your favorites to find them easily here!"
                actionLabel="Browse Recipes"
                onAction={() => navigate("/")}
              />
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {savedRecipeDetails.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ))}

          {/* ACTIVITY TAB */}
          {activeTab === "activity" && (
            <EmptyState
              icon="📊"
              title="Activity feed coming soon"
              description="This section will show your recent likes, saves, and comments. Coming in the next update!"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
