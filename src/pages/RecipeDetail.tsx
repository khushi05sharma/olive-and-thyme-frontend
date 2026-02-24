import { type FC, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Bookmark,
  Share2,
  Clock,
  Users,
  ChefHat,
  MessageCircle,
  Send,
} from "lucide-react";

import { mockRecipes } from "../data/mockRecipes";
import { getCommentsByRecipeId } from "../data/mockComments";
import { type Comment } from "../types/comment";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import RecipeImage from "../components/common/RecipeImage";

// RECIPE DETAIL PAGE

const RecipeDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // FIND RECIPE

  const recipe = mockRecipes.find((r) => r.id === id);

  // STATE

  const [isLiked, setIsLiked] = useState(recipe?.isLiked || false);
  const [isSaved, setIsSaved] = useState(recipe?.isSaved || false);
  const [likeCount, setLikeCount] = useState(recipe?.likes || 0);

  // Ingredient checklist (local state, not persisted)
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(
    new Set(),
  );

  // Comments (Phase 3: from backend)
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Load comments for this recipe
  useEffect(() => {
    if (recipe) {
      const recipeComments = getCommentsByRecipeId(recipe.id);
      setComments(recipeComments);
    }
  }, [recipe]);

  // HANDLERS

  const handleLike = (): void => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleSave = (): void => {
    setIsSaved(!isSaved);
  };

  const handleShare = async (): Promise<void> => {
    // Copy recipe URL to clipboard
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      alert("Recipe link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const toggleIngredient = (index: number): void => {
    setCheckedIngredients((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleCommentSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // Phase 3: POST /api/recipes/:id/comments
    const comment: Comment = {
      id: `c${Date.now()}`,
      recipeId: recipe!.id,
      userId: "current-user", // Will come from auth context
      userName: "You", // Will come from auth context
      text: newComment,
      likes: 0,
      createdAt: "Just now",
    };

    setComments([comment, ...comments]);
    setNewComment("");
  };

  // 404 HANDLING
  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-primary-light">
        <div className="text-center">
          <h1 className="mb-4 text-6xl">🔍</h1>
          <h2 className="mb-2 text-2xl font-bold text-gray-800">
            Recipe Not Found
          </h2>
          <p className="mb-6 text-gray-600">
            The recipe you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/")}>Return to Home</Button>
        </div>
      </div>
    );
  }

  // RENDER

};

export default RecipeDetail;
