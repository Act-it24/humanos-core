# Self OS Onboarding – Product & UX Spec (v0.2)

**File:** `docs/25_self_os_onboarding_spec.md`  
**Version:** v0.2  
**Status:** Draft – supersedes v0.1 spec  
**Depends on:**  
- `docs/20_self_os_blueprint.md`  
- `docs/21_life_map_blueprint.md`  
- `docs/22_daily_os_blueprint.md`  
- `docs/23_journal_mood_blueprint.md`  
- `docs/2A_ai_agents_automation_blueprint.md`  

---

## 1. Purpose & Outcomes

The Self OS onboarding flow is the **first deep contact** between the user and HumanOS.  
Its purpose is to:

1. Build an initial **Self OS profile** – a structured, non-clinical description of:
   - Core values
   - Personality tendencies
   - Energy rhythms
   - Life context & flags
   - A short free-text self-reflection

2. Give HumanOS enough signal to **personalise**:
   - Life Map goals, domains and projects
   - Daily OS planning suggestions
   - Journal & Mood prompts and insights
   - AI Copilot tone and recommendations

3. Make the user feel:
   - Understood and respected  
   - Not “tested” or judged  
   - In control (can skip, change answers later, and add nuance in their own words)

The v0.2 flow remains **frontend-only** (no backend, no persistence), but the data model and UX must be ready for future storage and advanced use.

---

## 2. Design Principles

1. **Not an exam.**  
   Language must be warm, collaborative and non-judgmental. No “scores”, no clinical labels.

2. **Human-first, model-second.**  
   The user experience should feel like “tuning HumanOS to my life”, not filling a form for the system.

3. **Short, focused, revisitable.**  
   - Target completion time: 5–7 minutes.  
   - The user can skip onboarding, or return later and update their profile.

4. **Explain the “why”.**  
   Each step should briefly say how this information will help HumanOS support the user.

5. **Editable and evolutionary.**  
   Self OS is a living profile. The flow should make it clear that nothing is permanent.

6. **Non-clinical & safe.**  
   No diagnoses, no mental health labels, no medical advice. All traits are neutral patterns, not problems.

---

## 3. Data Model (conceptual)

This model is implemented in `web/src/features/self-os/selfOsModel.js`.  
Names here are conceptual; the actual JS structures should map cleanly to this.

### 3.1. SelfOsProfile

```ts
SelfOsProfile {
  id?: string;                 // Optional future use (backend)
  createdAt: string;           // ISO timestamp
  updatedAt: string;           // ISO timestamp

  values: ValueItem[];         // All selected values, with ranking and priority
  personality: PersonalityDimension[];  // Sliders across key traits
  energy: EnergyProfile;       // Chronotype, focus windows, social energy
  flags: LifeFlag[];           // Roles, constraints, transitions, etc.
  notes: string;               // Free-text reflection from the summary step
}

3.2. ValueItem
ValueItem {
  key: string;                 // e.g. "creativity"
  label: string;               // e.g. "Creativity"
  description?: string;        // Optional short hint

  // Rank only for the top 3–5 values the user marks as "core".
  rank?: number | null;        // 1 = most important, then 2, 3, 4, 5

  priorityBand: "core" | "supporting";
  // "core"  → actively ranked and used for strong decisions
  // "supporting" → selected but not in the top-ranked subset
}

3.3. PersonalityDimension
PersonalityDimension {
  key: string;                 // e.g. "introversion_extraversion"
  labelLeft: string;           // e.g. "Introversion"
  labelRight: string;          // e.g. "Extraversion"

  score: number;               // 0–100 inclusive
  // 0   → 100% left, 0% right
  // 50  → 50% left, 50% right
  // 100 → 0% left, 100% right

  percentLeft: number;         // Derived: 100 - score
  percentRight: number;        // Derived: score

  description?: string;        // Short explanatory text for the dimension
}

3.4. EnergyProfile
EnergyProfile {
  chronotype: "morning" | "afternoon" | "evening" | "mixed";

  focusWindows: FocusWindow[]; // Optional; at most 3 windows for now

  socialEnergy: {
    score: number;             // 0–100: 0 = recharges alone, 100 = recharges with people
    labelLeft: string;         // "Recharge alone"
    labelRight: string;        // "Recharge with people"
  };
}

FocusWindow {
  label: string;               // e.g. "Morning deep work"
  startTime: string;           // e.g. "09:00"
  endTime: string;             // e.g. "11:00"
}

3.5. LifeFlag
LifeFlag {
  key: string;                 // e.g. "parent_of_toddler"
  label: string;               // e.g. "Parent of a young child"
  type: "role" | "constraint" | "transition" | "other";

  description?: string;        // Optional hint for UX
  isActive: boolean;           // Always true for now; allows future archiving
}

4. Flow Overview (v0.2)

The onboarding is a multi-step wizard inside SelfOSPage.
Recommended sequence:

Welcome & framing

Values – Selection

Values – Ranking (Top 3–5)

Personality sliders

Energy rhythms

Life context & flags

Summary & confirmation (with free-text notes)

Navigation:

Next / Back buttons at the bottom of each step.

A progress indicator (e.g. “Step 2 of 7”) is recommended but optional for v0.2.

A persistent Skip for now action is allowed from the first screen (and possibly from header).

The wizard should reuse existing shared components (Card, Section, Button, etc.) and match the visual style already used in v0.1.

5. Screen-by-screen Spec
5.0. Welcome & Framing

Purpose:
Explain what Self OS is, set expectations, and lower anxiety. This is where the user understands that:

There are no right or wrong answers.

They can always change their profile later.

The goal is to help HumanOS give better, kinder recommendations.

Content & copy (example):

Title: Let’s tune HumanOS to your inner world

Body text (example):

“Self OS is your inner profile in HumanOS – your values, personality patterns, energy rhythms, and life context.
This is not a test and there are no right answers. You can always edit this later.
We’ll use it to make your goals, plans, and reflections more aligned with who you really are.”

Actions:

Primary button: Start Self OS Setup

Secondary text button: Skip for now

Skipping returns to Self OS page with an empty state card.

How this data is used:
No data collected here; just framing.

5.1. Values – Selection

Purpose:
Capture the main values that feel important today, without forcing precise ranking yet.

Design:

Show a grid of 12–14 value chips, each as a button-like card. Suggested values:

Creativity

Growth & Learning

Love & Connection

Health & Vitality

Security & Stability

Freedom & Autonomy

Mastery & Excellence

Contribution & Impact

Play & Joy

Spirituality & Meaning

Recognition & Status

Adventure & Exploration

Allow the user to select up to 7 values.

Show a small helper text:

“Pick up to 7 values that feel important to you right now.”

If the user tries to select more than 7, show a friendly message like:

“Try to keep it focused. Choose up to 7 for now – you can always refine this later.”

Mapping to model:

Each selected value becomes a ValueItem with:

priorityBand = "supporting" (by default at this step)

rank = null (ranking done in next step)

How it’s used later:

Life Map OS:

All major goals and projects can be linked to one or more of these values.

Journal & Mood:

Future insights can detect days that align or conflict with these values.

5.2. Values – Ranking (Top 3–5)

Purpose:
From the selected values, identify the few that are most central right now. These will be used for stronger guidance.

Design:

Show only the values already selected in Step 5.1.

Ask the user to mark 3–5 of them as “core” values, then rank them.

Suggested UX:

Section 1: “Choose your core values (3–5)”

Each selected value has a toggle (e.g. checkbox / “Mark as core” button).

Only allow 3–5 cores; enforce with gentle messages if user tries more.

Section 2: “Rank your core values”

For each core value, show a dropdown or numeric input: 1, 2, 3, 4, 5

Require all chosen core values to have a unique rank (no duplicates).

Mapping to model:

For each selected value:

If “core” → priorityBand = "core" and rank = 1–5.

If not core → priorityBand = "supporting" and rank = null.

How it’s used later:

Life Map:

When the user creates/assesses goals, the AI can ask:

“This goal strongly serves Security & Stability but not Creativity (your #1 value). Are you okay with that trade-off?”

Daily OS:

When suggesting micro-actions or habits, use top values as themes.

5.3. Personality Style – Sliders

Purpose:
Capture a small set of practical traits as continuous tendencies rather than fixed labels.
This will adjust tone, planning style and suggestions across the app.

Design:

Replace the v0.1 Low/Medium/High buttons with horizontal sliders.

Each dimension:

Shows a title and short description.

Has a slider from 0 → 100.

Shows a live label such as:
Introversion 30% – Extraversion 70%.

Recommended dimensions (4–5):

Introversion ↔ Extraversion

Description: “How you recharge and where you get energy.”

Planner ↔ Spontaneous

Description: “Your preference for structure vs flexibility.”

Detail-focused ↔ Big-picture

Description: “How you prefer to approach tasks and plans.”

Cautious ↔ Risk-taking

Description: “How you approach new opportunities and uncertainty.”

(Optional) Emotion-driven ↔ Logic-driven

Description: “What tends to guide your decisions in everyday life.”

Slider behaviour:

Default position: 50 (balanced).

As the user moves the slider:

percentLeft = 100 - score

percentRight = score

UI should render something like:
Planner 70% – Spontaneous 30%.

Mapping to model:

Each dimension is stored as a PersonalityDimension:

{
  key: "introversion_extraversion",
  labelLeft: "Introversion",
  labelRight: "Extraversion",
  score: 70,
  percentLeft: 30,
  percentRight: 70,
  description: "How you recharge and where you get energy."
}

How it’s used later:

Daily OS:

Planner-heavy users might get more structure in their schedules.

Spontaneous-heavy users might get looser blocks and more open time.

Journal & Mood:

Prompts can be framed differently (more emotional vs more analytical).

AI Copilot:

Tone can adapt slightly (e.g., more exploratory vs more structured advice).

5.4. Energy Rhythms

Purpose:
Understand when the user has natural energy peaks and how their social energy works, so Daily OS can schedule things intelligently.

Design:

Sections:

Chronotype selection

Options: Morning, Afternoon, Evening, Mixed / It depends.

Copy example:

“When do you usually feel your clearest and most focused?”

Focus windows (optional but recommended)

Let the user optionally add up to 3 “focus blocks”:

Simple dropdowns for start / end time, plus a short label.

Example copy:

“If you know them, add 1–3 time windows where you usually work best.”

Social energy slider

Slider from 0–100 with labels:

Left: “Recharge alone”

Right: “Recharge with people”

Live text: Recharge alone 80% – With people 20%

Mapping to model:

chronotype as one of the defined strings.

focusWindows as an array of FocusWindow.

socialEnergy.score as slider value with labelLeft/labelRight fixed.

How it’s used later:

Daily OS:

Deep work blocks suggested in focus windows.

Social/meeting-heavy blocks placed outside low energy times where possible.

Automations:

Future rules engine can use this to schedule reminders, reflections, etc.

5.5. Life Context & Flags

Purpose:
Capture key roles, constraints and transitions to adjust expectations and recommendations.
This is where HumanOS learns if the user is a parent, caregiver, student, etc.

Design:

Group flags into visually separated sections with checkboxes:

Roles

Examples:

Parent / caregiver to children

Caring for an elderly relative

Student

Employee

Freelancer / self-employed

Business owner

Constraints

Examples:

Managing a chronic health condition

Financial pressure / debt

Unstable work schedule

Limited privacy / shared living space

Transitions

Examples:

Recently changed jobs or careers

Moving city or country

Recently started or ended a major relationship

Preparing for a big exam / project / launch

Other

A few optional toggles for miscellaneous flags.

A free “Custom flag” text field is optional for later versions, but not required for v0.2.

Mapping to model:

Each selected checkbox becomes a LifeFlag:

{
  key: "parent_of_toddler",
  label: "Parent of a young child",
  type: "role",
  isActive: true
}

How it’s used later:

Daily OS:

Fewer tasks and more recovery time for users with heavy constraints.

Life Map:

Goals can be scoped realistically (e.g., “gentle growth during caregiving period”).

AI Copilot:

More empathic framing (“Given that you’re caring for a parent, it makes sense that progress is slower right now.”)

5.6. Summary & Confirmation

Purpose:
Let the user see themselves in the profile, make corrections, and add narrative in their own words.

Design:

Single page summarising all collected data, with clear structure:

Core values

Show ordered list (1–3/5) with short labels.

Supporting values

List the other selected values without rank.

Personality overview

For each dimension, show something like:
Introversion 30% – Extraversion 70%

Energy rhythms

Chronotype with a simple sentence:

“You usually feel clearest in the morning.”

Focus windows (if provided).

Social energy sentence:

“You recharge more alone than with people.”

Life context & flags

Grouped by Roles / Constraints / Transitions.

Free-text reflection

Prompt example:

“Is there anything you’d like HumanOS to keep in mind about you right now?
(Optional, but very helpful – you can write in your own words.)”

Store this as notes in SelfOsProfile.

Actions:

Primary button: Save Self OS Profile

Secondary button: Back to previous step

Optional link/button on each section: e.g. Edit values, Edit personality, etc.
(For v0.2, it is acceptable to rely on the Back button only.)

Mapping to model:

Build a SelfOsProfile object using the collected data.

Set createdAt if this is the first profile, otherwise keep existing createdAt.

Always update updatedAt when user saves.

Current v0.2 limitation (frontend-only):

For now the profile lives in React state only and is lost on refresh.

The spec is written for future persistence; implementation can simply keep it in component state for v0.2.

6. Behaviour & Integration Notes

Entry condition:

In SelfOSPage, if no profile exists → show onboarding CTA (“Start Self OS Setup”).

If a profile exists → show profile summary with a Review / Update Self OS button that re-opens the wizard pre-filled.

Editing behaviour:

When reopening the wizard, pre-populate all steps from SelfOsProfile.

On save, overwite the profile in memory and update updatedAt.

Error handling & validation:

Values:

Max 7 selections.

Core values must be between 3 and 5.

Core ranks must be unique.

Personality:

Ensure a valid 0–100 number per dimension.

Energy:

Chronotype is required; focus windows and social energy can have defaults if user skips.

Flags:

No strict validation; all optional.

Language & tone:

Always emphasise:

“You can change this later.”

“There are no right or wrong answers.”

“This is here to support you, not judge you.”

7. Future Extensions (Beyond v0.2)

These are explicitly out of scope for this implementation but should be kept in mind:

Persisting SelfOsProfile to a backend (user account system).

Versioning historical profiles (e.g. “Self OS v1.0, v1.1” over major life transitions).

360-style feedback from trusted friends/partners (opt-in only).

Deeper psychometric modules as optional add-ons, never as default.

8. Implementation Checklist for Developers / Agents

 Ensure selfOsModel.js matches the v0.2 data model (including sliders, bands, flags).

 Update SelfOSWizard.jsx to:

 Use sliders for personality dimensions with percentage labels.

 Allow selecting up to 7 values, and ranking 3–5 core values.

 Implement energy section with chronotype, focus windows, and social energy slider.

 Implement grouped flags for roles, constraints, transitions.

 Show a clear, readable summary and free-text reflection.

 Ensure SelfOSPage.jsx:

 Shows empty state + CTA when no profile exists.

 Shows profile summary when a profile exists.

 Allows reopening the wizard with existing data.

 Keep the overall UI consistent with the rest of HumanOS (dark background, card layout, typography).