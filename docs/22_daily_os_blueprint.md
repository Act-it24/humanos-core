# Daily OS – Execution, Rhythm & Focus – Feature Blueprint  
**File:** `docs/22_daily_os_blueprint.md`  
**Version:** v1.0 (Founding Draft)  
**Depends on:**  
- `docs/00_humanos_vision_and_principles.md`  
- `docs/10_product_blueprint_overview.md`  
- `docs/20_self_os_blueprint.md`  
- `docs/21_life_map_blueprint.md`  

---

## 1. Purpose & Scope

### 1.1 Purpose

The **Daily OS** is where HumanOS becomes real in the user’s everyday life.

Its purpose is to answer, in a grounded and humane way:

- “What should I actually do **today**?”
- “What does a **realistic week** look like for me?”
- “How do I move forward without burning out or drifting?”

Daily OS is the **bridge** between:

- The inner model (Self OS),
- The outer structure (Life Map),
- And the practical reality of time, energy, and commitments.

### 1.2 Scope

Daily OS is responsible for:

- Providing **Today** and **This Week** views that:
  - Aggregate tasks and commitments from Life Map and integrated tools.
  - Respect the user’s energy rhythms, constraints, and flags from Self OS.
- Supporting:
  - Simple, realistic planning.
  - Daily check-ins and micro-reflections.
  - Weekly reviews and adjustments.

Daily OS is **not** a generic calendar or task app.  
It is a **decision layer** that orchestrates tasks, time, and energy around what matters most.

### 1.3 Relation to the Kernel

Daily OS is a **KERNEL** pillar:

- Without it:
  - Self OS and Life Map remain theoretical.
- With it:
  - Goals and values are translated into **concrete, doable steps**.
  - The user builds a **rhythm** instead of sporadic efforts.

Daily OS must remain:

- Simple enough for daily use.
- Deep enough to embody HumanOS principles (respect for energy, non-overload, alignment with Self OS and Life Map).

---

## 2. User Problems & Goals

### 2.1 Typical problems

Daily OS addresses pain points such as:

- “I know my goals… but my days still feel chaotic.”
- “I always plan too much and then feel like a failure.”
- “My schedule looks full, but I’m not doing the important things.”
- “Most productivity tools make me feel guilty, not supported.”
- “I ignore half my tasks because the list is overwhelming.”

### 2.2 Desired outcomes

From the user’s perspective, Daily OS is succeeding when:

- They feel **clear** on what today is about (even if it’s a light/rest day).
- Plans feel **realistic**, not aspirational fantasy.
- They can see **how** today’s tasks relate to goals and values.
- They experience more **completion and closure**, less guilt and chaos.
- They build **habits and rituals** that match their energy, not fight it.

---

## 3. Scope In / Scope Out (v1 vs. Future)

### 3.1 Scope In (v1)

For v1, Daily OS must:

1. **Provide a simple Today view**
   - Shows:
     - 3–7 focus items (not 30+ tasks).
     - Key time-bound events (from integrations).
     - 1–3 supporting habits/rituals (optional).
   - Allows:
     - Marking items as done.
     - Moving items to “later this week” or “not this week”.

2. **Provide a basic This Week view**
   - Summarizes:
     - Active goals and projects (from Life Map).
     - Suggested tasks distributed across the week.
   - Lets the user:
     - Choose which goals to actively work on this week.
     - Adjust load per day (light, normal, heavy).

3. **Use Self OS signals**
   - Respect:
     - Energy patterns (morning/evening, solo/social).
     - Flags like `recovering_burnout`, `parent_of_toddler`.
   - Provide:
     - Gentle warnings when the user overbooks themselves.
     - Suggestions for rest and recovery.

4. **Integrate minimally with external tools**
   - At least:
     - Read from one calendar (e.g., Google).
     - Optionally read/write tasks from one simple task manager (or keep tasks internal at v1).
   - Avoid complex sync logic in v1 – keep it simple and transparent.

5. **Include a daily micro-check-in**
   - At the start or end of the day:
     - “How are you arriving today?” or “How did today feel?”
   - Feed this into:
     - Journal & Mood OS.
     - Future planning suggestions.

### 3.2 Scope Out (Future)

Not for v1, but important future directions:

- **Advanced time-blocking UI**
  - Drag-and-drop blocks.
  - Multi-calendar overlays.
- **Deep scheduling intelligence**
  - Optimizing across weeks/months automatically.
- **Complex work modes**
  - Pomodoro timers, deep work sessions, focus sprints.
- **Multi-space planning**
  - Combining Self + Family + Team commitments in one unified plan.
- **Adaptive routines**
  - Automatically adjusting routines based on health and mood trends.

---

## 4. Core Concepts & Data Model (Conceptual)

Daily OS sits between:

- Life Map entities: `Goal`, `Project`, `Task`
- External entities: `CalendarEvent`, external `Task`
- Internal state: daily plans, logs, and reflections

### 4.1 Key conceptual entities

- **`DayPlan`**
  - A representation of what the user intends to do (and actually did) on a given day.
  - Fields (conceptual):
    - `date`
    - `focus_items` (references to tasks/events)
    - `intended_load` (`light`, `normal`, `heavy`)
    - `actual_load` (computed or user-rated)
    - `notes` (free text)
    - `mood_snapshot_id` (link to Journal & Mood)

- **`WeekPlan`**
  - Aggregation of day plans plus a summary.
  - Fields:
    - `week_start_date`
    - `active_goals` (from Life Map)
    - `planned_tasks` (by day)
    - `load_pattern` (e.g., heavy mid-week, light weekend)
    - `review_notes`

- **`PlannedItem`**
  - A generic pointer to:
    - A `Task` from Life Map, or
    - A `CalendarEvent`, or
    - A `Habit/Ritual`, or
    - A “free-floating” item.
  - Fields:
    - `id`
    - `source_type` (`life_map_task`, `calendar_event`, `habit`, `adhoc`)
    - `source_id` (external reference)
    - `status` (`planned`, `in_progress`, `done`, `skipped`, `moved`)
    - `day` (date)

- **`Routine`** (basic in v1)
  - A repeated pattern (e.g., morning, evening, weekly review).
  - Fields:
    - `id`
    - `name`
    - `frequency` (daily/weekly)
    - `items` (list of simple steps)
    - `status` (`active`, `paused`)

### 4.2 Conceptual flows

- Life Map → Daily OS:
  - Provides candidate tasks and goals to schedule.
- Integrations → Daily OS:
  - Provide time-bound events and meetings.
- Self OS → Daily OS:
  - Provides constraints and preferences (flags, energy patterns).
- Daily OS → Journal & Mood:
  - Provides context (what was planned, what happened) for reflection.

---

## 5. Key User Journeys

### 5.1 Morning Start (or Start-of-Day) Flow

**Goal:** Give the user a gentle, grounded start to the day.

1. User opens HumanOS in the morning.
2. Daily OS shows:
   - Any time-bound events today.
   - 3–7 suggested focus items:
     - Derived from:
       - Active projects/goals.
       - Previous unfinished items.
       - Self OS constraints (e.g., not too many demanding tasks).
3. The user:
   - Confirms or edits the list (add/remove/reorder).
   - Optionally sets the day’s **intention**:
     - “Recovery”, “Progress”, “Social”, “Admin”, etc.
4. The system:
   - Saves a `DayPlan` with initial state.

### 5.2 During the Day

**Goal:** Keep interaction simple and low-friction.

- The user:
  - Marks items as done.
  - Skips or moves items if needed.
- The UI:
  - Avoids nagging.
  - Shows gentle reminders only when helpful:
    - e.g., “Your day looked heavy in the morning; consider ending with a small celebration or reflection.”

### 5.3 End-of-Day Reflection

**Goal:** Close the loop and feed insights into other pillars.

1. At day end (or later), the user sees:
   - What was planned vs. what actually happened.
   - Simple reflection prompts:
     - “What gave you energy today?”
     - “What drained you?”
     - “Anything you want to remember?”
2. The user:
   - Provides a quick mood or energy rating.
   - Optionally writes one or two sentences.
3. The system:
   - Sends data to:
     - Journal & Mood OS (for patterns).
     - Life Map (for progress on goals).
     - Self OS (for potential flags or adjustments).

### 5.4 Weekly Planning & Review

**Goal:** Design a realistic week that respects Self OS and Life Map.

- Once a week, Daily OS guides a short ritual:
  - Review:
    - What happened last week?
    - Which goals moved? Which stalled?
  - Plan:
    - Choose which goals to actively focus on this week.
    - Pull a small set of tasks into the week.
    - Balance the load based on:
      - Known events from calendar.
      - Self OS constraints and flags.
- The AI co-pilot:
  - Warns:
    - “This week already has intense events; consider a lighter workload.”
  - Suggests:
    - “Given your `recovering_burnout` flag, how about capping the number of ‘heavy’ days?”

---

## 6. Interactions with Other Pillars

### 6.1 Self OS

- Self OS → Daily OS:
  - Energy patterns:
    - When to schedule deep work.
    - When to schedule social tasks vs. solo work.
  - Flags:
    - `recovering_burnout` → lower load, more rest blocks.
    - `caregiver` → more unpredictable days; daily planning must be flexible.
- Daily OS → Self OS:
  - May suggest updates:
    - E.g., repeated overcommitment indicates a trait/flag worth refining.

### 6.2 Life Map

- Life Map → Daily OS:
  - Provides:
    - A pool of meaningful tasks.
    - Knowledge of which goals should be advanced this week.
- Daily OS → Life Map:
  - Feeds:
    - Completed tasks.
    - Stalled projects.
    - Data for goal-level progress and reviews.

### 6.3 Journal & Mood OS

- Daily OS:
  - Creates the **structural context** for each day.
- Journal & Mood OS:
  - Creates the **emotional narrative** for that day.
- Combined:
  - Allow AI to see:
    - How certain loads and patterns affect mood.
    - When to suggest rest, renegotiation, or support.

### 6.4 Integrations Hub

- Daily OS:
  - Reads calendar events and shows them in context with tasks.
  - May write back:
    - Time-blocks in the calendar (if user permits).
- Integrations Hub:
  - Manages connections and permissions to external apps.

### 6.5 AI Agents & Automation

- Daily OS is a primary “surface” for AI:
  - Planning Agent.
  - Focus Agent.
  - Review Agent.
- Automations:
  - Can modify DayPlans and WeekPlans according to rules:
    - “If I sleep < 6 hours, automatically downgrade tomorrow’s load to ‘light’ and move non-urgent tasks.”

---

## 7. AI Involvement

### 7.1 Core AI roles in Daily OS

- **Planning Agent**
  - Helps design Today and This Week plans.
  - Balances tasks across days.
  - Takes into account:
    - Self OS (energy, flags).
    - Life Map (goals/projects).
    - Calendar events.

- **Focus Agent**
  - Offers:
    - Micro-suggestions during the day:
      - “Start with this small task to create momentum.”
      - “Take a 10-minute break now.”
  - Respects:
    - User’s preference for notification intensity.

- **Review Agent**
  - Summarizes:
    - What happened in the last day/week.
    - Patterns over time.
  - Suggests:
    - Adjustments to load, routines, or goals.

### 7.2 Allowed actions

AI is allowed to:

- Suggest:
  - Prioritized lists for today/this week.
  - Load adjustments.
  - Rest days and recovery periods.
- Reorder:
  - Recommended tasks (for the user to approve).
- Auto-move:
  - Non-critical tasks to later in the week (if user enables such automation).

### 7.3 Forbidden actions

AI must **not**:

- Overbook the user deliberately “for productivity”.
- Punish or shame the user for:
  - Moving tasks.
  - Having low-productivity days.
- Silently change:
  - Time-bound events in external calendars.
- Force:
  - Work on days marked as rest or critical personal time.

---

## 8. Privacy & Security Considerations

Daily OS data includes:

- Detailed day-level behavior (what was planned, what was done).
- Time patterns and possibly sensitive context (e.g., therapy sessions, personal events in the calendar).

Requirements:

- Respect privacy of calendar and external tasks:
  - Only access what the user explicitly allows.
  - Clear separation between private and shared contexts (e.g., no leaking to Team/Org space by default).
- Avoid storing unnecessary raw external data:
  - Use references where possible.
  - Summarize instead of copying everything.

The **tone** of the interface matters for psychological safety:
- The user should never feel “judged” by their own DayPlans history.

---

## 9. Edge Cases & Risks

- **Over-planning / Productivity trap**
  - Users may become obsessed with optimizing every minute.
  - → Countermeasure: keep UI simple, emphasize rest and depth over quantity.

- **Guilt & shame loops**
  - Seeing many undone tasks can hurt self-esteem.
  - → Countermeasure: design around realistic scope, default to fewer tasks, supportive language.

- **Complex lives with high volatility**
  - Caregivers, parents of young children, people with unstable schedules.
  - → Countermeasure: allow for flexible planning modes; emphasize “intention + adaptation” over rigid plans.

- **Conflict with external tools**
  - Users already use heavy-duty calendar/task systems.
  - → Countermeasure: start with read-mostly integrations, avoid duplication unless explicitly requested.

---

## 10. Open Questions & Future Directions

- What is the **minimum** planning ritual that still feels powerful?
  - For different user types (e.g., low-structure vs. high-structure people).
- How can Daily OS:
  - Support “seasonality” (e.g., intense months vs. quiet months)?
- How should Daily OS evolve in multi-space scenarios:
  - Merging Self + Family + Team planning in one view without confusion?
- To what extent should Daily OS:
  - Nudge users to renegotiate commitments with others (e.g., saying no at work, rescheduling social plans)?
- Could there be:
  - Different “planning styles” the user chooses from (e.g., minimalist, structured, experimental)?

---
