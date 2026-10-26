import { describe, it, expect } from "vitest";
import {
  toMinorUnits,
  fromMinorUnits,
  formatCurrency,
  calculateBudgetSummary,
} from "@/lib/currency";
import { BudgetAllocation } from "@/types/event";

describe("Currency & Budget Calculations Engine", () => {
  it("converts amounts to integer minor units without floating-point error", () => {
    expect(toMinorUnits(15000, "INR")).toBe(1500000);
    expect(toMinorUnits(15000.5, "INR")).toBe(1500050);
    expect(toMinorUnits(0, "INR")).toBe(0);
    expect(toMinorUnits(-10, "INR")).toBe(0);
  });

  it("converts minor units back to major units accurately", () => {
    expect(fromMinorUnits(1500000, "INR")).toBe(15000);
    expect(fromMinorUnits(1500050, "INR")).toBe(15000.5);
  });

  it("formats currencies appropriately with INR symbols and compact options", () => {
    const formatted = formatCurrency(15000, "INR");
    expect(formatted).toContain("15,000");

    const compactLakh = formatCurrency(800000, "INR", { compact: true });
    expect(compactLakh).toBe("₹8 L");

    const compactCrore = formatCurrency(15000000, "INR", { compact: true });
    expect(compactCrore).toBe("₹1.5 Cr");
  });

  it("accurately calculates total allocated, remaining budget, and utilization percentage", () => {
    const allocations: BudgetAllocation[] = [
      {
        id: "1",
        category: "venue",
        categoryLabel: "Venue",
        estimatedAmount: 5000,
        actualAmount: 5000,
        rationale: "Community hall booking",
      },
      {
        id: "2",
        category: "catering",
        categoryLabel: "Catering",
        estimatedAmount: 6000,
        actualAmount: 5500,
        rationale: "Snacks and beverages",
      },
      {
        id: "3",
        category: "contingency",
        categoryLabel: "Contingency",
        estimatedAmount: 1500,
        actualAmount: 0,
        rationale: "Emergency fund",
      },
    ];

    const summary = calculateBudgetSummary(15000, allocations, "INR");

    expect(summary.totalBudget).toBe(15000);
    expect(summary.totalAllocated).toBe(12500);
    expect(summary.totalActualSpent).toBe(10500);
    expect(summary.remainingBudget).toBe(2500);
    expect(summary.utilizationPercentage).toBe(83);
    expect(summary.isOverBudget).toBe(false);
  });

  it("flags over-budget scenarios when allocations exceed total budget", () => {
    const allocations: BudgetAllocation[] = [
      {
        id: "1",
        category: "venue",
        categoryLabel: "Venue",
        estimatedAmount: 12000,
        actualAmount: 0,
        rationale: "Expensive lawn",
      },
      {
        id: "2",
        category: "catering",
        categoryLabel: "Catering",
        estimatedAmount: 5000,
        actualAmount: 0,
        rationale: "Buffet",
      },
    ];

    const summary = calculateBudgetSummary(15000, allocations, "INR");

    expect(summary.totalAllocated).toBe(17000);
    expect(summary.remainingBudget).toBe(-2000);
    expect(summary.isOverBudget).toBe(true);
    expect(summary.utilizationPercentage).toBe(113);
  });
});
