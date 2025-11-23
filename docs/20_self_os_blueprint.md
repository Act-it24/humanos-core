# Self OS – Feature Blueprint  
**File:** `docs/20_self_os_blueprint.md`  
**Version:** v1.0 (Founding Draft)  
**Depends on:**  
- `docs/00_humanos_vision_and_principles.md`  
- `docs/10_product_blueprint_overview.md`  

---

## 1. Purpose & Scope

### 1.1 Purpose

The **Self OS** pillar is the heart of the HumanOS Kernel.

Its primary purpose is to build and maintain a **structured, living model of the user’s inner world** – a “digital twin” that represents:

- Who they are (traits, values, patterns, needs).  
- How they tend to operate (energy rhythms, tendencies, sensitivities).  
- What context they are living in (roles, constraints, major events).

This model is the **foundational context** used by all other Kernel pillars and AI agents. Without Self OS, HumanOS becomes a generic productivity tool; with it, HumanOS becomes a personalized life co-pilot.

### 1.2 Scope

Self OS is responsible for:

- Capturing and structuring:
  - Core values and priorities.
  - Personality patterns and tendencies.
  - Energy rhythms and work/rest preferences.
  - Identity / life-role flags (e.g., parent, caregiver, chronic illness).
  - Significant life events and themes.
- Keeping this model **dynamic and editable**:
  - The profile evolves as the user’s life changes.
  - The user always has the final say over how they are represented.
- Exposing usable “hooks” to other pillars:
  - Life Map can ask: “Does this goal align with your values?”
  - Daily OS can ask: “Is this plan realistic given your energy pattern?”
  - Journal & Mood can anchor patterns in context.

### 1.3 Relation to the Kernel

Self OS is a **KERNEL** pillar (see `10_product_blueprint_overview.md`):

- It directly feeds:
  - **Life Map (Goals & Domains)** – values and priorities.
  - **Daily OS** – energy rhythms and working styles.
  - **Journal & Mood OS** – emotional triggers and recurring patterns.
  - **AI Co-Pilot / Agents** – context for all insights and suggestions.
- It is logically **central** in the Life Graph: other pillars link to it.

If Self OS is weak or missing, the rest of the system becomes shallow and generic.

---

## 2. User Problems & Goals

### 2.1 Personas / situations

Representative (non-exhaustive) personas:

- **The Drifter**  
  A young professional who works hard but feels directionless. They are not sure if their job, lifestyle, or goals match who they truly are.

- **The Overwhelmed Caregiver/Parent**  
  Constantly juggling work, family, and responsibilities. They feel they have lost a sense of personal identity and don’t know what their own needs are anymore.

- **The Burned-Out Achiever**  
  Outwardly successful (career, status, achievements) but emotionally exhausted and disconnected from intrinsic values. They want to “rebuild from within”.

- **The Creative Multi-Hyphenate**  
  Good at many things, constantly pulled in multiple directions, struggling to choose and commit. They feel fragmented and guilty no matter what they choose.

### 2.2 Problems

Common pain points Self OS aims to address:

- “I don’t really know what I want, beyond vague ideas.”
- “I keep repeating the same mistakes in work or relationships.”
- “I’m always busy, but never have time for real self-reflection.”
- “Personality tests are fun, but they don’t help me with real decisions.”
- “Different parts of me want different things; I feel internally conflicted.”
- “My tools treat me as a generic user; they don’t ‘see’ me.”

### 2.3 Desired outcomes

Self OS success criteria (from the user’s perspective):

- “I have a clearer sense of my core values and can use them in decisions.”
- “I recognize my recurring patterns and can navigate them more consciously.”
- “I can name my needs, boundaries, and tendencies and share them with others.”
- “I see how my personality and energy patterns affect my work and wellbeing.”
- “The system’s recommendations feel like they come from someone who genuinely understands me.”

---

## 3. Scope In / Scope Out (v1 vs. Future)

### 3.1 Scope In (v1)

The **v1 Self OS** focuses on building a **real but lightweight** profile that can be used immediately by the Kernel pillars:

1. **Onboarding Assessments (Non-clinical, practical):**
   - **Values:**  
     - Short, card-like flow to identify ~5–7 core values (e.g., Growth, Autonomy, Security, Connection, Creativity).
   - **Personality Style (Actionable, simplified):**  
     - Inspired by Big Five / similar frameworks, but expressed as practical patterns:  
       - Social energy (Introversion / Extraversion spectrum).  
       - Openness / curiosity.  
       - Structure vs. flexibility (Conscientiousness / spontaneity).  
       - Emotional intensity (sensitivity to stress, criticism, ambiguity).
   - **Energy Rhythms:**  
     - Morning vs. evening preferences.  
     - Solo vs. social recharge.  
     - Typical peaks and dips during the day/week.

2. **Core Profile View:**
   - A dedicated, human-readable summary:
     - “My Values”
     - “My Personality Style”
     - “My Energy Pattern”
   - With short explanations and examples, not just labels.

3. **Manual Flags & Lenses:**
   - User-defined, editable tags that provide crucial context:
     - **Support Flags:**  
       - “Parent of toddlers”, “Caregiver for sick parent”, “Full-time student”.
     - **Risk Flags:**  
       - “Recovering from burnout”, “Tends to overcommit”, “Struggles with procrastination”.
     - **Identity/Context Flags:**  
       - “Freelancer”, “Immigrant”, “Living alone”, “Starting a new city”.
   - Flags are used as **lenses** to interpret goals, plans, and moods.

4. **Optional journal-driven enrichment:**
   - With explicit permission, the system may:
     - Suggest new flags based on journal patterns.
     - Suggest revisiting values or traits when repeated themes appear.

Self OS v1 does **not** have to be perfect or complete; it must be **good enough to be useful** and obviously editable by the user.

### 3.2 Scope Out (Future)

Out of scope for v1, but important for later versions:

- **Longitudinal Self History:**
  - A timeline view of how values, traits, and flags changed over months/years.
  - “Self OS v1.0”, “v2.0”, etc.

- **Advanced Assessments:**
  - Optional, deeper psychometrics (e.g., attachment style, cognitive biases).
  - Offered as modules, not mandatory onboarding.

- **“Inner Committee” / Parts Model:**
  - Representing different inner “voices” (e.g., Inner Critic, Protector, Playful Self).
  - Structured dialogues between parts and goals.

- **360 Feedback (Optional, high-trust):**
  - Carefully designed flows where trusted people can add perspective.
  - Strong consent, low frequency, high value.

- **Professional Integrations (Therapy/Coaching):**
  - Controlled mechanisms to share a Self OS summary with a therapist/coach.
  - Possibly as a read-only PDF/HTML snapshot designed for human sessions.

---

## 4. Core Concepts & Data Model (Conceptual)

Self OS is a central cluster in the **Life Graph**.

### 4.1 Main entities

Conceptual entities (not final DB schema):

- **`User`**
  - The central node representing the individual.

- **`Trait`**
  - Describes a relatively stable pattern.
  - Fields (conceptual):
    - `id`
    - `type` (e.g., `personality_style`, `energy_rhythm`)
    - `key` (e.g., `social_energy`, `structure_preference`)
    - `value` (e.g., `introvert`, `ambivert`, or numeric scale)
    - `source` (e.g., `onboarding_assessment`, `user_edit`, `ai_suggested`)
    - `confidence` (optional; qualitative or numeric)

- **`Value`**
  - A core life principle.
  - Fields:
    - `id`
    - `name` (e.g., `Creativity`, `Autonomy`, `Security`)
    - `rank` or `priority` (1–10 scale, or top N)
    - `user_definition` (free text: what this value means personally)
    - `examples` (optional: how it shows up in life)

- **`Flag`**
  - Contextual markers about identity, life state, or risk/support factors.
  - Fields:
    - `id`
    - `type` (`support`, `risk`, `identity`, `context`)
    - `key` (slug-like, e.g., `parent_of_toddler`, `recovering_burnout`)
    - `label` (human-readable)
    - `status` (`active`, `archived`)
    - `notes` (optional, user-written)

- **`LifeEvent`**
  - Significant past or current events that shaped the user.
  - Fields:
    - `id`
    - `title`
    - `period` (rough date or range)
    - `description`
    - `impact_tags` (e.g., `career`, `self-worth`, `trust`)

- **`Insight`** (conceptual)
  - Pattern detected by AI or user.
  - Fields:
    - `id`
    - `description`
    - `source` (`ai`, `user`, `coach`)
    - `linked_entities` (traits, flags, moods, events, goals)

### 4.2 Relationships (conceptual)

Examples of key relationships:

- `User` **has many** `Traits`, `Values`, `Flags`, `LifeEvents`.
- `Goal` or `Project` (from Life Map) **is linked to** one or more `Values`.
- `JournalEntry` (from Journal & Mood) **is tagged with** `Flags`, `LifeEvents`, or `Insights`.
- `AIInsight` **references** combinations such as:
  - (`Flag: recovering_burnout` + `Trait: high_conscientiousness`) → “overplanning risk”.
  - (`Value: Creativity` + `Current Projects` with low creative content) → potential dissatisfaction.

We keep the model flexible; it should support growth without requiring frequent schema overhauls.

---

## 5. Key User Journeys

### 5.1 Self OS Onboarding

**Goal:** Build an initial, meaningful Self OS in ~15–20 minutes (can be split over sessions).

Flow (simplified):

1. User signs up and enters the **Self Space** for the first time.
2. HumanOS explains:  
   > “We’ll build a first version of your Self OS – a map of your values, traits, and energy. You can edit everything later.”
3. Steps:
   - Values mini-exercise (cards or sliders).
   - Personality style survey (short, practical questions).
   - Energy rhythms & recharge preferences.
   - Optional flags (parent, caregiver, student, etc.).
4. At the end:
   - Show **Self OS v1.0 summary**:
     - 3–5 key sentences.
     - Visible list of values, traits, and active flags.
   - Offer a simple prompt:  
     > “Does this feel roughly like you? You can always refine later.”
5. Link to Life Map:
   - Suggest 2–3 starting focus areas or goals based on values and context.

### 5.2 Reviewing & Editing the Profile

**Goal:** Keep the Self OS alive, not a static test result.

- User visits the Self OS section from time to time (or after major life events).
- They:
  - Reorder or delete values.
  - Edit trait descriptions if they feel inaccurate.
  - Add or archive flags.
- The AI may propose:
  - “You mentioned ‘burnout’ repeatedly this month. Would you like to add a ‘recovering from burnout’ flag to help me respect your energy more?”

### 5.3 Using Self OS in Daily Planning

**Goal:** Make daily/weekly planning deeply realistic and aligned.

- In the **Daily OS** view:
  - The AI co-pilot references Self OS:
    - “You recharge alone and are a night owl; scheduling 3 back-to-back morning meetings might drain you. Consider keeping one morning block free.”
  - The user sees short references to Self OS items, so they understand **why** the suggestion is made.

### 5.4 Connecting Self OS with Journal & Mood

**Goal:** Turn reflection into learning.

- The user journals freely (text/voice).
- With permission, AI:
  - Tags entries with values/flags/themes.
  - Surfaces patterns:
    - “When your `value: Autonomy` feels violated, your mood drops for several days.”
- Self OS may suggest:
  - Reviewing certain values or flags.
  - Adjusting goals to reduce value conflicts.

---

## 6. Interactions with Other Pillars

### 6.1 Life Map (Goals & Domains)

- Self OS exports:
  - Values, flags, personality tendencies.
- Life Map uses them to:
  - Check alignment between goals and values.
  - Highlight potential conflicts:
    - “This goal is high on ‘Security’ but low on ‘Creativity’, which is one of your top values. Is this acceptable for now?”

### 6.2 Daily OS

- Self OS informs:
  - Time-of-day preferences.
  - Social vs. solo energy needs.
  - Overcommitment tendencies (from traits/flags).
- Daily OS uses this to:
  - Shape schedules.
  - Suggest pacing.
  - Limit unrealistic workloads.

### 6.3 Journal & Mood OS

- Journal & Mood:
  - Consume Self OS (values, flags, traits) as tags and explanatory context.
  - Produce candidate updates (e.g., new flags, changed priorities).
- Self OS:
  - Receives suggestions from Journal & Mood and asks user to confirm changes.

### 6.4 Relations OS

- Self OS provides:
  - Communication style hints.
  - Conflict tendencies (e.g., avoidance vs. confrontation).
- Relations OS uses this to:
  - Suggest relational rituals.
  - Offer better scripts for difficult conversations.

### 6.5 AI Agents & Automation

- Self OS is the **main context file** for:
  - Planning agents.
  - Reflection agents.
  - Focus/energy agents.
- Automations often reference Self OS:
  - “If `flag: recovering_burnout` is active, cap daily tasks at N and enforce one rest block.”

---

## 7. AI Involvement

### 7.1 Core agents in Self OS

- **Profiler Agent**
  - Guides onboarding assessments.
  - Translates answers into traits, values, and flags.
  - Checks for obvious inconsistencies and asks clarifying questions.

- **Insight Agent**
  - Monitors (with permission) patterns across:
    - Journal entries.
    - Mood logs.
    - Completed/abandoned tasks.
  - Suggests:
    - New or updated flags.
    - Potential value conflicts.
    - Gentle reflections for the user.

### 7.2 Allowed actions

AI is allowed to:

- Propose:
  - Adding or archiving flags.
  - Re-ranking values (with strong justification).
  - Reframing traits in more empowering language.
- Highlight:
  - Patterns and correlations (“When X happens, Y tends to follow”).
- Use the Self OS model to:
  - Personalize all planning and reflection prompts.

### 7.3 Forbidden actions (as per Charter)

AI is explicitly **not allowed** to:

- Diagnose mental health conditions (“You have depression/anxiety/ADHD”).
- Present traits as defects needing “fixing”.
- Share any Self OS data with:
  - Other users.
  - External services.
  - Ecosystem providers  
  … without explicit, granular, revocable consent from the user.

---

## 8. Privacy & Security Considerations

Self OS contains some of the **most sensitive data** in HumanOS.

### 8.1 Sensitivity level

- Includes:
  - Psychologically meaningful patterns.
  - Past traumas and important events (if the user chooses to store them).
  - Risk and support flags.
- A breach or misuse would be extremely harmful.

### 8.2 Protections (conceptual requirements)

- Strong encryption:
  - In transit (TLS).
  - At rest (where feasible, especially for sensitive fields).
- Access control:
  - Only the authenticated user (and explicitly authorized agents/services) can read/modify Self OS.
- Transparency:
  - Clear UI showing:
    - What is stored.
    - How it is used.
    - What is **not** done with it (e.g., no sale, no third-party scoring).

### 8.3 Sharing & export

- Default: **Self OS is private** and not shared with anyone.
- If the user chooses to export/share:
  - It must be explicit (e.g., “Generate a Self OS summary for my therapist”).
  - The shared artifact should be:
    - Time-bounded (snapshot, not live sync).
    - Revocable (user can stop future sharing).

---

## 9. Edge Cases & Risks

- **“Astrology Effect” (Fatalism):**  
  Users may treat the profile as destiny.  
  → Countermeasure: emphasize editability, growth, and that models are approximations.

- **Oversimplification:**  
  Risk of reducing complex humans to simplistic tags.  
  → Countermeasure: encourage nuance; allow free-text; repeat “map ≠ territory”.

- **Over-dependence on AI interpretations:**  
  Users might over-trust AI’s view of them.  
  → Countermeasure: frame insights as “proposals”, not truths; prompt for user reflection.

- **Privacy & Trust:**  
  If users sense any misuse of Self OS data, trust in the entire product collapses.  
  → Countermeasure: clear communication of boundaries (align with Charter), aggressive minimization of data sharing.

- **Cultural & contextual bias:**  
  Default questions/values may feel biased toward certain cultures or socio-economic realities.  
  → Countermeasure: keep language neutral, allow user-defined values, plan for localization.

---

## 10. Open Questions & Future Directions

- What is the right depth for onboarding assessments so they feel meaningful but not overwhelming?
- How often should HumanOS proactively suggest updating the Self OS (without feeling nagging)?
- How can we best show the user the **link** between Self OS data and specific AI suggestions (to build trust and understanding)?
- Should Self OS support multiple “modes” (e.g., “Work Self”, “Family Self”) under one identity?
- How might Self OS representations differ for:
  - Teenagers vs. adults?
  - People in crisis vs. people in stable phases?
- How can coaches/therapists safely **contribute** to Self OS (with consent) without taking away user agency?

---
