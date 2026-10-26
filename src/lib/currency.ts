/**
 * Currency and Monetary Calculations
 * Uses integer minor units (paise/cents) to eliminate floating-point arithmetic errors.
 */

import { CurrencyCode, BudgetAllocation, BudgetSummary } from "@/types/event";

/**
 * Currency metadata: minor unit multiplier (100 for INR, USD, EUR, GBP)
 */
const CURRENCY_CONFIG: Record<CurrencyCode, { symbol: string; locale: string; decimals: number }> = {
  INR: { symbol: "₹", locale: "en-IN", decimals: 2 },
  USD: { symbol: "$", locale: "en-US", decimals: 2 },
  EUR: { symbol: "€", locale: "de-DE", decimals: 2 },
  GBP: { symbol: "£", locale: "en-GB", decimals: 2 },
};

/**
 * Convert standard currency amount to integer minor units (e.g. ₹15,000.50 -> 1500050 paise)
 */
export function toMinorUnits(amount: number, currency: CurrencyCode = "INR"): number {
  if (!Number.isFinite(amount)) return 0;
  const safeAmount = Math.max(0, amount);
  const decimals = CURRENCY_CONFIG[currency]?.decimals ?? 2;
  const multiplier = Math.pow(10, decimals);
  return Math.round(safeAmount * multiplier);
}

/**
 * Convert integer minor units back to standard decimal currency amount
 */
export function fromMinorUnits(minorUnits: number, currency: CurrencyCode = "INR"): number {
  if (!Number.isFinite(minorUnits)) return 0;
  const decimals = CURRENCY_CONFIG[currency]?.decimals ?? 2;
  const multiplier = Math.pow(10, decimals);
  return minorUnits / multiplier;
}

/**
 * Format currency amount for display
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode = "INR",
  options?: { compact?: boolean }
): string {
  if (!Number.isFinite(amount)) return `${CURRENCY_CONFIG[currency]?.symbol ?? "₹"}0`;

  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.INR;

  if (options?.compact && Math.abs(amount) >= 100000) {
    if (currency === "INR") {
      // Indian numbering system (Lakhs, Crores)
      if (Math.abs(amount) >= 10000000) {
        const cr = (amount / 10000000).toFixed(2).replace(/\.?0+$/, "");
        return `₹${cr} Cr`;
      }
      const lk = (amount / 100000).toFixed(2).replace(/\.?0+$/, "");
      return `₹${lk} L`;
    }
    // Western compact
    if (Math.abs(amount) >= 1000000) {
      return `${config.symbol}${(amount / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
    }
    if (Math.abs(amount) >= 1000) {
      return `${config.symbol}${(amount / 1000).toFixed(0)}k`;
    }
  }

  try {
    return new Intl.NumberFormat(config.locale, {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${config.symbol}${amount.toLocaleString()}`;
  }
}

/**
 * Recalculate complete budget summary from total budget and allocations
 * Guaranteed exact integer math with zero floating-point accumulation
 */
export function calculateBudgetSummary(
  totalBudget: number,
  allocations: BudgetAllocation[],
  currency: CurrencyCode = "INR"
): BudgetSummary {
  const safeTotalBudget = Math.max(0, Number.isFinite(totalBudget) ? totalBudget : 0);
  const totalBudgetMinor = toMinorUnits(safeTotalBudget, currency);

  let allocatedMinor = 0;
  let spentMinor = 0;

  for (const item of allocations) {
    const est = Math.max(0, Number.isFinite(item.estimatedAmount) ? item.estimatedAmount : 0);
    const act = Math.max(0, Number.isFinite(item.actualAmount) ? item.actualAmount : 0);

    allocatedMinor += toMinorUnits(est, currency);
    spentMinor += toMinorUnits(act, currency);
  }

  const totalAllocated = fromMinorUnits(allocatedMinor, currency);
  const totalActualSpent = fromMinorUnits(spentMinor, currency);
  const remainingMinor = totalBudgetMinor - allocatedMinor;
  const remainingBudget = fromMinorUnits(remainingMinor, currency);

  const utilizationPercentage =
    totalBudgetMinor > 0 ? Math.min(999, Math.round((allocatedMinor / totalBudgetMinor) * 100)) : 0;

  const isOverBudget = remainingMinor < 0;

  return {
    totalBudget: safeTotalBudget,
    totalAllocated,
    totalActualSpent,
    remainingBudget,
    utilizationPercentage,
    isOverBudget,
    allocations,
  };
}
