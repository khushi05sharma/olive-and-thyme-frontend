import { type FC, type InputHTMLAttributes, type ReactNode } from "react";

// Extends native <input> props so value, onChange, placeholder etc work automatically
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string; // text above the input
  error?: string; // red error message below
  icon?: ReactNode; // optional icon inside input (left side)
  className?: string;
}

// COMPONENT

const Input: FC<InputProps> = ({
  label,
  error,
  icon,
  className = "",
  required = false,
  disabled = false,
  type = "text",
  ...props // everything else (value, onChange, placeholder, id, etc.)
}) => {
  // Border changes to red if there is an error
  const inputBorderStyles = error
    ? "border-red-400 focus:ring-red-400"
    : "border-gray-300 focus:ring-primary";

  const inputBaseStyles = `
    w-full py-2 rounded-lg border
    focus:outline-none focus:ring-2 focus:border-transparent
    transition duration-200
    disabled:bg-gray-100 disabled:cursor-not-allowed
  `;

  // If icon is passed, add left padding so text doesn't overlap icon
  const inputPadding = icon ? "pl-10 pr-4" : "px-4";

  const combined = [inputBaseStyles, inputBorderStyles, inputPadding, className]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return (
    <div className="flex flex-col gap-1.5">
      {/* LABEL */}
      {/* Only renders if label prop is passed */}
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {/* Red asterisk shows if field is required */}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      {/* INPUT WRAPPER */}
      {/* Relative positioning so icon can be placed inside */}
      <div className="relative">
        {/* ICON */}
        {/* Only renders if icon prop is passed */}
        {icon && (
          <span className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2">
            {icon}
          </span>
        )}

        {/* ACTUAL INPUT */}
        <input
          type={type}
          required={required}
          disabled={disabled}
          className={combined}
          {...props}
        />
      </div>

      {/* ERROR MESSAGE */}
      {/* Only renders if error prop is passed */}
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default Input;
