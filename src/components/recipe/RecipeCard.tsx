import {
  type FC,
  useState,
  type MouseEvent,
  type ButtonHTMLAttributes,
} from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Bookmark, Clock } from "lucide-react";

import { type Recipe } from "../../types/recipe";
import Badge from "../common/Badge";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: FC<RecipeCardProps> = ({ recipe }) => {
  const [isLiked, setIsLiked] = useState<boolean>(recipe.isLiked || false);
  const [isSaved, setIsSaved] = useState<boolean>(recipe.isSaved || false);
  const [likeCount, setLikeCount] = useState<number>(recipe.likes);

  const navigate = useNavigate();

  const handleCardClick = (): void => {
    navigate(`/recipe/${recipe.id}`);
  };

  const handleLike = (e: MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();

    setIsLiked(!isLiked);

    setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
  };

  const handleSave = (e: MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();

    setIsSaved(!isSaved);
  };

  return (
    <article
      onClick={handleCardClick}
      className="overflow-hidden transition-all duration-300 bg-white shadow-md cursor-pointer hover:shadow-2xl rounded-xl group"
    >
      <div className="relative overflow-hidden bg-gray-200 aspect-video">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
            <Badge mealType={recipe.mealType}>
                {recipe.mealType}
            </Badge>
        </div>
      </div>
    </article>
  );
};

export default RecipeCard;
