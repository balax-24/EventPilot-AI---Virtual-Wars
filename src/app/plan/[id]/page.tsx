"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { EventPlan } from "@/types/event";
import { getPlan } from "@/lib/storage/storage";
import { Dashboard } from "@/components/event/Dashboard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PlanDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const planId = resolvedParams.id;

  const [plan, setPlan] = useState<EventPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const found = await getPlan(planId);
        if (found) {
          setPlan(found);
        } else {
          setError("Event plan not found. It may have been removed or created in a different browser session.");
        }
      } catch (err: any) {
        console.error("Failed to load plan:", err);
        setError("Error loading saved plan. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [planId]);

  if (isLoading) {
    return (
      <div
        className="container"
        style={{
          padding: "6rem 0",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Loader2 size={36} color="var(--accent-primary)" className="animate-spin" />
        <h2 style={{ fontSize: "1.25rem", color: "var(--text-secondary)" }}>
          Loading your event plan...
        </h2>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="container" style={{ padding: "4rem 0", maxWidth: "600px" }}>
        <Card style={{ padding: "2.5rem", textAlign: "center" }}>
          <AlertCircle size={44} color="var(--warning)" style={{ margin: "0 auto 1rem auto" }} />
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Event Plan Not Found
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.75rem" }}>
            {error || "We couldn't locate this event plan in storage."}
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            <Link href="/plan/new" style={{ textDecoration: "none" }}>
              <Button variant="primary" leftIcon={<Sparkles size={16} />}>
                Create New Plan
              </Button>
            </Link>
            <Link href="/events" style={{ textDecoration: "none" }}>
              <Button variant="outline">
                View Saved Plans
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return <Dashboard initialPlan={plan} />;
}
