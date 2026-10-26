import { NextRequest, NextResponse } from "next/server";
import { RefinePlanRequestSchema } from "@/lib/validation";
import { refineEventPlan } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validationResult = RefinePlanRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid refinement request",
          details: validationResult.error.errors.map((e) => e.message),
        },
        { status: 400 }
      );
    }

    const { currentPlan, instruction } = validationResult.data;

    if (!currentPlan || !currentPlan.eventInput || !currentPlan.budget) {
      return NextResponse.json(
        { error: "Invalid current plan structure provided" },
        { status: 400 }
      );
    }

    const result = await refineEventPlan(currentPlan, instruction);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("API /api/plan/refine error:", error);
    return NextResponse.json(
      {
        error: "Failed to refine event plan",
        message: "An unexpected error occurred while modifying your plan. Please try again.",
      },
      { status: 500 }
    );
  }
}
