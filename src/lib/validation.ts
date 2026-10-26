/**
 * Validation Schemas with Zod
 * Enforces strict boundary validation on client requests, database data, and AI responses.
 */

import { z } from "zod";

/**
 * Event Creation Input Schema
 */
export const EventInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Event name must be at least 2 characters")
    .max(120, "Event name cannot exceed 120 characters"),
  eventType: z.enum(["wedding", "birthday", "community"], {
    errorMap: () => ({ message: "Event type must be Wedding, Birthday, or Community event" }),
  }),
  eventDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Event date must be in YYYY-MM-DD format")
    .refine((dateStr) => {
      const parsed = new Date(dateStr);
      if (isNaN(parsed.getTime())) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return parsed >= today;
    }, "Event date cannot be in the past"),
  location: z
    .string()
    .trim()
    .min(2, "Location must be at least 2 characters")
    .max(150, "Location cannot exceed 150 characters"),
  attendeeCount: z
    .number({ invalid_type_error: "Attendee count must be a number" })
    .int("Attendee count must be an integer")
    .min(1, "Attendee count must be at least 1")
    .max(100000, "Attendee count cannot exceed 100,000"),
  totalBudget: z
    .number({ invalid_type_error: "Total budget must be a number" })
    .positive("Budget must be a positive amount")
    .min(100, "Budget must be at least 100")
    .max(1000000000, "Budget cannot exceed 100 Crore"),
  currency: z.enum(["INR", "USD", "EUR", "GBP"]).default("INR"),
  themeStyle: z
    .string()
    .trim()
    .min(2, "Theme or style must be specified")
    .max(100, "Theme cannot exceed 100 characters"),
  priorities: z
    .array(z.string().trim().min(1))
    .min(1, "Please select or specify at least one priority"),
  additionalRequirements: z
    .string()
    .trim()
    .max(1500, "Additional requirements cannot exceed 1,500 characters")
    .optional()
    .default(""),
});

export type ValidatedEventInput = z.infer<typeof EventInputSchema>;

/**
 * Single Budget Allocation Item Schema
 */
export const BudgetAllocationSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  category: z.string().trim().min(1, "Category is required"),
  categoryLabel: z.string().trim().min(1, "Category label is required"),
  estimatedAmount: z
    .number()
    .min(0, "Estimated amount cannot be negative")
    .max(1000000000, "Amount exceeds maximum limit"),
  actualAmount: z
    .number()
    .min(0, "Actual amount cannot be negative")
    .default(0),
  rationale: z.string().trim().default(""),
  notes: z.string().trim().optional(),
});

/**
 * Milestone Schema
 */
export const MilestoneSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  title: z.string().trim().min(2, "Milestone title is required"),
  description: z.string().trim().default(""),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must be in YYYY-MM-DD format"),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
  isCompleted: z.boolean().default(false),
  category: z.string().trim().optional(),
});

/**
 * Vendor Checklist Item Schema
 */
export const VendorItemSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  category: z.string().trim().min(1, "Vendor category is required"),
  title: z.string().trim().min(2, "Service or item title is required"),
  description: z.string().trim().default(""),
  estimatedCost: z.number().min(0, "Cost cannot be negative").default(0),
  status: z.enum(["pending", "researching", "contacted", "booked"]).default("pending"),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Deadline must be in YYYY-MM-DD format"),
  notes: z.string().trim().optional(),
});

/**
 * Personalized Idea Schema
 */
export const PersonalizedIdeaSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  category: z.enum(["theme", "activity", "food", "decor", "cost_saving", "experience"]),
  title: z.string().trim().min(2, "Idea title is required"),
  description: z.string().trim().min(5, "Idea description is required"),
  estimatedImpact: z.enum(["high", "medium", "low"]).default("medium"),
  actionableStep: z.string().trim().default(""),
});

/**
 * AI Generated Output Schema (Strict structure returned by LLM)
 */
export const AIGeneratedPlanOutputSchema = z.object({
  allocations: z.array(BudgetAllocationSchema).min(3, "Plan must have at least 3 budget categories"),
  milestones: z.array(MilestoneSchema).min(3, "Plan must have at least 3 preparation milestones"),
  vendors: z.array(VendorItemSchema).min(3, "Plan must have at least 3 vendor items"),
  ideas: z.array(PersonalizedIdeaSchema).min(3, "Plan must have at least 3 personalized ideas"),
  assumptions: z.array(z.string().trim()).default([]),
  potentialRisksAndMitigations: z
    .array(
      z.object({
        risk: z.string().trim().min(2),
        mitigation: z.string().trim().min(2),
      })
    )
    .default([]),
});

export type AIGeneratedPlanOutput = z.infer<typeof AIGeneratedPlanOutputSchema>;

/**
 * Natural Language Revision Request Schema
 */
export const RefinePlanRequestSchema = z.object({
  instruction: z
    .string()
    .trim()
    .min(3, "Instruction must be at least 3 characters")
    .max(500, "Instruction cannot exceed 500 characters"),
  currentPlan: z.any(), // Validated deeply in business logic
});
