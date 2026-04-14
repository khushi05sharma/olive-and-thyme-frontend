import { type FC, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChefHat, Heart, Bookmark, Plus, Edit, Trash2 } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { fetchRecipeById } from "../services/spoonacularApi";
import { type Recipe } from "../types/recipe";
import { type DashboardTab } from "../types/user";
import Button from "../components/common/Button";
import RecipeCard from "../components/recipe/RecipeCard";

const Dashboard: FC = () => {
  const { user, likedRecipes, savedRecipes } = useAuth();

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
};
