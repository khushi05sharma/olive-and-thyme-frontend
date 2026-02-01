import { type FC, type ReactNode } from "react";
// TYPES
type BadgeVariant = "primary" | "secondary" | "success" | "warning" | "danger";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  icon: ReactNode;
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

// COMPONENT
const Badge: FC<BadgeProps> = ({
  variant = "secondary",
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
  `;

  const combined = [baseStyles, variantStyles[variant], className]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return (
    <span className={combined}>
      {/* Icon renders only if passed */}
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
