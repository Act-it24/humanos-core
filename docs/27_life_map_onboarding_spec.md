# Life Map OS – Onboarding & First Map Spec (v0.1)

**Title:** Life Map OS – Onboarding Flow & First Map Specification  
**File:** `27_life_map_onboarding_spec.md`  
**Version:** v0.1  
**Status:** Draft (Implementation-ready for UI skeleton)  
**Depends on:**  
- `20_self_os_blueprint.md`  
- `21_life_map_blueprint.md`  
- `25_self_os_onboarding_spec.md`  
- `26_self_os_usage_map.md`  
- `30_kernel_ui_mapping.md`  

---

## 1. Purpose

This document defines the **v0.1 Life Map Onboarding experience**:  
how HumanOS helps a user create their **first Life Map** (domains, goals, projects) in a way that:

- Is **lightweight** and non-intimidating.  
- Is deeply **connected to Self OS** (values, energy, flags).  
- Produces a clear, structured data model that future features (Daily OS, Journal & Mood, Agents) can rely on.

This spec is primarily for the **frontend React wizard** in `LifeMapPage.jsx` and related helpers.  
No backend integration is required in this version.

---

## 2. Scope & Non-goals

### In scope (v0.1)

- A guided, multi-step **Life Map Wizard** that runs inside the `Life Map` tab.
- Creation of a **minimal but useful map**:
  - 3–7 Life Domains.
  - 1–3 Goals for 1–3 priority domains.
  - Optional first Projects / Next Steps.
- Light integration with `SelfOsProfile`:
  - Suggesting domains from Core/Supporting values.
  - Using life flags as hints (e.g. Parent → Family domain).
- A simple **read-only summary view** after onboarding.

### Out of scope (future versions)

- Persistent storage (database, sync between devices).
- Calendar-level planning.
- Advanced goal hierarchies (OKRs, SMART templates, etc.).
- Collaboration or shared maps.
- AI-generated goals/projects beyond light suggestions.

---

## 3. Key concepts & data model (v0.1)

This spec defines a **frontend-only** conceptual model.  
Later, it can be mirrored as backend types.

### 3.1 Types

#### LifeDomain

Represents a big area of life.

```ts
type LifeDomainId = string;

type LifeDomain = {
  id: LifeDomainId;
  name: string;              // e.g. "Health & Energy"
  description?: string;      // user text, optional
  // 1–10 quick self-rating of how this area feels now
  currentScore?: number;     
  // one-sentence intention or direction
  intention?: string;        
  // link to Self OS values for this domain
  linkedValues?: string[];   // value keys or names
  // derived flag: is this domain a current focus?
  priority?: "low" | "medium" | "high";
};

LifeGoal
type LifeGoalId = string;

type LifeGoal = {
  id: LifeGoalId;
  domainId: LifeDomainId;
  title: string;              // e.g. "Build a sustainable creative career"
  description?: string;
  horizon?: "3_months" | "6_months" | "1_year" | "long_term";
  // link to Self OS values that this goal expresses
  linkedValues?: string[];
  // very lightweight status
  status?: "idea" | "active" | "paused" | "completed";
};

LifeProject
type LifeProjectId = string;

type LifeProject = {
  id: LifeProjectId;
  goalId: LifeGoalId;
  title: string;             // e.g. "Publish a 5-piece portfolio"
  description?: string;
  // optional: first 1–5 concrete steps as plain strings
  firstSteps?: string[];
  status?: "idea" | "active" | "paused" | "completed";
};

LifeMap
type LifeMap = {
  domains: LifeDomain[];
  goals: LifeGoal[];
  projects: LifeProject[];
  createdAt: string;
  updatedAt?: string;
};

Note: For v0.1, all data can live in React state only (no API).
The structure should be easy to plug into a backend later.

4. User journeys
4.1 First-time user (no Life Map yet)

User opens the Life Map tab.

Sees a friendly empty state card:

Explanation of what Life Map is.

CTA button: “Create My First Life Map”.

Clicking the CTA opens the Life Map Wizard (inline, similar style to Self OS Wizard).

After completing the wizard, user sees:

A summary of their domains and key goals.

A button to “Continue refining later” (future iterations).

4.2 Returning user (map already exists)

User opens Life Map tab.

Sees:

A summary view of existing domains & goals.

A button: “Review / Update Life Map” that reopens the wizard:

Pre-filled with current domains/goals.

Allows adding/removing/editing items.

5. Wizard structure (v0.1)

The wizard should be short and focused:
5 main steps + intro + summary = 7 screens max.

Each screen uses the shared UI components (Card, Button, Section, etc.) introduced in the v0.1 skeleton.

Step 0 – Intro: “What is your Life Map?”

Goal: frame the process in a calm, non-judgmental way.

Content ideas:

Short paragraph:

“Your Life Map is a high-level view of your domains, goals, and projects. It connects what you do with what matters to you.”

Explain that:

There are no right or wrong answers.

The map can be changed later.

Actions:

Primary: “Start Life Map Setup”

Secondary (ghost): “Skip for now” → close wizard, keep empty state.

If a map already exists, intro text changes to:

“Let’s review and gently update your Life Map.”

Step 1 – Suggest & choose Life Domains

Goal: get 3–7 domains that cover the user’s life, guided by Self OS.

Inputs from Self OS:

Core & Supporting Values (e.g. Creativity, Family, Health, Autonomy).

Life Flags (roles like Parent, Student, Freelancer).

Behaviour:

The screen shows:

A list of suggested domains as chips/cards, for example:

Health & Energy (from Health/Self-care values)

Creative Work (from Creativity/Growth)

Relationships & Family (from Love/Connection + Parent flag)

Career & Money (from Security/Autonomy + Freelancer flag)

An ability to:

Select/deselect suggested domains.

Add custom domains via an input field.

Constraint:

Minimum 3 domains, maximum 7.

Show a small note when limit is reached.

UI:

Multi-select buttons / chips for suggested domains.

Text input + “Add” button for custom domain.

Domain names should be editable (inline or via pencil icon).

Step 2 – Quick domain health check

Goal: get a simple snapshot of how each domain feels right now.

Behaviour:

For each chosen domain:

Show a row with:

Domain name.

A 1–10 rating slider or segmented control labelled:

Struggling → OK → Great.

Optional short text input:

“One sentence about how this area feels right now.”

Result is stored as:

currentScore (1–10).

Optional description.

Usage later:

Can be used by AI & Journal & Mood to:

Track improvements.

Suggest reflections on low-scoring domains.

Step 3 – Choose focus domains & intentions

Goal: intentionally select 1–3 domains to focus on in the next 3–6 months.

Behaviour:

Show all selected domains with:

Their currentScore from previous step.

For each domain:

Allow user to mark priority:

High focus, Medium, or Low / background.

Add optional Intention sentence, e.g.:

“Rebuild my energy after burnout.”

“Stabilise my finances.”

Constraints:

Encourage 1–3 High focus domains.

Show helper text:

“It’s OK to care about many things, but focusing on 1–3 areas at a time is more realistic.”

Result:

Domain fields:

priority

intention

Step 4 – Define key goals for focus domains

Goal: for each High focus domain, define 1–3 goals.

Behaviour:

For each High-priority domain:

Show a mini-section with:

Domain name + intention.

1–3 Goal cards with:

Title input.

Optional description.

Optional horizon select:

3 months / 6 months / 1 year / long-term.

Optional linked values:

Multi-select from Core & Supporting values (from Self OS).

Provide templates / hints in placeholder text, e.g.:

“In the next 6 months, I want to…”

Constraints:

Per domain:

Minimum 1 goal, maximum 3.

Overall:

Keep total number of goals manageable (e.g. up to 7–9).

Step 5 – Optional first projects & next steps

Goal: turn vague goals into something actionable without overwhelming the user.

Behaviour:

For each Goal defined in Step 4:

Ask optionally:

“Do you want to define a first project for this goal?”

If yes, show:

Project title input.

Optional description.

A small list of 1–5 “first steps” as text fields, e.g.:

“List 5 possible project ideas.”

“Book a checkup with a doctor.”

“Draft a budget for the next 3 months.”

All of this step is optional.

User can skip entirely or fill only some items.

Step 6 – Summary & confirmation

Goal: show the user the map they just created and let them confirm.

Summary content:

A structured read-only view:

Domains Overview

For each domain:

Name, currentScore, priority badge (High/Medium/Low).

Intention sentence (if filled).

Goals per Domain

Nested list:

Domain → Goals (title, horizon, linked values).

Projects & Steps (if any)

Under each goal, show project title and first steps.

Link to Self OS

Optional sentence explaining:

“These goals are mostly aligned with [Core Values].”

Actions:

Primary: “Save Life Map”

Builds a LifeMap object in memory.

Secondary: “Back & Edit”

Tertiary (subtle): “Discard and cancel” (advanced / rarely used).

6. Integration with Self OS (v0.1 level)

This section defines how the wizard reads from Self OS, without requiring any backend.

6.1 Inputs

From SelfOsProfile (see selfOsModel.js):

values.core: ordered list of Core values.

values.supporting: additional Supporting values.

personality: not directly used in this v0.1 wizard.

energy: may be used later for scheduling suggestions (not in v0.1).

flags: used to suggest domains.

6.2 Domain suggestions

Suggested domain types:

Health & Energy

Creative Work

Career & Money

Relationships & Family

Learning & Growth

Home & Environment

Spirituality & Meaning

Fun & Play / Hobbies

Mapping heuristics (example):

If values contain Health, Vitality, Self-care → suggest Health & Energy.

If values contain Creativity, Expression, Art → suggest Creative Work.

If values contain Security, Stability → suggest Career & Money.

If values contain Love & Connection, Family OR flags include Parent → suggest Relationships & Family.

If values contain Growth, Mastery, Learning → suggest Learning & Growth.

The implementation can keep these mappings as a small config object in a helper file.
They are suggestions only; the user can edit everything.

7. LifeMapPage behavior (post-onboarding)

This section guides how LifeMapPage.jsx should look after the wizard exists.
It does not force implementation in this version but establishes the direction.

7.1 Empty state

If no lifeMap exists in state:

Show:

Short explanation of Life Map (1–2 paragraphs).

Button: “Create My First Life Map” → opens wizard.

Link or note:

“We’ll use your Self OS profile to suggest domains and goals. You can change anything.”

7.2 Map summary view

If lifeMap exists:

Show:

Page title: “Life Map OS (Domains, Goals & Projects)”.

Intro sentence.

Content:

Domains grid/list:

Name, currentScore, focus badge, intention snippet.

Under each domain:

Goals as a list with horizon + linked values badges.

Optional section:

“Active Focus Domains” – highlight High-priority ones.

Provide action buttons:

Primary: “Review / Update Life Map” → opens wizard with pre-filled data.

Secondary: “(Future) Send to Daily OS” – placeholder copy explaining that later we will sync goals into planning.

8. UI & UX notes

Tone: calm, supportive, non-judgmental.

Avoid productivity-guilt language like “You should be doing more”.

Make it clear that:

The map is editable.

It is better to start small than to fill everything perfectly.

Keyboard accessibility:

User should be able to navigate the wizard using Tab / Enter / Space.

Mobile:

Layout should degrade gracefully to a vertical stack.

9. Future extensions (v0.2+)

Not required now, but we expect:

Syncing Life Map with Daily OS:

Creating a weekly focus plan automatically based on domains/goals.

Deeper integration with Journal & Mood:

Reflecting over progress on specific domains.

Versioning of Life Map:

Storing snapshots every few months for long-term reflection.

Collaborative features:

Sharing a subset of the map with a partner, coach, or therapist (only with explicit consent).

For now, this spec should be enough to implement a first Life Map wizard and a simple summary view that fits the existing HumanOS v0.1 kernel frontend.