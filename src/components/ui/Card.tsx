import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glass?: boolean;
  interactive?: boolean;
}

export function Card({
  children,
  glass = true,
  interactive = false,
  className = "",
  style,
  ...props
}: CardProps) {
  const cardStyle: React.CSSProperties = {
    padding: "1.5rem",
    borderRadius: "var(--radius-lg)",
    backgroundColor: glass ? "var(--bg-card)" : "var(--bg-secondary)",
    border: "1px solid var(--border-subtle)",
    backdropFilter: glass ? "blur(12px)" : undefined,
    WebkitBackdropFilter: glass ? "blur(12px)" : undefined,
    boxShadow: "var(--shadow-sm)",
    transition: "all var(--transition-normal)",
    position: "relative",
    overflow: "hidden",
    ...style,
  };

  const classes = [
    glass ? "glass-panel" : "",
    interactive ? "interactive-card" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div style={cardStyle} className={classes} {...props}>
      {children}
    </div>
  );
}
