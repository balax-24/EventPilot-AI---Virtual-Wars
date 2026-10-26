/**
 * AI Prompt Construction for Event Planning & Plan Refinement
 */

import { EventInput, EventPlan } from "@/types/event";

export function buildEventPlanPrompt(input: EventInput): string {
  const todayIso = new Date().toISOString().split("T")[0];

  return `You are EventPilot AI, a premier AI event planner.
Generate a comprehensive, actionable, and realistic event plan for the following event specifications.

EVENT DETAILS:
- Event Name: "${input.name}"
- Event Type: ${input.eventType.toUpperCase()}
- Date: ${input.eventDate} (Today's date is: ${todayIso})
- Location: ${input.location}
- Expected Attendees: ${input.attendeeCount} people
- Total Budget: ${input.currency} ${input.totalBudget.toLocaleString()}
- Currency: ${input.currency}
- Preferred Theme/Style: "${input.themeStyle}"
- Key Priorities: ${input.priorities.join(", ")}
${input.additionalRequirements ? `- Special Requirements/Constraints: "${input.additionalRequirements}"` : ""}

STRICT GENERATION RULES:
1. BUDGET ALLOCATION:
   - Provide 6 to 10 realistic expense categories tailored to a ${input.eventType}.
   - The SUM of all allocations MUST equal the total budget of ${input.currency} ${input.totalBudget}.
   - Include a 5-10% contingency reserve category.
   - Every allocation must include a clear, practical rationale explaining the number based on the attendee count (${input.attendeeCount} guests) and location (${input.location}).
   - Use standard integer/decimal values for estimatedAmount (no symbols).

2. TIMELINE MILESTONES:
   - Generate 6 to 12 chronological preparation milestones.
   - All preparation milestone due dates MUST be on or before the event date (${input.eventDate}), and on or after today (${todayIso}).
   - If the event is within 30 days, make milestones urgent and actionable.
   - Assign realistic priorities: "high", "medium", or "low".

3. VENDOR CHECKLIST:
   - Generate 5 to 10 actionable vendor items/services.
   - Specify status as "pending".
   - Include realistic estimatedCost for each vendor category (aligning with budget).
   - Assign realistic booking deadlines before ${input.eventDate}.

4. PERSONALIZED IDEAS:
   - Generate 4 to 8 creative, high-impact ideas specifically tailored to "${input.themeStyle}", budget (${input.currency} ${input.totalBudget}), and guest count (${input.attendeeCount}).
   - Categories must be one of: "theme", "activity", "food", "decor", "cost_saving", "experience".
   - Must be realistic within the specified constraints.

5. ASSUMPTIONS & RISKS:
   - List 3 to 5 key planning assumptions.
   - List 3 to 5 potential risks with concrete mitigation steps.

OUTPUT FORMAT:
Return ONLY a valid JSON object matching this exact structure (no markdown fences, no explanatory text outside JSON):
{
  "allocations": [
    {
      "id": "alloc-1",
      "category": "venue",
      "categoryLabel": "Venue Rental & Setup",
      "estimatedAmount": 50000,
      "actualAmount": 0,
      "rationale": "Reason for amount based on attendees and location",
      "notes": "Optional advice"
    }
  ],
  "milestones": [
    {
      "id": "mile-1",
      "title": "Book Venue",
      "description": "Details of task",
      "dueDate": "YYYY-MM-DD",
      "priority": "high",
      "isCompleted": false,
      "category": "Venue"
    }
  ],
  "vendors": [
    {
      "id": "vend-1",
      "category": "Catering",
      "title": "Buffet Caterer",
      "description": "Per-plate meal service for attendees",
      "estimatedCost": 40000,
      "status": "pending",
      "priority": "high",
      "deadline": "YYYY-MM-DD",
      "notes": "Dietary checks"
    }
  ],
  "ideas": [
    {
      "id": "idea-1",
      "category": "cost_saving",
      "title": "Smart Idea Title",
      "description": "How this saves money or elevates the event",
      "estimatedImpact": "high",
      "actionableStep": "Step to take"
    }
  ],
  "assumptions": [
    "Assumption text"
  ],
  "potentialRisksAndMitigations": [
    {
      "risk": "Risk description",
      "mitigation": "Mitigation action"
    }
  ]
}`;
}

export function buildPlanRefinementPrompt(
  currentPlan: EventPlan,
  instruction: string
): string {
  return `You are EventPilot AI. The user has an existing event plan and wants to refine or modify it using this natural-language instruction:

USER INSTRUCTION:
"${instruction}"

CURRENT EVENT PLAN OVERVIEW:
- Event: "${currentPlan.eventInput.name}" (${currentPlan.eventInput.eventType})
- Total Budget: ${currentPlan.eventInput.currency} ${currentPlan.eventInput.totalBudget}
- Date: ${currentPlan.eventInput.eventDate}
- Location: ${currentPlan.eventInput.location}
- Attendees: ${currentPlan.eventInput.attendeeCount}
- Current Allocations (${currentPlan.budget.allocations.length}):
${currentPlan.budget.allocations.map((a) => `  * ${a.categoryLabel}: ${currentPlan.eventInput.currency} ${a.estimatedAmount} (${a.rationale})`).join("\n")}

TASK:
1. Apply the user's requested change faithfully.
2. If the user asks to increase or reduce total budget or a specific category, adjust the allocations realistically so the total stays balanced.
3. If the user asks to add or modify activities, ideas, or timeline tasks, update those sections accordingly.
4. Keep untouched sections intact — do NOT discard existing user data needlessly.
5. Provide a clear explanation of what changed and why in "explanation", and bullet items in "diffSummary".

OUTPUT FORMAT:
Return ONLY a valid JSON object matching this structure:
{
  "updatedTotalBudget": ${currentPlan.eventInput.totalBudget},
  "allocations": [
    /* updated complete array of allocations */
  ],
  "milestones": [
    /* updated complete array of milestones */
  ],
  "vendors": [
    /* updated complete array of vendors */
  ],
  "ideas": [
    /* updated complete array of ideas */
  ],
  "assumptions": [
    /* updated assumptions */
  ],
  "potentialRisksAndMitigations": [
    /* updated risks and mitigations */
  ],
  "diffSummary": [
    "Reduced catering budget by ₹5,000 as requested",
    "Added live acoustic musician to vendor checklist"
  ],
  "explanation": "Summary paragraph explaining how the modifications satisfy the user's goal while keeping the event on track."
}`;
}
