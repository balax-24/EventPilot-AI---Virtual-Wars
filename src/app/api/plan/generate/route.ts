import { NextRequest, NextResponse } from "next/server";
import { EventInputSchema } from "@/lib/validation";
import { generateEventPlan } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Strict schema validation
    const validationResult = EventInputSchema.safeParse(body);
    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors.map((e) => e.message);
      return NextResponse.json(
        {
          error: "Invalid event input",
          details: errorMessages,
        },
        { status: 400 }
      );
    }

    const plan = await generateEventPlan(validationResult.data);
    return NextResponse.json(plan, { status: 200 });
  } catch (error: any) {
    console.error("API /api/plan/generate error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate event plan",
        message: "An unexpected error occurred while planning your event. Please check inputs and try again.",
      },
      { status: 500 }
    );
  }
}
