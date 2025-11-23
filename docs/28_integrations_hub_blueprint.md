# Integrations Hub – App Orchestrator & Data Bridge – Feature Blueprint  
**File:** `docs/28_integrations_hub_blueprint.md`  
**Version:** v1.0 (Founding Draft)  
**Depends on:**  
- `docs/00_humanos_vision_and_principles.md`  
- `docs/10_product_blueprint_overview.md`  
- `docs/20_self_os_blueprint.md`  
- `docs/21_life_map_blueprint.md`  
- `docs/22_daily_os_blueprint.md`  
- `docs/23_journal_mood_blueprint.md`  

---

## 1. Purpose & Scope

### 1.1 Purpose

The **Integrations Hub** is how HumanOS talks to the outside digital world.

Its purpose is to:

- Connect HumanOS with the apps the user already uses (calendar, tasks, notes, files, communication tools, content platforms, health trackers, etc.).
- Allow HumanOS to **read** relevant data and, with consent, **write** back useful actions.
- Make HumanOS act as a **Life OS on top of other apps**, not as yet another isolated app.

It answers:

- “How can I see everything that matters in one place?”
- “How can my calendar, tasks, notes, and health data work together with my goals?”
- “How can HumanOS act on my behalf in other tools, safely?”

### 1.2 Scope

The Integrations Hub is responsible for:

- Managing **connections** to external apps/services.
- Enforcing **permissions and scopes** (what HumanOS can read/write).
- Providing **normalized data** (e.g., “events”, “tasks”, “notes”) to other pillars.
- Enabling **actions**:
  - Create/update events.
  - Create/update tasks.
  - Store links/attachments in knowledge tools.
- Exposing a clean, stable **API layer** for AI agents and automations.

It is **not**:

- A replacement for all other apps.
- A hidden data-harvesting layer.
- A “black box” that acts in external services without the user understanding or consenting.

### 1.3 Relation to the Kernel

Integrations Hub is a **KERNEL pillar** in terms of infrastructure and UX:

- Daily OS relies on calendar and task data.
- Life Map may link to external docs, boards, or repos.
- Journal & Mood may be augmented with context from communication and work apps.
- AI Co-pilot & Automations need a consistent way to interact with external services.

However, the **v1 scope must be minimal** and opinionated, focusing on a small number of high-impact integrations (e.g., calendar + one task app / internal tasks).

---

## 2. User Problems & Goals

### 2.1 Typical problems

The Integrations Hub addresses user frustrations like:

- “My life is scattered across multiple apps, and I’m constantly switching between them.”
- “I can’t see all my commitments in one place.”
- “I don’t trust tools that connect to everything and then act on their own.”
- “I don’t want to migrate everything to a new app; I want something that works with what I already use.”

### 2.2 Desired outcomes

From the user’s perspective, the Integrations Hub is successful if:

- They can see **a unified picture** of time, tasks, and key resources, without duplicating everything manually.
- They feel **in control** of:
  - What is connected.
  - What is read.
  - What is written.
- They get **concrete benefits**:
  - Better daily plans (because HumanOS sees their calendar).
  - Less double entry (e.g., tasks created once but visible where needed).
- They never feel that HumanOS is “doing things behind their back”.

---

## 3. Scope In / Scope Out (v1 vs. Future)

### 3.1 Scope In (v1)

For v1, Integrations Hub should focus on a **small, high-leverage set** of integrations:

1. **Calendar Integration (Core)**  
   - At least one major provider (e.g., Google Calendar in early implementations).
   - Capabilities:
     - Read upcoming and past events (within a reasonable time window).
     - Write:
       - New events or time blocks, when the user explicitly approves.
     - Metadata:
       - Event title, time, duration, location, attendees.
   - Usage:
     - Daily OS sees real obligations.
     - Planning Agent avoids double-booking and overload.

2. **Task Integration (Minimal or Internal)**  
   Two options:
   - **Option A (Internal-first):**  
     - Tasks live primarily inside HumanOS (Life Map + Daily OS).
     - External task apps are a future feature.
   - **Option B (Single external app):**  
     - Integrate with one simple task tool.
     - Capabilities:
       - Read tasks (e.g., incomplete tasks assigned to the user).
       - Optionally create tasks from HumanOS into that tool.

   For v1, **Option A (internal tasks)** is acceptable and might be simpler.

3. **Authentication & Permissions UI**
   - Clear flow to:
     - Connect a service.
     - See what HumanOS can do with it.
     - Revoke access.
   - Use standard OAuth flows where possible.

4. **Basic Data Normalization**
   - Internally, represent:
     - Events in a unified format (regardless of provider).
     - Tasks in a unified format (whether internal or external).
   - Expose a clean API to other pillars and AI agents.

5. **Simple Sync Strategy**
   - Basic principles:
     - Pull updates at reasonable intervals or via webhooks where available.
     - Avoid aggressive background operations that surprise users.
     - Prioritize **correctness and safety** over instant real-time sync.

### 3.2 Scope Out (Future)

Out of scope for v1, but important for later phases:

- Multiple calendars and complex merging rules.
- Deep integrations with:
  - Email.
  - Chat tools (Slack, Teams, WhatsApp, etc.).
  - Project management tools (Notion, ClickUp, Asana, Jira, etc.).
  - Code repos (GitHub, GitLab).
  - Content platforms (YouTube, TikTok, blogs).
  - Health trackers and wearables.
- Two-way complex sync and conflict resolution.
- Organization-level integrations with SSO and admin controls.
- Full-blown “app automations” similar to Zapier/IFTTT (this overlaps with the AI & Automation Studio in `2A`).

---

## 4. Core Concepts & Data Model (Conceptual)

Integrations Hub provides a **conceptual layer** between external services and the internal Life Graph.

### 4.1 Entities

- **`IntegrationProvider`**
  - Represents a type of external service (e.g., Google Calendar).
  - Fields (conceptual):
    - `id`
    - `name`
    - `type` (`calendar`, `tasks`, `files`, `communication`, etc.)
    - `status` (`available`, `beta`, `deprecated`)

- **`IntegrationConnection`**
  - Represents a specific user’s connection to a provider.
  - Fields:
    - `id`
    - `user_id`
    - `provider_id`
    - `scopes` (what this connection is allowed to read/write)
    - `status` (`connected`, `revoked`, `error`)
    - `created_at`, `updated_at`
    - `last_sync_at` (optional)

- **`ExternalEvent`**
  - Represents a calendar event pulled from an external provider.
  - Fields:
    - `id`
    - `connection_id`
    - `external_id`
    - `title`
    - `start_time`, `end_time`
    - `is_all_day`
    - `location` (optional)
    - `is_private` (if provider exposes)
    - `raw_payload` (optional, or stored separately)

- **`ExternalTask`**
  - Represents a task from an external tool (if used).
  - Fields:
    - `id`
    - `connection_id`
    - `external_id`
    - `title`
    - `status`
    - `due_date` (optional)
    - `link_url` (to open in original app)
    - `raw_payload` (optional)

- **`SyncLog`**
  - Minimal trace of sync operations.
  - Fields:
    - `id`
    - `connection_id`
    - `timestamp`
    - `direction` (`import`, `export`)
    - `result` (`success`, `error`)
    - `summary` (for debugging, not user-facing)

### 4.2 Relationships

- `User` **has many** `IntegrationConnections`.
- `IntegrationConnection` **belongs to** one `IntegrationProvider`.
- `IntegrationConnection` **has many** `ExternalEvents` and/or `ExternalTasks`.
- Other pillars (Daily OS, Life Map, etc.) **read from** normalized events/tasks, not from raw provider-specific formats.

---

## 5. Key User Journeys

### 5.1 Connecting a Calendar for the First Time

**Goal:** Make connection simple, transparent, and obviously beneficial.

1. During onboarding or early use, Daily OS asks:
   - “Do you want HumanOS to see your calendar so it can plan realistically?”
2. User clicks “Connect calendar”.
3. Flow:
   - See a clear explanation:
     - What will be read (events).
     - What might be written (optional time-blocks).
   - User is redirected to OAuth consent page.
   - On success:
     - Connection is created.
     - Past & upcoming events (e.g., ±30 days) are imported.
4. Daily OS:
   - Immediately shows a “Today/This Week” view that includes real events.
   - Explains how it will use this data.

### 5.2 Managing Integrations

**Goal:** Give users control and visibility over connections.

- User opens **Integrations** screen:
  - Sees list of:
    - Connected services.
    - Available (but not yet connected) services.
- For each connected service:
  - Shows:
    - Provider name.
    - Type (calendar, tasks…).
    - Scopes (read-only / read-write).
    - Last sync time.
  - Actions:
    - “View details”.
    - “Pause sync”.
    - “Disconnect” (revokes tokens, deletes or anonymizes stored external data where possible).

### 5.3 Using Integrated Data in Daily Planning

**Goal:** Seamlessly incorporate external events into Daily OS.

- When user opens Today / This Week:
  - HumanOS:
    - Displays external events as part of the day.
    - Marks them clearly as “from calendar X”.
- AI Planning Agent:
  - Respects fixed events as constraints.
  - Suggests:
    - When there is free time for deep work or rest.
  - Avoids:
    - Scheduling HumanOS tasks over critical external meetings.

### 5.4 Writing Back (Optional v1 behaviour)

**Goal:** Show that HumanOS can “act” in other tools, but only with explicit user intent.

- When user confirms a focused deep work block:
  - HumanOS proposes:
    - “Would you like me to block this in your calendar from 10:00–12:00?”
- If user accepts:
  - Integrations Hub:
    - Creates the event through the provider’s API.
- The user:
  - Always sees:
    - What is being created.
    - Which calendar it goes to.

---

## 6. Interactions with Other Pillars

### 6.1 Self OS

- Self OS provides:
  - Constraints to AI agents:
    - E.g., do not schedule intense blocks early for night owls.
- Integrations Hub provides:
  - Real-time context:
    - “You already have 3 social events this week, which might be high for your typical pattern.”

### 6.2 Life Map OS

- Life Map:
  - Defines goals and projects.
- Integrations Hub:
  - May link:
    - Projects/Goals to external artifacts (docs, boards, repos).
  - Future:
    - Integration with tools like GitHub, Notion, ClickUp, etc.

### 6.3 Daily OS

- Main consumer of:
  - `ExternalEvent` and `ExternalTask` data.
- Uses:
  - Unified view of obligations to design today/this week.

### 6.4 Journal & Mood OS

- Journal & Mood:
  - Might display context:
    - “Today included 4 meetings and 2 deadlines from your calendar.”
  - Patterns:
    - Emotional states correlated with heavy/light calendar days.

### 6.5 AI Agents & Automation Studio

- Agents:
  - Use Integrations Hub as the **only gateway** to external apps.
- Automation Studio:
  - Defines:
    - Triggers involving external events/tasks (future).
  - E.g., “When a new event with keyword ‘interview’ appears, help me prepare.”

---

## 7. AI Involvement

### 7.1 Roles

- **Integrations Agent**
  - Helps user:
    - Understand what integrations are useful.
    - Configure them.
    - Troubleshoot basic issues (“Calendar disconnected, please reconnect.”).

- **Planning & Context Agents**
  - Consume integrated data to:
    - Build realistic plans.
    - Provide context in reviews.
    - Suggest actions (e.g., blocking time, adding tasks).

### 7.2 Allowed actions

AI may:

- Suggest connecting:
  - A calendar or task tool when it clearly improves planning.
- Propose:
  - Writing back specific events/tasks (with full explanation).
- Use:
  - Integrated data purely to benefit the user’s experience in HumanOS, aligned with the Charter.

### 7.3 Forbidden actions

AI must **not**:

- Secretly enable new integrations.
- Expand scopes (permissions) without:
  - Clear user consent.
- Modify or delete external data:
  - Without explicit confirmation per action (at least in early versions).
- Use integration data for:
  - Ads.
  - Hidden profiling.
  - Any third-party scoring.

---

## 8. Privacy & Security Considerations

The Integrations Hub is a major potential risk surface.

### 8.1 Data boundaries

- Only **minimum necessary scopes** should be requested.
- Users must be able to:
  - See scopes in human language.
  - Revoke access easily.
- Where possible:
  - Use IDs/links instead of copying large amounts of external content.

### 8.2 Transparency

- When data from integrations is shown:
  - The source should be clear (e.g., icon + label).
- When writing back:
  - The user should see:
    - What will be written.
    - To which account/calendars.

### 8.3 Storage

- Sensitive data from integrations:
  - Should be minimized.
  - Cached for as short as is practical.
- Tokens:
  - Must be stored securely.
  - Rotated/revoked according to best practices.

---

## 9. Edge Cases & Risks

- **Over-connection**
  - Users connecting too many sources → overwhelming.
  - → Countermeasure: encourage minimal, high-impact integrations; allow easy toggling.

- **Sync conflicts**
  - Differences between HumanOS view and external app state.
  - → Countermeasure: start with read-first designs; keep writes user-triggered; show clear status.

- **Privacy confusion**
  - Users not understanding what is shared.
  - → Countermeasure: use plain language; onboarding explanation; integration summary page.

- **API changes / outages**
  - Providers change APIs; integrations break.
  - → Countermeasure: robust error handling; clear user messages; degrade gracefully.

---

## 10. Open Questions & Future Directions

- Which **one or two integrations** deliver the most value for early users?
  - Likely calendar + internal tasks at first.
- How to design:
  - An Integrations UI that feels empowering, not technical?
- How to gradually expand to:
  - Email, chat, project tools, content platforms, and health trackers?
- How to support:
  - Local/offline tools or decentralized setups in the future?
- What is the right balance between:
  - Internal HumanOS-first workflows.
  - Deep reliance on external services?

---
