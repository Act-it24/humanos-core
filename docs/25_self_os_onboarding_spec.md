# Self OS – Onboarding & Profile MVP Spec  
**File:** `docs/25_self_os_onboarding_spec.md`  
**Version:** v0.1  
**Status:** Draft  
**Depends on:**  
- `docs/20_self_os_blueprint.md`  
- `docs/10_product_blueprint_overview.md`  
- `docs/40_architecture_overview.md`  

---

## 1. Purpose

This document defines the **first real feature** of HumanOS:  
the **Self OS Onboarding & Profile MVP**.

The goal:

- Give new users a **simple but meaningful first experience**.
- Build an initial **Self OS profile**:
  - Core values
  - Personality style (simplified)
  - Energy rhythms
  - Life context & flags
- Provide a **readable summary** that can be used later by:
  - Life Map OS
  - Daily OS
  - Journal & Mood OS
  - AI Co-pilot & automations

This is **not** a clinical tool and **must not** generate diagnoses. It is a reflective, user-owned profile.

---

## 2. Target scope (MVP only)

### In scope (MVP)

- A lightweight, multi-step onboarding flow:
  - 5–6 screens, each very simple.
- Local state in the frontend only (no backend required yet).
- An initial **Self OS Profile object** stored in memory:
  - Eventually will be persisted, but not in this MVP.
- A **“My Self OS”** view inside `SelfOSPage` that:
  - Shows the current profile (if exists).
  - Shows empty states and a CTA if no profile is created.

### Out of scope (for this MVP)

- No account system / auth.
- No real database.
- No advanced psychometrics.
- No AI agents calling APIs directly.
- No edit history or versioning.

---

## 3. Data model (conceptual)

This is a conceptual model for the **Self OS Profile**.
Implementation can be plain JS objects for now.

```ts
type SelfOsValue = {
  id: string;              // "creativity", "security", "family"
  label: string;           // "Creativity", "Security"
  description?: string;    // user-written description
  rank: number;            // 1–5 (1 = most important)
};

type SelfOsTrait = {
  id: string;              // "introversion_extraversion", "openness"
  label: string;           // "Introversion vs Extraversion"
  dimension: "personality";
  value: "low" | "medium" | "high"; // simplified
  notes?: string;          // optional user notes
};

type SelfOsEnergyRhythm = {
  id: string;              // "chronotype", "social_energy"
  label: string;           // "Chronotype", "Social Energy"
  value: string;           // e.g. "morning", "evening", "balanced", "recharge_alone"
  notes?: string;
};

type SelfOsFlag = {
  id: string;              // "parent", "caregiver", "burnout_recovery"
  text: string;            // user-facing text
  type: "support" | "risk" | "identity";
  active: boolean;
};

type SelfOsProfile = {
  createdAt: string;       // ISO date
  updatedAt: string;       // ISO date
  values: SelfOsValue[];
  traits: SelfOsTrait[];
  energy: SelfOsEnergyRhythm[];
  flags: SelfOsFlag[];
  notes?: string;          // free text summary (optional)
};

For the MVP, we will use a very small subset of predefined options.

4. Onboarding flow (screens)

The onboarding is a wizard inside Self OS.
It should be accessible from SelfOSPage as:

If no profile: show “Start Self OS Setup”.

If profile exists: show “Review / Update Self OS” and a summary.

Screen 0 – Intro

Title: “Let’s set up your Self OS”

Text: short explanation:

HumanOS uses your Self OS profile to personalize goals, plans and reflections.

You stay in control; you can edit this later.

Primary button: “Start”

Secondary: “Skip for now” (closes the wizard)

Screen 1 – Core Values (quick selection)

Simple question: “Which of these feel most important to you right now?”

Show a small list (6–8) of predefined values, e.g.:

Growth, Creativity, Security, Health, Love & Connection, Freedom, Mastery.

User can pick up to 5.

Next step: ask to rank them (drag or simple dropdown ranks 1–5).

Result:

Fill SelfOsProfile.values with selected values + ranks.

Screen 2 – Personality style (simple sliders)

Question: “Which side feels closer to you in daily life?”

Two or three mini dimensions, for example:

Introversion ↔ Extraversion

Planner ↔ Spontaneous

Detail-focused ↔ Big-picture

For MVP: use a 3-point choice (Low / Medium / High) rather than a full slider.

Result:

Fill SelfOsProfile.traits with:

id, label, value: "low" | "medium" | "high".

Screen 3 – Energy rhythms

Two questions:

“When do you usually feel most clear and focused?”

Options: Morning / Afternoon / Evening / It changes a lot.

“How do you usually recharge your energy?”

Options: Mostly alone / Mostly with people / A mix of both.

Result:

Fill SelfOsProfile.energy with 2 entries:

chronotype

social_energy

Screen 4 – Life context & flags

Simple multi-select checkboxes, grouped:

Support / identity:

“I’m a parent / caregiver”

“I’m a student”

“I’m working full-time”

“I’m between jobs”

Risk / stress:

“I’m recovering from burnout”

“I’m under high pressure right now”

“I’m caring for someone with health issues”

User can select any that apply.

Result:

Fill SelfOsProfile.flags accordingly.

Screen 5 – Summary & confirmation

Show a read-only summary of what the user chose:

Values with ranks.

Traits (with simple language).

Energy rhythms.

Flags.

Allow optional free-text note:

“Anything else you want to remember about where you are in life right now?”

Buttons:

“Save Self OS Profile”

“Back” (to edit previous steps)

Result:

Create a SelfOsProfile object in memory.

Show the “My Self OS” view instead of empty state on SelfOSPage.

5. UI & integration in SelfOSPage
Empty state (no profile yet)

In SelfOSPage:

If there is no profile:

Show a clear message:

“You haven’t set up your Self OS yet.”

One sentence about why it matters.

Primary button: “Start Self OS Setup”

This opens the onboarding wizard (e.g. modal or full-page section).

After onboarding (profile exists)

Still in SelfOSPage, show:

A “Profile Overview” card:

Top 3–5 values with short explanation.

Key traits in plain language.

Energy rhythm summary.

A “Context & Flags” card:

Active flags.

An “Actions” area:

Button: “Review / Update Self OS”

(Later) Links to how Self OS influences Life Map & Daily OS.

For MVP, the profile can live in useState or simple React context. No persistence is required yet.

6. Technical notes (for future implementation)

This spec is frontend-only for now.

A later version (v0.2+) will:

Add an API model mirroring SelfOsProfile.

Persist the profile per user.

Allow multiple profiles over time (versioning).

7. Open questions (to be addressed later)

Do we want to allow multiple “modes” (Work Self, Home Self) in the future?

How often should we prompt the user to revisit their Self OS (e.g., every 3–6 months)?

How to visually explain the connection between Self OS and:

Life Map domain priorities.

Daily OS scheduling suggestions.

Mood and journal patterns.

For now, the priority is to build a gentle, honest, non-clinical Self OS onboarding that feels helpful, not heavy.