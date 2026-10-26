import React from "react";
import {
  PieChart,
  CalendarClock,
  ClipboardCheck,
  MessageSquareCode,
  Sparkles,
  ShieldAlert,
  Coins,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

export function Features() {
  const featureList = [
    {
      icon: PieChart,
      title: "Interactive Budget Allocation",
      description:
        "Calculates realistic expense splits (venue, food, decor, photography, contingency) tailored to guest count. Instantly rebalances with zero floating-point errors.",
      badge: "Integer Precision",
    },
    {
      icon: CalendarClock,
      title: "Paced Preparation Timeline",
      description:
        "Generates chronological preparation milestones backward from your event date. Automatically triggers compressed mode for events happening within weeks.",
      badge: "Date-Aware",
    },
    {
      icon: ClipboardCheck,
      title: "Actionable Vendor Checklist",
      description:
        "Comprehensive vendor milestones with realistic cost estimates, booking statuses (researching, contacted, booked), and strict contract deadlines.",
      badge: "Structured Tracking",
    },
    {
      icon: MessageSquareCode,
      title: "Conversational Plan Assistant",
      description:
        "Refine your plan using natural English instructions: 'Reduce catering by ₹5,000', 'Prioritize traditional music', or 'Add child-friendly games'.",
      badge: "GenAI Powered",
    },
    {
      icon: Sparkles,
      title: "Personalized Event Concepts",
      description:
        "Curates creative themes, icebreakers, decor suggestions, and practical cost-saving alternatives that strictly respect your stated budget constraints.",
      badge: "Tailored Ideas",
    },
    {
      icon: ShieldAlert,
      title: "Risk Analysis & Contingency",
      description:
        "Proactively anticipates weather backups, dietary contingencies, and vendor cancellations with actionable mitigations and a dedicated 5-10% reserve.",
      badge: "Pragmatic Safety",
    },
  ];

  return (
    <section id="features" style={{ padding: "4rem 0", backgroundColor: "var(--bg-secondary)" }}>
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 3.5rem auto" }}>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: "1rem",
            }}
          >
            Engineered for <span className="text-gradient">Zero-Stress Organization</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>
            Every output is structured, validated by application code, and instantly editable. No
            fluff, no generic placeholders.
          </p>
        </div>

        <div className="grid-responsive-3">
          {featureList.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card key={idx} interactive glass style={{ padding: "1.75rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1.25rem",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "rgba(99, 102, 241, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--accent-primary)",
                      border: "1px solid rgba(99, 102, 241, 0.3)",
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--accent-secondary)",
                      backgroundColor: "rgba(168, 85, 247, 0.1)",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "var(--radius-full)",
                      border: "1px solid rgba(168, 85, 247, 0.25)",
                    }}
                  >
                    {feature.badge}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    marginBottom: "0.6rem",
                    color: "var(--text-primary)",
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
