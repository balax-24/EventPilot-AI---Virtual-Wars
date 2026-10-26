import { describe, it, expect } from "vitest";
import {
  EventInputSchema,
  BudgetAllocationSchema,
  MilestoneSchema,
  AIGeneratedPlanOutputSchema,
} from "@/lib/validation";

describe("Validation Schemas & Boundary Rules", () => {
  const validEventInput = {
    name: "Aarav's 5th Birthday",
    eventType: "birthday",
    eventDate: "2026-12-15",
    location: "Chennai",
    attendeeCount: 30,
    totalBudget: 15000,
    currency: "INR",
    themeStyle: "Superhero Adventure",
    priorities: ["Delicious Food", "Fun Games"],
    additionalRequirements: "Need eggless cake",
  };

  it("accepts valid event input parameters", () => {
    const result = EventInputSchema.safeParse(validEventInput);
    expect(result.success).toBe(true);
  });

  it("rejects event dates in the past", () => {
    const invalidPast = {
      ...validEventInput,
      eventDate: "2020-01-01",
    };
    const result = EventInputSchema.safeParse(invalidPast);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain("cannot be in the past");
    }
  });

  it("rejects invalid attendee counts (0 or negative)", () => {
    const zeroAttendees = { ...validEventInput, attendeeCount: 0 };
    expect(EventInputSchema.safeParse(zeroAttendees).success).toBe(false);

    const negativeAttendees = { ...validEventInput, attendeeCount: -5 };
    expect(EventInputSchema.safeParse(negativeAttendees).success).toBe(false);
  });

  it("rejects negative or excessively small budgets", () => {
    const negativeBudget = { ...validEventInput, totalBudget: -500 };
    expect(EventInputSchema.safeParse(negativeBudget).success).toBe(false);

    const tinyBudget = { ...validEventInput, totalBudget: 50 };
    expect(EventInputSchema.safeParse(tinyBudget).success).toBe(false);
  });

  it("rejects empty event name and excessively long strings", () => {
    const emptyName = { ...validEventInput, name: "" };
    expect(EventInputSchema.safeParse(emptyName).success).toBe(false);

    const oversizedName = { ...validEventInput, name: "A".repeat(150) };
    expect(EventInputSchema.safeParse(oversizedName).success).toBe(false);
  });

  it("validates individual budget allocation items", () => {
    const validAlloc = {
      id: "a-1",
      category: "catering",
      categoryLabel: "Catering",
      estimatedAmount: 5000,
      actualAmount: 4800,
      rationale: "Per guest meals",
    };
    expect(BudgetAllocationSchema.safeParse(validAlloc).success).toBe(true);

    const negativeAmount = { ...validAlloc, estimatedAmount: -100 };
    expect(BudgetAllocationSchema.safeParse(negativeAmount).success).toBe(false);
  });

  it("validates AI structured plan schema strictly", () => {
    const validAIOutput = {
      allocations: [
        {
          id: "1",
          category: "venue",
          categoryLabel: "Venue",
          estimatedAmount: 5000,
          actualAmount: 0,
          rationale: "Hall rental",
        },
        {
          id: "2",
          category: "catering",
          categoryLabel: "Food",
          estimatedAmount: 6000,
          actualAmount: 0,
          rationale: "Buffet",
        },
        {
          id: "3",
          category: "contingency",
          categoryLabel: "Contingency",
          estimatedAmount: 1000,
          actualAmount: 0,
          rationale: "Buffer",
        },
      ],
      milestones: [
        {
          id: "m-1",
          title: "Book Venue",
          description: "Inspect location",
          dueDate: "2026-11-20",
          priority: "high",
          isCompleted: false,
        },
        {
          id: "m-2",
          title: "Order Cake",
          description: "Finalize theme",
          dueDate: "2026-11-25",
          priority: "medium",
          isCompleted: false,
        },
        {
          id: "m-3",
          title: "Send Invites",
          description: "WhatsApp RSVP",
          dueDate: "2026-11-28",
          priority: "high",
          isCompleted: false,
        },
      ],
      vendors: [
        {
          id: "v-1",
          category: "Venue",
          title: "Party Lawn",
          description: "Private room",
          estimatedCost: 5000,
          status: "pending",
          priority: "high",
          deadline: "2026-11-20",
        },
        {
          id: "v-2",
          category: "Catering",
          title: "Caterer",
          description: "Snack buffet",
          estimatedCost: 6000,
          status: "pending",
          priority: "high",
          deadline: "2026-11-22",
        },
        {
          id: "v-3",
          category: "Bakery",
          title: "Bakery",
          description: "Cake",
          estimatedCost: 1500,
          status: "pending",
          priority: "medium",
          deadline: "2026-11-25",
        },
      ],
      ideas: [
        {
          id: "i-1",
          category: "activity",
          title: "Superhero Obstacle Course",
          description: "Cardboard laser maze for kids",
          estimatedImpact: "high",
          actionableStep: "Set up yarn laser maze in garden",
        },
        {
          id: "i-2",
          category: "food",
          title: "Theme Cupcakes",
          description: "Emblem cupcakes",
          estimatedImpact: "medium",
          actionableStep: "Order matching toppers",
        },
        {
          id: "i-3",
          category: "cost_saving",
          title: "DIY Mask Station",
          description: "Kids decorate felt superhero masks",
          estimatedImpact: "high",
          actionableStep: "Buy 30 plain felt masks online",
        },
      ],
      assumptions: ["Indoor party area confirmed"],
      potentialRisksAndMitigations: [
        {
          risk: "Late guests",
          mitigation: "Stagger cake cutting 1 hour after arrival",
        },
      ],
    };

    expect(AIGeneratedPlanOutputSchema.safeParse(validAIOutput).success).toBe(true);
  });
});
