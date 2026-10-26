"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { EventForm } from "@/components/event/EventForm";
import { EventType } from "@/types/event";

function PlanNewContent() {
  const searchParams = useSearchParams();
  const rawType = searchParams.get("type");
  const rawBudget = searchParams.get("budget");
  const rawGuests = searchParams.get("guests");
  const rawLocation = searchParams.get("location");

  const initialType: EventType =
    rawType === "wedding" || rawType === "birthday" || rawType === "community"
      ? rawType
      : "wedding";

  const initialBudget = rawBudget ? parseInt(rawBudget, 10) : undefined;
  const initialGuests = rawGuests ? parseInt(rawGuests, 10) : undefined;
  const initialLocation = rawLocation ? decodeURIComponent(rawLocation) : undefined;

  return (
    <div style={{ padding: "3rem 0" }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div style={{ marginBottom: "2rem" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "var(--text-secondary)",
              textDecoration: "none",
              fontSize: "0.9rem",
              transition: "color var(--transition-fast)",
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
          <h1
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginTop: "0.75rem",
              color: "var(--text-primary)",
            }}
          >
            Plan Your Next Event with <span className="text-gradient">GenAI Precision</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem", marginTop: "0.4rem" }}>
            Provide your event vision, location, headcount, and budget. Our planner synthesizes an
            immediate, actionable plan.
          </p>
        </div>

        {/* Form Container */}
        <EventForm
          initialType={initialType}
          initialBudget={initialBudget}
          initialGuests={initialGuests}
          initialLocation={initialLocation}
        />
      </div>
    </div>
  );
}

export default function PlanNewPage() {
  return (
    <Suspense
      fallback={
        <div className="container" style={{ padding: "4rem 0", textAlign: "center" }}>
          Loading event creation studio...
        </div>
      }
    >
      <PlanNewContent />
    </Suspense>
  );
}
