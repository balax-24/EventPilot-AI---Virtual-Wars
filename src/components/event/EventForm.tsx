"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  HeartHandshake,
  Cake,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  Palette,
  Check,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { EventInput, EventType, CurrencyCode } from "@/types/event";
import { EventInputSchema } from "@/lib/validation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { formatCurrency } from "@/lib/currency";

interface EventFormProps {
  initialType?: EventType;
  initialBudget?: number;
  initialGuests?: number;
  initialLocation?: string;
}

export function EventForm({
  initialType = "wedding",
  initialBudget,
  initialGuests,
  initialLocation,
}: EventFormProps) {
  const router = useRouter();

  // Calculate default date (+45 days from today)
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 45);
  const defaultDateStr = defaultDate.toISOString().split("T")[0];

  const [eventType, setEventType] = useState<EventType>(initialType);
  const [name, setName] = useState(
    initialType === "wedding"
      ? "Traditional Indian Wedding"
      : initialType === "birthday"
      ? "Gala Birthday Celebration"
      : "Community Tree Plantation Drive"
  );
  const [eventDate, setEventDate] = useState(defaultDateStr);
  const [location, setLocation] = useState(initialLocation || "Chennai, Tamil Nadu");
  const [attendeeCount, setAttendeeCount] = useState<number>(
    initialGuests || (initialType === "wedding" ? 200 : initialType === "birthday" ? 35 : 100)
  );
  const [totalBudget, setTotalBudget] = useState<number>(
    initialBudget || (initialType === "wedding" ? 800000 : initialType === "birthday" ? 15000 : 25000)
  );
  const [currency, setCurrency] = useState<CurrencyCode>("INR");
  const [themeStyle, setThemeStyle] = useState(
    initialType === "wedding"
      ? "Royal South Indian Traditional with Silk & Marigolds"
      : initialType === "birthday"
      ? "Vibrant Retro Neon Carnival"
      : "Eco-Friendly Green Earth Drive"
  );
  const [priorities, setPriorities] = useState<string[]>([
    "Delicious Food & Hospitality",
    "Memorable Guest Experience",
    "Budget Discipline",
  ]);
  const [additionalRequirements, setAdditionalRequirements] = useState(
    initialType === "wedding"
      ? "Prefer outdoor lawn setup, live South Indian vegetarian banquet, and candid photography."
      : initialType === "birthday"
      ? "Need custom theme cake, party host for games, and return gift hampers."
      : "Need sound system for announcements, waste segregation bins, and volunteer snack boxes."
  );

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const priorityOptions = [
    "Delicious Food & Hospitality",
    "Stunning Decor & Lighting",
    "Cinematic Photography & Video",
    "Live Music & Entertainment",
    "Budget Discipline",
    "Memorable Guest Experience",
    "Eco-Friendly / Zero Waste",
    "Kid-Friendly Activities",
  ];

  const handleTypeChange = (type: EventType) => {
    setEventType(type);
    if (type === "wedding") {
      setName("Grand Wedding Celebration");
      setAttendeeCount(200);
      setTotalBudget(800000);
      setThemeStyle("Royal Traditional Festive");
      setAdditionalRequirements("Multi-course banquet, mandap decoration, candid photography.");
    } else if (type === "birthday") {
      setName("Vibrant Birthday Bash");
      setAttendeeCount(35);
      setTotalBudget(15000);
      setThemeStyle("Playful Modern Theme");
      setAdditionalRequirements("Theme cake, party games coordinator, and custom party favors.");
    } else {
      setName("Community Clean & Green Initiative");
      setAttendeeCount(100);
      setTotalBudget(25000);
      setThemeStyle("Zero-Waste Sustainable Action");
      setAdditionalRequirements("Need safety gloves, volunteer water points, and municipal waste clearance.");
    }
  };

  const togglePriority = (item: string) => {
    if (priorities.includes(item)) {
      if (priorities.length > 1) {
        setPriorities(priorities.filter((p) => p !== item));
      }
    } else {
      setPriorities([...priorities, item]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setValidationErrors({});

    const payload: EventInput = {
      name,
      eventType,
      eventDate,
      location,
      attendeeCount: Number(attendeeCount),
      totalBudget: Number(totalBudget),
      currency,
      themeStyle,
      priorities,
      additionalRequirements,
    };

    const result = EventInputSchema.safeParse(payload);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0]?.toString() || "form";
        errors[field] = err.message;
      });
      setValidationErrors(errors);
      setErrorMessage("Please correct the highlighted input errors before submitting.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/plan/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || errData.error || "Failed to generate plan");
      }

      const generatedPlan = await response.json();

      // Save to storage
      const { savePlan } = await import("@/lib/storage/storage");
      await savePlan(generatedPlan);

      // Navigate to plan view
      router.push(`/plan/${generatedPlan.id}`);
    } catch (err: any) {
      console.error("Submission failed:", err);
      setErrorMessage(err.message || "An error occurred while creating your plan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "860px", margin: "0 auto" }}>
      {errorMessage && (
        <Alert variant="danger" title="Validation Notice">
          {errorMessage}
        </Alert>
      )}

      {/* Step 1: Select Event Type */}
      <Card style={{ marginBottom: "1.75rem" }}>
        <h2
          style={{
            fontSize: "1.2rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
            color: "var(--text-primary)",
          }}
        >
          1. Select Event Type
        </h2>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
          EventPilot AI customizes budget breakdown models, timelines, and vendors based on your selection.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          {[
            {
              type: "wedding" as EventType,
              label: "Wedding & Reception",
              icon: HeartHandshake,
              desc: "Multi-month timeline, banquet splits, floral mandaps, cinematography",
            },
            {
              type: "birthday" as EventType,
              label: "Birthday Party",
              icon: Cake,
              desc: "Compact timeline, theme cake, entertaining games, custom favors",
            },
            {
              type: "community" as EventType,
              label: "Community Event",
              icon: Users,
              desc: "Logistics, volunteer refreshments, civic permits, safety supplies",
            },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = eventType === item.type;
            return (
              <button
                type="button"
                key={item.type}
                onClick={() => handleTypeChange(item.type)}
                style={{
                  padding: "1.25rem",
                  borderRadius: "var(--radius-md)",
                  border: isSelected
                    ? "2px solid var(--accent-primary)"
                    : "1px solid var(--border-subtle)",
                  backgroundColor: isSelected
                    ? "rgba(99, 102, 241, 0.12)"
                    : "var(--bg-tertiary)",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)",
                  boxShadow: isSelected ? "var(--shadow-glow)" : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.75rem",
                  }}
                >
                  <Icon
                    size={24}
                    color={isSelected ? "var(--accent-primary)" : "var(--text-secondary)"}
                  />
                  {isSelected && <Check size={18} color="var(--accent-primary)" />}
                </div>
                <h3
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 600,
                    color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
                    marginBottom: "0.35rem",
                  }}
                >
                  {item.label}
                </h3>
                <p style={{ fontSize: "0.82rem", color: "var(--text-tertiary)", lineHeight: 1.4 }}>
                  {item.desc}
                </p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Step 2: Event Core Parameters */}
      <Card style={{ marginBottom: "1.75rem" }}>
        <h2
          style={{
            fontSize: "1.2rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
            color: "var(--text-primary)",
          }}
        >
          2. Event Specifications
        </h2>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
          Accurate counts and dates ensure realistic per-guest budgets and sensible task deadlines.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {/* Event Name */}
          <div>
            <label
              htmlFor="event-name"
              style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.4rem" }}
            >
              Event Title *
            </label>
            <input
              id="event-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Senthil & Priya's Wedding"
            />
            {validationErrors.name && (
              <span style={{ fontSize: "0.8rem", color: "var(--danger)", marginTop: "0.25rem", display: "block" }}>
                {validationErrors.name}
              </span>
            )}
          </div>

          {/* Event Date */}
          <div>
            <label
              htmlFor="event-date"
              style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.4rem" }}
            >
              Event Date *
            </label>
            <input
              id="event-date"
              type="date"
              required
              value={eventDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setEventDate(e.target.value)}
            />
            {validationErrors.eventDate && (
              <span style={{ fontSize: "0.8rem", color: "var(--danger)", marginTop: "0.25rem", display: "block" }}>
                {validationErrors.eventDate}
              </span>
            )}
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="event-location"
              style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.4rem" }}
            >
              Location / City *
            </label>
            <input
              id="event-location"
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Chennai, Tamil Nadu"
            />
            {validationErrors.location && (
              <span style={{ fontSize: "0.8rem", color: "var(--danger)", marginTop: "0.25rem", display: "block" }}>
                {validationErrors.location}
              </span>
            )}
          </div>

          {/* Attendee Count */}
          <div>
            <label
              htmlFor="attendee-count"
              style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.4rem" }}
            >
              Expected Attendees *
            </label>
            <input
              id="attendee-count"
              type="number"
              required
              min={1}
              max={100000}
              value={attendeeCount}
              onChange={(e) => setAttendeeCount(Math.max(1, parseInt(e.target.value) || 1))}
            />
            {validationErrors.attendeeCount && (
              <span style={{ fontSize: "0.8rem", color: "var(--danger)", marginTop: "0.25rem", display: "block" }}>
                {validationErrors.attendeeCount}
              </span>
            )}
          </div>

          {/* Total Budget */}
          <div>
            <label
              htmlFor="total-budget"
              style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.4rem" }}
            >
              Total Budget ({currency === "INR" ? "₹ INR" : currency}) *
            </label>
            <input
              id="total-budget"
              type="number"
              required
              min={100}
              step={500}
              value={totalBudget}
              onChange={(e) => setTotalBudget(Math.max(100, parseInt(e.target.value) || 0))}
            />
            <div style={{ fontSize: "0.8rem", color: "var(--accent-secondary)", marginTop: "0.3rem" }}>
              Formatted: {formatCurrency(totalBudget, currency)}
            </div>
            {validationErrors.totalBudget && (
              <span style={{ fontSize: "0.8rem", color: "var(--danger)", marginTop: "0.25rem", display: "block" }}>
                {validationErrors.totalBudget}
              </span>
            )}
          </div>

          {/* Currency selection */}
          <div>
            <label
              htmlFor="currency"
              style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.4rem" }}
            >
              Currency *
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            >
              <option value="INR">INR (₹ - Indian Rupee)</option>
              <option value="USD">USD ($ - US Dollar)</option>
              <option value="EUR">EUR (€ - Euro)</option>
              <option value="GBP">GBP (£ - British Pound)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Step 3: Theme, Priorities, Special Requirements */}
      <Card style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontSize: "1.2rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
            color: "var(--text-primary)",
          }}
        >
          3. Theme & Preferences
        </h2>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
          Guide the GenAI assistant on the ambiance, styling, and critical focus areas.
        </p>

        {/* Theme or Style */}
        <div style={{ marginBottom: "1.25rem" }}>
          <label
            htmlFor="theme-style"
            style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.4rem" }}
          >
            Preferred Theme or Style *
          </label>
          <input
            id="theme-style"
            type="text"
            required
            value={themeStyle}
            onChange={(e) => setThemeStyle(e.target.value)}
            placeholder="e.g. Royal Traditional South Indian or Pastel Minimalist"
          />
        </div>

        {/* Priority Chips */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.5rem" }}
          >
            Key Priorities (Select at least one) *
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {priorityOptions.map((opt) => {
              const active = priorities.includes(opt);
              return (
                <button
                  type="button"
                  key={opt}
                  onClick={() => togglePriority(opt)}
                  style={{
                    padding: "0.4rem 0.8rem",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    backgroundColor: active ? "var(--accent-primary)" : "var(--bg-tertiary)",
                    color: active ? "#ffffff" : "var(--text-secondary)",
                    border: active ? "1px solid var(--accent-primary)" : "1px solid var(--border-subtle)",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional Requirements */}
        <div>
          <label
            htmlFor="additional-requirements"
            style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.4rem" }}
          >
            Special Requirements / Notes (Optional)
          </label>
          <textarea
            id="additional-requirements"
            rows={3}
            value={additionalRequirements}
            onChange={(e) => setAdditionalRequirements(e.target.value)}
            placeholder="Describe any dietary constraints, VIP arrivals, weather considerations, or specific ideas..."
          />
        </div>
      </Card>

      {/* Submit Button */}
      <div style={{ textAlign: "center" }}>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          leftIcon={<Sparkles size={20} />}
          style={{ width: "100%", maxWidth: "420px", padding: "1rem" }}
        >
          {isLoading ? "Synthesizing AI Event Plan..." : "Generate Personalized Event Plan"}
        </Button>
        <p style={{ fontSize: "0.82rem", color: "var(--text-tertiary)", marginTop: "0.75rem" }}>
          Calculations are verified with integer precision. The plan will be fully editable.
        </p>
      </div>
    </form>
  );
}
