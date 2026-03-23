import { type FC, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, Heart, Bookmark, Share2,
  Clock, Users, ChefHat, MessageCircle, Send,
} from "lucide-react";

import { mockRecipes } from "../data/mockRecipes";
import { fetchRecipeById } from "../services/spoonacularApi";
import { getCommentsByRecipeId } from "../data/mockComments";
import { type Recipe } from "../types/recipe";
import { type Comment } from "../types/comment";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import RecipeImage from "../components/common/RecipeImage";


const RecipeDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ---- STATE ----------
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

// ------- EFFECT 1: FETCH RECIPE -------
const loadRecipe = async () => {
  setIsLoading(true);
  setError(null);

  try {
    // Always try real API first
    const data = await fetchRecipeById(id!);
    setRecipe(data);
    setIsLiked(data.isLiked ?? false);
    setIsSaved(data.isSaved ?? false);
    setLikeCount(data.likes);
  } catch (err) {
    // API failed (limit or not found) — try mock as fallback
    const found = mockRecipes.find((r) => r.id === id);
    if (found) {
      setRecipe(found);
      setIsLiked(found.isLiked ?? false);
      setIsSaved(found.isSaved ?? false);
      setLikeCount(found.likes);
    } else {
      // Not in mock either — genuine 404
      setError("Could not load this recipe. Please try again.");
    }
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  if (id) {
    loadRecipe();
  }
}, [id]);

  // ------ EFFECT 2: LOAD COMMENTS --------
  useEffect(() => {
    if (recipe) {
      // Phase 3: fetch(`/api/recipes/${recipe.id}/comments`)
      setComments(getCommentsByRecipeId(recipe.id));
    }
  }, [recipe]);

  // --------- HANDLERS ---------
  const handleLike = (): void => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleSave = (): void => setIsSaved(!isSaved);

  const handleShare = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Recipe link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const toggleIngredient = (index: number): void => {
    setCheckedIngredients((prev) => {
      const newSet = new Set(prev);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  };

  const handleCommentSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!newComment.trim() || !recipe) return;

    const comment: Comment = {
      id: `c${Date.now()}`,
      recipeId: recipe.id,
      userId: "current-user",
      userName: "You",
      text: newComment,
      likes: 0,
      createdAt: "Just now",
    };
    setComments([comment, ...comments]);
    setNewComment("");
  };

  // -------- LOADING STATE --------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-light animate-pulse">
        {/* Image skeleton */}
        <div className="h-[60vh] bg-gray-300" />
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Title skeleton */}
          <div className="p-6 mb-8 bg-white rounded-lg shadow-sm">
            <div className="w-2/3 h-8 mb-4 bg-gray-200 rounded" />
            <div className="w-full h-4 mb-2 bg-gray-100 rounded" />
            <div className="w-1/2 h-4 bg-gray-100 rounded" />
          </div>
          {/* Cards skeleton */}
          <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-white rounded-lg shadow-sm" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // -------- ERROR STATE --------
  if (error || !recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-primary-light">
        <div className="text-center">
          <h1 className="mb-4 text-6xl">🔍</h1>
          <h2 className="mb-2 text-2xl font-bold text-gray-800">
            Recipe Not Found
          </h2>
          <p className="mb-6 text-gray-600">
            {error ?? "This recipe doesn't exist or has been removed."}
          </p>
          <Button onClick={() => navigate("/")}>Return to Home</Button>
        </div>
      </div>
    );
  }

  // ----- RENDER -------
  return (
    <div className="min-h-screen bg-primary-light">

    </div>
  );
};

export default RecipeDetail;