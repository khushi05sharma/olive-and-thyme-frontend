import { type FC, type ButtonHTMLAttributes, type ReactNode } from "react";
// TYPES
type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "small" | "medium" | "large";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
}

// STYLE MAP

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-orange-600 focus:ring-primary",
  secondary:
    "bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-400",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
};

const sizeStyles: Record<ButtonSize, string> = {
  small: "px-3 py-1.5 text-sm",
  medium: "px-4 py-2 text-base",
  large: "px-6 py-3 text-lg",
};

const Button: FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  children,
  className = "",
  disabled = false,
  type = "button",
  ...props // everything else (onClick, aria-*, etc.) passed straight to <button>
}) => {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;
  const combined = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className,
  ]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return (
    <button type={type} disabled={disabled} className={combined} {...props}>
      {children}
    </button>
  );
};

export default Button;
