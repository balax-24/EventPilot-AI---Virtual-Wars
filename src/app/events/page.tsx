"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookmarkCheck,
  Calendar,
  DollarSign,
  Users,
  Trash2,
  ArrowRight,
  Upload,
  Sparkles,
  HeartHandshake,
  Cake,
  Building,
} from "lucide-react";
import { EventPlan } from "@/types/event";
import { getAllPlans, deletePlan, savePlan, getActiveStorageProvider } from "@/lib/storage/storage";
import { formatCurrency } from "@/lib/currency";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Alert } from "@/components/ui/Alert";

export default function SavedEventsPage() {
  const [plans, setPlans] = useState<EventPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    loadSavedPlans();
  }, []);

  const loadSavedPlans = async () => {
    setIsLoading(true);
    try {
      const data = await getAllPlans();
      setPlans(data);
    } catch (err) {
      console.error("Failed to load saved plans:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the plan for "${name}"?`)) {
      await deletePlan(id);
      await loadSavedPlans();
    }
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setImportError(null);
    try {
      const parsed = JSON.parse(importJsonText);
      if (!parsed.eventInput || !parsed.budget || !parsed.timeline) {
        throw new Error("Invalid plan file format. Required event properties missing.");
      }
      // Ensure unique ID
      const importedPlan: EventPlan = {
        ...parsed,
        id: `imported-${Date.now()}`,
        updatedAt: new Date().toISOString(),
      };

      await savePlan(importedPlan);
      setIsImportModalOpen(false);
      setImportJsonText("");
      await loadSavedPlans();
    } catch (err: any) {
      setImportError(err.message || "Failed to parse imported JSON file.");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "wedding":
        return HeartHandshake;
      case "birthday":
        return Cake;
      case "community":
      default:
        return Users;
    }
  };

  const storageProvider = getActiveStorageProvider();

  return (
    <div style={{ padding: "3rem 0", minHeight: "80vh" }}>
      <div className="container">
        {/* Page Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-primary)", marginBottom: "0.3rem" }}>
              <BookmarkCheck size={20} />
              <span style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Event Library
              </span>
              <Badge variant={storageProvider === "supabase" ? "success" : "default"}>
                {storageProvider === "supabase" ? "Supabase Cloud DB" : "Browser Storage (Local)"}
              </Badge>
            </div>
            <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 800, color: "var(--text-primary)" }}>
              Your Saved Event Plans
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "0.3rem" }}>
              Review, edit, or reopen saved weddings, birthdays, and community gatherings.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Button
              variant="outline"
              size="md"
              leftIcon={<Upload size={16} />}
              onClick={() => setIsImportModalOpen(true)}
            >
              Import JSON
            </Button>
            <Link href="/plan/new" style={{ textDecoration: "none" }}>
              <Button variant="primary" size="md" leftIcon={<Sparkles size={16} />}>
                Create New Event
              </Button>
            </Link>
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-secondary)" }}>
            Loading saved plans...
          </div>
        ) : plans.length === 0 ? (
          /* Empty state */
          <Card glass style={{ textAlign: "center", padding: "4rem 2rem", maxWidth: "600px", margin: "0 auto" }}>
            <BookmarkCheck size={48} color="var(--accent-secondary)" style={{ margin: "0 auto 1.25rem auto" }} />
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              No Saved Plans Yet
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "2rem" }}>
              Ready to organize your next wedding, birthday, or community project? Create your first
              plan in under 60 seconds with GenAI guidance.
            </p>
            <Link href="/plan/new" style={{ textDecoration: "none" }}>
              <Button variant="primary" size="lg" leftIcon={<Sparkles size={18} />}>
                Plan Your First Event
              </Button>
            </Link>
          </Card>
        ) : (
          /* Event Grid */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {plans.map((item) => {
              const Icon = getIcon(item.eventInput.eventType);
              const completedTasks = item.timeline.milestones.filter((m) => m.isCompleted).length;

              return (
                <Card key={item.id} glass interactive style={{ padding: "1.5rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "var(--radius-md)",
                          backgroundColor: "rgba(99, 102, 241, 0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--accent-primary)",
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <span
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            color: "var(--accent-secondary)",
                          }}
                        >
                          {item.eventInput.eventType}
                        </span>
                        <h3 style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--text-primary)" }}>
                          {item.eventInput.name}
                        </h3>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`Delete ${item.eventInput.name}`}
                      onClick={() => handleDelete(item.id, item.eventInput.name)}
                      style={{ color: "var(--text-tertiary)", padding: "0.3rem" }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  {/* Location & Date */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "1rem",
                      fontSize: "0.85rem",
                      color: "var(--text-secondary)",
                      marginBottom: "1rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <Calendar size={14} />
                      <span>{item.eventInput.eventDate}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <Users size={14} />
                      <span>{item.eventInput.attendeeCount} guests</span>
                    </div>
                  </div>

                  {/* Budget & Progress */}
                  <div
                    style={{
                      padding: "0.85rem 1rem",
                      backgroundColor: "var(--bg-tertiary)",
                      borderRadius: "var(--radius-md)",
                      marginBottom: "1.25rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)" }}>Budget</div>
                      <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text-primary)" }}>
                        {formatCurrency(item.budget.totalBudget, item.eventInput.currency)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", textAlign: "right" }}>
                        Progress
                      </div>
                      <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--accent-primary)" }}>
                        {completedTasks} / {item.timeline.milestones.length} Tasks
                      </div>
                    </div>
                  </div>

                  {/* View Details Link */}
                  <Link href={`/plan/${item.id}`} style={{ textDecoration: "none" }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      rightIcon={<ArrowRight size={16} />}
                      style={{ width: "100%", justifyContent: "space-between" }}
                    >
                      <span>Open Plan Dashboard</span>
                    </Button>
                  </Link>
                </Card>
              );
            })}
          </div>
        )}

        {/* Import JSON Modal */}
        <Modal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          title="Import Event Plan from JSON"
          description="Paste a previously exported EventPilot AI plan JSON payload below."
        >
          <form onSubmit={handleImport} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {importError && (
              <Alert variant="danger" title="Import Error">
                {importError}
              </Alert>
            )}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                JSON Payload:
              </label>
              <textarea
                rows={8}
                required
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder='Paste raw JSON here: {"eventInput": {...}, "budget": {...}}'
                style={{ fontFamily: "var(--font-family-mono)", fontSize: "0.82rem" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <Button type="button" variant="ghost" onClick={() => setIsImportModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" leftIcon={<Upload size={16} />}>
                Import Plan
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
