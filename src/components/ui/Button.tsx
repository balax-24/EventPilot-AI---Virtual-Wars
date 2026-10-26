"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      className = "",
      style,
      ...props
    },
    ref
  ) => {
    // Styling styles based on variants
    const baseStyle: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      fontWeight: 500,
      borderRadius: "var(--radius-md)",
      transition: "all var(--transition-fast)",
      whiteSpace: "nowrap",
      cursor: disabled || isLoading ? "not-allowed" : "pointer",
      opacity: disabled || isLoading ? 0.6 : 1,
      textDecoration: "none",
    };

    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: { padding: "0.4rem 0.75rem", fontSize: "0.85rem" },
      md: { padding: "0.6rem 1.15rem", fontSize: "0.95rem" },
      lg: { padding: "0.85rem 1.6rem", fontSize: "1.05rem" },
    };

    const variantStyles: Record<string, React.CSSProperties> = {
      primary: {
        background: "var(--accent-gradient)",
        color: "#ffffff",
        boxShadow: "0 2px 8px rgba(99, 102, 241, 0.3)",
      },
      secondary: {
        background: "var(--bg-tertiary)",
        color: "var(--text-primary)",
        border: "1px solid var(--border-subtle)",
      },
      outline: {
        background: "transparent",
        color: "var(--text-primary)",
        border: "1px solid var(--border-medium)",
      },
      ghost: {
        background: "transparent",
        color: "var(--text-secondary)",
      },
      danger: {
        background: "var(--danger)",
        color: "#ffffff",
      },
      success: {
        background: "var(--success)",
        color: "#ffffff",
      },
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        style={{
          ...baseStyle,
          ...sizeStyles[size],
          ...variantStyles[variant],
          ...style,
        }}
        className={className}
        {...props}
      >
        {isLoading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
        {!isLoading && leftIcon}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
