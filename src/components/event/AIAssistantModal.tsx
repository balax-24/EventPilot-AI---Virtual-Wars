"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, Check, AlertCircle, RefreshCw } from "lucide-react";
import { EventPlan, PlanRevisionResponse } from "@/types/event";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { formatCurrency } from "@/lib/currency";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: EventPlan;
  onPlanRefined: (updated: EventPlan) => void;
}

export function AIAssistantModal({
  isOpen,
  onClose,
  currentPlan,
  onPlanRefined,
}: AIAssistantModalProps) {
  const [instruction, setInstruction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proposedRevision, setProposedRevision] = useState<PlanRevisionResponse | null>(null);

  const quickPrompts = [
    "Reduce total budget by ₹5,000 while maintaining high food quality.",
    "Prioritize catering and live food counters over floral decorations.",
    "Make the celebration more traditional and culturally immersive.",
    "Add dedicated interactive activities suitable for kids.",
    "The event is next week — compress preparation milestones urgently.",
  ];

  const handleRefine = async (customText?: string) => {
    const textToRun = (customText || instruction).trim();
    if (!textToRun || textToRun.length < 3) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/plan/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPlan,
          instruction: textToRun,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || data.error || "Failed to refine plan");
      }

      const result: PlanRevisionResponse = await response.json();
      setProposedRevision(result);
    } catch (err: any) {
      console.error("Refinement error:", err);
      setError(err.message || "Failed to refine plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (proposedRevision?.updatedPlan) {
      onPlanRefined(proposedRevision.updatedPlan);
      onClose();
      setProposedRevision(null);
      setInstruction("");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Refine Plan with Conversational AI"
      description="Instruct the AI assistant to reallocate funds, shift priorities, or add tailored activities."
      maxWidth="680px"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {error && (
          <Alert variant="danger" title="Refinement Notice">
            {error}
          </Alert>
        )}

        {/* Input area */}
        {!proposedRevision && (
          <div>
            <label
              htmlFor="ai-instruction"
              style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.4rem" }}
            >
              How would you like to modify your event plan?
            </label>
            <textarea
              id="ai-instruction"
              rows={3}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="e.g. Cut ₹10,000 from venue and put it toward a live band, or add kids games..."
              style={{ marginBottom: "0.75rem" }}
            />

            {/* Quick prompt suggestions */}
            <div style={{ marginBottom: "1.5rem" }}>
              <span
                style={{
                  display: "block",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: "var(--text-tertiary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "0.5rem",
                }}
              >
                Suggested instructions:
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInstruction(p);
                      handleRefine(p);
                    }}
                    style={{
                      padding: "0.3rem 0.65rem",
                      borderRadius: "var(--radius-full)",
                      fontSize: "0.8rem",
                      backgroundColor: "var(--bg-tertiary)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border-subtle)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all var(--transition-fast)",
                    }}
                  >
                    &ldquo;{p}&rdquo;
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleRefine()}
                isLoading={isLoading}
                disabled={!instruction.trim() || instruction.trim().length < 3}
                leftIcon={<Sparkles size={16} />}
              >
                Evaluate & Adjust Plan
              </Button>
            </div>
          </div>
        )}

        {/* Proposed Revision Diff View */}
        {proposedRevision && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Alert variant="info" title="Proposed Plan Modifications">
              {proposedRevision.explanation}
            </Alert>

            <div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                Summary of Proposed Changes:
              </h4>
              <ul
                style={{
                  paddingLeft: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                }}
              >
                {proposedRevision.diffSummary.map((diff, i) => (
                  <li key={i}>{diff}</li>
                ))}
              </ul>
            </div>

            {/* Comparison pill */}
            <div
              style={{
                padding: "0.85rem 1rem",
                backgroundColor: "var(--bg-tertiary)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.88rem",
              }}
            >
              <div>
                <span style={{ color: "var(--text-tertiary)" }}>Current Budget: </span>
                <strong>
                  {formatCurrency(
                    currentPlan.eventInput.totalBudget,
                    currentPlan.eventInput.currency
                  )}
                </strong>
              </div>
              <ArrowRight size={18} color="var(--accent-primary)" />
              <div>
                <span style={{ color: "var(--text-tertiary)" }}>Updated Budget: </span>
                <strong style={{ color: "var(--accent-secondary)" }}>
                  {formatCurrency(
                    proposedRevision.updatedPlan.eventInput.totalBudget,
                    proposedRevision.updatedPlan.eventInput.currency
                  )}
                </strong>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.75rem",
                marginTop: "0.75rem",
              }}
            >
              <Button
                variant="outline"
                size="md"
                onClick={() => setProposedRevision(null)}
              >
                Discard & Re-prompt
              </Button>
              <Button
                variant="success"
                size="md"
                leftIcon={<Check size={16} />}
                onClick={handleApply}
              >
                Apply Changes to Plan
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
