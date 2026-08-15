import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "slate" | "success" | "warning" | "danger" | "outline";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  return (
    <span
      data-variant={variant}
      className={`pc-badge ${variant} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
};
