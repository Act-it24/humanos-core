# Self Image Assessments – Technical Spec (v0.1)
**File:** `docs/26_self_image_assessment_spec.md`  
**Version:** v0.1  
**Status:** Draft – Implementation Spec  
**Depends on:**  
- `docs/20_self_os_blueprint.md`  
- `docs/24_self_image_assessment_blueprint.md`  
- `docs/25_self_os_onboarding_spec.md`  
- `docs/30_kernel_ui_mapping.md`  

---

## 1. Scope & Objectives

This spec translates the **Self Image Assessments blueprint** into concrete implementation details for the **web frontend** (Vite + React, plain JS).

**Goals for v0.1 implementation:**

- Extend the existing **Self OS** feature with:
  - A dedicated **“Self Image & Assessments”** section on `SelfOSPage`.
  - One or more **modal-based wizards** for psychological assessments.
- Introduce a **structured assessments subtree** inside the `SelfOsProfile` model.
- Implement at least **one real assessment flow (Big Five)** end-to-end:
  - Question UI → scoring → summary → stored in profile.
- Provide **UI scaffolding and placeholders** for other assessments (Strengths, Attachment, EQ, Clinical screens) to be filled in with full item banks later.

No backend or persistence is added in v0.1.  
All data remains in **local React state**.

---

## 2. UX & Layout Requirements

### 2.1 Location in the UI (SelfOSPage)

The Self Image module lives **inside Self OS**, not as a top-level tab.

On `SelfOSPage.jsx`, after the existing Self OS summary (values, personality, energy, flags):

- Add a section titled **“Self Image & Assessments”** using the shared `Section` component.
- Inside that section, render **three cards**, using the shared `Card` + `Button`:

1. **Core Personality & Strengths**
   - Short description: what it covers and why it matters.
   - Primary button: `Explore core personality`
   - Secondary text link/button: `View last results` (disabled if none).

2. **Relational & Emotional Style**
   - Short description.
   - Primary button: `Explore relational & emotional style`
   - Secondary: `View last results` (disabled if none).

3. **Advanced & Clinical Screens**
   - Safety-oriented description (non-alarming).
   - Primary button: `Check advanced screens`
   - Secondary: link to learn more / disclaimers.

Each primary button opens a **modal wizard**.  
The Self OS page remains visually clean; no long assessments inline.

### 2.2 Modal Behavior & Visuals

Create a reusable modal component:

- File: `web/src/components/Modal.jsx`
- Behavior:
  - Full-screen overlay with semi-transparent dark background.
  - Centered content container with:
    - Max-width ~ 720–800px on desktop.
    - Full-width (with padding) on mobile.
  - Close actions:
    - “X” icon/button in the top-right of the modal.
    - Clicking on the overlay outside the content.
    - `Esc` key if feasible.
- Content layout:
  - Header area:
    - Title (e.g. “Big Five – Core Personality”).
    - Optional subtitle.
  - Body area:
    - Assessment wizard content.
  - Footer area:
    - Left: secondary button (“Cancel” / “Back to Self OS”).
    - Right: primary action (“Next”, “Save & Close”, etc.).

Use existing typography & spacing conventions from `App.css` and other components.  
Do **not** introduce new design systems or CSS frameworks in this pass.

### 2.3 Wizard Interaction Pattern

All assessment wizards follow a shared structure:

1. **Step 0 – Intro**
   - Explain in simple language:
     - What this assessment does.
     - Approximate duration (e.g. “5–7 minutes”).
     - How results will be used in HumanOS.
   - Buttons:
     - Primary: `Start`
     - Secondary: `Cancel` / `Not now`

2. **Steps 1..N – Question screens**
   - Each screen shows a manageable subset of questions:
     - Big Five: 4–6 statements per screen.
     - Other assessments can choose similar clustering.
   - Use a consistent response format per assessment:
     - Big Five: Likert 1–5 (“Strongly disagree” → “Strongly agree”).
     - Attachment/EQ: Likert or similar.
   - Display a **progress indicator**:
     - e.g. “Step 3 of 7” plus a thin progress bar.

3. **Final Step – Summary**
   - Show the **human-readable summary** and visual cues:
     - e.g. bars/meters for each Big Five trait.
   - Provide 2–4 bullet insights.
   - Optional toggle: `Show advanced details` to reveal more technical info.
   - Buttons:
     - Secondary: `Back`
     - Primary: `Save to my Self OS profile`

4. **Save & Close**
   - Build an assessment object (see Data Model).
   - Merge into `SelfOsProfile.assessments`.
   - Close modal and update `SelfOSPage` summary.

---

## 3. Assessment Catalog & MVP Scope

This spec covers **all planned assessments** conceptually, but defines a clear **MVP scope** for the first implementation pass.

### 3.1 Full Conceptual Set (from blueprint)

- Big Five / OCEAN (traits)
- Strengths / talents (Clifton-style, non-infringing)
- Values refinement (extend existing Self OS values)
- MBTI-like type indicator (non-proprietary implementation)
- DiSC-like behavioural profile (non-proprietary)
- Adult Attachment style
- Emotional Intelligence (EQ)
- Depression screen (BDI-style, non-proprietary)
- Anxiety / Burnout screens (future)

### 3.2 Implementation Scope for v0.1

For this first implementation:

1. **Fully implemented flow (UI + scoring + profile integration):**
   - **Big Five** (core personality traits).

2. **Partial UI scaffolding (modal + steps + placeholder questions, no final scoring logic yet or minimal scoring):**
   - **Relational & Emotional Style**:
     - Attachment style – simple prototype (short form, 8–12 items).
     - Emotional Intelligence – prototype (10–12 items).
   - **Advanced & Clinical Screens**:
     - Depression screen – **short, non-diagnostic** prototype (6–8 items).
     - Anxiety/Burnout – placeholders only (marked “Coming soon”).

3. **Not implemented yet (UI placeholders only, no wizard):**
   - MBTI-like type.
   - DiSC-like behaviour.
   - Full Strengths assessment (can be future separate module).

The UI should clearly label non-implemented parts as **“Not available yet”** or **“Coming soon”** and disable their action buttons.

---

## 4. Data Model – Frontend Shapes

All models are implemented in **plain JavaScript** but documented in TypeScript-style comments.

### 4.1 Extending SelfOsProfile

Location: `web/src/features/self-os/selfOsModel.js`

Add an `assessments` subtree to `SelfOsProfile`.  
Existing fields (values, personality, energy, flags, notes) remain unchanged.

```ts
/**
 * @typedef {Object} TraitScore
 * @property {number} score       // 0–100 normalized
 * @property {'low'|'medium'|'high'} band
 * @property {string} label       // short human label e.g. "High openness"
 */

/**
 * @typedef {Object} BigFiveAssessment
 * @property {'bf_v1'} version
 * @property {string} takenAt          // ISO date
 * @property {string=} updatedAt       // ISO date, optional
 * @property {{ 
 *   openness: TraitScore,
 *   conscientiousness: TraitScore,
 *   extraversion: TraitScore,
 *   agreeableness: TraitScore,
 *   neuroticism: TraitScore
 * }} traits
 * @property {{ [itemId: string]: number }} rawScores // 1–5 Likert responses
 * @property {string[]} primaryLabels   // e.g. ["High openness", "Low neuroticism"]
 * @property {string[]} insights        // 2–6 bullet-point insights for UI
 * @property {'private'|'shared'|'hidden'} visibility
 * @property {boolean} isArchived
 */

/**
 * @typedef {Object} AttachmentAssessment
 * @property {'attach_v1'} version
 * @property {string} takenAt
 * @property {string=} updatedAt
 * @property {{ anxiety: number, avoidance: number }} dimensions // 0–100
 * @property {string} styleLabel    // e.g. "Secure", "Anxious", "Avoidant", "Fearful"
 * @property {string[]} insights
 * @property {'private'|'shared'|'hidden'} visibility
 * @property {boolean} isArchived
 */

/**
 * @typedef {Object} EmotionalIntelligenceAssessment
 * @property {'eq_v1'} version
 * @property {string} takenAt
 * @property {string=} updatedAt
 * @property {{ 
 *   selfAwareness: number,
 *   selfRegulation: number,
 *   motivation: number,
 *   empathy: number,
 *   socialSkills: number
 * }} dimensions
 * @property {string[]} insights
 * @property {'private'|'shared'|'hidden'} visibility
 * @property {boolean} isArchived
 */

/**
 * @typedef {Object} DepressionScreenAssessment
 * @property {'dep_v1'} version
 * @property {string} takenAt
 * @property {string=} updatedAt
 * @property {number} severityScore    // 0–100 normalized
 * @property {'none'|'mild'|'moderate'|'severe'} severityBand
 * @property {string[]} insights
 * @property {boolean} crisisFlag      // true if scores suggest high risk
 * @property {'private'|'hidden'} visibility
 * @property {boolean} isArchived
 */

/**
 * @typedef {Object} SelfOsAssessments
 * @property {BigFiveAssessment=} bigFive
 * @property {AttachmentAssessment=} attachment
 * @property {EmotionalIntelligenceAssessment=} emotionalIntelligence
 * @property {DepressionScreenAssessment=} depressionScreen
 * // placeholders for future:
 * // @property {any=} strengths
 * // @property {any=} mbtiLike
 * // @property {any=} discLike
 * // @property {any=} anxietyScreen
 * // @property {any=} burnoutScreen
 */

/**
 * @typedef {Object} SelfOsProfile
 * @property {Array<any>} values
 * @property {Object} personalitySummary
 * @property {Object} energy
 * @property {Array<any>} flags
 * @property {string=} notes
 * @property {SelfOsAssessments} assessments
 * @property {string} createdAt
 * @property {string} updatedAt
 */

Add or update helper functions:

/**
 * @returns {SelfOsAssessments}
 */
export function createEmptyAssessments() {
  return {
    bigFive: undefined,
    attachment: undefined,
    emotionalIntelligence: undefined,
    depressionScreen: undefined,
    // future: strengths, mbtiLike, etc.
  };
}

/**
 * @param {SelfOsProfile} profile
 * @returns {boolean}
 */
export function hasAnyAssessments(profile) {
  const a = profile.assessments || {};
  return !!(a.bigFive || a.attachment || a.emotionalIntelligence || a.depressionScreen);
}

/**
 * @param {SelfOsProfile} profile
 * @param {Partial<SelfOsAssessments>} partial
 * @returns {SelfOsProfile}
 */
export function mergeAssessments(profile, partial) {
  const nextAssessments = {
    ...(profile.assessments || createEmptyAssessments()),
    ...partial,
  };
  return {
    ...profile,
    assessments: nextAssessments,
    updatedAt: new Date().toISOString(),
  };
}


4.2 Big Five Scoring Helper

Create small utility functions for Big Five:

File: web/src/features/self-os/selfImageScoring.js (or inside selfOsModel.js if small).

Responsibilities:

Map item responses (itemId → Likert 1–5) to five trait scores.

Normalize to 0–100.

Assign band (low / medium / high).

Generate short labels (e.g. “Very high openness”) and 3–5 insights.

Implementation can be simple for v0.1; exact psychometric mapping can be refined later.

5. Component & File Plan
5.1 New Components / Files

web/src/components/Modal.jsx

Generic modal container as described in Section 2.2.

web/src/features/self-os/SelfImageSection.jsx

Renders the “Self Image & Assessments” section on the Self OS page.

Props:

profile (SelfOsProfile)

onUpdateProfile(nextProfile)

Contains the three cards and handles opening/closing modals.

web/src/features/self-os/BigFiveWizard.jsx

Modal content component for Big Five.

Props:

initialResult (BigFiveAssessment | null)

onCancel()

onSave(result: BigFiveAssessment)

Implements:

Step 0: intro

Steps 1..N: questions

Final: summary + save.

web/src/features/self-os/AttachmentWizard.jsx (prototype)

Same pattern as BigFiveWizard, but with smaller item set.

v0.1 may have minimal scoring or even “prototype only” scoring.

web/src/features/self-os/EmotionalIntelligenceWizard.jsx (prototype)

Same pattern; summary can be qualitative at first.

web/src/features/self-os/ClinicalScreensWizard.jsx (prototype)

Short depression screen with simple scoring and clear disclaimers.

Anxiety/Burnout: placeholders with “Not available yet” messaging.

Optional item bank file:

web/src/features/self-os/selfImageItems.js

Expose item arrays:

bigFiveItems

attachmentItems

eqItems

depressionItems

Each item: { id, text, dimensionKey, reverseScored? }

Important: Items must be written originally by HumanOS and not copied from proprietary tests.

5.2 Modifications to Existing Files

web/src/features/self-os/selfOsModel.js

Add assessments to SelfOsProfile.

Implement createEmptyAssessments, hasAnyAssessments, mergeAssessments.

If a createEmptySelfOsProfile function exists, initialize assessments with createEmptyAssessments().

web/src/features/self-os/SelfOSPage.jsx

Import and render SelfImageSection within the page layout.

Pass profile and setProfile/onUpdateProfile to the section.

Ensure existing Self OS onboarding wizard continues to work unchanged.

docs/30_kernel_ui_mapping.md

Update Self OS section to include:

SelfImageSection.jsx

BigFiveWizard.jsx

Other wizard components.

Note implementation status: Big Five = implemented; others = prototype.

6. Big Five Wizard – Detailed Flow (v0.1)
6.1 Item Set (Conceptual)

Target length for production: 20–40 items.

v0.1 may start with 10–20 items per dimension, or fewer for a prototype.

Items are statements like:

“I enjoy exploring new ideas and experiences.”

“I like to have a detailed plan before starting something important.”

Response scale (Likert 1–5):

1 – Strongly disagree

2 – Disagree

3 – Neutral

4 – Agree

5 – Strongly agree

Each item is associated with:

A target trait (O, C, E, A, or N).

Direction (normal or reverse-scored).

6.2 UI Steps

Step 0: Intro

Title: “Big Five – Core Personality”

Copy: friendly, non-technical explanation.

Start / Cancel buttons.

Steps 1..N: Questions

Show 4–6 statements per step.

For each item:

Statement text.

5 selectable buttons or radio options.

Back/Next buttons.

Step N+1: Summary

Show a list of traits with:

Trait name.

Label (e.g., “High”).

Short one-line interpretation.

Optional: horizontal bars (CSS) showing 0–100.

Insights bullet list.

Save:

Build BigFiveAssessment object.

Call onSave(result) which will:

Use mergeAssessments(profile, { bigFive: result }).

Update page state + close modal.

7. Safety & Copy Guidelines (UI)

Never claim:

“This is who you really are in absolute terms.”

“This predicts your success or failure.”

Prefer formulations like:

“People with similar patterns often find that…”

“This suggests that you may be more comfortable with…”

Clinical screens:

Add clear disclaimers:

“This is not a diagnosis.”

“If you feel at risk, consider contacting a professional or local helpline.”

Avoid red/ alarming visuals; prefer neutral tones and calm language.

8. Non-Functional Requirements

Performance:

Item arrays are static and local; no network calls.

Wizards should remain responsive on mid-range mobile devices.

Accessibility:

Modal should trap focus when open.

Keyboard navigation (Tab, Shift+Tab).

Sufficient contrast for text and interactive elements.

Testability (manual for now):

After implementation, a tester should be able to:

Open Big Five wizard, answer items, see summary, save.

Reopen Big Five wizard and see previous answers loaded.

See Big Five summary reflected on Self OS page.

9. Open Questions / TODO (for future specs)

Exact item banks and licensing for trait measures and screens.

How many items is the optimal trade-off between precision and fatigue?

Whether to allow “skip item” and how that affects scoring.

How to visualize multiple assessment histories over time (graphs, timelines).

How to connect assessments to AI agents in a safe, explainable way.

These will be refined in later versions of this spec and in separate item-bank documents.