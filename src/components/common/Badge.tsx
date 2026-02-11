import { type FC, type ReactNode } from "react";
import { type MealType } from "../../types/recipe";

// TYPES
type BadgeVariant = "primary" | "secondary" | "success" | "warning" | "danger";

interface BadgeProps {
  variant?: BadgeVariant;
  mealType?: MealType;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

// STYLE MAP
const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-orange-50 text-primary border border-orange-200",
  secondary: "bg-gray-100 text-gray-700 border border-gray-200",
  success: "bg-green-50 text-green-700 border border-green-200",
  warning: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  danger: "bg-red-50 text-red-700 border border-red-200",
};

const mealTypeStyles: Record<MealType, string> = {
  Breakfast: "bg-purple-50 text-purple-700 border border-purple-500",
  Lunch: "bg-green-50 text-green-700 border border-green-500",
  Dinner: "bg-blue-50 text-blue-700 border border-blue-500",
  Dessert: "bg-pink-50 text-pink-700 border border-pink-500",
  Snacks: "bg-yellow-50 text-yellow-700 border border-yellow-500",
  Drinks: "bg-red-50 text-red-700 border border-red-500",
};

// COMPONENT
const Badge: FC<BadgeProps> = ({
  variant = "secondary",
  mealType,
  children,
  icon,
  className = "",
}) => {
  const baseStyles = `
    inline-flex items-center gap-1
    px-2.5 py-0.5
    text-xs font-medium
    rounded-full
    transition-colors duration-200
    whitespace-nowrap
  `;

  // Decide which style system to use
  const resolvedStyles = mealType
    ? mealTypeStyles[mealType]
    : variantStyles[variant];

  const combined = [baseStyles, resolvedStyles, className]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return (
    <span className={combined}>
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
