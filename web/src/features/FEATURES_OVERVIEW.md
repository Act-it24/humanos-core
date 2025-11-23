# Features Overview

**File:** `web/src/features/FEATURES_OVERVIEW.md`  
**Version:** v1.0  
**Status:** Active reference

---

## Purpose

This document provides a detailed overview of each feature/pillar in the HumanOS web application, including current status, component structure, related documentation, and implementation notes.

This aligns with `docs/30_kernel_ui_mapping.md` and provides implementation-level details.

---

## Feature Status Legend

- **Placeholder** – Component exists but shows placeholder content
- **Planned** – Documented in blueprint, not yet implemented
- **In Progress** – Partially implemented
- **Complete** – Fully implemented and functional

---

## 1. Self OS

**Path:** `web/src/features/self-os/`  
**Blueprint:** [`docs/20_self_os_blueprint.md`](../../../docs/20_self_os_blueprint.md)  
**Status:** **Placeholder**

### Current Implementation

- **Component:** `SelfOSPage.jsx`
- **Content:** Placeholder text indicating Self OS section

### Planned Components

From blueprint, these components will be implemented:

1. **SelfOnboardingWizard**
   - Guided flow for first-time setup
   - Values selection (cards or sliders)
   - Personality style questions
   - Energy rhythm preferences
   - Optional flags

2. **ValuesSelector**
   - Interface for selecting 5-7 core values
   - Card-based or slider UI
   - User can define personal meaning

3. **TraitsSummary**
   - Human-readable display of personality patterns
   - Social energy, structure preference, emotional intensity
   - Not clinical labels, but practical patterns

4. **FlagsEditor**
   - Add/edit support flags (parent, caregiver, student)
   - Add/edit risk flags (recovering from burnout, overcommitment)
   - Add/edit identity/context flags

5. **SelfOSProfileView**
   - Complete profile overview
   - Values, traits, flags, life events
   - Editable sections

### Data Model (Future)

- Traits (personality patterns)
- Values (core life principles)
- Flags (contextual markers)
- LifeEvents (significant past events)

### Routes (Future)

- `/self` – Main overview
- `/self/onboarding` – First-time setup
- `/self/profile` – Profile editing

### Dependencies

- Self OS is foundational – other pillars depend on it
- Life Map uses values for goal alignment
- Daily OS uses energy patterns for planning

---

## 2. Life Map

**Path:** `web/src/features/life-map/`  
**Blueprint:** [`docs/21_life_map_blueprint.md`](../../../docs/21_life_map_blueprint.md)  
**Status:** **Placeholder**

### Current Implementation

- **Component:** `LifeMapPage.jsx`
- **Content:** Placeholder text indicating Life Map section

### Planned Components

1. **DomainList**
   - List of life domains (Health, Work, Money, Relationships, etc.)
   - User can rename, hide, or add domains
   - Mark domains as active focus vs. background

2. **GoalCard**
   - Individual goal display
   - Status (idea, planned, active, paused, completed, dropped)
   - Links to values from Self OS
   - Effort level indicator

3. **ProjectEditor**
   - Create/edit projects that support goals
   - Link projects to one or more goals
   - Add tasks to projects

4. **LifeMapOverview**
   - High-level visual map
   - All domains and key goals
   - Simple visualization (cards, list, or graph)

5. **GoalDetailView**
   - Expanded view of one goal
   - Projects and tasks hierarchy
   - Progress tracking

### Data Model (Future)

- Domains (life areas)
- Goals (medium/long-term intentions)
- Projects (concrete initiatives)
- Tasks (actionable steps)

### Routes (Future)

- `/life-map` – Main overview
- `/life-map/domains/:id` – Domain detail
- `/life-map/goals/:id` – Goal detail

### Dependencies

- Requires Self OS (for value alignment)
- Feeds into Daily OS (provides task pool)

---

## 3. Daily OS

**Path:** `web/src/features/daily-os/`  
**Blueprint:** [`docs/22_daily_os_blueprint.md`](../../../docs/22_daily_os_blueprint.md)  
**Status:** **Placeholder**

### Current Implementation

- **Component:** `DailyOSPage.jsx`
- **Content:** Placeholder text indicating Daily OS section

### Planned Components

1. **TodayView**
   - 3-7 focus items for today
   - Time-bound events (from calendar)
   - Day intention selector (Recovery, Progress, Social, etc.)
   - Mark items as done/skip/move

2. **WeekView**
   - This Week summary
   - Tasks distributed across days
   - Active goals and projects
   - Load indicators per day

3. **DayPlanCard**
   - Individual day's plan
   - Focus items and events
   - Load indicator (light/normal/heavy)
   - Completion status

4. **RoutineStrip**
   - Morning/evening routines
   - Weekly review ritual
   - Routine status and completion

5. **PlanningAssistant**
   - AI-powered planning suggestions
   - Respects Self OS energy patterns
   - Warns about overcommitment

### Data Model (Future)

- DayPlans (daily intentions and actuals)
- WeekPlans (weekly summaries)
- PlannedItems (tasks/events scheduled for days)
- Routines (repeated patterns)

### Routes (Future)

- `/today` – Today's view (default)
- `/week` – This Week view
- `/daily-os/routines` – Routine management

### Dependencies

- Requires Life Map (for tasks)
- Requires Self OS (for energy patterns)
- Requires Integrations (for calendar events)
- Feeds into Journal & Mood (for day context)

---

## 4. Journal & Mood

**Path:** `web/src/features/journal-mood/`  
**Blueprint:** [`docs/23_journal_mood_blueprint.md`](../../../docs/23_journal_mood_blueprint.md)  
**Status:** **Placeholder**

### Current Implementation

- **Component:** `JournalMoodPage.jsx`
- **Content:** Placeholder text indicating Journal & Mood section

### Planned Components

1. **MoodCheckIn**
   - Quick mood/emotion input (1-2 taps)
   - Simple scale or emoji-based
   - Optional short note
   - End-of-day integration

2. **JournalEditor**
   - Free-form text entry
   - Basic formatting
   - Optional tags
   - Links to goals, projects, days

3. **JournalTimeline**
   - Chronological view of entries
   - Filter by tag, mood range, domain
   - Search functionality

4. **MoodTrendChart**
   - Simple visualization of mood over time
   - Weekly/monthly trends
   - Pattern highlights

5. **ReflectionSummary**
   - AI-generated weekly/monthly summaries
   - Key themes and patterns
   - Gentle insights and prompts

### Data Model (Future)

- JournalEntries (text reflections)
- MoodSnapshots (emotional state at moments)
- Tags (context and emotion tags)
- ReflectionThemes (AI-constructed patterns)

### Routes (Future)

- `/journal` – Main journal view
- `/journal/:id` – Individual entry detail
- `/journal/reflections` – Weekly/monthly summaries

### Dependencies

- Links to Daily OS (day context)
- Links to Life Map (goals/projects)
- Feeds insights back to Self OS and Life Map

---

## 5. Integrations

**Path:** `web/src/features/integrations/`  
**Blueprint:** [`docs/28_integrations_hub_blueprint.md`](../../../docs/28_integrations_hub_blueprint.md)  
**Status:** **Placeholder**

### Current Implementation

- **Component:** `IntegrationsPage.jsx`
- **Content:** Placeholder text indicating Integrations section

### Planned Components

1. **IntegrationsList**
   - Available providers (Calendar, Tasks, etc.)
   - Connected services
   - Connection status

2. **IntegrationCard**
   - Individual service card
   - Provider name and type
   - Connection status
   - Last sync time
   - Actions (connect, disconnect, settings)

3. **ConnectCalendarFlow**
   - OAuth flow for calendar connection
   - Permission explanation
   - Connection confirmation

4. **IntegrationSettings**
   - Scope management (read/write permissions)
   - Sync frequency controls
   - Data visibility settings

### Data Model (Future)

- IntegrationProviders (service types)
- IntegrationConnections (user's connections)
- ExternalEvents (calendar events)
- ExternalTasks (tasks from external tools)

### Routes (Future)

- `/settings/integrations` – Main management
- `/settings/integrations/:providerId` – Provider-specific settings

### Dependencies

- Feeds into Daily OS (calendar events)
- May feed into Life Map (external tasks)

---

## 6. Automations & AI

**Path:** `web/src/features/automations/`  
**Blueprint:** [`docs/2A_ai_agents_automation_blueprint.md`](../../../docs/2A_ai_agents_automation_blueprint.md)  
**Status:** **Placeholder**

### Current Implementation

- **Component:** `AutomationsPage.jsx`
- **Content:** Placeholder text indicating Automations & AI section

### Planned Components

1. **AutomationToggles**
   - Enable/disable pre-built automation rules
   - Burnout protection
   - Meeting overload protection
   - Neglected goal reminders
   - High joy signal amplification

2. **AutomationExplanation**
   - Plain-language explanation of each rule
   - What triggers it
   - What actions it takes
   - Why it's helpful

3. **AutomationHistory**
   - Log of automated actions
   - What rule fired
   - What action was taken
   - When it happened

4. **AgentStatus** (Future)
   - Overview of active AI agents
   - Agent roles and capabilities
   - Activity summary

### Data Model (Future)

- AutomationRules (trigger/condition/action definitions)
- AutomationLogs (execution history)
- Agent configurations (future)

### Routes (Future)

- `/settings/automations` – Automation management
- `/settings/automations/history` – Action log
- `/settings/agents` – Agent configuration (future)

### Dependencies

- Requires all other pillars (agents use their data)
- Integrates with Daily OS (planning agent)
- Integrates with Life Map (goal shaping agent)
- Integrates with Journal & Mood (reflection agent)

---

## Implementation Phases

See [`docs/60_roadmap_v0.md`](../../../docs/60_roadmap_v0.md) for detailed implementation phases:

- **Phase 1:** Frontend skeleton enhancement (replace placeholders)
- **Phase 2:** Backend foundation
- **Phase 3-8:** Individual pillar implementations
- **Phase 9:** Polish and integration

---

## Component Organization

### Current Pattern

```
features/{pillar}/
  └── {Pillar}Page.jsx
```

### Future Pattern

```
features/{pillar}/
  ├── {Pillar}Page.jsx        # Main page
  ├── components/             # Sub-components
  │   ├── Component1.jsx
  │   └── Component2.jsx
  ├── hooks/                  # Custom hooks (if needed)
  │   └── usePillarData.js
  └── utils/                  # Utilities (if needed)
      └── helpers.js
```

---

## Notes for Developers

- **Start with placeholders** – Each feature begins as a placeholder
- **Follow blueprints** – Implementation should align with blueprint specs
- **Keep components small** – Single responsibility principle
- **Document as you go** – Update this file when status changes
- **Test manually** – Formal tests come later (Phase 9)

---

## Related Documentation

- [Kernel-to-UI Mapping](../../../docs/30_kernel_ui_mapping.md) – Blueprint-to-component mapping
- [Architecture Overview](../../../docs/40_architecture_overview.md) – System architecture
- [Roadmap v0](../../../docs/60_roadmap_v0.md) – Implementation phases
- [Product Blueprint Overview](../../../docs/10_product_blueprint_overview.md) – Product structure

---

## Status Updates

This document should be updated as features are implemented:

- Change status from "Placeholder" to "In Progress" when work begins
- Change to "Complete" when feature is fully functional
- Add implementation notes for future reference

