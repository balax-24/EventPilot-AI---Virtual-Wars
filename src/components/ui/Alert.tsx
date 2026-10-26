import React from "react";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

export interface AlertProps {
  variant?: "info" | "warning" | "danger" | "success";
  title?: string;
  children: React.ReactNode;
  icon?: boolean;
}

export function Alert({
  variant = "info",
  title,
  children,
  icon = true,
}: AlertProps) {
  const configs = {
    info: {
      bg: "var(--info-bg)",
      border: "rgba(6, 182, 212, 0.3)",
      color: "var(--info)",
      Icon: Info,
    },
    warning: {
      bg: "var(--warning-bg)",
      border: "rgba(245, 158, 11, 0.3)",
      color: "var(--warning)",
      Icon: AlertTriangle,
    },
    danger: {
      bg: "var(--danger-bg)",
      border: "rgba(239, 68, 68, 0.3)",
      color: "var(--danger)",
      Icon: AlertCircle,
    },
    success: {
      bg: "var(--success-bg)",
      border: "rgba(16, 185, 129, 0.3)",
      color: "var(--success)",
      Icon: CheckCircle2,
    },
  };

  const current = configs[variant];
  const IconComponent = current.Icon;

  return (
    <div
      role="alert"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.75rem",
        padding: "0.9rem 1.1rem",
        backgroundColor: current.bg,
        border: `1px solid ${current.border}`,
        borderRadius: "var(--radius-md)",
        color: "var(--text-primary)",
        fontSize: "0.92rem",
        margin: "0.75rem 0",
      }}
    >
      {icon && (
        <span style={{ color: current.color, flexShrink: 0, marginTop: "0.1rem" }}>
          <IconComponent size={20} aria-hidden="true" />
        </span>
      )}
      <div style={{ flex: 1 }}>
        {title && (
          <h4
            style={{
              fontWeight: 600,
              fontSize: "0.95rem",
              color: current.color,
              marginBottom: "0.2rem",
            }}
          >
            {title}
          </h4>
        )}
        <div style={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>{children}</div>
      </div>
    </div>
  );
}
