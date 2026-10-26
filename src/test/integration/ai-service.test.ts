import { describe, it, expect } from "vitest";
import { generateEventPlan, refineEventPlan } from "@/lib/ai/gemini";
import { EventInput } from "@/types/event";

describe("AI Planning Engine Integration", () => {
  const weddingInput: EventInput = {
    name: "Raghav & Ananya Wedding",
    eventType: "wedding",
    eventDate: "2026-11-20",
    location: "Bangalore",
    attendeeCount: 200,
    totalBudget: 800000,
    currency: "INR",
    themeStyle: "Royal South Indian Silk & Gold",
    priorities: ["Banquet Food", "Floral Decor"],
    additionalRequirements: "Outdoor lawn mandap setup",
  };

  it("generates a complete structured plan with balanced allocations matching the total budget", async () => {
    const plan = await generateEventPlan(weddingInput);

    expect(plan).toBeDefined();
    expect(plan.eventInput.name).toBe(weddingInput.name);
    expect(plan.eventInput.eventType).toBe("wedding");

    // Strict Budget Validation: Sum of allocations must equal totalBudget
    const sumAllocated = plan.budget.allocations.reduce(
      (sum, item) => sum + item.estimatedAmount,
      0
    );
    expect(sumAllocated).toBe(weddingInput.totalBudget);
    expect(plan.budget.totalBudget).toBe(weddingInput.totalBudget);
    expect(plan.budget.isOverBudget).toBe(false);

    // Milestones validation
    expect(plan.timeline.milestones.length).toBeGreaterThanOrEqual(4);
    for (const milestone of plan.timeline.milestones) {
      expect(new Date(milestone.dueDate).getTime()).toBeLessThanOrEqual(
        new Date(weddingInput.eventDate).getTime()
      );
    }

    // Vendor validation
    expect(plan.vendors.length).toBeGreaterThanOrEqual(3);
    for (const vendor of plan.vendors) {
      expect(vendor.estimatedCost).toBeGreaterThanOrEqual(0);
      expect(new Date(vendor.deadline).getTime()).toBeLessThanOrEqual(
        new Date(weddingInput.eventDate).getTime()
      );
    }

    // Ideas and risks validation
    expect(plan.ideas.length).toBeGreaterThanOrEqual(2);
    expect(plan.potentialRisksAndMitigations.length).toBeGreaterThanOrEqual(1);
    expect(plan.changelog.length).toBeGreaterThanOrEqual(1);
  });

  it("generates an event plan for a community event with compressed preparation if imminent", async () => {
    // Date 10 days from now
    const imminentDate = new Date();
    imminentDate.setDate(imminentDate.getDate() + 10);
    const dateStr = imminentDate.toISOString().split("T")[0];

    const communityInput: EventInput = {
      name: "Besant Nagar Beach Cleanup",
      eventType: "community",
      eventDate: dateStr,
      location: "Chennai",
      attendeeCount: 100,
      totalBudget: 25000,
      currency: "INR",
      themeStyle: "Zero-Waste Marine Drive",
      priorities: ["Safety Gear", "Volunteer Hydration"],
    };

    const plan = await generateEventPlan(communityInput);

    expect(plan.eventInput.eventType).toBe("community");
    expect(plan.timeline.isCompressed).toBe(true);
    expect(plan.budget.totalBudget).toBe(25000);
    expect(plan.budget.totalAllocated).toBe(25000);
  });

  it("refines a plan using natural language instruction and tracks the changelog diff", async () => {
    const initialPlan = await generateEventPlan(weddingInput);

    const revisionResult = await refineEventPlan(
      initialPlan,
      "Reduce total budget by ₹50,000 and prioritize food catering"
    );

    expect(revisionResult).toBeDefined();
    expect(revisionResult.updatedPlan).toBeDefined();
    expect(revisionResult.diffSummary.length).toBeGreaterThan(0);
    expect(revisionResult.explanation).toBeDefined();

    // Budget reduced by 50,000
    expect(revisionResult.updatedPlan.eventInput.totalBudget).toBe(750000);
    expect(revisionResult.updatedPlan.budget.totalBudget).toBe(750000);

    // Sum of allocations must still be rebalanced to new budget
    const updatedSum = revisionResult.updatedPlan.budget.allocations.reduce(
      (sum, item) => sum + item.estimatedAmount,
      0
    );
    expect(updatedSum).toBe(750000);

    // Changelog updated
    expect(revisionResult.updatedPlan.revisionsCount).toBe(1);
    expect(revisionResult.updatedPlan.changelog.length).toBe(2);
  });
});
