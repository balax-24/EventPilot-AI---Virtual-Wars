"use client";

import React, { useState } from "react";
import {
  Coins,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  Info,
  TrendingDown,
  PieChart as PieIcon,
} from "lucide-react";
import { BudgetSummary, BudgetAllocation, CurrencyCode } from "@/types/event";
import { formatCurrency, calculateBudgetSummary } from "@/lib/currency";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";

interface BudgetPlannerProps {
  budget: BudgetSummary;
  currency: CurrencyCode;
  onBudgetUpdate: (updated: BudgetSummary) => void;
}

export function BudgetPlanner({ budget, currency, onBudgetUpdate }: BudgetPlannerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEstimated, setEditEstimated] = useState<number>(0);
  const [editActual, setEditActual] = useState<number>(0);
  const [editLabel, setEditLabel] = useState<string>("");

  // Add new allocation state
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newCategory, setNewCategory] = useState("miscellaneous");
  const [newAmount, setNewAmount] = useState<number>(1000);
  const [newRationale, setNewRationale] = useState("");

  const handleStartEdit = (item: BudgetAllocation) => {
    setEditingId(item.id);
    setEditEstimated(item.estimatedAmount);
    setEditActual(item.actualAmount);
    setEditLabel(item.categoryLabel);
  };

  const handleSaveEdit = (id: string) => {
    const updatedAllocations = budget.allocations.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          categoryLabel: editLabel.trim() || item.categoryLabel,
          estimatedAmount: Math.max(0, editEstimated),
          actualAmount: Math.max(0, editActual),
        };
      }
      return item;
    });

    const newSummary = calculateBudgetSummary(budget.totalBudget, updatedAllocations, currency);
    onBudgetUpdate(newSummary);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    const updatedAllocations = budget.allocations.filter((item) => item.id !== id);
    const newSummary = calculateBudgetSummary(budget.totalBudget, updatedAllocations, currency);
    onBudgetUpdate(newSummary);
  };

  const handleAddAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const newItem: BudgetAllocation = {
      id: `custom-${Date.now()}`,
      category: newCategory,
      categoryLabel: newLabel.trim(),
      estimatedAmount: Math.max(0, newAmount),
      actualAmount: 0,
      rationale: newRationale.trim() || "User added custom expense",
    };

    const updatedAllocations = [...budget.allocations, newItem];
    const newSummary = calculateBudgetSummary(budget.totalBudget, updatedAllocations, currency);
    onBudgetUpdate(newSummary);

    setIsAdding(false);
    setNewLabel("");
    setNewAmount(1000);
    setNewRationale("");
  };

  const handleAutoRebalance = () => {
    if (budget.allocations.length === 0) return;
    const currentSum = budget.allocations.reduce((sum, a) => sum + a.estimatedAmount, 0);
    if (currentSum === 0) return;

    const ratio = budget.totalBudget / currentSum;
    let running = 0;

    const rebalanced = budget.allocations.map((item, idx) => {
      if (idx === budget.allocations.length - 1) {
        return {
          ...item,
          estimatedAmount: Math.max(0, budget.totalBudget - running),
        };
      }
      const val = Math.round(item.estimatedAmount * ratio);
      running += val;
      return {
        ...item,
        estimatedAmount: val,
      };
    });

    const newSummary = calculateBudgetSummary(budget.totalBudget, rebalanced, currency);
    onBudgetUpdate(newSummary);
  };

  // Color palette for SVG donut chart segments
  const sliceColors = [
    "#6366f1",
    "#ec4899",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#06b6d4",
    "#3b82f6",
    "#14b8a6",
    "#f97316",
    "#64748b",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* Over-budget alert */}
      {budget.isOverBudget && (
        <Alert variant="danger" title="Budget Overrun Warning">
          Allocated expenses exceed your total budget by{" "}
          <strong>{formatCurrency(Math.abs(budget.remainingBudget), currency)}</strong>. Consider
          reducing individual category amounts or using the auto-rebalance feature below.
        </Alert>
      )}

      {/* Top Metric Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "1rem",
        }}
      >
        {/* Total Budget */}
        <Card style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.3rem" }}>
            Total Event Budget
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--text-primary)" }}>
            {formatCurrency(budget.totalBudget, currency)}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", marginTop: "0.3rem" }}>
            Target spending cap
          </div>
        </Card>

        {/* Total Allocated */}
        <Card style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.3rem" }}>
            Total Allocated
          </div>
          <div
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              color: budget.isOverBudget ? "var(--danger)" : "var(--accent-primary)",
            }}
          >
            {formatCurrency(budget.totalAllocated, currency)}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", marginTop: "0.3rem" }}>
            Across {budget.allocations.length} categories
          </div>
        </Card>

        {/* Remaining Budget */}
        <Card style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.3rem" }}>
            Remaining Unallocated
          </div>
          <div
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              color: budget.isOverBudget ? "var(--danger)" : "var(--success)",
            }}
          >
            {formatCurrency(budget.remainingBudget, currency)}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", marginTop: "0.3rem" }}>
            {budget.isOverBudget ? "Deficit" : "Surplus buffer"}
          </div>
        </Card>

        {/* Actual Spent */}
        <Card style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.3rem" }}>
            Actual Spent To Date
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--text-primary)" }}>
            {formatCurrency(budget.totalActualSpent, currency)}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", marginTop: "0.3rem" }}>
            Logged vendor payments
          </div>
        </Card>
      </div>

      {/* Progress Bar & Actions */}
      <Card style={{ padding: "1.25rem 1.5rem" }}>
        <ProgressBar
          value={budget.utilizationPercentage}
          label="Budget Allocation Utilization"
          isOverBudget={budget.isOverBudget}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginTop: "1rem",
            paddingTop: "0.75rem",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Need to adjust? Edit amounts directly in the table or auto-scale proportionally.
          </span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RotateCcw size={14} />}
              onClick={handleAutoRebalance}
            >
              Auto-Rebalance to Total
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => setIsAdding(!isAdding)}
            >
              {isAdding ? "Cancel" : "Add Expense Category"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Add Category Form Dropdown */}
      {isAdding && (
        <Card style={{ padding: "1.5rem", border: "1px solid var(--accent-primary)" }}>
          <h4 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: "1rem" }}>
            Add Custom Expense Category
          </h4>
          <form
            onSubmit={handleAddAllocation}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", marginBottom: "0.3rem" }}>
                Category Label *
              </label>
              <input
                type="text"
                required
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Wedding Cake, Security Guards"
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", marginBottom: "0.3rem" }}>
                Category Type
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              >
                <option value="venue">Venue</option>
                <option value="catering">Catering & Food</option>
                <option value="decoration">Decoration</option>
                <option value="photography">Photography</option>
                <option value="entertainment">Entertainment</option>
                <option value="transportation">Transportation</option>
                <option value="invitations">Invitations</option>
                <option value="supplies">Supplies & Equipment</option>
                <option value="miscellaneous">Miscellaneous</option>
                <option value="contingency">Contingency</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", marginBottom: "0.3rem" }}>
                Estimated Amount ({currency}) *
              </label>
              <input
                type="number"
                min={0}
                required
                value={newAmount}
                onChange={(e) => setNewAmount(Math.max(0, parseInt(e.target.value) || 0))}
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", fontSize: "0.82rem", marginBottom: "0.3rem" }}>
                Rationale / Notes
              </label>
              <input
                type="text"
                value={newRationale}
                onChange={(e) => setNewRationale(e.target.value)}
                placeholder="Why is this allocation required?"
              />
            </div>
            <div style={{ gridColumn: "1 / -1", display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" leftIcon={<Plus size={14} />}>
                Save Category
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Allocations Table */}
      <Card style={{ padding: "0", overflow: "hidden" }}>
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>Category Breakdown & Allocations</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
              Click edit on any row to adjust estimates or record actual vendor payments.
            </p>
          </div>
          <Badge variant="primary">
            {budget.allocations.length} Categories
          </Badge>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: "0.92rem",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  borderBottom: "1px solid var(--border-subtle)",
                  color: "var(--text-secondary)",
                  fontSize: "0.82rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                <th style={{ padding: "0.85rem 1.25rem" }}>Category</th>
                <th style={{ padding: "0.85rem 1.25rem" }}>Estimated</th>
                <th style={{ padding: "0.85rem 1.25rem" }}>Actual Spent</th>
                <th style={{ padding: "0.85rem 1.25rem" }}>Rationale / Scope</th>
                <th style={{ padding: "0.85rem 1.25rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {budget.allocations.map((item, index) => {
                const isEditing = editingId === item.id;
                const percentOfBudget =
                  budget.totalBudget > 0
                    ? Math.round((item.estimatedAmount / budget.totalBudget) * 100)
                    : 0;
                const dotColor = sliceColors[index % sliceColors.length];

                return (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: "1px solid var(--border-subtle)",
                      backgroundColor: isEditing ? "rgba(99, 102, 241, 0.08)" : "transparent",
                      transition: "background-color var(--transition-fast)",
                    }}
                  >
                    {/* Category Label */}
                    <td style={{ padding: "1rem 1.25rem" }}>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editLabel}
                          onChange={(e) => setEditLabel(e.target.value)}
                          style={{ width: "100%", minWidth: "140px" }}
                        />
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          <span
                            style={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              backgroundColor: dotColor,
                              flexShrink: 0,
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                              {item.categoryLabel}
                            </div>
                            <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)" }}>
                              {percentOfBudget}% of total budget
                            </div>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Estimated Amount */}
                    <td style={{ padding: "1rem 1.25rem", whiteSpace: "nowrap" }}>
                      {isEditing ? (
                        <input
                          type="number"
                          min={0}
                          value={editEstimated}
                          onChange={(e) => setEditEstimated(Math.max(0, parseInt(e.target.value) || 0))}
                          style={{ width: "120px" }}
                        />
                      ) : (
                        <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                          {formatCurrency(item.estimatedAmount, currency)}
                        </span>
                      )}
                    </td>

                    {/* Actual Amount */}
                    <td style={{ padding: "1rem 1.25rem", whiteSpace: "nowrap" }}>
                      {isEditing ? (
                        <input
                          type="number"
                          min={0}
                          value={editActual}
                          onChange={(e) => setEditActual(Math.max(0, parseInt(e.target.value) || 0))}
                          style={{ width: "120px" }}
                        />
                      ) : (
                        <span
                          style={{
                            color: item.actualAmount > 0 ? "var(--text-primary)" : "var(--text-tertiary)",
                          }}
                        >
                          {item.actualAmount > 0
                            ? formatCurrency(item.actualAmount, currency)
                            : "—"}
                        </span>
                      )}
                    </td>

                    {/* Rationale */}
                    <td style={{ padding: "1rem 1.25rem", color: "var(--text-secondary)", fontSize: "0.88rem" }}>
                      <div>{item.rationale}</div>
                      {item.notes && (
                        <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", marginTop: "0.2rem" }}>
                          Note: {item.notes}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "1rem 1.25rem", textAlign: "right", whiteSpace: "nowrap" }}>
                      {isEditing ? (
                        <Button
                          variant="success"
                          size="sm"
                          leftIcon={<Check size={14} />}
                          onClick={() => handleSaveEdit(item.id)}
                        >
                          Done
                        </Button>
                      ) : (
                        <div style={{ display: "inline-flex", gap: "0.35rem" }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label={`Edit ${item.categoryLabel}`}
                            onClick={() => handleStartEdit(item)}
                            style={{ padding: "0.35rem" }}
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label={`Delete ${item.categoryLabel}`}
                            onClick={() => handleDelete(item.id)}
                            style={{ padding: "0.35rem", color: "var(--danger)" }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Advisory disclaimer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.82rem",
          color: "var(--text-tertiary)",
          padding: "0 0.5rem",
        }}
      >
        <Info size={16} />
        <span>
          Advisory note: All AI-generated estimates are structured planning benchmarks and do not
          represent binding vendor contracts or verified merchant quotes.
        </span>
      </div>
    </div>
  );
}
