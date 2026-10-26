import React from "react";
import {
  Sparkles,
  Lightbulb,
  DollarSign,
  Heart,
  Palette,
  ShieldAlert,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { PersonalizedIdea, RiskAndMitigation } from "@/types/event";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface PersonalizedIdeasProps {
  ideas: PersonalizedIdea[];
  assumptions: string[];
  risksAndMitigations: RiskAndMitigation[];
}

export function PersonalizedIdeas({
  ideas,
  assumptions,
  risksAndMitigations,
}: PersonalizedIdeasProps) {
  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "cost_saving":
        return { label: "Cost Saving", variant: "success" as const };
      case "experience":
        return { label: "Guest Experience", variant: "primary" as const };
      case "food":
        return { label: "Food & Beverage", variant: "warning" as const };
      case "activity":
        return { label: "Interactive Activity", variant: "info" as const };
      case "decor":
        return { label: "Decor & Styling", variant: "default" as const };
      case "theme":
      default:
        return { label: "Theme Concept", variant: "default" as const };
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Personalized Ideas Section */}
      <div>
        <div style={{ marginBottom: "1.25rem" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>
            Personalized Event Innovations & Recommendations
          </h3>
          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
            Curated ideas specifically tailored to your event type, guest count, budget, and stated priorities.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {ideas.map((idea) => {
            const badge = getCategoryBadge(idea.category);
            return (
              <Card key={idea.id} glass interactive style={{ padding: "1.35rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.75rem",
                  }}
                >
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color:
                        idea.estimatedImpact === "high"
                          ? "var(--success)"
                          : idea.estimatedImpact === "medium"
                          ? "var(--warning)"
                          : "var(--text-tertiary)",
                      textTransform: "uppercase",
                    }}
                  >
                    {idea.estimatedImpact} Impact
                  </span>
                </div>

                <h4
                  style={{
                    fontSize: "1.08rem",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "var(--text-primary)",
                  }}
                >
                  {idea.title}
                </h4>

                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.55,
                    marginBottom: "1rem",
                  }}
                >
                  {idea.description}
                </p>

                {idea.actionableStep && (
                  <div
                    style={{
                      padding: "0.75rem 0.9rem",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "rgba(99, 102, 241, 0.08)",
                      border: "1px solid rgba(99, 102, 241, 0.2)",
                      fontSize: "0.85rem",
                      color: "#c7d2fe",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                    }}
                  >
                    <ArrowRight size={16} style={{ flexShrink: 0, marginTop: "0.15rem" }} />
                    <div>
                      <strong>Action step: </strong>
                      {idea.actionableStep}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Assumptions & Risk Mitigation */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {/* Planning Assumptions */}
        <Card glass style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
            <HelpCircle size={20} color="var(--accent-primary)" />
            <h4 style={{ fontSize: "1.1rem", fontWeight: 600 }}>Core Planning Assumptions</h4>
          </div>
          <ul
            style={{
              paddingLeft: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
              lineHeight: 1.5,
            }}
          >
            {assumptions.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </Card>

        {/* Risk Mitigations */}
        <Card glass style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
            <ShieldAlert size={20} color="var(--warning)" />
            <h4 style={{ fontSize: "1.1rem", fontWeight: 600 }}>Proactive Risk Mitigations</h4>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {risksAndMitigations.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: "0.75rem 0.9rem",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "rgba(245, 158, 11, 0.05)",
                  border: "1px solid rgba(245, 158, 11, 0.2)",
                  fontSize: "0.88rem",
                }}
              >
                <div style={{ fontWeight: 600, color: "var(--warning)", marginBottom: "0.25rem" }}>
                  Risk: {item.risk}
                </div>
                <div style={{ color: "var(--text-secondary)", lineHeight: 1.45 }}>
                  <strong>Mitigation: </strong> {item.mitigation}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
