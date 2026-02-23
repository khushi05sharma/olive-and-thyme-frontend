import { type FC, useState, type ImgHTMLAttributes } from "react";
import { ImageOff } from "lucide-react";

interface RecipeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
}

// RECIPE IMAGE COMPONENT WITH FALLBACK

const RecipeImage: FC<RecipeImageProps> = ({
  src,
  alt,
  className = "",
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle image load error

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  // Handle image load success

  const handleLoad = () => {
    setIsLoading(false);
  };

  // If image failed to load, show placeholder

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-100 ${className}`}
        role="img"
        aria-label={alt}
      >
        <ImageOff size={48} className="mb-2 text-orange-300" />
        <span className="text-sm font-medium text-gray-600">
          No Image Available
        </span>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div
          className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`}
        />
      )}
      {/* Actual Image */}
      <img
        src={src}
        alt={alt}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </>
  );
};

export default RecipeImage;
