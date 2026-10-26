import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "primary";
  children: React.ReactNode;
}

export function Badge({
  variant = "default",
  children,
  className = "",
  style,
  ...props
}: BadgeProps) {
  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      backgroundColor: "var(--bg-tertiary)",
      color: "var(--text-secondary)",
      border: "1px solid var(--border-subtle)",
    },
    primary: {
      backgroundColor: "rgba(99, 102, 241, 0.15)",
      color: "#a5b4fc",
      border: "1px solid rgba(99, 102, 241, 0.3)",
    },
    success: {
      backgroundColor: "var(--success-bg)",
      color: "var(--success)",
      border: "1px solid rgba(16, 185, 129, 0.25)",
    },
    warning: {
      backgroundColor: "var(--warning-bg)",
      color: "var(--warning)",
      border: "1px solid rgba(245, 158, 11, 0.25)",
    },
    danger: {
      backgroundColor: "var(--danger-bg)",
      color: "var(--danger)",
      border: "1px solid rgba(239, 68, 68, 0.25)",
    },
    info: {
      backgroundColor: "var(--info-bg)",
      color: "var(--info)",
      border: "1px solid rgba(6, 182, 212, 0.25)",
    },
  };

  const badgeStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.3rem",
    padding: "0.2rem 0.6rem",
    borderRadius: "var(--radius-full)",
    fontSize: "0.78rem",
    fontWeight: 600,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    ...variantStyles[variant],
    ...style,
  };

  return (
    <span style={badgeStyle} className={className} {...props}>
      {children}
    </span>
  );
}
