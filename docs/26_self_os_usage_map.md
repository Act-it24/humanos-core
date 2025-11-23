# Self OS Usage Map

**Title:** Self OS Usage Map – How the Profile Drives HumanOS  
**File:** `26_self_os_usage_map.md`  
**Version:** v0.1  
**Status:** Draft (Foundational)  
**Depends on:**  
- `20_self_os_blueprint.md`  
- `25_self_os_onboarding_spec.md`  
- `21_life_map_blueprint.md`  
- `22_daily_os_blueprint.md`  
- `23_journal_mood_blueprint.md`  
- `28_integrations_hub_blueprint.md`  
- `2A_ai_agents_automation_blueprint.md`  

---

## 1. Purpose of this document

The **Self OS** onboarding flow produces a structured `SelfOsProfile`.  
This document explains:

- What is inside that profile (at a conceptual level).
- How each part of the profile is **used by other pillars**:
  - Life Map OS  
  - Daily OS  
  - Journal & Mood OS  
  - Integrations Hub  
  - AI Agents & Automations
- How future features should **read and respect** Self OS instead of re-asking the same questions.

This is not a technical API spec. It is a **usage contract** between the Self OS model and the rest of HumanOS.

---

## 2. Quick recap: what SelfOsProfile contains

At a high level (see `selfOsModel.js` and `25_self_os_onboarding_spec.md` for details), the profile contains:

1. **Values**
   - A list of selected values (e.g. *Creativity, Growth, Security*).
   - A subset of them marked as **Core Values** with ranks (1–5).
   - The rest are **Supporting Values**.

2. **Personality**
   - Five continuous sliders (0–100) representing practical dimensions, for example:
     - Introversion ↔ Extraversion  
     - Planner ↔ Spontaneous  
     - Detail-focused ↔ Big-picture  
     - Stable ↔ Change-seeking  
     - Calm ↔ Intense  
   - Each dimension is stored as a numeric percentage and can be rendered as a human-readable description.

3. **Energy Profile**
   - **Chronotype** (e.g. Morning, Evening, Mixed).
   - One to three **Focus Windows** (time blocks where deep work is easiest).
   - A **Social Energy** slider (how draining/charging social interactions are).

4. **Life Flags**
   - Tagged, high-impact context about the user’s current life:
     - Roles (e.g. *Parent*, *Caregiver*, *Student*, *Freelancer*).
     - Constraints (e.g. *Health limitation*, *Financial pressure*).
     - Transitions (e.g. *Career change*, *Moving city*).
     - Other custom flags the user adds.

5. **Notes**
   - Free-text description in the user’s own words about who they are and what matters right now.

6. **Meta**
   - `createdAt` and `updatedAt` timestamps for versioning and long-term evolution.

---

## 3. How other pillars should use Self OS

This section describes how each part of the profile should influence the rest of the system.  
Future features should **read from Self OS first**, and only ask new questions when necessary.

### 3.1 Values → Life Map OS

**Goal:** connect what the user *does* (goals & projects) to what truly matters (values).

**Usage:**

- When the user creates **Domains** in Life Map (e.g. *Health, Career, Relationships, Creativity*), the system should:
  - Suggest domains that **cover the top Core Values**.
  - Warn gently if a Core Value has no domain associated with it (e.g. *“Creativity is a top value, but you have no domain that expresses it yet.”*).

- When the user creates **Goals** and **Projects**:
  - The UI should allow linking each goal/project to one or more **Core** and/or **Supporting Values**.
  - The AI can suggest links automatically:
    - *“This project ‘Write my first short film’ seems highly aligned with Creativity and Growth. Do you want to mark that?”*

- When prioritising between goals:
  - Core-aligned goals should be highlighted or bubbled up.
  - The system can explain trade-offs:
    - *“This goal increases Security but might reduce Autonomy. Is that acceptable for you right now?”*

**Design principle:**  
Life Map OS is where **values become visible in the calendar and projects**. Self OS values are the starting point and should always be visible when setting or reviewing goals.

---

### 3.2 Personality → Daily OS, Life Map & AI tone

**Goal:** adapt planning, suggestions, and tone to how the user tends to operate.

**Usage:**

- **Planning style (Planner ↔ Spontaneous):**
  - If the user is more Planner:
    - Encourage structured routines, clear checklists, and time-blocking.
  - If more Spontaneous:
    - Offer lighter structure (e.g. “Top 3 priorities”) instead of rigid hourly schedules.

- **Introversion ↔ Extraversion:**
  - If more Introvert:
    - Suggest **buffer time** after social events.
    - Encourage deep work in quiet blocks.
    - Limit the number of social interactions per day when possible.
  - If more Extrovert:
    - Suggest collaborative work sessions, co-working, or calls.
    - Encourage mixing social and work time where appropriate.

- **Detail-focused ↔ Big-picture:**
  - Detail-focused:
    - Break tasks into smaller steps automatically.
    - Provide more concrete, operational suggestions.
  - Big-picture:
    - Emphasise outcomes, themes, and directions rather than micro-tasks.

- **Stable ↔ Change-seeking:**
  - Stable:
    - Keep routines more constant; introduce changes slowly.
  - Change-seeking:
    - Suggest experiments, weekly theme changes, or rotating focuses.

- **Calm ↔ Intense:**
  - Intense:
    - Encourage recovery and reflection; watch for overcommitment.
  - Calm:
    - Gently nudge toward growth challenges when the user is ready.

**AI tone:**

- The AI co-pilot should adapt its **language**:
  - For very high Introversion + high Planner → more private, calm, structured tone.
  - For high Extraversion + high Change-seeking → more energetic, experimental tone.

---

### 3.3 Energy profile → Daily OS & scheduling

**Goal:** align the plan with the user’s natural energy, instead of fighting it.

**Usage:**

- **Chronotype:**
  - Morning type:
    - Suggest deep work in early blocks.
    - Put admin and lighter work in the afternoon.
  - Evening type:
    - Avoid heavy tasks first thing in the morning.
    - Suggest deep work blocks later in the day.
  - Mixed:
    - Use focus windows as the primary guide.

- **Focus windows:**
  - Daily OS should:
    - Visually highlight these windows in the day/week view.
    - Recommend scheduling **Deep Work** tasks inside them by default.
  - When creating or rescheduling a task:
    - The AI can propose: *“This looks like deep work. Should we put it into your 10:00–12:00 focus window?”*

- **Social energy:**
  - If social interactions are draining:
    - Avoid stacking multiple calls/meetings in a row.
    - Insert recovery blocks after intense social time.
  - If social interactions are energising:
    - Suggest collaborative sessions in low-energy times to boost mood and momentum.

---

### 3.4 Life Flags → All pillars (context & constraints)

**Goal:** respect the user’s real-world constraints and current life stage.

**Usage:**

- **Roles** (e.g. Parent, Caregiver, Student, Freelancer):
  - Life Map:
    - Encourage at least one domain per major role (e.g. *Family*, *Caregiving*).
  - Daily OS:
    - Adjust expected capacity (a new parent will have less time than a single person).
  - AI tone:
    - Acknowledge these roles in prompts and reflections.

- **Constraints** (e.g. health limitations, financial stress):
  - Daily OS:
    - Limit aggressive goal-setting and over-packed schedules.
    - Suggest smaller, more sustainable steps.
  - Life Map:
    - Mark some goals as *“gentle pace”* or *“recovery-friendly”*.

- **Transitions** (e.g. career change, relocation, new relationship):
  - Journal & Mood:
    - Reflect on how moods shift around the transition.
  - Life Map:
    - Suggest temporary focus on stabilisation (e.g. *“settle into new job”* before adding many new goals).
  - Automations:
    - Allow temporary “soft mode” where notifications and routines are lighter.

- **Other flags / custom flags:**
  - Always treat them as **user-defined truth about their life**.
  - Do not override or interpret them clinically; only echo and respect them.

---

### 3.5 Notes → Journal & AI interpretation

**Goal:** let the user describe themselves in their own words, without forcing them into categories.

**Usage:**

- Journal & Mood OS:
  - Use the notes as initial context for prompts such as:
    - *“Looking back at how you described yourself when you started, what feels different today?”*
  - Avoid re-asking questions that the user already answered in the notes.

- AI Co-pilot:
  - Can extract **themes** (e.g. “perfectionism”, “fear of failure”, “desire for creative freedom”), but must:
    - Present them as *hypotheses* or reflections, not diagnoses.
    - Use language like:
      - *“You often mention wanting freedom and creativity. Would you like your goals to reflect that more?”*

- Future analytics:
  - Notes can be versioned over time to show how the user’s self-description evolves.

---

## 4. Examples (personas)

These examples are **usage guides**, not hard rules.

### Persona A – Creative Night Owl Introvert

- Core Values: Creativity (1), Autonomy (2), Growth (3)  
- Personality: Introvert, Planner, Big-picture, Change-seeking, Intense  
- Energy: Evening chronotype, focus windows at 10:00–12:00 and 20:00–23:00, low social energy  
- Flags: Freelancer, Financial pressure, Career transition  

**How HumanOS should behave:**

- Life Map:
  - Suggest domains like *Creative Work*, *Financial Stability*, *Personal Growth*.
  - Propose projects such as *“Build a portfolio site”* or *“Finish a 3-month creative challenge”*.

- Daily OS:
  - Reserve morning for admin/light tasks.
  - Put deep creative work into the late-morning and evening focus blocks.
  - Avoid many meetings; spread them out.

- Journal & Mood:
  - Check-ins that ask about creative satisfaction and overwhelm rather than social life.

- Automations:
  - Reminders for creative blocks around evening focus times.
  - Soft nudges for rest and breaks due to “Intense” + “Financial pressure” flags.

---

### Persona B – Extroverted Morning Parent

- Core Values: Family (1), Connection (2), Security (3)  
- Personality: Extravert, Planner, Detail-focused, Stable, Calm  
- Energy: Morning chronotype, focus windows at 06:00–08:00 and 09:00–11:00, high social energy  
- Flags: Parent of young children, Full-time employee  

**How HumanOS should behave:**

- Life Map:
  - Strong domains for *Family*, *Career*, and *Health/Energy*.
  - Goals balanced between family time and career progression.

- Daily OS:
  - Place deep work blocks in early morning before family or work interruptions.
  - Use social energy to schedule collaborative work and mentoring.
  - Suggest realistic plans considering parenting responsibilities.

- Journal & Mood:
  - Prompts that ask about balance between family and work, not just productivity.

- Automations:
  - Morning routines that respect school runs or childcare.
  - Gentle, stable habits rather than frequent changes.

---

## 5. Safety, ethics, and boundaries

When using Self OS data, HumanOS must follow these principles:

1. **No clinical labels.**  
   - The system never diagnoses conditions. It only reflects user-provided patterns and language.

2. **Transparency.**  
   - When a suggestion is based on Self OS data, the UI should make that clear:
     - *“Because you said you are a Night Owl, we’re suggesting this schedule…”*

3. **Control.**  
   - The user can always:
     - Edit their Self OS profile.
     - Turn off or soften certain types of adaptations (e.g. fewer notifications, no social suggestions).

4. **Privacy.**  
   - Self OS is among the most sensitive data in HumanOS and should:
     - Be stored securely.
     - Never be shared with others or third-party services without explicit consent.

---

## 6. Integration guidelines for future features

When adding new features or flows, developers and AI agents should:

1. **Check Self OS first.**
   - Before asking about values, energy, or personality → read from `SelfOsProfile`.

2. **Respect existing choices.**
   - Do not overwrite or ignore the profile.
   - If you need more detail, build on top of what is already there.

3. **Log meaningful changes.**
   - If a new flow suggests updating Self OS (e.g. chronotype clearly changed), do it explicitly and explain to the user.

4. **Document dependencies.**
   - Any new feature that relies on Self OS should mention it in its spec and architecture notes.

---

## 7. Open questions & future directions

- How often should the user be invited to **revisit** Self OS (e.g. every 3–6 months, after major life events)?
- Should we support **multiple “modes”** or profiles (e.g. “Work Mode Self” vs “Parent Mode Self”) and switch between them?
- How should long-term graphs (values, energy, flags) appear in the Journal & Mood OS timeline?
- What is the right balance between **automation** (system adapts silently) and **explicit choices** (system asks before changing behaviours)?

These questions should be explored in later versions (`v0.2+` and beyond). For now, this document defines the **baseline contract**:  
> Self OS is the primary source of personalization in HumanOS, and all major pillars should read from it and respect it.
