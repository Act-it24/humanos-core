# HumanOS – Architecture Overview  
**File:** `docs/40_architecture_overview.md`  
**Version:** v1.0 (High-level, implementation-agnostic)  

**Depends on:**  
- `docs/00_humanos_vision_and_principles.md`  
- `docs/10_product_blueprint_overview.md`  
- `docs/20_self_os_blueprint.md`  
- `docs/21_life_map_blueprint.md`  
- `docs/22_daily_os_blueprint.md`  
- `docs/23_journal_mood_blueprint.md`  
- `docs/28_integrations_hub_blueprint.md`  
- `docs/2A_ai_agents_automation_blueprint.md`  

---

## 1. Purpose & Scope

### 1.1 Purpose

This document describes the **high-level software architecture** of HumanOS – Digital Life OS.

It exists to answer:

- How is HumanOS logically structured?
- How do the core pillars (Self OS, Life Map, Daily OS, Journal & Mood, Integrations, AI Agents) map to concrete **modules, services, and folders**?
- How can a **single developer** (with heavy AI-assistant support) start small and still keep a path toward a **global-scale product**?

This document:

- Guides repo structure, module boundaries, and responsibilities.
- Helps AI coding tools (Cursor, Codex, Gemini) understand the intended system shape.
- Ensures that any code generated later **respects the product design** from the other docs.

It is **not**:

- A low-level class diagram.
- A detailed API reference.
- A deployment guide for specific cloud providers.

Those can be created later as separate docs (`41_frontend_architecture`, `42_backend_architecture`, etc.).

### 1.2 Constraints & Reality

HumanOS is being built initially under the following constraints:

- **Single developer** (Ahmed) using AI-assisted development (Cursor, Codex, Gemini, etc.).
- **Web-first** UI (responsive) with the intention to support native mobile later.
- Preference for **TypeScript + React** on the frontend.
- Preference for a **simple, unified repo** at the beginning:
  - Frontend + backend + docs in one place.
- Strong emphasis on:
  - Clear, readable code.
  - Well-structured docs.
  - Minimal complexity in v1, with room to grow.

---

## 2. Architectural Principles

1. **Kernel-first implementation**  
   - Core Kernel pillars must be implemented first and well:
     - Self OS
     - Life Map OS
     - Daily OS
     - Journal & Mood OS
     - Integrations Hub (minimal)
     - AI Agents & Automations (core, opinionated set)
   - L2 pillars (Relations OS, Work & Money, Health & Energy, Creativity & Expression, Marketplace) **plug into** the Kernel and reuse existing patterns.

2. **Life Graph as conceptual backbone**  
   - All data and logic ultimately live inside a conceptual **Life Graph**:
     - User → traits/values/flags → domains/goals/projects/tasks → days → mood snapshots/journal entries → external events.
   - Concrete storage may be relational or document-based in v1, but:
     - APIs and data models should expose **relationships explicitly**.

3. **Separation of concerns**  
   - **Frontend (Web App)**: UI, interaction, local state, presentation.
   - **Backend / Application Layer**: business logic, validation, rules, scheduling, persistence.
   - **AI Orchestration Layer**: prompts, agents, tool calls, safety layer.
   - **Integrations Hub**: external API access (calendar, tasks, etc.).
   - **Automation Runtime**: evaluation of triggers/conditions/actions.

4. **Safe-by-design AI**  
   - All AI behaviors and automations must align with:
     - The HumanOS Charter (`00`).
     - Red lines (no clinical diagnoses, no manipulation, no data selling).
   - Agents:
     - Work through **explicit tools** (functions, APIs).
     - Never directly talk to databases or external APIs without going through validated logic.

5. **Progressive complexity, not big bang**  
   - v1 can be implemented as:
     - A single repo.
     - A single app (e.g., Next.js with API routes) or a simple React SPA + Node backend.
   - Only when necessary:
     - Extract independent services (e.g., AI orchestration, Integrations Hub) into separate deployable units.

6. **Explainable system**  
   - Any non-trivial suggestion or change should be explainable to the user:
     - Which agent did this?
     - Which data did it use?
     - Which rule or reasoning path did it follow (in human terms)?

7. **AI-friendly architecture**  
   - Code, folders, and types must be:
     - Clear, consistent, and well-documented.
   - This allows AI tools (Cursor, Codex, etc.) to:
     - Navigate the repo.
     - Generate code that respects conventions and docs.

---

## 3. High-level System Landscape

### 3.1 Main Components

1. **Web Frontend (React)**  
   - Human-facing interface.
   - Implements core flows:
     - Onboarding & Self OS.
     - Life Map (domains, goals, projects).
     - Daily OS (Today / This Week).
     - Journal & Mood (check-ins, entries, timeline).
     - Integrations management (connect, revoke).
     - Simple Automation preferences (toggles, sliders).
   - Talks to backend via HTTP APIs (REST or GraphQL).

2. **Backend Application / API**  
   - Manages:
     - Business logic for all pillars (Self OS, Life Map, Daily OS, Journal, etc.).
     - Authentication & authorization.
     - Data persistence layer (Life Graph).
     - Integrations Hub endpoints.
     - Automation runtime endpoints.

3. **AI Orchestration Layer**  
   - Wraps external LLMs and acts as the “brain network”.
   - Implements agents:
     - Self OS Profiler, Life Architect, Daily Planner, Reflection, Focus, Integrations, Guardian.
   - Exposes:
     - High-level endpoints like `/ai/plan-week`, `/ai/reflect-month`, `/ai/self-os-onboarding`.

4. **Data Layer (Life Graph Storage)**  
   - Database(s) storing:
     - User accounts.
     - Self OS entities (traits, values, flags, life events).
     - Life Map entities (domains, goals, projects, tasks).
     - Daily OS entities (DayPlans, WeekPlans, routines).
     - Journal & Mood (entries, mood snapshots).
     - Integrations (providers, connections, external events/tasks).
     - Automation rules and logs.
   - Accessed via repositories / data access layer, not directly from UI or AI.

5. **Integrations Hub**  
   - Encapsulates external services:
     - Starting with calendar (e.g., Google Calendar).
     - Possibly tasks later.
   - Provides:
     - Unified, normalized “Event” and “Task” objects.
   - Handles:
     - OAuth / token management.
     - Sync processes.

6. **Automation Runtime**  
   - Evaluates rules based on:
     - Triggers (events in the Life Graph).
     - Conditions (Self OS, load, mood, etc.).
   - Executes:
     - Controlled actions (update day load, move tasks, propose rest).
   - Logs:
     - What rules fired.
     - What actions were taken or proposed.

---

## 4. Repository & Module Structure (Conceptual)

**Repository name:** `humanos-core`

Suggested top-level structure:

```text
humanos-core/
  docs/                      # All product & architecture docs
    00_humanos_vision_and_principles.md
    10_product_blueprint_overview.md
    20_self_os_blueprint.md
    21_life_map_blueprint.md
    22_daily_os_blueprint.md
    23_journal_mood_blueprint.md
    28_integrations_hub_blueprint.md
    2A_ai_agents_automation_blueprint.md
    40_architecture_overview.md
    ... (later: 41, 42, etc.)

  web/                       # Web frontend (React / Next.js)
    src/
      components/            # Reusable UI elements
      features/              # Feature-based modules (per pillar)
        self-os/
        life-map/
        daily-os/
        journal-mood/
        integrations/
        automations/
        core/                # Shared layouts, navigation, etc.
      pages/ or app/         # Routing (framework dependent)
      hooks/
      lib/
      styles/

  api/                       # Backend application / API
    src/
      modules/               # Business logic organized by pillar
        self-os/
        life-map/
        daily-os/
        journal-mood/
        integrations/
        automations/
        users-auth/
      lib/                   # Shared helpers (logging, errors, etc.)
      routes/ or controllers/
      middlewares/

  shared/                    # Shared code between web & api (if mono-repo setup)
    types/                   # TypeScript types / interfaces
    models/                  # Domain models (if shared)
    constants/
    utils/

  infra/                     # Infrastructure configuration (optional in v1)
    docker/
    deployment/
    scripts/

  .idx/                      # Firebase / IDE environment configs
  package.json
  README.md

Notes:

v1 can be implemented with:

A single Next.js app inside web/ that also handles API routes.

Or a separate api/ Node/Express service.

The important thing is the feature-based organization:

Self OS code grouped together.

Life Map code grouped together.

Daily OS code grouped together.

This helps AI tools and humans navigate.

5. Frontend Architecture (Web App)
5.1 Technology assumptions (flexible)

Language: TypeScript.

Framework: React (possibly Next.js).

Styling: TailwindCSS or another utility-first / component-based solution.

State management:

Local state + React Query / SWR for server state.

Avoid heavy global state libraries at v1 unless necessary.

5.2 Feature modules & pages

Each main pillar has its own feature module:

features/self-os/

Components:

SelfOnboardingWizard

ValuesSelector

TraitsSummary

FlagsEditor

Pages:

/self – Self OS overview

/self/onboarding – guided setup

features/life-map/

Components:

DomainList

GoalCard

ProjectEditor

LifeMapOverview

Pages:

/life-map

/life-map/domains/:id

/life-map/goals/:id

features/daily-os/

Components:

TodayView

WeekView

DayPlanCard

RoutineStrip

Pages:

/today

/week

features/journal-mood/

Components:

MoodCheckIn

JournalEditor

JournalTimeline

Pages:

/journal

/journal/:id (entry detail)

features/integrations/

Components:

IntegrationsList

IntegrationCard

ConnectCalendarFlow

Pages:

/settings/integrations

features/automations/

Components:

AutomationToggles

AutomationExplanation

Pages:

/settings/automations

5.3 API access from frontend

A single API client layer (e.g., web/src/lib/apiClient.ts).

Example endpoints (conceptual):

GET /api/self-os/profile

POST /api/self-os/flags

GET /api/life-map/domains

POST /api/life-map/goals

GET /api/daily-os/day-plan?date=YYYY-MM-DD

POST /api/daily-os/day-plan

POST /api/journal-mood/check-in

GET /api/journal-mood/entries

GET /api/integrations

POST /api/integrations/connect

GET /api/automations/settings

POST /api/automations/settings

The frontend never talks directly to the database or external APIs.

6. Backend Architecture (Application / API Layer)
6.1 Modules by pillar

Backend code is organized by domain module:

modules/self-os/

Services:

getSelfOsProfile(userId)

updateValues(userId, payload)

updateTraits(userId, payload)

updateFlags(userId, payload)

Repositories:

selfOsRepo accessing traits, values, flags tables/collections.

modules/life-map/

Services:

listDomains(userId)

createGoal(userId, payload)

updateGoalStatus(userId, goalId, status)

createProject, listGoals, etc.

modules/daily-os/

Services:

getDayPlan(userId, date)

saveDayPlan(userId, dayPlan)

getWeekPlan(userId, weekStartDate)

modules/journal-mood/

Services:

createJournalEntry(userId, payload)

listJournalEntries(userId, filters)

createMoodSnapshot(userId, payload)

modules/integrations/

Services:

listProviders()

connectProvider(userId, providerId, oauthPayload)

listEventsForRange(userId, dateRange)

modules/automations/

Services:

evaluateRulesForTrigger(userId, triggerType, context)

logAutomationExecution(...)

getUserAutomationSettings(userId)

modules/users-auth/

Services:

registerUser(...)

loginUser(...)

getUserProfile(userId)

6.2 Request flow

Frontend sends an HTTP request.

API route/controller:

Validates auth.

Validates input.

Calls relevant module service.

Service:

Contains business rules.

Calls repositories + possibly AI Orchestration or Integrations.

Response:

Returns typed DTOs.

Frontend consumes via API client.

7. AI Orchestration Layer
7.1 Logical position

The AI layer does not replace backend logic.

It works as a client of backend modules with elevated powers but strict boundaries.

7.2 Components

LLM Gateway

Wraps the actual AI provider (OpenAI, Gemini, etc.).

Handles:

Prompt templates.

Rate limits.

Logging of prompts and responses (with privacy in mind).

Agent Runtime

Defines each agent as:

A structured prompt.

A set of allowed tools (backend/APIs).

A safety profile.

Examples:

SelfOsProfilerAgent

LifeArchitectAgent

DailyPlanningAgent

ReflectionAgent

FocusAgent

IntegrationsAgent

GuardianAgent

Tools (AI-callable functions)

Functions exposed to agents, for example:

tool_getSelfOsProfile(userId)

tool_getActiveGoals(userId)

tool_getDayPlan(userId, date)

tool_saveDayPlan(userId, plan)

tool_listCalendarEvents(userId, dateRange)

Tools are wrappers over backend services with:

Additional safety checks.

Clear parameter types.

7.3 Interaction patterns

User-initiated:

Example: “Plan my week.”

Frontend calls /api/ai/plan-week.

Backend calls DailyPlanningAgent.

Agent:

Fetches Self OS, Life Map, existing events.

Generates a proposed WeekPlan.

Returns a structured plan + explanation.

Backend stores plan, frontend displays to user for confirmation/edit.

Automation-initiated:

Example: End-of-week review.

Automation runtime triggers ReflectionAgent.

Agent:

Reads week’s DayPlans, journal entries, mood snapshots.

Produces a summary + suggestions.

Backend stores summary and notifies user.

8. Data Layer – Life Graph
8.1 v1 storage choices

For v1, HumanOS can use one primary database, for example:

PostgreSQL (relational).

Or Firestore (document-based) if staying tightly integrated with Firebase.

Key requirement:

Data access is abstracted through repositories/services, so switching or evolving storage is possible later (e.g., adding a graph DB).

8.2 Conceptual entities

Aligning with blueprints:

User / Auth

Users

Sessions / Tokens (depending on auth strategy)

Self OS

Traits

Values

Flags

LifeEvents

Life Map

Domains

Goals

Projects

Tasks

Daily OS

DayPlans

WeekPlans

PlannedItems

Routines

Journal & Mood

JournalEntries

MoodSnapshots

Integrations

IntegrationProviders

IntegrationConnections

ExternalEvents

ExternalTasks

Automations

AutomationRules

AutomationLogs

8.3 Relationships (examples)

User has many Values, Traits, Flags, Goals, DayPlans, etc.

Goal belongs to one Domain, and can link to multiple Values.

Project belongs to one or more Goals.

Task belongs to a Project (or directly to a Goal in simple cases).

DayPlan references PlannedItems, which reference Tasks or ExternalEvents.

JournalEntry can reference a DayPlan or a Goal.

9. Integrations Hub – Technical Role
9.1 Encapsulation

All external services pass through the Integrations module in the backend:

No direct calls from frontend or AI to Google APIs, etc.

Integrations module:

Manages OAuth flows.

Stores tokens securely.

Provides normalized data.

9.2 v1 behavior

Start with calendar integration:

Read-only for most cases.

Optional explicit write access (blocking time) if user opts in.

API examples:

listEventsForUser(userId, dateRange)

createTimeBlock(userId, spec)

10. Automation Runtime
10.1 Evaluation

Triggered by events such as:

day_start, day_end, week_start, week_end.

mood_snapshot_created.

journal_entry_created.

goal_status_changed.

For each trigger:

Load relevant AutomationRules.

Check conditions (using Self OS, Life Map, Daily OS data).

If conditions met:

Execute actions:

Direct (e.g., adjust load).

Or via agents (e.g., generate a suggestion text).

10.2 Transparency

For every rule execution:

Log to AutomationLogs.

Make it possible (later) for the user to see:

“Automation History”:

“On [date], rule [name] suggested [action].”

11. Security, Privacy & Compliance (High-level)
11.1 Authentication & authorization

Every API request is authenticated.

Each data record is scoped to:

A specific user.

Or a space (Self / Family / Team) with clear roles (later).

11.2 Sensitive data handling

Highest sensitivity:

Self OS details.

Journal entries and mood snapshots.

Requirements:

TLS for all communication.

At-rest encryption for core tables / collections or sensitive columns.

Access control enforced at the backend, never only in the frontend.

11.3 AI data usage

AI agents only access:

The minimum data needed for the requested task.

Later (not v1):

User-facing “Data Usage” screen summarizing:

Which data types are used where (planning, reflection, automations).

12. Environments & Dev Workflow
12.1 Environments

Local Development

Run frontend + backend locally.

Use local DB (Docker Postgres or Firebase emulator).

Staging (later)

A close copy of production for testing.

Production (later)

Stable, monitored environment.

12.2 Workflow with AI tools

GitHub is the single source of truth.

Typical cycle:

Update or create docs under docs/ first (like this file).

Use docs as context in Cursor / Codex / Gemini.

Generate or refactor code in feature modules.

Commit small, coherent changes with clear messages.

Always keep:

Architecture and product docs up-to-date with major design changes.

13. Open Questions & Future Directions

Final decision on:

Framework: Next.js vs React SPA + separate API.

Database: Postgres vs Firestore vs another managed DB.

When to split:

AI Orchestration into a separate microservice.

Integrations Hub into its own service (for scaling).

Multi-space model:

How Self, Family, Team, Org spaces will:

Share some entities.

Stay isolated for others (privacy, permissions).

Offline capabilities:

Whether to support offline-first behavior and to what depth.

Extensibility:

How providers/creators later plug in:

Custom programs.

Custom agents.

Custom automations and templates.