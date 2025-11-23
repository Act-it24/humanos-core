# Life Map OS – Goals, Domains & Projects – Feature Blueprint  
**File:** `docs/21_life_map_blueprint.md`  
**Version:** v1.0 (Founding Draft)  
**Depends on:**  
- `docs/00_humanos_vision_and_principles.md`  
- `docs/10_product_blueprint_overview.md`  
- `docs/20_self_os_blueprint.md`  

---

## 1. Purpose & Scope

### 1.1 Purpose

The **Life Map OS** is the structural backbone of HumanOS.  
Its purpose is to turn the user’s **inner world** (Self OS) into a **coherent outer map** of:

- Life domains (Health, Work, Money, Relationships, etc.).
- Medium/long-term goals in each domain.
- Concrete projects and tasks connected to these goals.

It answers:

- “What is my life actually made of right now?”
- “What am I moving towards, and why?”
- “How does today’s task relate to my bigger picture?”

### 1.2 Scope

Life Map OS is responsible for:

- Defining and maintaining **life domains** for the Self Space (and later for other spaces).
- Representing **goals → projects → tasks** as a navigable hierarchy.
- Linking goals and projects to:
  - Values, traits, and flags from Self OS.
  - Time and commitments from Daily OS.
  - Reflections from Journal & Mood.

Life Map is not a generic task manager. It is a **meaning-centered framework** for connecting intentions, actions, and identity.

### 1.3 Relation to the Kernel

Life Map OS is a **KERNEL pillar**:

- It provides structure for:
  - Daily OS: what to do this week, today.
  - Journal & Mood: what the user is working on and why it matters.
  - AI Co-pilot: what to prioritize, postpone, or drop.
- It must be:
  - Powerful enough to represent complex lives.
  - Simple enough that users do not feel like project managers all the time.

---

## 2. User Problems & Goals

### 2.1 Typical problems

Life Map OS addresses problems such as:

- “My life is a mess of unrelated tasks. I can’t see the big picture.”
- “I have too many ideas and goals; I don’t know what to choose.”
- “I feel I’m always working, but I’m not moving towards anything meaningful.”
- “Planning tools are either too simplistic or too corporate for my life.”
- “My tasks don’t reflect my real values and needs.”

### 2.2 Desired outcomes

From the user’s perspective, Life Map succeeds when:

- They can see a **clear, honest map** of their current life domains and goals.
- They understand how **projects and tasks** support (or betray) their values.
- They can say “no” more confidently, because they see what they are saying “yes” to.
- Planning becomes about **aligning reality with the map**, not just filling checklists.
- The map is **alive**:
  - Goals adapt.
  - Projects are retired when no longer relevant.
  - The system helps them avoid overcommitment.

---

## 3. Scope In / Scope Out (v1 vs. Future)

### 3.1 Scope In (v1)

For **v1**, Life Map must:

1. **Support a simple domain model** for Self Space:
   - Default domains (suggested):
     - Health & Energy
     - Work & Career
     - Money & Finances
     - Relationships & Family
     - Learning & Growth
     - Creativity & Expression
     - Play & Joy
     - Meaning & Impact
   - User can:
     - Rename, hide, or add domains.
     - Mark which domains are **active focus** vs. **background**.

2. **Represent goals → projects → tasks hierarchy**:
   - **Goal** (6–24 month horizon, domain-level).
   - **Project** (weeks–months, concrete outcomes).
   - **Task** (hours–days, actionable steps).
   - The system must support:
     - Linking items together.
     - Marking status (planned, active, paused, completed, dropped).

3. **Link to Self OS**:
   - Each goal can be linked to:
     - One or more **Values** (from Self OS).
     - Relevant **Flags** (e.g., `recovering_burnout`, `parent_of_toddler`).
   - The UI should show:
     - “This goal supports value(s): X, Y”
     - “This goal is sensitive to flag(s): Z”

4. **Basic capacity awareness (no deep scheduling yet)**:
   - For each active goal:
     - Estimate “effort weight” (rough).
   - For each time period (e.g., upcoming month):
     - Help the user avoid having too many high-effort goals active.

5. **Essential views**:
   - **Domain overview**:
     - List of domains with key goals.
   - **Goal-centric view**:
     - One goal → its projects → key tasks.
   - **Life Map overview**:
     - High-level map of all domains/goals (even if minimal visually at v1).

### 3.2 Scope Out (Future)

Out-of-scope for v1, but important directions:

- **Scenario planning & simulations**:
  - “What if I pause this goal?”  
  - “What if I increase effort here and reduce there?”
- **Multi-space Life Map**:
  - Merging Self + Family + Team maps in controlled ways.
- **Advanced capacity modelling**:
  - Integrating health data, energy trends, and actual time logs.
- **Dependencies across goals**:
  - E.g., “Build emergency fund” as a prerequisite for risky career moves.
- **Long-term historical analytics**:
  - “What kinds of goals do you consistently complete vs. abandon?”

---

## 4. Core Concepts & Data Model (Conceptual)

Life Map is a central part of the **Life Graph**.  
This section defines conceptual entities and relationships (not final schema).

### 4.1 Entities

- **`Domain`**
  - Represents a major area of life.
  - Fields (conceptual):
    - `id`
    - `name` (e.g., `Health & Energy`)
    - `description` (optional)
    - `status` (`active_focus`, `background`, `paused`)
    - `order` (for UI ordering)

- **`Goal`**
  - Represents a meaningful, somewhat long-term intention in a domain.
  - Fields:
    - `id`
    - `domain_id`
    - `title`
    - `description`
    - `horizon` (e.g., 3 months, 6–12 months)
    - `status` (`idea`, `planned`, `active`, `paused`, `completed`, `dropped`)
    - `effort_level` (`low`, `medium`, `high`)
    - `value_links` (references to `Value` IDs from Self OS)
    - `flag_links` (references to `Flag` IDs from Self OS)
    - `created_at`, `updated_at`

- **`Project`**
  - Represents a concrete, bounded initiative that supports one or more goals.
  - Fields:
    - `id`
    - `goal_ids` (one or multiple)
    - `title`
    - `description`
    - `status` (`idea`, `planned`, `active`, `paused`, `completed`, `dropped`)
    - `effort_estimate` (rough points or time)
    - `start_hint` / `target_finish` (not strict deadlines)
    - `tags` (optional)

- **`Task`** (conceptual, basic here; Daily OS will extend)
  - Represents a specific step that can be done in one or a few sessions.
  - Fields:
    - `id`
    - `project_id` (or direct `goal_id` if no project)
    - `title`
    - `description` (optional)
    - `status` (`todo`, `in_progress`, `done`, `dropped`)
    - `effort` (small/medium/large or time estimate)
    - `links` (e.g., to external tools/tasks)

- **`ObjectiveLink` (optional, conceptual)**
  - Used for cross-domain relationships:
    - `source_goal_id`
    - `target_goal_id`
    - `relationship_type` (e.g., `supports`, `conflicts`, `depends_on`)

### 4.2 Relationships

- `User` **has many** `Domains`.
- `Domain` **has many** `Goals`.
- `Goal` **has many** `Projects` (and may exist without projects).
- `Project` **has many** `Tasks`.
- `Goal` **links to**:
  - `Value` (Self OS) via `value_links`.
  - `Flag` (Self OS) via `flag_links`.
- `Task` can be:
  - Exposed to Daily OS as a candidate for scheduling.
  - Linked to external tools (calendar events, tasks in other apps).

The Life Map should be flexible enough to support:

- Simple lives (few domains, few goals).
- Complex lives (many domains and projects) without forcing the user to see everything at once.

---

## 5. Key User Journeys

### 5.1 Initial Life Map Setup (First Week)

**Goal:** Create a rough but usable Life Map aligned with Self OS.

1. After Self OS onboarding, user enters a **Life Map setup flow**.
2. System pre-suggests domains based on:
   - Self OS values.
   - Flags (e.g., parent, freelancer).
3. User:
   - Confirms or edits domains.
   - Marks 2–3 domains as **current focus**.
4. For each focus domain:
   - The AI co-pilot suggests 1–3 candidate goals (based on values and context).
   - User chooses, edits, or writes their own goals.
5. At the end:
   - User sees a simple “Life Map v1.0”:
     - Domains on one side, key goals highlighted.
   - System generates a **First Week Plan** using these goals + Self OS + available time.

### 5.2 Refining Goals and Projects

**Goal:** Help users move from vague goals to concrete, realistic projects.

- User opens Life Map OS (e.g., monthly or after major reflection).
- They:
  - Rephrase goals to be more concrete.
  - Mark some as paused or dropped.
  - Create 1–3 projects per active goal.
- The AI co-pilot:
  - Suggests project ideas based on goal descriptions.
  - Warns when there are too many active high-effort goals simultaneously.
  - Proposes merging or simplifying overlapping goals.

### 5.3 Day-to-day connection (via Daily OS)

**Goal:** Turn the map into daily and weekly actions without overwhelming the user.

- From Daily OS, user opens:
  - “Suggested tasks for this week” (pulled from active projects).
- They:
  - Choose a small number of tasks aligned with core goals.
  - Defer or drop tasks that do not fit current energy/capacity.
- The system:
  - Highlights which goals are currently being served and which are being neglected.
  - Avoids dumping everything on the user; always prioritizes.

### 5.4 Periodic Reviews (Monthly / Quarterly)

**Goal:** Maintain a realistic, updated Life Map.

- The system invites the user to a monthly/quarterly Life Map review.
- Components:
  - Which goals made progress?
  - Which goals/projects stalled, and why?
  - Are there goals that no longer align with Self OS (values, flags)?
- The AI co-pilot:
  - Suggests:
    - Goals to retire.
    - New goals arising from patterns in Journal & Mood.
    - Adjustments to focus domains.

---

## 6. Interactions with Other Pillars

### 6.1 Self OS

- Self OS → Life Map:
  - Values, flags, and traits help define:
    - Which domains matter most now.
    - Which goals are truly aligned vs. externally imposed.
- Life Map → Self OS:
  - Life Map changes may prompt:
    - Reconsideration of values (“I keep prioritizing money over creativity. Is that what I really want?”).
    - New flags (“Starting a new career”, “Returning to study”).

### 6.2 Daily OS

- Life Map provides:
  - The **pool of meaningful tasks**.
  - The structure for weekly planning:
    - e.g., “1–2 tasks per active goal”.
- Daily OS ensures:
  - Immediate plans do not contradict Life Map’s capacity signals.
  - Day-to-day life doesn’t drift away from declared goals.

### 6.3 Journal & Mood OS

- Journal & Mood:
  - Provide reflections on how working on certain goals feels.
  - Reveal misalignment (“This goal looked good on paper but drains me”).
- Life Map:
  - Receives insights and suggestions:
    - Tagging goals with emotional impact.
    - Proposing re-prioritization when a goal consistently correlates with negative mood.

### 6.4 Relations OS

- Life Map:
  - Holds goals that involve key relationships (e.g., “Rebuild trust with partner”, “More time with children”).
- Relations OS:
  - Provides:
    - Rituals and communication tools that serve these relational goals.

### 6.5 Work & Money, Health & Energy, Creativity

- Each domain may plug into its own dedicated OS:
  - Work-related goals ↔ Work & Money OS.
  - Health-related goals ↔ Health & Energy OS.
  - Creative goals ↔ Creativity & Expression OS.
- Life Map remains the **cross-domain map**, not a replacement for specialized views.

### 6.6 Integrations Hub

- Life Map tasks and projects:
  - Can be mirrored (if user chooses) to external tools:
    - Calendar events.
    - Task managers.
- Integrations Hub:
  - Handles synchronization in both directions (within user’s consent).

---

## 7. AI Involvement

### 7.1 Roles of AI in Life Map OS

- **Goal Shaper Agent**
  - Helps users phrase meaningful goals.
  - Ensures goals align with values and context.
  - Suggests simplifications and merges.

- **Capacity Guardian Agent**
  - Monitors:
    - Number and intensity of active goals.
    - User’s energy and time signals (from Self OS, Daily OS, Journal).
  - Warns against overcommitment.

- **Review Agent**
  - Assists in monthly/quarterly Life Map reviews.
  - Summarizes progress, patterns, and suggests rebalancing.

### 7.2 Allowed actions

AI may:

- Propose:
  - New goals based on expressed desires or repeated patterns.
  - Turning vague wishes into concrete, testable goals.
  - Retiring or pausing goals that no longer fit reality.
- Warn:
  - When active goals are too many for the user’s capacity.
  - When there are persistent conflicts between goals and values.
- Help link:
  - Goals/projects to values and flags.

### 7.3 Forbidden actions

AI must **not**:

- Impose goals:
  - It cannot decide what the user “should” want.
- Guilt-trip the user:
  - No shaming for pausing or dropping goals.
- Hide trade-offs:
  - If it suggests a new goal, it must be honest about required trade-offs.
- Use goals for:
  - Manipulative upselling (e.g., “To reach this goal, you must buy X program”) without clear labelling and alternatives.

---

## 8. Privacy & Security Considerations

Although Life Map may seem less sensitive than Self OS, it still reveals:

- Personal priorities.
- Ambitions and fears.
- Financial, relational, and health-related intentions.

Requirements:

- Respect the same privacy baseline as the rest of HumanOS (see `00`).
- Be cautious when:
  - Syncing goals/projects with external tools.
  - Sharing any part of Life Map with providers or collaborators.
- Any sharing must be:
  - Explicit.
  - Granular (e.g., “Share only work-related goals with my coach”).
  - Revocable.

---

## 9. Edge Cases & Risks

- **Over-structuring**  
  The system may push users into excessive planning.  
  → Countermeasure: keep flows light, allow “fuzzy goals”, encourage experimentation.

- **Perfectionism & shame**  
  Users may feel guilty when goals are not met.  
  → Countermeasure: reviews emphasize learning and realignment, not judgment.

- **Misalignment with reality**  
  Goals may ignore financial, health, or relational constraints.  
  → Countermeasure: nudge users to consider Self OS flags and constraints when setting goals.

- **Data overload**  
  For complex users, Life Map can become dense and overwhelming.  
  → Countermeasure: layered UI (focus vs. background), filters, and “current focus” mechanics.

---

## 10. Open Questions & Future Directions

- What is the minimum necessary structure that still feels powerful for non-technical users?
- How should the system prioritize:
  - Depth in a few domains vs. breadth across many domains?
- How can Life Map best support:
  - People in crisis (stabilization goals).
  - People in high-growth phases (ambitious goals with safeguards).
- To what extent should Life Map support:
  - Shared goals across spaces (Self + Family + Team) in the UI?
- How might we visualize Life Map:
  - As a graph?
  - As cards?
  - As timelines?
  - Without overwhelming users?

---
