import { type FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChefHat, Heart, Bookmark, Plus, Edit, Trash2 } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { type Recipe } from "../types/recipe";
import { type DashboardTab } from "../types/user";
import Button from "../components/common/Button";
import RecipeCard from "../components/recipe/RecipeCard";
import { getMyRecipesApi, deleteRecipeApi } from "../services/authApi";
import { mockRecipes } from "../data/mockRecipes";

const Dashboard: FC = () => {
  const navigate = useNavigate();
  const { user, savedRecipes, likedRecipes, token } = useAuth();

  const [activeTab, setActiveTab] = useState<DashboardTab>("my-recipes");

  // saved recipes fetched from Spoonacular using saved IDs
  const [savedRecipeDetails, setSavedRecipeDetails] = useState<Recipe[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);

  // My recipes
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [isLoadingMyRecipes, setIsLoadingMyRecipes] = useState(false);

  // ---- FETCH SAVED RECIPE DETAILS ----
  // savedRecipes in AuthContext is just an array of IDs like ["1234, "5678"]
  // We need to fetch full recipe details from Spoonacular for each ID
  // Only fetch when user switches to Saved tab — saves API quota

  useEffect(() => {
    if (activeTab !== "my-recipes" || !token) return;

    const loadMyRecipes = async () => {
      setIsLoadingMyRecipes(true);
      try {
        const data = await getMyRecipesApi(token);
        // Convert backend shape to Recipe type
        const converted: Recipe[] = data.recipes.map((r) => ({
          id: r._id,
          title: r.title,
          description: r.description,
          image: r.image || "",
          cookingTime: r.cookingTime,
          servings: r.servings,
          difficulty: r.difficulty as "Easy" | "Medium" | "Hard",
          cuisine: r.cuisine,
          mealType: r.mealType as any,
          diet: r.diet,
          ingredients: r.ingredients,
          instructions: r.instructions,
          likes: r.likes,
          author: r.author,
          createdAt: new Date(r.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        }));
        setMyRecipes(converted);
      } catch (error) {
        console.error("Failed to load my recipes:", error);
      } finally {
        setIsLoadingMyRecipes(false);
      }
    };

    loadMyRecipes();
  }, [activeTab, token]);

  useEffect(() => {
    if (activeTab !== "saved" || !token) return;

    const loadSavedRecipes = async () => {
  if (savedRecipes.length === 0) {
    setSavedRecipeDetails([]);
    return;
  }

  setIsLoadingSaved(true);

  try {
    const { fetchRecipeById } = await import("../services/spoonacularApi");

    const results = await Promise.all(
      savedRecipes.map(async (id) => {

        // skip invalid
        if (!id) return null;

        // 1. Spoonacular ID (number)
        if (!isNaN(Number(id))) {
          return await fetchRecipeById(id);
        }

        // 2. MongoDB ID
        if (id.length > 10) {
          const res = await fetch(`http://localhost:5000/api/recipes/${id}`);
          const data = await res.json();
          return data;
        }

        // 3. Mock recipes
        const mock = mockRecipes.find((r) => r.id === id);
        return mock || null;
      })
    );

    setSavedRecipeDetails(results.filter(Boolean));

  } catch (error) {
    console.error("Failed to load saved recipes:", error);
  } finally {
    setIsLoadingSaved(false);
  }
};

    loadSavedRecipes();
  }, [activeTab, savedRecipes, token]);

  // ---- STATS -------
  // totalLikes = likes received on my uploaded recipes

  // (.reduce =  "take all items -> combine into ONE value")
  // (and sum -> running total, r -> current recipe so it will add each recipe's likes to the total)
  const totalLikes = myRecipes.reduce((sum, r) => sum + r.likes, 0);

  // ----- HANDLERS ---

  const handleDeleteRecipe = async (recipeId: string): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    if (!token) return;

    try {
      await deleteRecipeApi(recipeId, token);
      // Remove from local state — no need to refetch
      setMyRecipes(myRecipes.filter((r) => r.id !== recipeId));
      console.log(`[RECIPE] Deleted from dashboard: ${recipeId}`);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };
  const handleEditRecipe = (recipeId: string): void => {
    navigate(`/edit-recipe/${recipeId}`);
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
      <div className="absolute flex gap-2 transition-opacity opacity-0 top-2 right-2 group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEditRecipe(recipe.id);
          }}
          className="p-2 text-white transition bg-blue-500 rounded-full shadow-lg hover:bg-blue-600"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteRecipe(recipe.id);
          }}
          className="p-2 text-white transition bg-red-500 rounded-full shadow-lg hover:bg-red-600"
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
          {activeTab === "my-recipes" &&
            (isLoadingMyRecipes ? (
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
            ) : myRecipes.length === 0 ? (
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
            <div>
              <h3 className="mb-6 text-lg font-semibold text-gray-800">
                Recent Activity
              </h3>

              {likedRecipes.length === 0 && savedRecipes.length === 0 ? (
                <EmptyState
                  icon="📊"
                  title="No activity yet"
                  description="Start liking and saving recipes to see your activity here!"
                  actionLabel="Browse Recipes"
                  onAction={() => navigate("/")}
                />
              ) : (
                <div className="space-y-3">
                  {/* LIKED RECIPES */}
                  {likedRecipes.map((recipeId) => (
                    <div
                      key={`like-${recipeId}`}
                      className="flex items-center gap-4 p-4 transition border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => navigate(`/recipe/${recipeId}`)}
                    >
                      {/* Icon */}
                      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-red-100 rounded-full">
                        <Heart
                          size={18}
                          className="text-red-500 fill-current"
                        />
                      </div>
                      {/* Text */}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          You liked a recipe
                        </p>
                        <p className="text-xs text-gray-500">
                          Recipe ID: {recipeId}
                        </p>
                      </div>
                      {/* Arrow */}
                      <span className="text-sm text-gray-400">→</span>
                    </div>
                  ))}

                  {/* SAVED RECIPES */}
                  {savedRecipes.map((recipeId) => (
                    <div
                      key={`save-${recipeId}`}
                      className="flex items-center gap-4 p-4 transition border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => navigate(`/recipe/${recipeId}`)}
                    >
                      {/* Icon */}
                      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full">
                        <Bookmark
                          size={18}
                          className="text-blue-500 fill-current"
                        />
                      </div>
                      {/* Text */}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          You saved a recipe
                        </p>
                        <p className="text-xs text-gray-500">
                          Recipe ID: {recipeId}
                        </p>
                      </div>
                      {/* Arrow */}
                      <span className="text-sm text-gray-400">→</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
