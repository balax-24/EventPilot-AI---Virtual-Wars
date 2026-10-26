# EventPilot AI — GenAI Event Planning Assistant
> **Virtual PromptWars — Challenge 5 | Hack2Skill**  
> Complete, production-ready full-stack application transforming event requirements into actionable, personalized, and budget-perfect plans for **Weddings**, **Birthdays**, and **Community Events**.

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Tests-18%20Passed-brightgreen?style=flat&logo=vitest)](https://vitest.dev/)
[![Repo Size](https://img.shields.io/badge/Repo%20Size-0.51%20MB-success)](#repository-size)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

---

## 1. Project Overview
Planning physical and social gatherings—such as weddings, birthday parties, or community volunteer drives—is notoriously overwhelming. Organizers face unpredictable budget creep, fragmented spreadsheets, lack of timeline pacing, and generic advice that fails to consider their guest counts, locations, or aesthetic priorities.

**EventPilot AI** is an intelligent full-stack event copilot powered by Generative AI. It transforms natural-language event specifications into:
1. **Interactive, integer-precise budget allocations** across venue, catering, decor, photography, entertainment, and contingency reserves.
2. **Date-aware preparation timelines** with countdown tracking and compressed sprint scheduling for imminent dates.
3. **Actionable vendor checklists** with estimated cost benchmarks, booking statuses (`pending`, `researching`, `contacted`, `booked`), and deadlines.
4. **Tailored innovation concepts** (themes, icebreakers, cost-saving alternatives, and risk mitigations).
5. **Conversational plan refinement**, enabling users to modify their plans with conversational instructions (e.g., *"Reduce budget by ₹5,000 while maintaining food quality"* or *"Prioritize catering over floral decor"*).

---

## 2. Problem Statement Alignment
EventPilot AI addresses every mandate of Hack2Skill Challenge 5:
- **Event Archetypes**: Deeply modeled workflows for **Weddings**, **Birthdays**, and **Community Drives**.
- **Real-World Scenarios**: Pre-configured prompts tested against real benchmarks:
  - *"I want a birthday party in Chennai for 30 people with a budget of ₹15,000."*
  - *"Plan a wedding for 200 guests with a budget of ₹8 lakh."*
  - *"Organize a community cleanup event for 100 volunteers."*
  - *"Reduce my budget by ₹5,000 while keeping food quality high."*
- **Mathematical Integrity**: Eliminates floating-point calculation errors using an **integer minor-units engine (paise/cents)**.
- **Security-First AI Architecture**: All Generative AI requests execute strictly on the server side via Next.js App Router route handlers. **Zero API keys are exposed to client browser bundles.**

---

## 3. Core Features

### A. Intelligent Event Studio
- Multi-step validation for attendee counts, budgets, future dates, themes, and special requirements.
- Native support for **INR (₹)** as the primary currency, with automatic formatting for Lakhs and Crores.
- Dual input mode: structured form controls or natural-language prompt synthesis.

### B. Interactive Budget Manager
- Real-time expense breakdown across 7–10 event-specific categories.
- Displays: **Total Budget**, **Total Allocated**, **Remaining Balance**, **Utilization %**, and **Actual Spent**.
- **Over-Budget Guard**: Instant visual alerts and warnings when category allocations exceed the total budget cap.
- Inline category editing, additions, deletions, and an **Auto-Rebalance** algorithm that rescales all categories proportionally to fit the target budget.

### C. Date-Aware Timeline Generator
- Backward-scheduled preparation milestones from the event date to today.
- **Compressed Sprint Mode**: Automatically activates for events within 30 days, highlighting high-priority tasks.
- Interactive completion tracking with progress metrics.

### D. Vendor Checklist & Procurement Tracker
- Pre-populated vendor duties (e.g., Lead Caterer, Banquet Lawn, Cinematography, Waste Hauling).
- Lifecycle status tracking: `pending` → `researching` → `contacted` → `booked`.
- Target contract deadlines and budget allocation benchmarks.

### E. Conversational AI Assistant
- Live plan refinement modal that takes user instructions in plain English.
- Evaluates proposed changes and provides an audit diff (`diffSummary` and `explanation`) before applying changes.
- Automatically re-balances allocations to preserve mathematical validity.
- Complete **Plan Revision Audit Log** displaying historical changes.

### F. Hybrid Persistence & Portability
- Primary database integration with **Supabase PostgreSQL** (with Row Level Security and migrations).
- Graceful client fallback to **LocalStorage / IndexedDB** when Supabase credentials are not configured.
- Full JSON export and import for seamless backup and cross-device plan migration.

---

## 4. System Architecture

```
[ User Browser / Client ]
        │
        ├── UI Primitives (Accessible Semantic HTML, ARIA, Focus Rings)
        ├── Dynamic Views (Dashboard, BudgetPlanner, TimelineView, VendorChecklist)
        └── Local Storage Fallback Adapter (Instant offline cache & persistence)
        │
        ▼ (HTTPS REST / Next.js Serverless Routes)
[ Server Layer — Next.js 15 App Router ]
        │
        ├── /api/plan/generate ──► Validates via Zod Schema
        ├── /api/plan/refine   ──► Validates Revision Payload
        │
        ├── Dedicated Planning Service (src/lib/ai/gemini.ts)
        │     ├── Google Gemini 2.5/1.5 Flash API (Server-Side Isolated Key)
        │     ├── Deterministic Synthesis Engine (Robust Offline Fallback)
        │     ├── Proportional Budget Balancer
        │     └── Date & Milestone Sanitizer
        │
        ▼
[ Database / Persistence ]
        ├── Supabase PostgreSQL (Public/Authenticated RLS Policies)
        └── Client-side JSON Import / Export Portability
```

---

## 5. Technology Stack
- **Framework**: Next.js 15 (App Router, Server-Side Route Handlers)
- **Runtime & Language**: Node.js v24+ / TypeScript 5.7 (Strict Mode)
- **UI & Styling**: Vanilla CSS Architecture with Design Tokens, Glassmorphism, and zero CSS runtime bloat
- **Icons**: Lucide React
- **Schema Validation**: Zod 3.24
- **Testing Engine**: Vitest 3.2 + Testing Library + jsdom
- **AI Model**: Google Gemini (`gemini-2.5-flash` / `gemini-1.5-flash`) via official Google GenAI REST API
- **Persistence**: Supabase (PostgreSQL with RLS) + LocalStorage hybrid adapter

---

## 6. How GenAI is Used (Disclosure)
| Feature | GenAI Provider & Model | Role & Output |
| :--- | :--- | :--- |
| **Initial Plan Synthesis** | Google Gemini 2.5/1.5 Flash | Analyzes event inputs, attendees, location, and constraints to generate structured JSON matching `AIGeneratedPlanOutputSchema`. |
| **Plan Refinement** | Google Gemini 2.5/1.5 Flash | Evaluates user prompts (e.g. *"Reduce budget by ₹5,000"*), adjusts allocations, updates vendor items, and produces a semantic diff summary. |
| **Deterministic Fallback** | Internal Rule-Based Engine | If external AI API keys are not provided or the network is offline, a deterministic planning engine synthesizes mathematically valid plans. |

*Note: Model outputs are never trusted blindly. All responses pass through Zod boundary validation and programmatic budget re-balancing.*

---

## 7. Installation & Local Development

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 9+

### Setup Steps
```bash
# 1. Clone repository
git clone https://github.com/balax-24/EventPilot-AI---Virtual-Wars.git
cd EventPilot-AI---Virtual-Wars

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
```

Edit `.env.local` with your Google Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```
*(Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey))*

### Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 8. Database Setup (Supabase - Optional)
If using Supabase for cloud persistence:
1. Create a project at [Supabase](https://supabase.com).
2. Navigate to the SQL Editor.
3. Paste and execute the contents of [`supabase/schema.sql`](supabase/schema.sql).
4. Add your project URL and keys to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
*If omitted, EventPilot AI functions with local storage persistence.*

---

## 9. Running Tests
The project features 18 automated tests across unit, integration, and security suites:
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Verified Test Suites:
- `src/test/unit/currency.test.ts`: Integer minor units (paise) math, Lakhs/Crores formatting, over-budget calculations.
- `src/test/unit/validation.test.ts`: Negative budget rejection, past date rejection, attendee count limits, AI schema enforcement.
- `src/test/integration/ai-service.test.ts`: Plan generation for weddings/birthdays/community events, milestone date constraints, conversational plan refinement.
- `src/test/security/security.test.ts`: Prompt injection safety, secret key leak prevention, oversized input defense.

---

## 10. Repository Size
- **Total Source Code Size**: **0.51 MB** (532 KB)
- Well below the Hack2Skill **10 MB limit**.
- Measured excluding `node_modules` and `.next` build output via `.gitignore`.

---

## 11. Security Considerations
1. **Zero Secret Leakage**: AI API keys (`GEMINI_API_KEY`) and database service keys remain strictly on the server.
2. **Server-Side Validation**: All client payloads and model-generated responses are validated through Zod schemas.
3. **HTTP Security Headers**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection`, strict `Referrer-Policy`, and `Permissions-Policy` configured in `next.config.ts`.
4. **XSS Protection**: Zero use of `dangerouslySetInnerHTML`; text is escaped via React DOM.
5. **No Code Execution**: AI-generated responses are restricted to structured JSON and cannot execute arbitrary shell commands, database queries, or eval statements.

---

## 12. Accessibility (a11y)
- **Semantic HTML5**: Native `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`, `<article>`, `<table>` elements.
- **Visible Focus Rings**: High-contrast outline on all interactive inputs and buttons (`:focus-visible`).
- **Screen Reader Support**: `.sr-only` utility classes and ARIA attributes (`role="progressbar"`, `role="dialog"`, `aria-modal="true"`, `aria-label`).
- **Reduced Motion**: Respects `@media (prefers-reduced-motion: reduce)` by disabling non-essential transitions.
- **Color Contrast**: WCAG AA/AAA compliant color combinations.

---

## 13. License
MIT License. Built for Hack2Skill Virtual PromptWars Challenge 5.
