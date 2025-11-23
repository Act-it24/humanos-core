# Daily OS Planning – v0.1 Product & UX Spec
**File:** `docs/24_daily_os_planning_spec.md`  
**Version:** v0.1  
**Status:** Draft – Baseline for Daily OS MVP  
**Depends on:**  
- `22_daily_os_blueprint.md`  
- `20_self_os_blueprint.md`  
- `21_life_map_blueprint.md`  
- `25_self_os_onboarding_spec.md`  
- `27_life_map_onboarding_spec.md`  

---

## 1. Purpose & Role in HumanOS

**Daily OS** is where the user’s *Life Map* and *Self OS* meet the reality of today and this week.

For v0.1, the goal is **not** to be a full calendar app. The goal is to provide a lightweight, structured **planning surface** that:

- Keeps the user connected to:
  - Their **focus domains** and **active goals** (from Life Map).
  - Their **energy rhythms** and **focus windows** (from Self OS).
- Helps them answer, every morning:
  > “Given who I am and what matters now, what should today actually look like?”

Daily OS v0.1 is **frontend-only** and works with in-memory state. Future versions will add persistence and real calendar integrations.

---

## 2. Out of Scope (v0.1)

Intentionally **not** part of this spec:

- Real calendar sync (Google/Outlook/etc.).
- Multi-device sync, notifications, or reminders.
- Complex task management (subtasks, tags, filters, Kanban, etc.).
- AI auto-scheduling that writes to the user’s real calendar.

We design the UX and data model so that these can be added later, but we *do not implement them* in this phase.

---

## 3. Core Concepts

### 3.1 Daily Plan

A **DailyPlan** represents how a single day is structured:

- What the user wants to **focus on**.
- Which **blocks** of time are reserved for deep work, admin, rest, etc.
- Which **goals / projects** are being moved forward.
- Optional **notes** or reflections.

We treat each date as having at most **one DailyPlan**.

### 3.2 Weekly Plan

A **WeeklyPlan** is a light wrapper around multiple DailyPlans within a 7-day window (e.g., Monday–Sunday), with a short summary of:

- This week’s **focus domains**.
- Key **goals** targeted this week.
- A simple indicator of coverage (e.g., how many days planned).

v0.1 focuses UI on **Today** and **This Week** as two views on the same underlying data.

### 3.3 Focus Blocks

A **FocusBlock** is a time block in the day. It doesn’t need exact minutes for v0.1; “Morning / Afternoon / Evening” or similar segments are enough.

Examples:

- “Deep Work – Creative Writing”
- “Admin & Emails”
- “Exercise & Recovery”
- “Social / Family Time”

---

## 4. Data Model (Conceptual)

This is a **conceptual** model; the actual implementation in `web/` will be plain JavaScript objects and arrays, similar to `selfOsModel.js` and `lifeMapModel.js`.

### 4.1 DailyPlan

```ts
type DailyPlan = {
  id: string;
  date: string; // ISO date, e.g. "2025-01-10"

  focusTitle?: string; // e.g. "Deep work + health + 1 admin block"
  energyNote?: string; // e.g. "Low energy, protect morning focus"

  focusBlocks: FocusBlock[];
  tasks: DailyTask[];

  createdAt: string;
  updatedAt?: string;
};

4.2 FocusBlock
type FocusBlock = {
  id: string;
  label: string;        // e.g. "Morning Deep Work", "Evening Recovery"
  segment: "morning" | "afternoon" | "evening" | "flex"; // v0.1 segments

  domainId?: string;    // from Life Map
  goalId?: string;      // optional link to LifeGoal
  projectId?: string;   // optional link to LifeProject

  intensity?: "light" | "medium" | "deep";
  locationType?: "home" | "office" | "outside" | "mixed";

  note?: string;
};

4.3 DailyTask
type DailyTask = {
  id: string;
  title: string;

  source?:
    | "manual"
    | "life_goal"
    | "life_project"
    | "maintenance";       // chores, errands, admin

  domainId?: string;        // optional LifeDomain link
  goalId?: string;
  projectId?: string;

  status: "todo" | "in_progress" | "done" | "skipped";
  timeHint?: "focus_block" | "between" | "anytime";
};

4.4 WeeklyPlan
type WeeklyPlan = {
  id: string;
  weekStartDate: string;  // ISO date of Monday (or chosen start)
  dailyPlans: DailyPlan[];
  focusDomains: string[]; // list of LifeDomain IDs
  summaryNote?: string;

  createdAt: string;
  updatedAt?: string;
};

Implementation in v0.1 can keep WeeklyPlan very simple or even implicit (computed from existing DailyPlans), but we define it here as a target structure.

5. Inputs from Self OS & Life Map

Daily OS should read, not rewrite, data from:

5.1 Self OS

From SelfOsProfile:

Chronotype and focus windows:

Suggest when to place deep work vs. light tasks.

Social energy:

Encourage grouping social / meeting blocks when energy is higher.

Optional flags (e.g., “recovering from burnout”) should be used to:

Nudge towards more recovery blocks and realistic planning.

5.2 Life Map

From LifeMap:

Focus domains (High-priority) → become candidates for:

Today’s focus tagline.

Blocks and tasks.

Active goals in focus domains:

Used to propose 1–3 “move this goal forward today” slots.

Projects:

Optional: show as context when adding tasks.

v0.1 does not need heavy automation; hints and suggestions in copy/empty states are enough.

6. UX Flows
6.1 First-Time Daily OS Setup

When the user opens the Daily OS tab for the first time:

Show a calm intro card:

“Daily OS: Today & This Week”

Short text explaining that this is where you connect your Self OS & Life Map to your real day.

Primary CTA:

“Plan Today” → opens a simple Daily Planning Wizard v0.1.

Secondary:

“Skip for now” → keeps a minimal explanation and a “Plan my day” button.

The v0.1 wizard can be a small inline flow (2–3 steps), separate from the main Daily OS redesign:

Step 1: Pick a focus tagline for today (using Life Map focus domains as suggestions).

Step 2: Choose 2–4 focus blocks (Morning/Afternoon/Evening) and rough themes.

Step 3: Choose 3–7 tasks:

From goal suggestions (if available) + manual entries.

Confirm and create the DailyPlan.

This spec doesn’t prescribe exact UI components; it defines the minimum behaviour.

6.2 Returning User – Today View

When a DailyPlan exists for today:

Show:

Today’s focus tagline, connected visually to focus domains.

List of focus blocks ordered by segment.

Tasks grouped by:

“From Goals”

“Maintenance / Admin”

Actions:

Mark task as done / skipped.

Light edit of focus blocks (change label, note).

“Replan Today” link to reopen the planning wizard with prefilled data.

6.3 This Week View

The Week view is intentionally simple in v0.1:

Shows:

A 7-day strip with:

Planned / not planned badge.

Quick readout of focus domains per day.

A short summary:

“This week, you’re focusing on: Health, Creative Work, Relationships.”

Actions:

Clicking a day jumps to that day’s Today view or planning wizard.

Optional: “Plan the rest of the week” which simply iterates the same planning flow for unplanned days.

7. UI Principles

Daily OS must feel:

Humane: not a rigid calendar, but a companion to help the user be realistic and kind with themselves.

Low pressure: no red overdue counters in v0.1; focus on “supports” instead of “penalties”.

Explainable: where suggestions come from (e.g. “Based on your Self OS focus windows…”).

Design consistency:

Use the same card style, typography, and spacing as the existing HumanOS tabs.

Mirror the tab-based layout already in App.jsx.

8. Implementation Notes (for web/)

This spec is for Phase: Daily OS MVP v0.1.

In the frontend (web/):

DailyPlan and WeeklyPlan should be implemented in a dedicated model/helper file:

Suggested: web/src/features/daily-os/dailyOsModel.js

The main page is DailyOSPage.jsx, which will:

Render “Today” and “This Week” views (tabbed or toggled).

Integrate the small planning wizard inline (similar to Self OS & Life Map).

For now, all state can live:

In component state (useState), or

In a simple context provider under web/src/features/daily-os/ (future).

Future phases will introduce:

Persistence (local storage or backend).

Real calendar sync.

Deeper AI suggestions.

9. Open Questions / TODO

How many days ahead should Daily OS help plan by default? (Today only vs. rolling 3 days vs. full week.)

Should the user be able to “duplicate yesterday’s plan” as a starting point?

What is the simplest way to represent time segments that still respects Self OS focus windows?

For now, v0.1 assumes:

We focus on Today + simple This Week view.

We treat Morning / Afternoon / Evening / Flex as enough time granularity.