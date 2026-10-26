"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Calendar,
  Clock,
  DollarSign,
  PieChart,
  CheckCircle2,
  BookmarkCheck,
  Download,
  Share2,
  Users,
  MapPin,
  MessageSquare,
  History,
  AlertCircle,
  Building,
  HeartHandshake,
  Cake,
} from "lucide-react";
import { EventPlan, BudgetSummary, TimelineData, VendorItem } from "@/types/event";
import { formatCurrency } from "@/lib/currency";
import { savePlan, exportPlanAsJsonFile } from "@/lib/storage/storage";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { BudgetPlanner } from "./BudgetPlanner";
import { TimelineView } from "./TimelineView";
import { VendorChecklist } from "./VendorChecklist";
import { PersonalizedIdeas } from "./PersonalizedIdeas";
import { AIAssistantModal } from "./AIAssistantModal";

interface DashboardProps {
  initialPlan: EventPlan;
}

export function Dashboard({ initialPlan }: DashboardProps) {
  const [plan, setPlan] = useState<EventPlan>(initialPlan);
  const [activeTab, setActiveTab] = useState<
    "overview" | "budget" | "timeline" | "vendors" | "ideas" | "changelog"
  >("overview");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Compute countdown in days
  const eventDateObj = new Date(plan.eventInput.eventDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = eventDateObj.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const completedMilestones = plan.timeline.milestones.filter((m) => m.isCompleted).length;
  const bookedVendors = plan.vendors.filter((v) => v.status === "booked").length;

  const handleSave = async () => {
    try {
      await savePlan(plan);
      setSaveStatus("Event plan successfully saved!");
      setTimeout(() => setSaveStatus(null), 3500);
    } catch (err) {
      console.error("Save error:", err);
      setSaveStatus("Failed to save plan.");
    }
  };

  const handleBudgetUpdate = async (updatedBudget: BudgetSummary) => {
    const updatedPlan: EventPlan = {
      ...plan,
      budget: updatedBudget,
      updatedAt: new Date().toISOString(),
    };
    setPlan(updatedPlan);
    await savePlan(updatedPlan);
  };

  const handleTimelineUpdate = async (updatedTimeline: TimelineData) => {
    const updatedPlan: EventPlan = {
      ...plan,
      timeline: updatedTimeline,
      updatedAt: new Date().toISOString(),
    };
    setPlan(updatedPlan);
    await savePlan(updatedPlan);
  };

  const handleVendorsUpdate = async (updatedVendors: VendorItem[]) => {
    const updatedPlan: EventPlan = {
      ...plan,
      vendors: updatedVendors,
      updatedAt: new Date().toISOString(),
    };
    setPlan(updatedPlan);
    await savePlan(updatedPlan);
  };

  const handlePlanRefined = async (refinedPlan: EventPlan) => {
    setPlan(refinedPlan);
    await savePlan(refinedPlan);
    setSaveStatus("Plan updated with AI suggestions and saved!");
    setTimeout(() => setSaveStatus(null), 3500);
  };

  const EventTypeIcon =
    plan.eventInput.eventType === "wedding"
      ? HeartHandshake
      : plan.eventInput.eventType === "birthday"
      ? Cake
      : Users;

  return (
    <div style={{ padding: "2.5rem 0", minHeight: "80vh" }}>
      <div className="container">
        {/* Save confirmation toast */}
        {saveStatus && (
          <Alert variant="success" title="Storage Status">
            {saveStatus}
          </Alert>
        )}

        {/* Transparent Notice if in Fallback Mode */}
        {!plan.aiGenerated && (
          <Alert variant="info" title="Deterministic Benchmark Engine Active">
            Notice: This plan was generated using EventPilot&apos;s offline mathematical synthesizer because no live Gemini API key was detected in the environment. All category allocations, milestones, and vendor checklists are mathematically verified benchmarks. To enable live Generative AI synthesis, configure GEMINI_API_KEY in your environment.
          </Alert>
        )}

        {/* Header Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem",
            marginBottom: "2rem",
            paddingBottom: "1.5rem",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
              <Badge variant="primary">
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <EventTypeIcon size={14} />
                  {plan.eventInput.eventType}
                </span>
              </Badge>
              {plan.aiGenerated ? (
                <Badge variant="info">
                  <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Sparkles size={13} />
                    Live GenAI ({plan.aiModelUsed})
                  </span>
                </Badge>
              ) : (
                <Badge variant="warning">
                  <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    Deterministic Heuristic (Fallback)
                  </span>
                </Badge>
              )}
            </div>

            <h1
              style={{
                fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
                marginBottom: "0.4rem",
              }}
            >
              {plan.eventInput.name}
            </h1>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1.25rem",
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Calendar size={16} color="var(--accent-primary)" />
                <span>{plan.eventInput.eventDate}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <MapPin size={16} color="var(--accent-primary)" />
                <span>{plan.eventInput.location}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Users size={16} color="var(--accent-primary)" />
                <span>{plan.eventInput.attendeeCount} Guests</span>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Sparkles size={16} />}
              onClick={() => setIsAiModalOpen(true)}
            >
              Refine with AI
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<BookmarkCheck size={16} />}
              onClick={handleSave}
            >
              Save Plan
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download size={16} />}
              onClick={() => exportPlanAsJsonFile(plan)}
            >
              Export JSON
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          role="tablist"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            overflowX: "auto",
            marginBottom: "2rem",
            paddingBottom: "0.5rem",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          {[
            { id: "overview", label: "Dashboard Overview" },
            { id: "budget", label: "Budget Planner" },
            { id: "timeline", label: `Timeline (${completedMilestones}/${plan.timeline.milestones.length})` },
            { id: "vendors", label: `Vendors (${bookedVendors}/${plan.vendors.length})` },
            { id: "ideas", label: "Personalized Ideas & Risks" },
            { id: "changelog", label: `Revisions (${plan.changelog.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: "0.6rem 1.1rem",
                borderRadius: "var(--radius-md)",
                fontSize: "0.92rem",
                fontWeight: 600,
                cursor: "pointer",
                backgroundColor: activeTab === tab.id ? "rgba(99, 102, 241, 0.15)" : "transparent",
                color: activeTab === tab.id ? "#ffffff" : "var(--text-secondary)",
                border: activeTab === tab.id ? "1px solid rgba(99, 102, 241, 0.4)" : "1px solid transparent",
                whiteSpace: "nowrap",
                transition: "all var(--transition-fast)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Countdown and Core Metrics */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {/* Countdown Card */}
              <Card glass interactive style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-primary)", marginBottom: "0.5rem" }}>
                  <Clock size={20} />
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase" }}>Event Countdown</span>
                </div>
                <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  {diffDays > 0 ? `${diffDays} Days` : diffDays === 0 ? "Today!" : "Event Concluded"}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.3rem" }}>
                  Scheduled for {plan.eventInput.eventDate}
                </div>
              </Card>

              {/* Budget Health Card */}
              <Card glass interactive style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--success)", marginBottom: "0.5rem" }}>
                  <DollarSign size={20} />
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase" }}>Budget Status</span>
                </div>
                <div style={{ fontSize: "2.2rem", fontWeight: 800, color: plan.budget.isOverBudget ? "var(--danger)" : "var(--text-primary)" }}>
                  {formatCurrency(plan.budget.totalBudget, plan.eventInput.currency)}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.3rem" }}>
                  {plan.budget.utilizationPercentage}% allocated ({formatCurrency(plan.budget.remainingBudget, plan.eventInput.currency)} remaining)
                </div>
              </Card>

              {/* Task Completion Card */}
              <Card glass interactive style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-secondary)", marginBottom: "0.5rem" }}>
                  <CheckCircle2 size={20} />
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase" }}>Milestones</span>
                </div>
                <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  {completedMilestones} / {plan.timeline.milestones.length}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.3rem" }}>
                  {plan.timeline.milestones.length - completedMilestones} tasks in progress
                </div>
              </Card>

              {/* Vendor Card */}
              <Card glass interactive style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--warning)", marginBottom: "0.5rem" }}>
                  <Building size={20} />
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase" }}>Vendors Secured</span>
                </div>
                <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  {bookedVendors} / {plan.vendors.length}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.3rem" }}>
                  {plan.vendors.filter((v) => v.status === "contacted").length} currently in contact
                </div>
              </Card>
            </div>

            {/* Quick Previews: Budget & Milestones */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {/* Budget Allocation Preview */}
              <Card glass style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>Budget Allocation Summary</h3>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("budget")}>
                    Manage Full Budget
                  </Button>
                </div>
                <ProgressBar
                  value={plan.budget.utilizationPercentage}
                  isOverBudget={plan.budget.isOverBudget}
                  label="Budget Allocation"
                />
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "1.25rem" }}>
                  {plan.budget.allocations.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.88rem",
                        padding: "0.4rem 0",
                        borderBottom: "1px solid var(--border-subtle)",
                      }}
                    >
                      <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                        {item.categoryLabel}
                      </span>
                      <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                        {formatCurrency(item.estimatedAmount, plan.eventInput.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Next Upcoming Milestones */}
              <Card glass style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>Next Milestone Deadlines</h3>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("timeline")}>
                    View All Milestones
                  </Button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {plan.timeline.milestones
                    .filter((m) => !m.isCompleted)
                    .slice(0, 3)
                    .map((m) => (
                      <div
                        key={m.id}
                        style={{
                          padding: "0.75rem",
                          borderRadius: "var(--radius-md)",
                          backgroundColor: "var(--bg-tertiary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.92rem", color: "var(--text-primary)" }}>
                            {m.title}
                          </div>
                          <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", marginTop: "0.15rem" }}>
                            Due: {m.dueDate}
                          </div>
                        </div>
                        <Badge variant={m.priority === "high" ? "danger" : "default"}>
                          {m.priority}
                        </Badge>
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Tab 2: Budget */}
        {activeTab === "budget" && (
          <BudgetPlanner
            budget={plan.budget}
            currency={plan.eventInput.currency}
            onBudgetUpdate={handleBudgetUpdate}
          />
        )}

        {/* Tab 3: Timeline */}
        {activeTab === "timeline" && (
          <TimelineView
            timeline={plan.timeline}
            eventDate={plan.eventInput.eventDate}
            onTimelineUpdate={handleTimelineUpdate}
          />
        )}

        {/* Tab 4: Vendors */}
        {activeTab === "vendors" && (
          <VendorChecklist
            vendors={plan.vendors}
            currency={plan.eventInput.currency}
            eventDate={plan.eventInput.eventDate}
            onVendorsUpdate={handleVendorsUpdate}
          />
        )}

        {/* Tab 5: Ideas & Risks */}
        {activeTab === "ideas" && (
          <PersonalizedIdeas
            ideas={plan.ideas}
            assumptions={plan.assumptions}
            risksAndMitigations={plan.potentialRisksAndMitigations}
          />
        )}

        {/* Tab 6: Changelog */}
        {activeTab === "changelog" && (
          <Card glass style={{ padding: "1.75rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>
              Plan Revision Audit Log
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              Every modification made via natural-language instructions or direct user actions is
              permanently logged with timestamps and diff summaries.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {plan.changelog.map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: "1.1rem",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--bg-tertiary)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <strong style={{ color: "var(--accent-primary)" }}>&ldquo;{log.instruction}&rdquo;</strong>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-tertiary)" }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <ul style={{ paddingLeft: "1.25rem", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                    {log.summaryOfChanges.map((change, idx) => (
                      <li key={idx}>{change}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Modal for Conversational AI Refinement */}
        <AIAssistantModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          currentPlan={plan}
          onPlanRefined={handlePlanRefined}
        />
      </div>
    </div>
  );
}
