import React from "react";

export interface ProgressBarProps {
  value: number; // 0 to 100+
  max?: number;
  label?: string;
  showLabel?: boolean;
  isOverBudget?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showLabel = true,
  isOverBudget = false,
}: ProgressBarProps) {
  const percentage = Math.max(0, value);
  const clampedDisplay = Math.min(100, percentage);

  let barColor = "var(--accent-gradient)";
  if (isOverBudget || percentage > 100) {
    barColor = "linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)";
  } else if (percentage >= 90) {
    barColor = "var(--warning)";
  } else if (percentage > 0) {
    barColor = "linear-gradient(90deg, #6366f1 0%, #10b981 100%)";
  }

  return (
    <div style={{ width: "100%", margin: "0.5rem 0" }}>
      {showLabel && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.85rem",
            color: "var(--text-secondary)",
            marginBottom: "0.35rem",
          }}
        >
          <span>{label || "Utilization"}</span>
          <span
            style={{
              fontWeight: 600,
              color: isOverBudget ? "var(--danger)" : "var(--text-primary)",
            }}
          >
            {percentage}% {isOverBudget && "(Over Budget)"}
          </span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || "Budget Progress"}
        style={{
          width: "100%",
          height: "8px",
          backgroundColor: "var(--bg-tertiary)",
          borderRadius: "var(--radius-full)",
          overflow: "hidden",
          border: isOverBudget ? "1px solid var(--danger)" : "1px solid var(--border-subtle)",
        }}
      >
        <div
          style={{
            width: `${clampedDisplay}%`,
            height: "100%",
            background: barColor,
            borderRadius: "var(--radius-full)",
            transition: "width var(--transition-normal)",
          }}
        />
      </div>
    </div>
  );
}
