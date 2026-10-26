/**
 * EventPilot AI - Core Domain Types
 * Strict, type-safe definitions for events, budgets, timelines, vendors, and AI plans.
 */

export type EventType = "wedding" | "birthday" | "community";

export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP";

export type PriorityLevel = "high" | "medium" | "low";

export type VendorStatus = "pending" | "researching" | "contacted" | "booked";

export type ExpenseCategory =
  | "venue"
  | "catering"
  | "decoration"
  | "photography"
  | "entertainment"
  | "transportation"
  | "invitations"
  | "supplies"
  | "miscellaneous"
  | "contingency";

export interface EventInput {
  name: string;
  eventType: EventType;
  eventDate: string; // ISO 8601 YYYY-MM-DD
  location: string;
  attendeeCount: number;
  totalBudget: number; // in base currency units (e.g., INR ₹)
  currency: CurrencyCode;
  themeStyle: string;
  priorities: string[];
  additionalRequirements?: string;
}

export interface BudgetAllocation {
  id: string;
  category: ExpenseCategory | string;
  categoryLabel: string;
  estimatedAmount: number; // in base currency units
  actualAmount: number;
  rationale: string;
  notes?: string;
}

export interface BudgetSummary {
  totalBudget: number;
  totalAllocated: number;
  totalActualSpent: number;
  remainingBudget: number;
  utilizationPercentage: number;
  isOverBudget: boolean;
  allocations: BudgetAllocation[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO 8601 YYYY-MM-DD
  priority: PriorityLevel;
  isCompleted: boolean;
  category?: string;
}

export interface TimelineData {
  milestones: Milestone[];
  isCompressed: boolean;
  urgentTasksCount: number;
}

export interface VendorItem {
  id: string;
  category: string;
  title: string;
  description: string;
  estimatedCost: number;
  status: VendorStatus;
  priority: PriorityLevel;
  deadline: string; // ISO 8601 YYYY-MM-DD
  notes?: string;
}

export interface PersonalizedIdea {
  id: string;
  category: "theme" | "activity" | "food" | "decor" | "cost_saving" | "experience";
  title: string;
  description: string;
  estimatedImpact: "high" | "medium" | "low";
  actionableStep: string;
}

export interface RiskAndMitigation {
  risk: string;
  mitigation: string;
}

export interface PlanChangelogEntry {
  id: string;
  timestamp: string;
  instruction: string;
  summaryOfChanges: string[];
}

export interface EventPlan {
  id: string;
  createdAt: string;
  updatedAt: string;
  eventInput: EventInput;
  budget: BudgetSummary;
  timeline: TimelineData;
  vendors: VendorItem[];
  ideas: PersonalizedIdea[];
  assumptions: string[];
  potentialRisksAndMitigations: RiskAndMitigation[];
  aiGenerated: boolean;
  aiModelUsed?: string;
  revisionsCount: number;
  changelog: PlanChangelogEntry[];
}

export interface PlanRevisionRequest {
  currentPlan: EventPlan;
  instruction: string;
}

export interface PlanRevisionResponse {
  updatedPlan: EventPlan;
  diffSummary: string[];
  explanation: string;
}
