"use client";

import React, { useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Plus,
  Trash2,
  Clock,
  Calendar,
  Filter,
} from "lucide-react";
import { TimelineData, Milestone, PriorityLevel } from "@/types/event";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";

interface TimelineViewProps {
  timeline: TimelineData;
  eventDate: string;
  onTimelineUpdate: (updated: TimelineData) => void;
}

export function TimelineView({ timeline, eventDate, onTimelineUpdate }: TimelineViewProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState(eventDate);
  const [newPriority, setNewPriority] = useState<PriorityLevel>("medium");

  const todayStr = new Date().toISOString().split("T")[0];

  const handleToggleComplete = (id: string) => {
    const updatedMilestones = timeline.milestones.map((m) => {
      if (m.id === id) {
        return { ...m, isCompleted: !m.isCompleted };
      }
      return m;
    });

    onTimelineUpdate({
      ...timeline,
      milestones: updatedMilestones,
      urgentTasksCount: updatedMilestones.filter((m) => m.priority === "high" && !m.isCompleted)
        .length,
    });
  };

  const handleDelete = (id: string) => {
    const updatedMilestones = timeline.milestones.filter((m) => m.id !== id);
    onTimelineUpdate({
      ...timeline,
      milestones: updatedMilestones,
      urgentTasksCount: updatedMilestones.filter((m) => m.priority === "high" && !m.isCompleted)
        .length,
    });
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newMilestone: Milestone = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim(),
      dueDate: newDueDate <= eventDate ? newDueDate : eventDate,
      priority: newPriority,
      isCompleted: false,
      category: "Preparation",
    };

    // Keep chronological
    const updated = [...timeline.milestones, newMilestone].sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

    onTimelineUpdate({
      ...timeline,
      milestones: updated,
      urgentTasksCount: updated.filter((m) => m.priority === "high" && !m.isCompleted).length,
    });

    setIsAdding(false);
    setNewTitle("");
    setNewDescription("");
    setNewDueDate(eventDate);
  };

  const filteredMilestones = timeline.milestones.filter((m) => {
    if (filter === "pending") return !m.isCompleted;
    if (filter === "completed") return m.isCompleted;
    return true;
  });

  const completedCount = timeline.milestones.filter((m) => m.isCompleted).length;
  const progressPercent =
    timeline.milestones.length > 0
      ? Math.round((completedCount / timeline.milestones.length) * 100)
      : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Compressed timeline banner if applicable */}
      {timeline.isCompressed && (
        <Alert variant="warning" title="Compressed Preparation Mode Active">
          This event is scheduled within the next 30 days. High-priority milestones are highlighted
          to ensure critical tasks like venue deposits, catering confirmations, and permits are
          locked in without delay.
        </Alert>
      )}

      {/* Progress & Controls Header */}
      <Card style={{ padding: "1.25rem 1.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 600 }}>Milestone Preparation Roadmap</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
              {completedCount} of {timeline.milestones.length} milestones accomplished ({progressPercent}%)
            </p>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => setIsAdding(!isAdding)}
            >
              {isAdding ? "Cancel" : "Add Milestone"}
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            paddingTop: "0.75rem",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <span style={{ fontSize: "0.82rem", color: "var(--text-tertiary)", marginRight: "0.25rem" }}>
            Filter:
          </span>
          {(["all", "pending", "completed"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              style={{
                padding: "0.3rem 0.75rem",
                borderRadius: "var(--radius-full)",
                fontSize: "0.82rem",
                fontWeight: 600,
                textTransform: "capitalize",
                cursor: "pointer",
                backgroundColor: filter === tab ? "var(--accent-primary)" : "var(--bg-tertiary)",
                color: filter === tab ? "#ffffff" : "var(--text-secondary)",
                border: "1px solid var(--border-subtle)",
                transition: "all var(--transition-fast)",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </Card>

      {/* Add Milestone Form */}
      {isAdding && (
        <Card style={{ padding: "1.5rem", border: "1px solid var(--accent-primary)" }}>
          <h4 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: "1rem" }}>
            Schedule New Milestone
          </h4>
          <form
            onSubmit={handleAddMilestone}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", marginBottom: "0.3rem" }}>
                Task Title *
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Schedule Sound Check"
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", marginBottom: "0.3rem" }}>
                Due Date * (Max: {eventDate})
              </label>
              <input
                type="date"
                required
                value={newDueDate}
                max={eventDate}
                onChange={(e) => setNewDueDate(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", marginBottom: "0.3rem" }}>
                Priority
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", fontSize: "0.82rem", marginBottom: "0.3rem" }}>
                Description
              </label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Specific instructions or requirements..."
              />
            </div>
            <div style={{ gridColumn: "1 / -1", display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Milestone
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Chronological Milestone List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {filteredMilestones.length === 0 ? (
          <Card style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--text-tertiary)" }}>
            No milestones found for this filter.
          </Card>
        ) : (
          filteredMilestones.map((milestone) => {
            const isPastDue = !milestone.isCompleted && milestone.dueDate < todayStr;
            const isDueSoon =
              !milestone.isCompleted &&
              milestone.dueDate >= todayStr &&
              new Date(milestone.dueDate).getTime() - new Date(todayStr).getTime() <=
                5 * 24 * 60 * 60 * 1000;

            return (
              <div
                key={milestone.id}
                className="glass-panel"
                style={{
                  padding: "1.15rem 1.4rem",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  backgroundColor: milestone.isCompleted
                    ? "rgba(16, 185, 129, 0.04)"
                    : isPastDue
                    ? "rgba(239, 68, 68, 0.05)"
                    : "var(--bg-card)",
                  border: isPastDue
                    ? "1px solid rgba(239, 68, 68, 0.3)"
                    : "1px solid var(--border-subtle)",
                }}
              >
                {/* Complete checkbox button */}
                <button
                  type="button"
                  onClick={() => handleToggleComplete(milestone.id)}
                  aria-label={
                    milestone.isCompleted
                      ? `Mark ${milestone.title} as incomplete`
                      : `Mark ${milestone.title} as complete`
                  }
                  style={{
                    backgroundColor: "transparent",
                    color: milestone.isCompleted ? "var(--success)" : "var(--text-tertiary)",
                    cursor: "pointer",
                    marginTop: "0.15rem",
                    flexShrink: 0,
                  }}
                >
                  {milestone.isCompleted ? (
                    <CheckCircle2 size={22} fill="rgba(16, 185, 129, 0.2)" />
                  ) : (
                    <Circle size={22} />
                  )}
                </button>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                      marginBottom: "0.3rem",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "1.02rem",
                        fontWeight: 600,
                        color: milestone.isCompleted ? "var(--text-tertiary)" : "var(--text-primary)",
                        textDecoration: milestone.isCompleted ? "line-through" : "none",
                      }}
                    >
                      {milestone.title}
                    </h4>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Badge
                        variant={
                          milestone.priority === "high"
                            ? "danger"
                            : milestone.priority === "medium"
                            ? "warning"
                            : "default"
                        }
                      >
                        {milestone.priority}
                      </Badge>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          fontSize: "0.82rem",
                          color: isPastDue
                            ? "var(--danger)"
                            : isDueSoon
                            ? "var(--warning)"
                            : "var(--text-secondary)",
                          fontWeight: 500,
                        }}
                      >
                        <Calendar size={14} />
                        <span>Due {milestone.dueDate}</span>
                      </div>
                    </div>
                  </div>

                  <p
                    style={{
                      fontSize: "0.88rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.5,
                      textDecoration: milestone.isCompleted ? "line-through" : "none",
                    }}
                  >
                    {milestone.description}
                  </p>
                </div>

                {/* Delete button */}
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={`Delete ${milestone.title}`}
                  onClick={() => handleDelete(milestone.id)}
                  style={{ color: "var(--text-tertiary)", padding: "0.3rem" }}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
