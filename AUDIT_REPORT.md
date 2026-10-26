# EventPilot AI — Repository Audit & Baseline Report
**Submission for Virtual PromptWars Challenge 5 | Hack2Skill**
**Auditor**: Senior Full-Stack & AI Architect  
**Date**: October 26, 2026  
**Status**: Initial Audit Complete — Proceeding with Implementation Phases

---

## A. Existing Architecture
1. **Workspace Context**:
   - Location: `d:\Projects\Virtual Prompt Wars\Challenge 5`
   - Git Context: Root repository is `D:\Projects\Virtual Prompt Wars` (configured for prior challenges including StadiumFlow and VoteWise). `Challenge 5` directory was initially an empty workspace.
2. **Selected & Initialized Architecture**:
   - **Framework**: Next.js 15 (App Router) + React 19 + TypeScript.
   - **Design & Styling**: Clean, responsive Vanilla CSS Architecture with CSS Design Tokens, custom glassmorphism, semantic theme variables, zero dependency bloat.
   - **Validation**: Strict boundary validation via Zod (schema enforcement for client payloads, database persistence, and AI structured JSON outputs).
   - **Testing Engine**: Vitest 3 + `@testing-library/react` + `jsdom`.
   - **AI Integration**: Server-Side Dedicated Planning Service using Google Gemini (Interactions & REST SDK), keeping keys completely isolated from browser client bundles.
   - **Persistence**: Hybrid Storage Adapter — primary integration ready for Supabase PostgreSQL (with RLS policies and migrations), coupled with an automatic, robust client-side storage fallback (LocalStorage/IndexedDB) when Supabase credentials are not provided.
   - **Deployment Target**: Vercel Serverless (1-click zero-config deployment) + Supabase.

---

## B. Existing Functionality
- Prior to audit: Directory was clean/empty with no legacy code to preserve.
- Scaffolded:
  - `package.json`: Configured with Next.js 15, React 19, Zod, Supabase, Lucide React, Vitest.
  - `tsconfig.json`: Strict TypeScript checking with `@/*` aliases.
  - `next.config.ts`: Strict HTTP security headers (`nosniff`, `DENY` frames, XSS protection, Referrer-Policy, Permissions-Policy).
  - `vitest.config.ts`: Automated test harness configured.
  - `.env.example`: Clear template covering Gemini AI and Supabase credentials.
  - `src/types/event.ts`: Full domain modeling for Weddings, Birthdays, and Community events.
  - `src/lib/currency.ts`: Integer minor-units currency arithmetic (eliminates floating-point imprecision).
  - `src/lib/validation.ts`: Zod schema suite for events, budgets, milestones, vendors, and AI responses.
  - `src/lib/ai/prompts.ts`: Domain-tuned prompt engineering templates.

---

## C. Baseline Test Results
- **Test Command**: `npm test` (Vitest v3.2.7)
- **Suite**: `src/test/unit/currency.test.ts`
- **Result**: **5 passed, 0 failed (100% pass rate)**
- **Execution Time**: 23ms (Total process 2.15s)
- **Verifications**:
  - Minor units conversion (e.g. ₹15,000 -> 1,500,000 paise)
  - Negative value clamping
  - Indian numbering system formatting (Lakhs, Crores)
  - Budget allocation math, utilization %, and over-budget warning detection.

---

## D. Missing Features (To Be Implemented)
1. **Landing Page**: Hero with value proposition, interactive event selector (Wedding, Birthday, Community), feature showcases, accessible design.
2. **Event Creation Form**: Comprehensive validated input (Name, Type, Date, Location, Attendees, Budget in INR, Theme, Priorities, Special Requirements).
3. **AI Generation Engine**: Server-side route `/api/plan/generate` communicating with Gemini 2.5 Flash / 1.5 Flash, structured JSON parsing, strict fallback repair.
4. **Interactive Budget Manager**: Real-time category allocation editor, category additions/deletions, SVG budget breakdown chart, over-budget warnings, zero-latency local recalculation.
5. **Timeline Generator**: Milestone tracking, priority tagging, urgent task highlights for imminent dates, completion toggles.
6. **Vendor Checklist**: Actionable vendor service list, estimated cost trackers, booking statuses (`pending`, `researching`, `contacted`, `booked`), deadlines.
7. **Personalized Recommendations**: Contextual theme, activity, decor, and cost-saving ideas tailored to budget and attendee count.
8. **Conversational AI Assistant**: Route `/api/plan/refine` enabling natural language adjustments (e.g., "Reduce budget by ₹5,000 while keeping food quality high") with transparent diff explanations.
9. **Event Persistence & Management**: Save, list, update, and delete events with hybrid Supabase / LocalStorage fallback, plus JSON Export/Import.
10. **Event Dashboard**: Overview status, countdown timer, budget progress, completion metrics.

---

## E. Security Risks & Mitigations
| Risk | Severity | Mitigation Strategy |
| :--- | :--- | :--- |
| **Exposed AI API Keys** | Critical | AI calls strictly executed in server-side Next.js route handlers (`app/api/*`). Zero client exposure. |
| **Prompt Injection / Malformed AI Output** | High | Strict Zod validation on model output; programmatic boundary checks; fallback to structured generator on schema mismatch. |
| **Floating-Point Budget Inaccuracies** | Medium | Integer minor-unit (paise) math throughout application calculation pipeline. |
| **XSS via Event Content** | High | React automated DOM escaping; no `dangerouslySetInnerHTML`; strict CSP and security headers. |
| **Repository Size Bloat (>10MB)** | High | Strict `.gitignore` excluding `node_modules`, `.next`, `coverage`, `.env*`. No uncompressed media assets. |
| **npm Dependency Advisories** | Low/Med | Transitive devDependency advisories in PostCSS/eslint/tinypool. Production runtime dependencies isolated to React/Next/Zod. |

---

## F. Recommended Implementation Phases
- **Phase 1: Audit and Baseline** *(Complete)*
- **Phase 2: Core Application & Design System** (Tokens, Navbar, Footer, Landing Page, Navigation)
- **Phase 3: GenAI Planning Engine** (Server-side Gemini integration, fallback repair, route handlers)
- **Phase 4: Interactive Event Management UI** (Event Form, Budget Planner, Timeline, Vendor Checklist, Ideas, Dashboard)
- **Phase 5: Conversational AI Plan Refinement** (Natural language assistant modal, structured diffing)
- **Phase 6: Persistence & Storage Adapter** (Supabase schema/client + robust client fallback)
- **Phase 7: Comprehensive Testing** (Unit, Integration, Security, and Accessibility)
- **Phase 8: Production Build & Deployment Readiness** (Build verification, headers, environment docs)
- **Phase 9: Submission Preparation** (Repository size verification <10MB, demo script, disclosure, README)

---

## G. Required External Services & Credentials
1. **Google Gemini API Key (`GEMINI_API_KEY`)**:
   - Provider: Google AI Studio (`gemini-2.5-flash` or `gemini-1.5-flash`)
   - Usage: Structured plan generation and natural language plan refinement
   - Free tier available at: https://aistudio.google.com/app/apikey
2. **Supabase (Optional)**:
   - Credentials: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - SQL schema provided in repository (`supabase/schema.sql`).
   - If not configured, application automatically degrades gracefully to client-side persistence without breaking any user workflows.
