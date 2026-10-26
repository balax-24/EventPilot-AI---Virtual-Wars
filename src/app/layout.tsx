import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0d14",
};

export const metadata: Metadata = {
  title: "EventPilot AI - GenAI Event Planning Assistant",
  description:
    "Intelligent GenAI-powered planning assistant for Weddings, Birthdays, and Community Events. Precision budget allocation, paced preparation timelines, and actionable vendor checklists.",
  keywords: [
    "Event Planner",
    "Wedding Planning AI",
    "Birthday Party Planner",
    "Community Cleanup Organizer",
    "Budget Allocator",
    "GenAI Event Assistant",
    "Virtual PromptWars",
  ],
  authors: [{ name: "EventPilot AI Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
