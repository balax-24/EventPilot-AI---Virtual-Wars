# EventPilot AI — Submission & Demonstration Pack
**Hack2Skill Virtual PromptWars — Challenge 5**

---

## 1. Project Overview & Problem Statement Alignment

**EventPilot AI** is a production-grade, full-stack event intelligence application built for Hack2Skill Virtual PromptWars Challenge 5. 

### Problem Addressed
Organizing physical gatherings—such as 200-guest traditional weddings, ₹15,000 neighborhood birthday parties, or 100-volunteer community drives—is traditionally plagued by:
1. **Unpredictable Budget Creep**: Spreadsheets fail to enforce arithmetic discipline or warn when category allocations breach total budget limits.
2. **Disconnected Timelines**: Event deadlines are either arbitrary or missed due to lack of backward scheduling from the target event date.
3. **Vendor Procurement Friction**: Organizers lack actionable cost benchmarks and structured lifecycle tracking (`pending` → `researching` → `contacted` → `booked`).
4. **Rigid Planning Tools**: Modifying an existing plan requires manually recalculating dozens of spreadsheet rows rather than expressing adjustments in natural language.

### Challenge 5 Compliance
- **Supported Event Archetypes**: Deep domain models tailored specifically for **Weddings**, **Birthdays**, and **Community Events**.
- **Real-World Scenarios Handled**:
  - *"Birthday party in Chennai for 30 people with a budget of ₹15,000."*
  - *"Royal heritage wedding for 200 guests with a budget of ₹8 lakh."*
  - *"Clean city community drive for 100 volunteers with a budget of ₹25,000."*
  - *"Reduce total budget by ₹2,000 while elevating food and catering standards."*
- **Mathematical Integrity**: All monetary computations utilize an integer minor-units arithmetic engine (`paise`/`cents`) to prevent floating-point calculation errors.
- **Zero Client-Side Secrets**: All GenAI calls execute exclusively in server-side Next.js route handlers. No API keys are leaked into client browser bundles.

---

## 2. Core Working Features

1. **Intelligent Event Specification Studio (`/plan/new`)**:
   - Multi-step validation for attendee counts, budgets, future dates, aesthetic themes, and priority selections.
   - Native support for **INR (₹)** with localized Indian numbering formatting (Lakhs and Crores).
   - Real-world prompt scenario presets for rapid one-click testing.

2. **Interactive Budget Manager**:
   - Real-time expense breakdown across 6–8 domain-specific categories.
   - Live metrics: **Total Budget**, **Total Allocated**, **Remaining Balance**, **Utilization %**, and **Over-Budget Warning**.
   - Inline category editing, category addition/deletion, and one-click proportional **Auto-Rebalance**.

3. **Date-Aware Preparation Timeline**:
   - Chronological preparation milestones backward-scheduled from the target event date.
   - **Compressed Sprint Mode**: Automatically activates for events occurring within 30 days, prioritizing critical path items.
   - Interactive completion checkboxes updating milestone progress dynamically.

4. **Vendor Procurement Checklist**:
   - Pre-populated vendor tasks with cost benchmarks based on attendee count and budget.
   - Stage progression tracking: `pending` → `researching` → `contacted` → `booked`.
   - Contract deadlines and requirements tracking.

5. **Personalized Ideas & Risk Mitigations**:
   - Tailored experiential concepts, icebreakers, and cost-saving DIY alternatives.
   - Explicit planning assumptions and proactive risk mitigation strategies.

6. **Conversational Plan Refinement (AI Assistant)**:
   - Natural-language modification modal (e.g., *"Reduce total budget by ₹50,000 and adjust photography and catering"*).
   - Generates an instant diff summary, updates all allocations and milestones, and maintains an audit changelog.

7. **Dual-Persistence Engine**:
   - Connects directly to **Supabase PostgreSQL** with Row Level Security (RLS) policies when credentials are provided.
   - Gracefully falls back to browser **Local Storage** with JSON Export/Import capabilities when unconfigured.

---

## 3. Actual Technology Stack

- **Framework**: [Next.js 15.5](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Language**: [TypeScript 5.7](https://www.typescriptlang.org/) (Strict type checking enabled)
- **Runtime & UI**: [React 19](https://react.dev/)
- **Styling**: Vanilla CSS Design System with CSS Tokens, Glassmorphic surfaces, and WCAG AA/AAA contrast ratios (no Tailwind bloat)
- **Validation**: [Zod 3.24](https://zod.dev/) (Strict boundary schemas for requests, responses, and storage)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database / Cloud Storage**: [Supabase](https://supabase.com/) (`@supabase/supabase-js` v2.49)
- **Testing**: [Vitest 3.2](https://vitest.dev/) with `jsdom` (18 unit, integration, and security tests)

---

## 4. Disclosure of Generative AI Services Used

- **GenAI Provider**: Google Cloud / Google AI Studio
- **Configured Model**: `gemini-1.5-flash` (default, overridable to `gemini-2.0-flash` via `GEMINI_MODEL`)
- **Features Powered by GenAI**:
  1. *Structured Event Plan Synthesis* (`POST /api/plan/generate`): Generates category allocations, chronological milestones, vendor tasks, personalized ideas, assumptions, and risk mitigations.
  2. *Conversational Plan Refinement* (`POST /api/plan/refine`): Interprets natural-language user feedback to calculate proportional adjustments, rebalance budgets, and explain changes.
- **Client vs. Server Boundary**: AI requests execute strictly in server-side API routes. The browser client never touches or possesses the `GEMINI_API_KEY`.
- **Transparent Deterministic Fallback**: In offline, rate-limited, or uncredentialed environments, a deterministic rule-based synthesizer generates mathematically valid plans. The UI explicitly marks these plans with an amber `Deterministic Heuristic (Fallback)` badge so users are never misled.

---

## 5. Verified Tests & Known Limitations

### Test Suite Execution (Vitest v3.2.7)
```
 ✓ src/test/unit/currency.test.ts (5 tests)
 ✓ src/test/unit/validation.test.ts (7 tests)
 ✓ src/test/integration/ai-service.test.ts (3 tests)
 ✓ src/test/security/security.test.ts (3 tests)

Test Files  4 passed (4)
Tests       18 passed (18)
Duration    2.68s
```

### Static Analysis & Build
- `npx tsc --noEmit`: 0 errors, 0 warnings
- `npm run lint`: ✔ No ESLint warnings or errors
- `npm run build`: 8/8 static pages compiled, 103 kB First Load JS

### Known Limitations
1. **Live Gemini Provider Verification**: In local development without a configured `GEMINI_API_KEY`, the application safely activates the deterministic fallback engine. Live Google LLM execution requires placing a valid key in `.env.local` or Vercel environment variables.
2. **Browser Storage Limitation**: When Supabase credentials are not provided, events are persisted in the browser's `localStorage`. Data does not synchronize across separate devices and can be cleared if browser site data is wiped.

---

## 6. Demonstration Video Storyboard (2–3 Minutes)

| Timestamp | Visual Screen | Narration & Action Guide |
| :--- | :--- | :--- |
| **0:00 – 0:30** | **Landing Page (`/`)** | *"Welcome to EventPilot AI — an intelligent, full-stack event planning copilot built for Hack2Skill Virtual PromptWars Challenge 5. Whether you are planning a traditional 200-guest wedding, a ₹15,000 birthday, or a community volunteer drive, EventPilot AI eliminates budget creep and spreadsheet chaos."* |
| **0:30 – 1:00** | **Event Creation (`/plan/new`)** | Click **"Plan Your Event"**. Select the **Birthday Party** preset. Show the pre-filled inputs: 30 guests, ₹15,000 budget, Chennai location, Outer Space theme, and dietary priorities. Click **"Generate Event Plan"**. |
| **1:00 – 1:30** | **Budget Management** | Show the generated budget card. Highlight that Total Allocated equals exactly ₹15,000 with 0 remaining residue. Demonstrate **in-place editing**: change Venue from ₹3,750 to ₹5,000. Point out the instant over-budget warning banner and remaining deficit. Click **"Auto-Rebalance"** to demonstrate proportional mathematical re-balancing back to ₹15,000. |
| **1:30 – 1:55** | **Timeline & Vendors** | Switch to the **Timeline** tab. Highlight milestones scheduled chronologically backward from the event date. Check off *"Book Party Location"*. Switch to **Vendor Checklist**: change the Cake Baker status from `pending` to `contacted`. |
| **1:55 – 2:30** | **AI Assistant Refinement** | Click **"Refine Plan with AI"**. Enter the natural-language prompt: *"Reduce total budget by ₹2,000 and upgrade cake quality"*. Click **"Evaluate & Adjust Plan"**. Review the diff summary and updated budget of ₹13,000. Click **"Apply Changes"**. Show the newly updated budget and changelog revision history. |
| **2:30 – 3:00** | **Persistence & Conclusion** | Click **"Save Plan"**. Navigate to **"Saved Plans"** (`/events`). Show the saved plan in the library. Click **"Export JSON"** to highlight data portability. Conclude by highlighting server-isolated API keys, 18 passing tests, and an ultra-lean 540 KB repository size. |

---

## 7. Draft LinkedIn Post

```markdown
🚀 Proud to introduce EventPilot AI — our submission for the Virtual PromptWars Challenge 5 by Hack2Skill!

Planning physical and social events—whether a traditional 200-guest wedding, a ₹15,000 birthday, or a community cleanup—often leads to budget overruns and spreadsheet fatigue.

We built EventPilot AI to serve as an intelligent, precision copilot for event hosts:
✨ Natural-Language to Structured Plan: Generates expense allocations, chronological milestones, vendor tasks, and creative ideas in seconds.
💰 Precision Budgeting: Powered by an integer minor-units arithmetic engine (paise) that eliminates floating-point calculation errors.
⏱️ Date-Aware Timelines: Chronological milestones with automatic compressed-sprint mode for imminent dates.
📋 Vendor Procurement Tracker: Lifecycle tracking from research to booking with contract deadlines.
💬 Conversational Plan Refinement: Adjust your entire plan with prompts like "Reduce total budget by ₹5,000 while maintaining high food quality".
🔒 Security & Engineering: Built on Next.js 15 App Router, zero client-exposed API keys, 18 passing automated tests, and a lean 0.54 MB repository footprint.

🔗 GitHub: https://github.com/balax-24/EventPilot-AI---Virtual-Wars
🌐 Live Deployed App: [Deploy URL]
📹 2-Minute Demo Video: [Video URL]

Huge thanks to Hack2Skill for organizing this fantastic challenge!

#EventPilotAI #Hack2Skill #VirtualPromptWars #GenerativeAI #Nextjs #TypeScript #FullStack #GoogleGemini #WebDevelopment
```

---

## 8. Final Submission Checklist

- [x] **Public GitHub Repository**: Configured for `https://github.com/balax-24/EventPilot-AI---Virtual-Wars`
- [x] **Repository Size Compliance**: **540.51 KB** uncompressed source / **149.50 KB** zip archive (Limit: < 10 MB)
- [x] **Security & Secrets Check**: No `.env` files or API keys committed (`.gitignore` protects all `.env*` files)
- [x] **Automated Tests**: 18/18 tests passing in Vitest (Unit, Integration, Security)
- [x] **Type Safety & Linting**: 0 TypeScript errors (`tsc --noEmit`), 0 ESLint warnings (`next lint`)
- [x] **Production Build**: Next.js 15 production build compiled successfully
- [ ] **Public Deployment URL**: [To be completed upon Vercel import]
- [ ] **Demo Video URL**: [To be recorded using Section 6 storyboard]
- [ ] **LinkedIn Post URL**: [To be published using Section 7 draft]
