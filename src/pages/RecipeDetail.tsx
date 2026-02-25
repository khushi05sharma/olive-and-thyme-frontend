// src/pages/RecipeDetail.tsx

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

  // Comments
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  // EFFECTS
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Load comments for this recipe
  useEffect(() => {
    if (recipe) {
      // Phase 3: This becomes: fetch(`/api/recipes/${recipe.id}/comments`)
      const recipeComments = getCommentsByRecipeId(recipe.id);
      setComments(recipeComments);
    }
  }, [recipe]);

  // HANDLERS

  const handleLike = (): void => {
    // Phase 3: POST /api/recipes/:id/like
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleSave = (): void => {
    // Phase 3: POST /api/recipes/:id/save
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

  return (
    <div className="min-h-screen bg-primary-light">
      {/* HERO IMAGE SECTION */}
      <section className="relative h-[60vh] bg-gray-900">
        {/* Recipe Image with Fallback */}
        <RecipeImage
          src={recipe.image}
          alt={recipe.title}
          className="object-cover w-full h-full opacity-80"
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Back Button */}
        <Link
          to="/"
          className="absolute flex items-center gap-2 px-4 py-2 text-white transition rounded-lg top-6 left-6 bg-black/50 backdrop-blur-sm hover:bg-black/70"
        >
          <ArrowLeft size={20} />
          <span className="hidden sm:inline">Back to recipes</span>
        </Link>

        {/* Meal Type Badge */}
        <div className="absolute flex flex-wrap items-center gap-3 bottom-6 left-6">
          <Badge mealType={recipe.mealType as any} className="text-sm ">
            {recipe.mealType}
          </Badge>
          {/* Diet (Vegetarian, Vegan, etc.) */}
          {recipe.diet.length > 0 &&
            recipe.diet.map((diet) => (
              <Badge key={diet} variant="success" className="text-sm">
                {diet}
              </Badge>
            ))}
          {/* Cuisine */}
          {recipe.cuisine && (
            <Badge variant="secondary" className="text-sm">
              {recipe.cuisine}
            </Badge>
          )}
        </div>
      </section>

      {/* MAIN CONTENT */}

      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* HEADER SECTION */}

        <div className="p-6 mb-8 bg-white rounded-lg shadow-sm sm:p-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            {recipe.title}
          </h1>

          <p className="mb-6 text-gray-600">{recipe.description}</p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant={isLiked ? "primary" : "secondary"}
              onClick={handleLike}
              className="gap-2"
            >
              <Heart size={18} className={isLiked ? "fill-current" : ""} />
              {likeCount} Likes
            </Button>

            <Button
              variant={isSaved ? "primary" : "secondary"}
              onClick={handleSave}
              className="gap-2"
            >
              <Bookmark size={18} className={isSaved ? "fill-current" : ""} />
              {isSaved ? "Saved" : "Save"}
            </Button>

            <Button variant="ghost" onClick={handleShare} className="gap-2">
              <Share2 size={18} />
              Share
            </Button>
          </div>
        </div>

        {/* QUICK INFO CARDS */}

        <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-4">
          {/* Time Card */}
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
            <Clock size={24} className="mb-2 text-primary" />
            <span className="text-2xl font-bold text-gray-800">
              {recipe.cookingTime}
            </span>
            <span className="text-xs text-gray-500">minutes</span>
          </div>

          {/* Servings Card */}
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
            <Users size={24} className="mb-2 text-primary" />
            <span className="text-2xl font-bold text-gray-800">
              {recipe.servings}
            </span>
            <span className="text-xs text-gray-500">servings</span>
          </div>

          {/* Difficulty Card */}
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
            <ChefHat size={24} className="mb-2 text-primary" />
            <span className="text-2xl font-bold text-gray-800">
              {recipe.difficulty}
            </span>
            <span className="text-xs text-gray-500">difficulty</span>
          </div>

          {/* Cuisine Card */}
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
            <span className="mb-2 text-2xl">🌍</span>
            <span className="text-2xl font-bold text-gray-800">
              {recipe.cuisine}
            </span>
            <span className="text-xs text-gray-500">cuisine</span>
          </div>
        </div>

        {/* INGREDIENTS & INSTRUCTIONS */}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* INGREDIENTS (Left Column) */}
          <div className="lg:col-span-1">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="flex items-center gap-2 mb-4 text-xl font-bold text-gray-800">
                <span>📝</span>
                Ingredients
              </h2>

              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id={`ingredient-${index}`}
                      checked={checkedIngredients.has(index)}
                      onChange={() => toggleIngredient(index)}
                      className="w-5 h-5 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    />
                    <label
                      htmlFor={`ingredient-${index}`}
                      className={`flex-1 cursor-pointer transition ${
                        checkedIngredients.has(index)
                          ? "line-through text-gray-400"
                          : "text-gray-700"
                      }`}
                    >
                      {ingredient}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* INSTRUCTIONS (Right Column) */}
          <div className="lg:col-span-2">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="flex items-center gap-2 mb-6 text-xl font-bold text-gray-800">
                <span>👨‍🍳</span>
                Instructions
              </h2>

              <ol className="space-y-6">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-4">
                    {/* Step Number */}
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-lg font-bold text-white rounded-full bg-primary">
                      {index + 1}
                    </div>

                    {/* Step Text */}
                    <p className="flex-1 pt-2 leading-relaxed text-gray-700">
                      {instruction}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* AUTHOR INFO */}

        {recipe.author && (
          <div className="p-6 mt-8 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 text-xl font-bold text-white rounded-full bg-primary">
                {recipe.author.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {recipe.author.name}
                </p>
                <p className="text-sm text-gray-500">
                  Posted on {recipe.createdAt}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* COMMENTS SECTION */}

        <div className="p-6 mt-8 bg-white rounded-lg shadow-sm">
          <h2 className="flex items-center gap-2 mb-6 text-xl font-bold text-gray-800">
            <MessageCircle size={24} />
            Comments ({comments.length})
          </h2>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" variant="primary" className="gap-2">
                <Send size={18} />
                Post
              </Button>
            </div>
          </form>

          {/* Comments List */}
          {comments.length === 0 ? (
            <p className="py-8 text-center text-gray-500">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-sm font-bold text-white rounded-full bg-primary">
                      {comment.userName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">
                          {comment.userName}
                        </span>
                        <span className="text-xs text-gray-500">
                          • {comment.createdAt}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                  </div>

                  {/* Comment Actions */}
                  <div className="flex items-center gap-3 ml-13">
                    <button className="flex items-center gap-1 text-sm text-gray-500 transition hover:text-primary">
                      <Heart size={14} />
                      {comment.likes > 0 && <span>{comment.likes}</span>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
