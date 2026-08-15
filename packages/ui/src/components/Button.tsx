import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "primary", size = "md", isLoading = false, className = "", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        data-variant={variant}
        data-size={size}
        className={`pc-button ${variant} ${size} ${className}`.trim()}
        {...props}
      >
        {isLoading ? <span className="pc-spinner mr-2" /> : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
