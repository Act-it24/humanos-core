# Journal & Mood OS – Reflection, Emotion & Meaning – Feature Blueprint  
**File:** `docs/23_journal_mood_blueprint.md`  
**Version:** v1.0 (Founding Draft)  
**Depends on:**  
- `docs/00_humanos_vision_and_principles.md`  
- `docs/10_product_blueprint_overview.md`  
- `docs/20_self_os_blueprint.md`  
- `docs/21_life_map_blueprint.md`  
- `docs/22_daily_os_blueprint.md`  

---

## 1. Purpose & Scope

### 1.1 Purpose

The **Journal & Mood OS** is the emotional and reflective layer of HumanOS.

Its purpose is to:

- Provide a safe, simple space for users to **express what they feel and think**.
- Connect everyday experiences (Daily OS) and long-term intentions (Life Map) to **emotional reality**.
- Help users and AI see **patterns over time** without turning reflection into diagnosis, judgment, or pseudo-therapy.

It answers:

- “How am I really doing?”
- “What keeps repeating emotionally in my life?”
- “What does this period *mean* for me?”

### 1.2 Scope

Journal & Mood OS is responsible for:

- Capturing:
  - Free-form journals (text, voice in future).
  - Quick mood/emotion check-ins.
- Organizing:
  - Entries by time, tags, and links to goals/events.
- Surfacing:
  - Patterns (e.g., energy slumps, sources of joy/stress).
  - Gentle prompts for reflection and adjustment.

It is **not**:

- A clinical tool.
- A replacement for therapy.
- A social “feed” for sharing vulnerabilities.

### 1.3 Relation to the Kernel

Journal & Mood OS is a **KERNEL pillar** because:

- It completes the loop:
  - Self OS → Life Map → Daily OS → **Journal & Mood** → back into Self OS and Life Map.
- Without it:
  - HumanOS risks becoming purely “mechanical” and disconnected from lived experience.
- With it:
  - The system can learn from reality and help the user adjust their map and habits.

---

## 2. User Problems & Goals

### 2.1 Typical problems

Journal & Mood OS addresses issues like:

- “I don’t have a habit of reflection; days just blur together.”
- “I feel things but I don’t know how to name or understand them.”
- “I’ve tried journaling apps but they feel disconnected from my actual life and goals.”
- “I can’t see emotional patterns; I repeat the same emotional mistakes.”
- “I don’t want a heavy therapy app, just a humane way to check in with myself.”

### 2.2 Desired outcomes

From the user’s perspective, this pillar is succeeding when:

- They have a **lightweight, safe habit** of checking in with themselves.
- They can **look back** and see meaningful patterns:
  - What restores them.
  - What drains or destabilizes them.
- Their plans and goals evolve based on **felt experience**, not just logic.
- They feel **seen**, not judged:
  - By the UI.
  - By the language of the AI.

---

## 3. Scope In / Scope Out (v1 vs. Future)

### 3.1 Scope In (v1)

For v1, Journal & Mood OS must provide:

1. **Quick Mood Check-ins**
   - A super simple interface (e.g., 1–2 taps):
     - Overall mood or emotional tone (e.g., a simple scale or a small set of labels).
     - Optional short note (one sentence).
   - Key moments:
     - End-of-day (connected to Daily OS).
     - Optional ad-hoc check-ins.

2. **Free-form Journal Entries (Text)**
   - A space to write:
     - Daily reflections.
     - Thoughts about specific events, goals, or relationships.
   - Features:
     - Basic formatting.
     - Ability to link an entry to:
       - A day.
       - A goal or project.
       - A person (from Relations OS) in future.

3. **Tags & Lightweight Structure**
   - User can add:
     - Tags (e.g., `work`, `family`, `health`, `joy`, `anxiety`).
   - System can suggest tags (with permission) based on content.

4. **Timeline & Review**
   - Simple chronological view:
     - “Recent entries”
     - Filter by tag, mood range, or domain.
   - Basic monthly review view:
     - Rough trend of mood.
     - A few highlighted entries or themes.

5. **AI-assisted reflection (non-clinical)**
   - The system can:
     - Summarize: “This week, you often mentioned X and Y.”
     - Offer gentle prompts/questions.
     - Suggest reviewing certain goals or routines.

### 3.2 Scope Out (Future)

Out-of-scope for v1 but relevant for future:

- **Voice journaling** with transcription and summarization.
- **Image-based journaling** (e.g., adding photos).
- **Deeper emotion wheels** and multi-dimensional emotional mapping.
- **Guided journeys** for specific topics (grief, transitions, etc.).
- **Integration with professional support**:
  - Export packs for therapists/coaches.
- **Heavy analytics**:
  - Complex emotional dashboards; these should be designed carefully to avoid over-pathologizing.

---

## 4. Core Concepts & Data Model (Conceptual)

Journal & Mood OS revolves around **entries**, **mood snapshots**, and **tags/links**.

### 4.1 Entities

- **`JournalEntry`**
  - A structured container for text-based reflection.
  - Fields (conceptual):
    - `id`
    - `user_id`
    - `created_at`
    - `updated_at`
    - `content` (text)
    - `mood_snapshot_id` (optional)
    - `tags` (simple strings)
    - `links` (to goals, projects, DayPlans, people)
    - `privacy_level` (if we later support shared spaces)

- **`MoodSnapshot`**
  - A minimal data point about emotional state at a moment.
  - Fields:
    - `id`
    - `user_id`
    - `timestamp`
    - `mood_score` (e.g., -2…+2 or 1–5)
    - `mood_label` (optional – e.g., `calm`, `anxious`, `excited`)
    - `energy_level` (optional)
    - `note` (short text, optional)
    - `source` (`daily_check_in`, `ad_hoc`, `imported`)

- **`Tag`** (conceptual; can be simple strings at first)
  - Used for both entries and moods.
  - Examples:
    - Context tags: `work`, `family`, `health`, `money`.
    - Emotion tags: `joy`, `anger`, `fear`, `sadness`, `gratitude`.

- **`ReflectionTheme`** (AI-constructed concept)
  - A cluster of entries/moods around a recurring theme.
  - Fields:
    - `id`
    - `label` (e.g., “Work overwhelm”, “Social energy”, “Self-worth”)
    - `summary`
    - `linked_items` (journal entries, moods, goals)

### 4.2 Relationships

- `User` **has many** `JournalEntries` and `MoodSnapshots`.
- `JournalEntry` may:
  - Reference a `DayPlan` (Daily OS).
  - Reference `Goal`, `Project` (Life Map).
  - Reference entities from Relations OS in future.
- `MoodSnapshot` can:
  - Be associated with a `DayPlan` or `WeekPlan`.
  - Be used in aggregated trends.

The model must remain flexible and privacy-aware.

---

## 5. Key User Journeys

### 5.1 End-of-Day Micro-Check-in

**Goal:** Provide a light, repeatable ritual that finishes the day.

1. At the end of the day (triggered by Daily OS, or when the user opens the app):
   - User sees:
     - “How did today feel overall?”
   - They pick:
     - A mood level (e.g., scale or emojis).
     - (Optional) short note (“Drained”, “Proud of myself”, “Peaceful evening”).
2. System:
   - Creates a `MoodSnapshot`.
   - Optionally offers:
     - A one-line journal prompt: “Anything you want to remember from today?”
3. User may:
   - Add a very short journal entry.
   - Or skip; check-in should never feel like an exam.

### 5.2 Free Journal Moments

**Goal:** Provide a deep, safe space when the user needs it.

- User opens the Journal view.
- They:
  - Start a new entry.
  - Write freely (no pressure).
  - Optionally:
    - Add tags.
    - Link to a goal/project (e.g., “This is about my career change goal”).
- System:
  - May suggest tags or ask if they want to link to today’s plan, a person, or a domain.

### 5.3 Weekly / Monthly Reflection

**Goal:** Turn many small entries into understandable patterns.

- On a weekly or monthly basis:
  - System offers a summary:
    - “This month, your average mood was X.”
    - “You wrote mostly about: work, health, and relationships.”
    - “Entries tagged with ‘work’ often had words like ‘pressure’ and ‘worry’.”
- User:
  - Reads a short, human-language recap.
  - May:
    - Write a meta-reflection: “What I’m learning from this month.”
    - Decide to adjust goals or routines.
- AI:
  - May propose:
    - “Would you like to review your workload?” (→ Daily OS)
    - “This might be a good time to reconsider a goal.” (→ Life Map)

---

## 6. Interactions with Other Pillars

### 6.1 Self OS

- Journal & Mood → Self OS:
  - Source of candidate traits, flags, or value adjustments.
  - E.g., frequent mentions of “burnout” → suggestion: `recovering_burnout` flag.
- Self OS → Journal & Mood:
  - Shapes prompts:
    - For an introvert, prompts might emphasize inner experience and solo time.
    - For someone with a `caregiver` flag, prompts may acknowledge that reality.

### 6.2 Life Map OS

- Journal entries:
  - Often attached to specific goals or projects.
  - Reveal emotional resonance or resistance:
    - “Every time I work on this goal, I feel dread.”
- Life Map:
  - Receives signals:
    - Goals that consistently correlate with negative mood may need:
      - Reframing.
      - Pausing.
      - Dropping.

### 6.3 Daily OS

- Daily OS:
  - Provides the context of what was planned/done each day.
- Journal & Mood:
  - Captures how the day felt.
- Combined:
  - Allow the system to:
    - Suggest lighter days after heavy stretches.
    - Detect patterns (e.g., exhaustion after certain types of days).

### 6.4 Relations OS

- Journal:
  - Often includes reflections about people and relationships.
- In the future:
  - Entries can be explicitly linked to relational spaces.
  - Patterns can:
    - Support relational work (with caution and respect).

### 6.5 Health & Energy, Work & Money, etc.

- Emotional patterns:
  - Often tied to work stress, money anxiety, health struggles.
- Journal & Mood OS:
  - Provides the **subjective layer** on top of these domains.
- Other pillars:
  - May adjust advice or views based on emotional data.

---

## 7. AI Involvement

### 7.1 Roles

- **Summarizer Agent**
  - Summarizes single entries:
    - “Here are the key themes you mentioned.”
  - Summarizes periods:
    - “This week/month, here is what stood out.”

- **Pattern Agent**
  - Scans across:
    - MoodSnapshots.
    - Journal tags.
    - References to goals and days.
  - Proposes:
    - Patterns worth reflecting on (“Work-related entries are often associated with low mood.”).

- **Prompt Agent**
  - Suggests targeted questions:
    - “You’ve been mentioning ‘stuck’ a lot. Want to explore where exactly you feel stuck?”
  - Always optional and gentle.

### 7.2 Allowed actions

AI may:

- Help the user:
  - Find words for their experiences (without telling them how they “should” feel).
  - Organize their reflections.
- Propose:
  - Tags and links.
  - Themes for review.
- Suggest:
  - Adjustments to plans or goals, routed through:
    - Daily OS.
    - Life Map.

### 7.3 Forbidden actions

AI must **not**:

- Diagnose:
  - “You have depression/anxiety/etc.”
- Label the user’s identity or mental health status.
- Provide:
  - Clinical treatment plans.
  - Crisis interventions beyond:
    - Encouraging seeking support.
    - Providing resources (as per Charter).
- Use journal content for:
  - Advertising.
  - Manipulative personalization.

---

## 8. Privacy & Security Considerations

Journal & Mood OS holds some of the **most intimate content** in the system.

### 8.1 Sensitivity

- Entries may include:
  - Trauma.
  - Abuse.
  - Secrets.
  - Self-harm ideation.
- Misuse or leakage would be extremely harmful.

### 8.2 Requirements

- Strong encryption in transit and (where feasible) at rest.
- Clear boundaries:
  - Journals are **private by default**.
  - Sharing with providers or others is:
    - Optional.
    - Granular.
    - Revocable.
- No hidden:
  - Text analysis for marketing.
  - Behavioral scoring for third parties.

### 8.3 Crisis-related content

- If entries strongly suggest crisis:
  - AI response must:
    - Stay within safe guidelines (non-clinical).
    - Encourage contacting:
      - Trusted humans.
      - Professionals.
      - Hotlines/resources.
- No:
  - Silent reporting to third parties.
  - False promises (“We will save you”).

---

## 9. Edge Cases & Risks

- **Emotional over-exposure**  
  Some users might dive too deep too fast.  
  → Countermeasure: encourage pacing, offer lighter prompts.

- **Reluctance to write**  
  Many people don’t like writing long text.  
  → Countermeasure: focus on micro-check-ins first, optional deeper journaling.

- **Misinterpretation by AI**  
  AI might misread tone or intent.  
  → Countermeasure: always present insights as tentative, allow users to correct them.

- **Privacy fears**  
  Users may be afraid to be honest.  
  → Countermeasure: clear, repeated messaging about privacy; visible controls for data usage.

---

## 10. Open Questions & Future Directions

- What is the **simplest possible journaling UX** that still feels meaningful?
- How can we support:
  - People who prefer voice over writing?
  - People with low literacy or language barriers?
- How often should the system proactively offer:
  - Summaries?
  - Prompts?
  - Is there a risk of “analysis fatigue”?
- How to handle:
  - Long gaps in journaling (respecting silence).
  - Periods of high emotional intensity (without overwhelming the user).
- Could we offer:
  - Archetypes of journaling styles (e.g., bullet-style, narrative, gratitude, tracking), while keeping everything optional?

---
