import React from "react";
import Link from "next/link";
import { Compass, ShieldCheck, Heart, Sparkles, Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer
      style={{
        marginTop: "auto",
        borderTop: "1px solid var(--border-subtle)",
        backgroundColor: "var(--bg-secondary)",
        padding: "3.5rem 0 2rem 0",
        color: "var(--text-secondary)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3rem",
          }}
        >
          {/* Brand Info */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "var(--text-primary)",
                marginBottom: "0.8rem",
              }}
            >
              <Compass size={22} color="var(--accent-primary)" />
              <span style={{ fontSize: "1.15rem", fontWeight: 700 }}>EventPilot AI</span>
            </div>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>
              The generative AI assistant transforming your event concepts into precision budgets,
              preparation milestones, and vendor checklists for Weddings, Birthdays, and Community events.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4
              style={{
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: "1rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Event Types
            </h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <li>
                <Link
                  href="/plan/new?type=wedding"
                  style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.9rem" }}
                >
                  Weddings & Receptions
                </Link>
              </li>
              <li>
                <Link
                  href="/plan/new?type=birthday"
                  style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.9rem" }}
                >
                  Birthday Celebrations
                </Link>
              </li>
              <li>
                <Link
                  href="/plan/new?type=community"
                  style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.9rem" }}
                >
                  Community & Social Drives
                </Link>
              </li>
            </ul>
          </div>

          {/* Engineering & Hackathon details */}
          <div>
            <h4
              style={{
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: "1rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Submission & Security
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <ShieldCheck size={16} color="var(--success)" />
                <span>Zero client-side secrets</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Terminal size={16} color="var(--accent-primary)" />
                <span>Strict Zod Schema Enforcement</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Sparkles size={16} color="var(--accent-secondary)" />
                <span>Google Gemini 2.5/1.5 Flash</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: "1.75rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            fontSize: "0.85rem",
          }}
        >
          <div>
            Virtual PromptWars — Challenge 5 | Hack2Skill
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span>Crafted with</span>
            <Heart size={14} color="#ef4444" fill="#ef4444" />
            <span>for frictionless event planning</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
