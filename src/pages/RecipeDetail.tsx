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
import { fetchRecipeById } from "../services/spoonacularApi";
import { getCommentsByRecipeId } from "../data/mockComments";
import { type Recipe } from "../types/recipe";
import { type Comment } from "../types/comment";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import RecipeImage from "../components/common/RecipeImage";
import { useAuth } from "../context/AuthContext";
import {
  likeRecipeApi,
  savedRecipeApi,
  postCommentApi,
  getCommentsApi,
  deleteCommentApi,
   getRecipeByIdApi ,
} from "../services/authApi";

const RecipeDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    isLoggedIn,
    token,
    user,
    likedRecipes,
    savedRecipes,
    setLikedRecipes,
    setSavedRecipes,
  } = useAuth();

  // ---- STATE ----------
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(
    new Set(),
  );
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  // ----- EFFECT 1: LOAD RECIPE --------

  useEffect(() => {
  if (!id) return;

  const loadRecipe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let data;

      if (id.length > 10) {
         const result = await getRecipeByIdApi(id);
  const raw = result.recipe || result;
  
  // map _id to id so recipe.id works everywhere
  data = {
    ...raw,
    id: raw._id || raw.id,  // ensure id is set correctly
  };
      } else {
        data = await fetchRecipeById(id);
      }

      setRecipe(data);
      setLikeCount(data.likes || 0);

    } catch (error) {
      const found = mockRecipes.find((r) => r.id === id);
      if (found) {
        setRecipe(found);
        setLikeCount(found.likes);
      } else {
        setError("Failed to load recipe. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  loadRecipe();
  window.scrollTo(0, 0);
}, [id]);
  
  // ----- EFFECT 2: SYNC LIKE/SAVE STATE  --------

  useEffect(() => {
    if (recipe) {
      setIsLiked(likedRecipes.includes(recipe.id));
      setIsSaved(savedRecipes.includes(recipe.id));
    }
  }, [recipe, likedRecipes, savedRecipes]);

  // ------ EFFECT 3: LOAD COMMENTS --------

  useEffect(() => {
    if (!recipe) return;

    const loadComments = async () => {
      try {
        const data = await getCommentsApi(recipe.id);

        // convert backend comment shape to your Comment type
        const format = data.comments.map((c) => ({
          id: c._id,
          _id: c._id,
          recipeId: c.recipeId,
          userId: c.userId,
          userName: c.userName,
          text: c.text,
          likes: 0,
          createdAt: new Date(c.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        }));
        setComments(format);
      } catch (error) {
        console.error("Could not load comments:", error);
        // Fallback to mock if backend fails
        setComments(getCommentsByRecipeId(recipe.id));
      }
    };
    loadComments();
  }, [recipe]);

  // --------- HANDLER: LIKE ---------

  const handleLike = async (): Promise<void> => {
    if (!isLoggedIn || !token || !recipe) {
      navigate("/Login");
      return;
    }

    try {
      const result = await likeRecipeApi(recipe.id, token);
      // update local display state
      setIsLiked(result.liked);
      setLikeCount((prev) => (result.liked ? prev + 1 : prev - 1));

      // update AuthContext so Dashboard saved count stays accurate
      // and heart stays filled on other pages too
      setLikedRecipes(result.likedRecipes);
    } catch (error) {
      console.error("[LIKE] Failed:", error);
    }
  };

  // --------- HANDLER: SAVE ---------

  const handleSave = async (): Promise<void> => {
    if (!isLoggedIn || !token || !recipe) {
      navigate("/Login");
      return;
    }

    try {
      const result = await savedRecipeApi(recipe.id, token);
      setIsSaved(result.saved);

      // update AuthContext — Dashboard Saved count updates instantly
      setSavedRecipes(result.savedRecipes);
    } catch (error) {
      console.error("[SAVE] Failed:", error);
    }
  };

  // ---- HANDLER: SHARE ----
  const handleShare = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Recipe link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // ---- HANDLER: TOGGLE INGREDIENT ----
  const toggleIngredient = (index: number): void => {
    setCheckedIngredients((prev) => {
      const newSet = new Set(prev);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  };

  // ---- HANDLER: SUBMIT COMMENT ----
  const handleCommentSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!newComment.trim() || !recipe) return;

    // not logged in — redirect to login
    if (!isLoggedIn || !token) {
      navigate("/login");
      return;
    }

    try {
      const data = await postCommentApi(recipe.id, newComment.trim(), token);

      // convert and add to top of list — no page reload needed
      const formatted = {
        id: data.comment._id,
        _id: data.comment._id,
        recipeId: data.comment.recipeId,
        userId: data.comment.userId,
        userName: data.comment.userName,
        text: data.comment.text,
        likes: 0,
        createdAt: "Just now",
      };

      setComments([formatted, ...comments]);
      setNewComment("");

      console.log(`[COMMENT] Posted by ${user?.name}`);
    } catch (error) {
      console.error("Comment failed:", error);
    }
  };

  // ---- HANDLE DELETE COMMENT --------

  const handleDeleteComment = async (commentId: string) => {
    if (!token) return;

    try {
      await deleteCommentApi(commentId, token);

      // remove from UI instantly
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error("Delete failed:", error);
    }
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
      {/* HERO IMAGE */}
      <section className="relative h-[60vh] bg-gray-900">
        <RecipeImage
          src={recipe.image}
          alt={recipe.title}
          className="object-cover w-full h-full opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <Link
          to="/"
          className="absolute flex items-center gap-2 px-4 py-2 text-white transition rounded-lg top-6 left-6 bg-black/50 backdrop-blur-sm hover:bg-black/70"
        >
          <ArrowLeft size={20} />
          <span className="hidden sm:inline">Back to recipes</span>
        </Link>
        <div className="absolute flex flex-wrap items-center gap-3 bottom-6 left-6">
          <Badge mealType={recipe.mealType as any} className="text-sm">
            {recipe.mealType}
          </Badge>
          {recipe.diet.map((diet) => (
            <Badge key={diet} variant="success" className="text-sm">
              {diet}
            </Badge>
          ))}
          {recipe.cuisine && (
            <Badge variant="secondary" className="text-sm">
              {recipe.cuisine}
            </Badge>
          )}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="p-6 mb-8 bg-white rounded-lg shadow-sm sm:p-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            {recipe.title}
          </h1>
          <p className="mb-6 text-gray-600">{recipe.description}</p>
          <div className="flex flex-wrap gap-3">
            {/* LIKE BUTTON — filled when liked */}
            <Button
              variant={isLiked ? "primary" : "secondary"}
              onClick={handleLike}
              className="gap-2"
            >
              <Heart size={18} className={isLiked ? "fill-current" : ""} />
              {likeCount} Likes
            </Button>

            {/* SAVE BUTTON — filled when saved */}
            <Button
              variant={isSaved ? "primary" : "secondary"}
              onClick={handleSave}
              className="gap-2"
            >
              <Bookmark size={18} className={isSaved ? "fill-current" : ""} />
              {isSaved ? "Saved" : "Save"}
            </Button>

            <Button variant="ghost" onClick={handleShare} className="gap-2">
              <Share2 size={18} /> Share
            </Button>
          </div>

          {/* NEW — hint for non-logged-in users */}
          {!isLoggedIn && (
            <p className="mt-3 text-sm text-gray-500">
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>{" "}
              to like and save recipes
            </p>
          )}
        </div>

        {/* QUICK INFO */}
        <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-4">
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
            <Clock size={24} className="mb-2 text-primary" />
            <span className="text-2xl font-bold text-gray-800">
              {recipe.cookingTime}
            </span>
            <span className="text-xs text-gray-500">minutes</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
            <Users size={24} className="mb-2 text-primary" />
            <span className="text-2xl font-bold text-gray-800">
              {recipe.servings}
            </span>
            <span className="text-xs text-gray-500">servings</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
            <ChefHat size={24} className="mb-2 text-primary" />
            <span className="text-2xl font-bold text-gray-800">
              {recipe.difficulty}
            </span>
            <span className="text-xs text-gray-500">difficulty</span>
          </div>
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
          <div className="lg:col-span-1">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="flex items-center gap-2 mb-4 text-xl font-bold text-gray-800">
                <span>📝</span> Ingredients
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

          <div className="lg:col-span-2">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="flex items-center gap-2 mb-6 text-xl font-bold text-gray-800">
                <span>👨‍🍳</span> Instructions
              </h2>
              <ol className="space-y-6">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-lg font-bold text-white rounded-full bg-primary">
                      {index + 1}
                    </div>
                    <p className="flex-1 pt-2 leading-relaxed text-gray-700">
                      {instruction}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* AUTHOR */}
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

        {/* COMMENTS */}
        <div className="p-6 mt-8 bg-white rounded-lg shadow-sm">
          <h2 className="flex items-center gap-2 mb-6 text-xl font-bold text-gray-800">
            <MessageCircle size={24} /> Comments ({comments.length})
          </h2>
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={
                  isLoggedIn ? "Write a comment..." : "Sign in to comment..."
                }
                disabled={!isLoggedIn}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-400"
              />
              <Button
                type="submit"
                variant="primary"
                className="gap-2"
                disabled={!isLoggedIn}
              >
                <Send size={18} /> Post
              </Button>
            </div>
          </form>
          {comments.length === 0 ? (
            <p className="py-8 text-center text-gray-500">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-start justify-between">
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

                    {/* 👇 ADD THIS DELETE BUTTON */}
                    {comment.userId === user?.id && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-sm text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
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
