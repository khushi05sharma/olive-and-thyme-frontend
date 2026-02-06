import { type FC, useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Bookmark, Clock } from "lucide-react";

import { type Recipe } from "../../types/recipe";
import Badge from "../common/Badge";

// TYPESCRIPT INTERFACE
interface RecipeCardProps {
  recipe: Recipe; // Full recipe object
}

const RecipeCard: FC<RecipeCardProps> = ({ recipe }) => {
  const [isLiked, setIsLiked] = useState<boolean>(recipe.isLiked || false);
  const [isSaved, setIsSaved] = useState<boolean>(recipe.isSaved || false);
  // Track current like count (can increase/decrease)
  const [likeCount, setLikeCount] = useState<number>(recipe.likes);

  const navigate = useNavigate();

  // Navigate to recipe detail page when card is clicked
  const handleCardClick = (): void => {
    navigate(`/recipe/${recipe.id}`);
  };

  // Toggle like state

  const handleLike = (e: MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation(); // Don't navigate when clicking like

    setIsLiked(!isLiked);
    // Increment or decrement like count
    setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
  };

  // Toggle save state
  const handleSave = (e: MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation(); // Don't navigate when clicking save

    setIsSaved(!isSaved);
  };

  return (
    <article
      onClick={handleCardClick}
      className="overflow-hidden transition-all duration-300 bg-white shadow-md cursor-pointer hover:shadow-2xl rounded-xl group"
    >
      <div className="relative overflow-hidden bg-gray-200 aspect-video">
        {/* IMAGE SECTION */}
        <img
          src={recipe.image}
          alt={recipe.title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          loading="lazy" // Lazy load images for performance
        />
        {/* Overlay Gradient (makes text readable on image) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Meal Type Badge (Top-Left) */}
        <div className="absolute top-3 left-3">
          <Badge mealType={recipe.mealType}>{recipe.mealType}</Badge>
        </div>
        {/* Like & Save Buttons (Top-Right) */}
        <div className="absolute flex gap-2 top-3 right-3">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className="p-2 transition-all duration-200 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white active:scale-95"
            aria-label={isLiked ? "Unlike recipe" : "Like recipe"}
          >
            <Heart
              size={18}
              className={`transition-colors ${
                isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>
          {/* Save Button */}
          <button
            onClick={handleSave}
            className="p-2 transition-all duration-200 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white active:scale-95"
            aria-label={isSaved ? "Unsave recipe" : "Save recipe"}
          >
            <Bookmark
              size={18}
              className={`transition-colors ${
                isSaved ? "fill-primary text-primary " : "text-gray-600"
              }`}
            />
          </button>
        </div>
        {/* Cooking Time Badge (Bottom-Right) */}
        <div className="absolute bottom-3 right-3">
          <div
            className="flex items-center gap-1 px-2.5 py-1 
                        bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium"
          >
            <Clock size={14} className="text-gray-600" />
            <span className="text-gray-700">{recipe.cookingTime}min</span>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}

      <div className="p-4 space-y-3">
        {/* Recipe Title */}
        <h3 className="text-lg font-semibold text-gray-800 transition-colors line-clamp-1 group-hover:text-primary">
          {recipe.title}
        </h3>
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {recipe.description}
        </p>
        {/* FOOTER METADATA */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <Badge variant="danger" className="text-sm">
            {recipe.cuisine}
          </Badge>

          {/* Right: Like Count & Author */}
          <div className="flex items-center gap-3 text-sm text-gray-500">
            {/* Like Count */}
            <div className="flex items-center gap-1">
              <Heart
                size={14}
                className={
                  isLiked ? "fill-red-500 text-red-500" : "text-gray-400"
                }
              />
              <span className="font-medium">{likeCount}</span>
            </div>
            {/* Author Name (if available) */}
            {recipe.author && (
              <span className="text-xs">by {recipe.author.name}</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default RecipeCard;
