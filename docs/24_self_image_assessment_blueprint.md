# Self Image Assessments – Blueprint  
**File:** `docs/24_self_image_assessment_blueprint.md`  
**Version:** v0.1  
**Status:** Baseline  
**Depends on:**  
- `docs/20_self_os_blueprint.md`  
- `docs/25_self_os_onboarding_spec.md`  
- `docs/10_product_blueprint_overview.md`  

---

## 1. Purpose & Role in HumanOS

The **Self Image Assessments** module is the analytical backbone of the **Self OS** pillar.  
It is responsible for building a deep, multi-dimensional psychological picture of the user by combining:

- **Personality structure** (traits, types, behavioural styles).  
- **Strengths & talents** (what the person is naturally good at).  
- **Relational & attachment patterns** (how they connect with others).  
- **Emotional skills** (how they perceive, process, and regulate emotions).  
- **Clinical risk indicators** (depression, anxiety, burnout) – used carefully, non-diagnostically.

This module does **not** define an objective “truth” about the user.  
It models:

> “How the user tends to see themselves and how they tend to show up in the world,  
> using validated psychological frameworks, to support better decisions and healthier lives.”

The output of this module serves as a **shared context layer** for:

- **Life Map OS** – goal alignment with values, traits, strengths.  
- **Daily OS** – planning that respects energy, temperament, and mental state.  
- **Journal & Mood OS** – pattern detection and psycho-educational insights.  
- **Relations / Social OS (future)** – attachment-aware relationship guidance.  
- **AI Co-pilot & agents** – deeply personalized tone, pacing, and strategies.

---

## 2. Design Principles

1. **Evidence-informed, not buzzword-driven**  
   - Prefer models and instruments with strong psychometric and research backing.  
   - When using popular tools with weaker validity (e.g. MBTI), clearly frame them as reflective lenses, not scientific diagnoses.

2. **Non-pathologizing & non-deterministic**  
   - No “good” or “bad” personalities.  
   - Describe traits and styles as **patterns with trade-offs**, not as flaws.  
   - Emphasize growth, plasticity, and context (“this is how you *tend* to operate, not who you *must* be”).

3. **Layered depth (simple → deep)**  
   - First view: simple, visual, human-readable summaries.  
   - Second view: deeper explanations, strengths, risks, and practical suggestions.  
   - Third view (optional): technical detail for advanced users (e.g., scores, dimensions, references).

4. **User control & consent**  
   - Assessments are **modular and optional**, especially advanced and clinical ones.  
   - The user chooses which tests to take and can hide or archive results.  
   - Expose clear explanations of *what each assessment is for* and *how it will be used*.

5. **Privacy & safety first**  
   - Treat assessment results as **sensitive data**.  
   - Strong encryption, minimal necessary retention, and clear UX around who/what can access them.  
   - Clinical-adjacent results (e.g. high depression indicators) must trigger **supportive, ethical flows**, not automated decisions.

6. **Interpretable outputs, not raw scores**  
   - Internal models can store numerical scores.  
   - The UI should mostly present **interpreted, contextualized summaries** and **actionable insights**.

---

## 3. Supported Assessments – Conceptual Catalog

This blueprint defines *which* assessment families HumanOS will support and *why*.  
Implementation will be phased (see Section 8).

### 3.1 Core Personality & Strengths (Tier 1 – Core)

These are foundational and should be available to most users.

1. **Big Five / OCEAN (traits)**  
   - **Role:** Scientifically robust model of personality (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism).  
   - **Use:**  
     - Tailor Daily OS planning (structure vs flexibility, social vs solo).  
     - Inform Life Map about realistic goal strategies.  
     - Feed AI co-pilot with temperament info (how to nudge, how much structure).  
   - **Implementation note:** Use **open, IP-licensed item pools** (e.g. IPIP-based) – *never* ship proprietary BFI/NEO items verbatim.

2. **Strengths / Talents (Clifton-style, but non-infringing)**  
   - **Role:** Identify the user’s top 4–6 *talent themes* (e.g. strategic thinking, empathy, creativity, execution).  
   - **Use:**  
     - Link strengths to projects and roles in Life Map.  
     - Suggest “strength-based” strategies inside Daily OS.  
     - Provide affirming, motivational context in the Self OS profile.  
   - **Implementation note:**  
     - Either integrate with an external API (if licensed) **or** design a “strength themes” model inspired by positive psychology but implemented with original items.

3. **Values & Life Priorities (already partly covered in Self OS onboarding)**  
   - **Role:** Clarify what truly matters to the user (e.g. autonomy, security, creativity, family, impact).  
   - **Use:**  
     - Anchor Life Map goals to values.  
     - Explain conflicts (e.g. high “security” vs high “adventure”).  
   - **Implementation note:** This is already present in Self OS onboarding; Self Image should be able to refine and extend it over time.

### 3.2 Styles & Types (Tier 2 – Advanced, optional)

These tools are popular and intuitive but less “hard-science”. They are useful as reflective lenses if framed properly.

4. **MBTI-style type indicator (16 types)**  
   - **Role:** Provide an accessible, narrative “type story” (e.g. “INTJ – architect”).  
   - **Use:**  
     - Help users reflect on how they process information and decide (Thinking/Feeling, Sensing/Intuition).  
     - Support communication tips in relationship and team contexts.  
   - **Caveats:**  
     - Limited psychometric robustness; results can change, categories are coarse.  
     - Must be explicitly framed as a *lens*, not a diagnosis or hiring tool.  
   - **Implementation note:**  
     - Do **not** reuse proprietary MBTI items or trademarks.  
     - Implement a functionally similar, original item set that maps to four preference dimensions and a 4-letter code.

5. **DiSC-style behavioural profile**  
   - **Role:** Describe behavioural style in collaboration and work: Dominance, Influence, Steadiness, Conscientiousness.  
   - **Use:**  
     - Guide team collaboration tips and conflict resolution strategies.  
     - Customize Work OS interactions and notifications (direct vs relational tone).  
   - **Caveats:**  
     - Not predictive of job performance; use for communication only.  
   - **Implementation note:**  
     - Implement a **DiSC-inspired** quadrant model with original items, not a clone of a specific commercial product.

### 3.3 Relational & Emotional (Tier 2–3 – Advanced / Sensitive)

6. **Adult Attachment Style**  
   - **Role:** Assess patterns in close relationships (Secure, Anxious, Avoidant, Fearful).  
   - **Use:**  
     - Provide psycho-education and reflection in a future **Relations OS**.  
     - Help AI co-pilot respond with sensitivity to relational triggers.  
   - **Caveats:**  
     - Highly sensitive; results must be presented gently and with clear explanation.  
   - **Implementation note:**  
     - Use a dimensional model (Anxiety × Avoidance) and derive labels from that.  
     - Base item design on public research (not copying any specific proprietary scale).

7. **Emotional Intelligence (EQ)**  
   - **Role:** Measure self-reported skills in: self-awareness, self-regulation, motivation, empathy, and social skills.  
   - **Use:**  
     - Suggest specific micro-practices (e.g. journaling prompts, empathy exercises).  
     - Support leadership and relationship-oriented modules.  
   - **Implementation note:**  
     - Use a trait-EI questionnaire format with original item wording, inspired by established models (e.g., Goleman-style domains).

### 3.4 Clinical Risk Screens (Tier 3 – Sensitive, opt-in)

These are **screening tools**, not diagnostic tools. They must be:

- Clearly labelled as such.  
- Optional.  
- Accompanied by “what to do” guidance and resources.

8. **Depression Severity (BDI-style) – Screening**  
   - **Role:** Gauge self-reported depressive symptoms (none, mild, moderate, severe).  
   - **Use:**  
     - Adjust Daily OS expectations (e.g., reduce load, emphasize self-care).  
     - Prompt the user to seek professional help when appropriate.  
   - **Implementation note:**  
     - Do **not** ship the proprietary BDI item text.  
     - Implement an original, short depression symptom checklist inspired by DSM criteria and public-domain items.  

9. **Anxiety / Burnout Screeners (future)**  
   - **Role:** Similar approach for generalized anxiety and burnout risk.  
   - **Use:**  
     - Help the user recognize overload and restructure commitments via Life Map and Daily OS.  
   - **Implementation note:**  
     - Use short, public-domain or original items based on well-established criteria.

---

## 4. User Experience & Flows

### 4.1 Self Image Area inside Self OS

The **Self OS tab remains the main home**. Within it, Self Image appears as a **dedicated card/section**, not a separate top-level tab (for now).

Structure on `SelfOSPage`:

- **Section: “Self Image & Assessments”**  
  - Short explainer:  
    > “Here you can explore structured reflections on your personality, strengths, relationships, and emotional skills.”  
  - One or more **cards with primary buttons**:
    - **“Core Personality & Values”**  
      - Big Five, values refinement, strengths.  
    - **“Relational & Emotional Style”**  
      - Attachment style, EQ.  
    - **“Advanced & Clinical Screens”**  
      - Depression/Anxiety/Burnout check-ins (with warning icon and safety text).

Each button opens a **modal wizard** (overlay) rather than navigating away, to keep the main Self OS page clean and visually uncluttered.

### 4.2 Assessment Wizard Pattern

All assessments follow a shared UX pattern:

1. **Intro step**  
   - Plain-language explanation of:
     - What this assessment measures.  
     - How long it takes.  
     - How the results will be used.  
   - Example: “This helps us understand your broad personality traits so we can better tailor your plans and suggestions.”

2. **Question steps (1–N screens)**  
   - Each screen shows a small cluster of items (e.g. 3–6 statements) to avoid fatigue.  
   - Responses via Likert scale, sliders, or forced-choice depending on the assessment.  
   - Persistent **progress indicator** (“Step 3 of 7”).

3. **Review & Summary step**  
   - High-level summary:
     - Visual (chart or simple meter).  
     - 2–3 key insights in human language.  
   - Optional “Show advanced detail” toggle.

4. **Save & Apply**  
   - Button: “Save to my Self OS profile”.  
   - On save:
     - Update the Self OS profile model.  
     - Trigger any relevant “hooks” (e.g. mark that Big Five is now available to Daily OS).  
   - Offer “Remind me to revisit this in X months” for dynamic traits (EQ, mood etc.).

5. **Exit behaviours**  
   - “Save draft and exit” (for longer assessments).  
   - “Discard and exit” with clear confirmation.

---

## 5. Data Model – Conceptual

At the conceptual level, Self Image enriches the **Self OS profile** with an `assessments` subtree.

```ts
// Pseudocode / conceptual model

type SelfOsProfile = {
  // existing fields: values, personality summary, energy, flags, notes...
  values: ValueSummary[];
  personalitySummary: PersonalitySummary; // high-level human summary

  assessments: {
    bigFive?: BigFiveAssessment;
    strengths?: StrengthsAssessment;
    mbtiLike?: MbtiLikeAssessment;
    discLike?: DiscLikeAssessment;
    attachment?: AttachmentAssessment;
    emotionalIntelligence?: EmotionalIntelligenceAssessment;
    depressionScreen?: DepressionScreenAssessment;
    anxietyScreen?: AnxietyScreenAssessment;
    burnoutScreen?: BurnoutScreenAssessment;
    // future: RIASEC, mindset, etc.
  };

  // meta
  createdAt: string;
  updatedAt: string;
};

Each *Assessment type should include:

version – to allow future revisions of item sets and scoring.

takenAt / updatedAt timestamps.

rawScores – internal numeric scores, normalized (e.g. 0–100 per dimension).

primaryLabels – short labels for UI (e.g. “High Openness, Low Neuroticism”).

insights – optional pre-computed bullet points for quick rendering.

isArchived / visibility – allow the user to hide results.

The exact TypeScript / JS shapes will be specified in a dedicated spec (docs/26_self_image_assessment_spec.md) before implementation.

6. Integration Points with Other Pillars

High-level examples (non-exhaustive):

Life Map OS

Use values + strengths + Big Five to suggest goal framings and strategies.

E.g. high Conscientiousness → more structured project breakdowns by default.

Daily OS

Use personality, EQ, and depression/energy screens to set realistic daily load.

E.g. on days with high depression scores, reduce suggested tasks and emphasise self-care.

Journal & Mood OS

Use Big Five (especially Neuroticism), attachment style, and EQ to contextualize mood patterns.

E.g. highlight recurring triggers consistent with high attachment anxiety.

Relations / Social OS (future)

Use attachment style, EQ, MBTI-like, and DiSC-like data to generate communication tips and conflict-handling suggestions.

AI Agents & Automations

Use the assessments subtree as a shared context file for agents:

AI life coach.

Relationship coach.

Work/career coach.

Provide clear guidelines in the agents’ charters on what they may infer and what they must not (e.g., no clinical diagnoses).

7. Safety, Ethics, and Guardrails

No clinical diagnoses

Clinical screens may indicate risk but may never be labeled as “you have depression/an anxiety disorder/etc.”.

Instead: “your responses suggest a high level of depressive symptoms; consider speaking with a professional.”

Crisis scenarios

Very high distress scores (e.g. severe depression + item patterns hinting at self-harm) must trigger:

Immediate, clear suggestion to seek help.

Links to hotlines/resources (region-specific when possible).

No automated decisions on behalf of the user.

No use in employment / financial decisions by default

HumanOS must not, by default, expose raw assessment data to employers, insurers, or other third parties.

Any API/export that exposes such data requires explicit, granular user consent.

Explainability

Always allow the user to see why a recommendation references an assessment (“This suggestion is based in part on your high Openness and low Conscientiousness scores.”).

Re-take & evolution

Allow re-taking assessments and versioning results over time.

Make it clear that personality and skills can change (especially under therapy, coaching, life events).

8. Implementation Phasing (Self Image Roadmap)

Phase SI-0 – Blueprint & model (this document)

Finalize conceptual scope and integration points.

Align with 20_self_os_blueprint.md and 25_self_os_onboarding_spec.md.

Phase SI-1 – Core non-clinical assessments (MVP)

Implement:

Big Five (using open items).

Strengths (original themes + short questionnaire).

Values refinement (extend onboarding with deeper but short follow-up).

UI:

Add “Self Image & Assessments” section to SelfOSPage.

Modal wizards for Big Five and Strengths.

Data:

Extend frontend selfOsModel with assessments.bigFive and assessments.strengths.

Local state only (no backend) in the first iteration.

Phase SI-2 – Relational & emotional style

Implement:

Attachment style (dimensional).

Emotional Intelligence (short trait-EI questionnaire).

UI:

New wizard modals under “Relational & Emotional Style”.

Integration:

Start exposing simple “relationship tips” and EQ-based micro-practices within Journal & Mood and a future Relations OS.

Phase SI-3 – Clinical risk screens

Implement short, original:

Depression screen.

Anxiety/burnout screen.

UI:

“Advanced & Clinical Screens” card with safety messaging and disclaimers.

Integration:

Hooks into Daily OS (load adjustment) and Mood OS (trend tracking).

Crisis guidance UX.

Phase SI-4 – Backend & persistence integration

Persist assessment results on the backend with encryption and access control.

Provide APIs for AI agents to query the assessments subtree, respecting user consent.

Phase SI-5 – Continuous refinement

Validate UX via user testing.

Iterate on item sets, visuals, and wording to increase clarity and reduce bias.

Add optional specialized assessments (career interests, mindset, etc.) as separate mini-modules.

9. Open Questions

Which exact open-source item pools and licenses will be used for Big Five and related trait measures?

Should long assessments (e.g. strengths) be taken in one sitting or split into micro-sessions over multiple days?

How much technical detail (e.g. percentile ranks) should be exposed to users vs. hidden for advanced views only?

How should Self Image results be visualized on mobile-first layouts without overwhelming the user?

These will be addressed in docs/26_self_image_assessment_spec.md and subsequent UI/UX specs.