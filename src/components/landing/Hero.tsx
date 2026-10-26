"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Calendar, ArrowRight, CheckCircle2, Shield, HeartHandshake, Cake, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Hero() {
  const samplePrompts = [
    {
      title: "Birthday Party in Chennai",
      prompt: "I want a birthday party in Chennai for 30 people with a budget of ₹15,000.",
      type: "birthday",
      guests: 30,
      budget: 15000,
      location: "Chennai",
    },
    {
      title: "Traditional Wedding",
      prompt: "Plan a wedding for 200 guests with a budget of ₹8 lakh.",
      type: "wedding",
      guests: 200,
      budget: 800000,
      location: "Bangalore",
    },
    {
      title: "Community Cleanup Drive",
      prompt: "Organize a community cleanup event for 100 volunteers.",
      type: "community",
      guests: 100,
      budget: 25000,
      location: "Mumbai",
    },
  ];

  return (
    <section
      style={{
        padding: "4rem 0 3.5rem 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="container" style={{ textAlign: "center" }}>
        {/* Subtle pill tag */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.35rem 1rem",
            borderRadius: "var(--radius-full)",
            backgroundColor: "rgba(99, 102, 241, 0.12)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            color: "#a5b4fc",
            fontSize: "0.85rem",
            fontWeight: 600,
            marginBottom: "1.75rem",
          }}
        >
          <Sparkles size={16} />
          <span>Next-Generation GenAI Event Planning</span>
        </div>

        {/* Main Headline */}
        <h1
          style={{
            fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            maxWidth: "960px",
            margin: "0 auto 1.5rem auto",
          }}
        >
          Transform Event Visions into{" "}
          <span className="text-gradient">Actionable, Budget-Perfect Plans</span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
            color: "var(--text-secondary)",
            maxWidth: "760px",
            margin: "0 auto 2.5rem auto",
            lineHeight: 1.6,
          }}
        >
          EventPilot AI turns your guest count, budget, and style preferences into practical
          category allocations, milestones, and vendor checklists for{" "}
          <strong style={{ color: "var(--text-primary)" }}>Weddings</strong>,{" "}
          <strong style={{ color: "var(--text-primary)" }}>Birthdays</strong>, and{" "}
          <strong style={{ color: "var(--text-primary)" }}>Community Drives</strong>.
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "3.5rem",
          }}
        >
          <Link href="/plan/new" style={{ textDecoration: "none" }}>
            <Button
              variant="primary"
              size="lg"
              leftIcon={<Sparkles size={18} />}
              rightIcon={<ArrowRight size={18} />}
              style={{ padding: "0.9rem 1.8rem", fontSize: "1.05rem" }}
            >
              Start Planning Free
            </Button>
          </Link>
          <Link href="#features" style={{ textDecoration: "none" }}>
            <Button
              variant="outline"
              size="lg"
              style={{ padding: "0.9rem 1.8rem", fontSize: "1.05rem" }}
            >
              See How It Works
            </Button>
          </Link>
        </div>

        {/* One-click quick scenarios */}
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontSize: "0.88rem",
              fontWeight: 600,
              color: "var(--text-tertiary)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.75rem",
              textAlign: "center",
            }}
          >
            Try one-click real-world scenarios:
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            {samplePrompts.map((scenario, index) => {
              const Icon =
                scenario.type === "wedding"
                  ? HeartHandshake
                  : scenario.type === "birthday"
                  ? Cake
                  : Users;

              return (
                <Link
                  key={index}
                  href={`/plan/new?type=${scenario.type}&budget=${scenario.budget}&guests=${scenario.guests}&location=${encodeURIComponent(
                    scenario.location
                  )}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="glass-panel interactive-card"
                    style={{
                      padding: "1.1rem",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-subtle)",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <Icon size={18} color="var(--accent-primary)" />
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          color: "var(--text-primary)",
                        }}
                      >
                        {scenario.title}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.4,
                      }}
                    >
                      &ldquo;{scenario.prompt}&rdquo;
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Trust Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
            flexWrap: "wrap",
            marginTop: "3.5rem",
            paddingTop: "2rem",
            borderTop: "1px solid var(--border-subtle)",
            fontSize: "0.85rem",
            color: "var(--text-secondary)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <CheckCircle2 size={16} color="var(--success)" />
            <span>Precise Integer Currency Math</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <CheckCircle2 size={16} color="var(--success)" />
            <span>Natural-Language Revisions</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Shield size={16} color="var(--accent-primary)" />
            <span>Server-Side Isolated Keys</span>
          </div>
        </div>
      </div>
    </section>
  );
}
