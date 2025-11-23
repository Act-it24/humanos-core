# Journal & Mood OS – Logging & Reflection Spec (v0.1)

**File:** `29_journal_mood_logging_spec.md`  
**Version:** v0.1  
**Status:** Draft – Implementation-ready for UI & model  
**Depends on:**  
- `23_journal_mood_blueprint.md`  
- `20_self_os_blueprint.md`  
- `21_life_map_blueprint.md`  
- `22_daily_os_blueprint.md`  
- `25_self_os_onboarding_spec.md`  
- `26_self_os_usage_map.md`  
- `27_life_map_onboarding_spec.md`  
- `24_daily_os_planning_spec.md`  

---

## 1. Purpose & Role in HumanOS

**Journal & Mood OS** is where the user:

- Records **how they feel** and **what happened**.
- Connects emotions to:
  - Life domains & goals (Life Map)
  - Values, traits, and flags (Self OS)
  - Daily plans and focus (Daily OS)

For v0.1, the goal is **not** to build a full-blown knowledge base or therapy tool, but to provide:

1. A **simple mood check-in** flow for “today”.
2. A **free-form journal** where entries can optionally:
   - Attach a mood snapshot.
   - Link to domains/goals.
3. A **very basic history & trend view** (list + light mood timeline placeholder).

Everything is **frontend-only** and stored in memory for now.

---

## 2. Scope & Non-goals

### In scope (v0.1)

- Mood check-in for “today” (one main snapshot per day).
- Multiple journal entries per day (short or long).
- Ability to:
  - Rate mood (1–5 or similar).
  - Choose a main feeling (e.g. Calm, Anxious, Excited).
  - Add a free-text note.
  - Optionally link an entry to:
    - Life domains
    - Life goals
    - Daily plan (if exists)
- Basic history list:
  - Grouped by day.
  - Shows mood & number of entries.
  - Clicking a day shows all entries for that day.

### Out of scope (future versions)

- AI-generated insights, clustering, or summaries.
- Attachments (images, voice notes, etc.).
- Advanced search or tagging.
- Clinical assessments or mental health diagnostics.
- Sharing entries with others.

---

## 3. Core Concepts & Data Model

This spec defines a frontend-only conceptual model to be implemented later in:

- `web/src/features/journal-mood/journalModel.js` (or similar).

### 3.1 MoodSnapshot

Represents how the user feels at a given moment.

```ts
type MoodSnapshot = {
  id: string;
  timestamp: string; // ISO datetime
  // A simple integer representing overall mood valence/intensity
  moodScore: 1 | 2 | 3 | 4 | 5; // 1 = very low, 3 = neutral, 5 = very good

  primaryEmotion: string;      // e.g. "Calm", "Anxious", "Grateful", "Sad", "Excited"
  secondaryEmotions?: string[]; // optional, user-selected

  energyLevel?: "very_low" | "low" | "medium" | "high" | "very_high";
  tensionLevel?: "relaxed" | "neutral" | "tense";

  // Optional quick context
  contextTags?: string[];      // e.g. ["Work", "Family", "Health", "Money"]

  // Optional links to other pillars
  domainIds?: string[];        // LifeDomain IDs
  goalIds?: string[];          // LifeGoal IDs

  note?: string;               // short note for the snapshot itself
};

3.2 JournalEntry

Represents a free-form text entry.

type JournalEntry = {
  id: string;
  timestamp: string;           // ISO datetime
  date: string;                // ISO date "YYYY-MM-DD" (for grouping)

  // Entry kind
  kind: "free" | "prompt" | "reflection"; 

  title?: string;              // optional short title
  content: string;             // main text

  // Optional mood snapshot linked directly to this entry
  moodSnapshotId?: string;     // link to MoodSnapshot (if any)

  // Links to Life Map and Daily OS
  domainIds?: string[];        // related LifeDomain IDs
  goalIds?: string[];          // related LifeGoal IDs
  dailyPlanDate?: string;      // link to DailyPlan.date if relevant

  // Simple tags (non-system, user-defined)
  tags?: string[];             // e.g. ["gratitude", "frustration", "idea"]

  createdAt: string;
  updatedAt?: string;
};

3.3 JournalDaySummary

A derived structure to support the “History” view:

type JournalDaySummary = {
  date: string;                 // e.g. "2025-01-10"
  mainMoodSnapshot?: MoodSnapshot; // the primary snapshot for that day (if any)
  entryCount: number;
};

3.4 JournalState (frontend-only)

In v0.1, the page can maintain something like:

type JournalState = {
  moodSnapshots: MoodSnapshot[];
  entries: JournalEntry[];
};

All data can live in React state; no persistence required yet.

4. UX Overview – Journal & Mood Page

The Journal & Mood tab will have two internal views:

Today

Quick mood check-in.

Option to write a journal entry “for today”.

History

List of past days with mood indicators and entry counts.

Click a day to see its entries and mood details.

The design should be visually consistent with other HumanOS pillars (cards, dark theme, calm typography).

5. Today View – Flow (v0.1)
5.1 Initial state (no mood logged today)

When the user opens Journal & Mood for today and there is no mood snapshot yet:

Show a main card:

Title: “How are you feeling today?”

Short text:

“This is a private space to track your mood and capture what’s on your mind. There are no right or wrong answers.”

Primary CTA:

“Log Today’s Mood” → opens a small inline “mood check-in” flow.

Optional secondary:

“Write a journal entry” (for users who want to skip mood rating).

5.2 Mood Check-in mini-flow

The check-in can be a small 1–2 step wizard, not a full separate page:

Step A – Basic mood

Controls:

MoodScore selector (1–5), with labels, e.g.:

1 = “Very rough”

3 = “In the middle”

5 = “Feeling great”

PrimaryEmotion selection:

Show a few common options as chips:

Calm, Anxious, Sad, Angry, Grateful, Excited, Tired, Overwhelmed, etc.

Allow one selected at a time.

Optional:

Short note field:

“Anything you want to add in a sentence or two?”

Step B – Optional context

Lightweight, all optional:

Energy level (very_low → very_high).

Tension level (relaxed / neutral / tense).

Context tags, e.g.:

Work, Health, Family, Money, Social, Creativity.

Optional domain/goal links:

If LifeMap is available, show a simple dropdown/multi-select of domains/goals:

“Does this mood relate to any area or goal?”

At the end:

Button: “Save Mood for Today”

Creates a MoodSnapshot for now.

Ensures it’s marked as the “main” snapshot for that date (if needed, overwrite previous daily primary for v0.1).

Secondary: “Skip extra details” (keeps only the basic fields).

After saving:

Today view shows:

A small mood summary card:

Mood score with emoji or label.

Primary emotion.

Optional one-line note.

A button: “Update today’s mood” that opens the same flow, prefilled.

6. Today View – Journal Entry Creation

From the Today view, the user should be able to:

Click “Write a journal entry”.

This opens a simple editor card:

Fields:

Optional title.

Main content textarea.

Optional toggle:

“Attach current mood snapshot” (if today’s mood exists).

Optional links:

Domains / Goals (if LifeMap exists).

DailyPlan date (pre-filled as today if there is a plan).

Actions:

Primary: “Save entry”

Creates a JournalEntry with timestamps and attaches moodSnapshotId if chosen.

Secondary: “Cancel”.

After saving:

Entry appears in:

A “Today’s entries” list under the mood card.

Each entry row shows:

Title (or first line).

Time.

A small pill indicating if mood is attached (e.g. coloured dot).

7. History View

The History view is simple in v0.1:

7.1 Day list

Show a scrollable list of JournalDaySummary, newest first:

For each day:

Date label (e.g. “Mon, Jan 10”).

Main mood score (if any) – optionally with emoji.

Primary emotion or “No mood logged”.

Entry count: “3 entries”.

If there is no data at all yet:

Show an empty state card encouraging the user to start with Today.

7.2 Day details

When the user clicks a day:

Show:

Mood for that day (if exists):

Mood score.

Primary emotion.

Any notes.

Context tags.

Entries list:

List of JournalEntry for that date.

Clicking an entry expands it inline:

Show full content.

Show linked domains/goals (if any).

Show whether it’s linked to a DailyPlan (and which date).

There is no editing requirement in v0.1 (editing can be a v0.2 feature).
If editing is easy to implement, it should be optional, not required.

8. Interactions with Other Pillars (v0.1 level)
8.1 Self OS

Use Self OS only to:

Frame prompts, not to compute scores.

Example:

If flags include “recovering from burnout”, occasionally show:

“Be gentle with yourself. A rough day does not mean you’re failing.”

Use Self OS values in reflections later (v0.2+), not required in v0.1.

8.2 Life Map

When linking moods or entries to domains/goals:

Use domainIds and goalIds from the current LifeMap.

This link will later allow:

“You often feel drained on days when you work on [Goal X].”

For v0.1, simple multi-select lists are enough.

8.3 Daily OS

If a DailyPlan exists for today:

Offer a subtle link:

“Reflect on today’s plan” → pre-fills a journal entry with:

Title: “Reflection on today’s plan”.

dailyPlanDate set to today.

No deeper integration needed yet.

9. Implementation Hints (for future frontend work)

When this spec is implemented in web/:

Create a model/helper file, e.g.:

web/src/features/journal-mood/journalModel.js with:

Creators: createMoodSnapshot, createJournalEntry.

Grouping helpers: getJournalDaySummaries(state), getEntriesForDate(date).

Update JournalMoodPage.jsx to:

Maintain JournalState in local state.

Render:

“Today” view (mood card + today entries).

“History” view (day list + details panel).

Optionally use a simple internal toggle ("today" | "history").

State can be stored purely in React for v0.1.

10. Safety & Language

Journal & Mood OS touches sensitive emotional space. v0.1 must:

Avoid clinical terms (diagnosis names, etc.).

Use non-judgmental, supportive language.

Emphasise that:

The journal is private.

Mood variability is normal.

The system is here to help notice patterns, not label the user.

Future AI-powered features (summaries, insights) must respect this baseline.

11. Open Questions (for v0.2+)

Should the user be able to star or bookmark specific entries as “important moments”?

How often should the system gently invite the user to reflect (e.g. weekly review)?

How should mood be visualised in a future Trends view (e.g. line graph, calendar heatmap)?

What is the simplest way to suggest helpful prompts without feeling like a “prescription”?

v0.1 focuses on:

A mood check-in.

A journal editor.

A history list.

This is enough to start learning from the user’s emotional patterns and prepare the ground for deeper insights later.