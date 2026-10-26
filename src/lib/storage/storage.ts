/**
 * Hybrid Storage Manager for Event Plans
 * Synchronizes with Supabase when configured, otherwise uses client storage fallback.
 */

import { EventPlan } from "@/types/event";
import { getSupabaseClient } from "./supabase";

const LOCAL_STORAGE_KEY = "eventpilot_saved_plans_v1";

/**
 * Return current active storage provider name
 */
export function getActiveStorageProvider(): "supabase" | "browser_local" {
  const supabase = getSupabaseClient();
  return supabase ? "supabase" : "browser_local";
}

/**
 * Save or update an event plan
 */
export async function savePlan(plan: EventPlan): Promise<void> {
  const supabase = getSupabaseClient();

  // 1. Always write to local storage as an immediate, reliable cache
  if (typeof window !== "undefined") {
    try {
      const existing = getLocalPlans();
      const updated = [plan, ...existing.filter((p) => p.id !== plan.id)];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Local storage write failed:", e);
    }
  }

  // 2. Persist to Supabase if configured
  if (supabase) {
    try {
      const { error } = await supabase.from("events").upsert(
        {
          id: plan.id,
          name: plan.eventInput.name,
          event_type: plan.eventInput.eventType,
          event_date: plan.eventInput.eventDate,
          location: plan.eventInput.location,
          attendee_count: plan.eventInput.attendeeCount,
          total_budget: plan.eventInput.totalBudget,
          currency: plan.eventInput.currency,
          plan_data: plan,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
      if (error) {
        console.warn("Supabase upsert warning:", error.message);
      }
    } catch (err) {
      console.warn("Supabase connection error:", err);
    }
  }
}

/**
 * Retrieve a single event plan by ID
 */
export async function getPlan(id: string): Promise<EventPlan | null> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("plan_data")
        .eq("id", id)
        .single();

      if (!error && data?.plan_data) {
        return data.plan_data as EventPlan;
      }
    } catch (err) {
      console.warn("Supabase query error:", err);
    }
  }

  // Fallback to local storage
  if (typeof window !== "undefined") {
    const local = getLocalPlans();
    return local.find((p) => p.id === id) || null;
  }

  return null;
}

/**
 * List all saved event plans
 */
export async function getAllPlans(): Promise<EventPlan[]> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("plan_data")
        .order("updated_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d) => d.plan_data as EventPlan);
      }
    } catch (err) {
      console.warn("Supabase fetch all error:", err);
    }
  }

  // Fallback to local storage
  if (typeof window !== "undefined") {
    return getLocalPlans();
  }

  return [];
}

/**
 * Delete an event plan
 */
export async function deletePlan(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      await supabase.from("events").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase delete error:", err);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const existing = getLocalPlans();
      const filtered = existing.filter((p) => p.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.warn("Local storage delete failed:", e);
      return false;
    }
  }

  return true;
}

/**
 * Helper to get local storage array
 */
function getLocalPlans(): EventPlan[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as EventPlan[];
  } catch (err) {
    console.warn("Corrupt local storage data:", err);
    return [];
  }
}

/**
 * Export plan as formatted JSON file
 */
export function exportPlanAsJsonFile(plan: EventPlan): void {
  if (typeof window === "undefined") return;
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(plan, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  const safeFilename = `${plan.eventInput.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-plan.json`;
  downloadAnchor.setAttribute("download", safeFilename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
