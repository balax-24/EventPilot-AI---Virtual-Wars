"use client";

import React, { useState } from "react";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  DollarSign,
  Calendar,
  Info,
  Building,
} from "lucide-react";
import { VendorItem, VendorStatus, PriorityLevel, CurrencyCode } from "@/types/event";
import { formatCurrency } from "@/lib/currency";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface VendorChecklistProps {
  vendors: VendorItem[];
  currency: CurrencyCode;
  eventDate: string;
  onVendorsUpdate: (updated: VendorItem[]) => void;
}

export function VendorChecklist({
  vendors,
  currency,
  eventDate,
  onVendorsUpdate,
}: VendorChecklistProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Catering");
  const [newDescription, setNewDescription] = useState("");
  const [newCost, setNewCost] = useState<number>(5000);
  const [newPriority, setNewPriority] = useState<PriorityLevel>("high");
  const [newDeadline, setNewDeadline] = useState(eventDate);

  const handleStatusChange = (id: string, newStatus: VendorStatus) => {
    const updated = vendors.map((v) => {
      if (v.id === id) {
        return { ...v, status: newStatus };
      }
      return v;
    });
    onVendorsUpdate(updated);
  };

  const handleDelete = (id: string) => {
    const updated = vendors.filter((v) => v.id !== id);
    onVendorsUpdate(updated);
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newVendor: VendorItem = {
      id: `vend-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim(),
      estimatedCost: Math.max(0, newCost),
      status: "pending",
      priority: newPriority,
      deadline: newDeadline <= eventDate ? newDeadline : eventDate,
    };

    onVendorsUpdate([...vendors, newVendor]);
    setIsAdding(false);
    setNewTitle("");
    setNewDescription("");
    setNewCost(5000);
  };

  const bookedCount = vendors.filter((v) => v.status === "booked").length;
  const progressPercent = vendors.length > 0 ? Math.round((bookedCount / vendors.length) * 100) : 0;

  const statusBadgeVariant = (status: VendorStatus) => {
    switch (status) {
      case "booked":
        return "success";
      case "contacted":
        return "info";
      case "researching":
        return "warning";
      case "pending":
      default:
        return "default";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Overview Card */}
      <Card style={{ padding: "1.25rem 1.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 600 }}>Vendor Procurement Checklist</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
              {bookedCount} of {vendors.length} vendors secured ({progressPercent}% completion)
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => setIsAdding(!isAdding)}
          >
            {isAdding ? "Cancel" : "Add Vendor Requirement"}
          </Button>
        </div>
      </Card>

      {/* Add Vendor Form */}
      {isAdding && (
        <Card style={{ padding: "1.5rem", border: "1px solid var(--accent-primary)" }}>
          <h4 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: "1rem" }}>
            Add Required Vendor or Service
          </h4>
          <form
            onSubmit={handleAddVendor}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", marginBottom: "0.3rem" }}>
                Service Title *
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Lead Wedding Caterer"
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", marginBottom: "0.3rem" }}>
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              >
                <option value="Venue">Venue</option>
                <option value="Catering">Catering</option>
                <option value="Photography">Photography</option>
                <option value="Decoration">Decoration</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Transportation">Transportation</option>
                <option value="Safety Supplies">Safety Supplies</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", marginBottom: "0.3rem" }}>
                Estimated Cost ({currency})
              </label>
              <input
                type="number"
                min={0}
                value={newCost}
                onChange={(e) => setNewCost(Math.max(0, parseInt(e.target.value) || 0))}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", marginBottom: "0.3rem" }}>
                Booking Deadline (Max: {eventDate})
              </label>
              <input
                type="date"
                required
                max={eventDate}
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", fontSize: "0.82rem", marginBottom: "0.3rem" }}>
                Description & Deliverables
              </label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Specific contractual needs, headcount, equipment..."
              />
            </div>
            <div style={{ gridColumn: "1 / -1", display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Vendor Item
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Vendor Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1rem",
        }}
      >
        {vendors.map((vendor) => (
          <Card key={vendor.id} glass style={{ padding: "1.25rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: "0.6rem",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "var(--accent-secondary)",
                  }}
                >
                  {vendor.category}
                </span>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--text-primary)" }}>
                  {vendor.title}
                </h4>
              </div>

              <Badge variant={statusBadgeVariant(vendor.status)}>
                {vendor.status}
              </Badge>
            </div>

            <p
              style={{
                fontSize: "0.88rem",
                color: "var(--text-secondary)",
                lineHeight: 1.5,
                marginBottom: "1rem",
              }}
            >
              {vendor.description}
            </p>

            {/* Estimated cost & deadline info */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "0.85rem",
                padding: "0.6rem 0",
                borderTop: "1px solid var(--border-subtle)",
                borderBottom: "1px solid var(--border-subtle)",
                marginBottom: "1rem",
              }}
            >
              <div>
                <span style={{ color: "var(--text-tertiary)" }}>Est. Budget: </span>
                <strong style={{ color: "var(--text-primary)" }}>
                  {formatCurrency(vendor.estimatedCost, currency)}
                </strong>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "var(--text-secondary)" }}>
                <Calendar size={14} />
                <span>Deadline: {vendor.deadline}</span>
              </div>
            </div>

            {/* Interactive Status Selector and Delete */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <label
                  htmlFor={`status-${vendor.id}`}
                  style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}
                >
                  Status:
                </label>
                <select
                  id={`status-${vendor.id}`}
                  value={vendor.status}
                  onChange={(e) => handleStatusChange(vendor.id, e.target.value as VendorStatus)}
                  style={{ fontSize: "0.82rem", padding: "0.25rem 0.5rem", width: "auto" }}
                >
                  <option value="pending">Pending</option>
                  <option value="researching">Researching</option>
                  <option value="contacted">Contacted</option>
                  <option value="booked">Booked & Locked</option>
                </select>
              </div>

              <Button
                variant="ghost"
                size="sm"
                aria-label={`Delete ${vendor.title}`}
                onClick={() => handleDelete(vendor.id)}
                style={{ color: "var(--danger)", padding: "0.3rem" }}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Honest disclosure note */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.82rem",
          color: "var(--text-tertiary)",
          padding: "0 0.5rem",
        }}
      >
        <Info size={16} />
        <span>
          Verification notice: EventPilot AI provides structured vendor requirements and target
          timelines. External vendors are not booked automatically without direct user agreement.
        </span>
      </div>
    </div>
  );
}
