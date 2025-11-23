# Kernel-to-UI Mapping
**File:** `30_kernel_ui_mapping.md`  
**Version:** v1.0  
**Status:** Active reference  
**Depends on:**
- `docs/10_product_blueprint_overview.md`
- `docs/20_self_os_blueprint.md`
- `docs/21_life_map_blueprint.md`
- `docs/22_daily_os_blueprint.md`
- `docs/23_journal_mood_blueprint.md`
- `docs/28_integrations_hub_blueprint.md`
- `docs/2A_ai_agents_automation_blueprint.md`
- `docs/40_architecture_overview.md`

---

## Purpose

This document maps each HumanOS pillar blueprint to its corresponding React component structure in the web frontend. It explains how the tab navigation works, how to add new sections, and how the UI will evolve as features are implemented.

---

## Current Frontend Structure

### Root Application

**File:** `web/src/App.jsx`

The main application uses a **tab-based navigation** system:

- **Header**: Displays "HumanOS" title and tagline
- **Navigation Tabs**: Horizontal row of buttons for each pillar
- **Main Content Area**: Renders the active section's component

**Current Sections:**
```javascript
const SECTIONS = [
  { id: "self-os", label: "Self OS", component: <SelfOSPage /> },
  { id: "life-map", label: "Life Map", component: <LifeMapPage /> },
  { id: "daily-os", label: "Daily OS", component: <DailyOSPage /> },
  { id: "journal-mood", label: "Journal & Mood", component: <JournalMoodPage /> },
  { id: "integrations", label: "Integrations", component: <IntegrationsPage /> },
  { id: "automations", label: "Automations & AI", component: <AutomationsPage /> },
];
```

### Feature Folder Structure

Each pillar has its own feature folder under `web/src/features/`:

```
web/src/features/
  ├── self-os/
  │   └── SelfOSPage.jsx
  ├── life-map/
  │   └── LifeMapPage.jsx
  ├── daily-os/
  │   └── DailyOSPage.jsx
  ├── journal-mood/
  │   └── JournalMoodPage.jsx
  ├── integrations/
  │   └── IntegrationsPage.jsx
  └── automations/
      └── AutomationsPage.jsx
```

---

## Pillar-to-Component Mapping

### 1. Self OS

**Blueprint:** `docs/20_self_os_blueprint.md`  
**Component Path:** `web/src/features/self-os/SelfOSPage.jsx`  
**Current Status:** Placeholder component

**Planned Components (from blueprint):**
- `SelfOnboardingWizard` - Guided setup flow for values, traits, energy rhythms
- `ValuesSelector` - Card-based or slider interface for selecting core values
- `TraitsSummary` - Human-readable display of personality patterns
- `FlagsEditor` - Interface for adding/editing support/risk/identity flags
- `SelfOSProfileView` - Overview of complete Self OS profile

**Routes (future):**
- `/self` - Main Self OS overview
- `/self/onboarding` - First-time setup wizard
- `/self/profile` - Profile review and editing

**Data Dependencies:**
- Self OS profile (values, traits, flags, life events)
- Links to Life Map for goal alignment checks

---

### 2. Life Map

**Blueprint:** `docs/21_life_map_blueprint.md`  
**Component Path:** `web/src/features/life-map/LifeMapPage.jsx`  
**Current Status:** Placeholder component

**Planned Components:**
- `DomainList` - List of life domains (Health, Work, Money, Relationships, etc.)
- `GoalCard` - Individual goal display with status, links to values
- `ProjectEditor` - Create/edit projects that support goals
- `LifeMapOverview` - High-level visual map of all domains and goals
- `GoalDetailView` - Expanded view of one goal with projects and tasks

**Routes (future):**
- `/life-map` - Main overview
- `/life-map/domains/:id` - Domain detail view
- `/life-map/goals/:id` - Goal detail view

**Data Dependencies:**
- Domains, Goals, Projects, Tasks
- Self OS values and flags (for alignment checks)
- Daily OS task pool

---

### 3. Daily OS

**Blueprint:** `docs/22_daily_os_blueprint.md`  
**Component Path:** `web/src/features/daily-os/DailyOSPage.jsx`  
**Current Status:** Placeholder component

**Planned Components:**
- `TodayView` - Focus items for today (3-7 items), time-bound events
- `WeekView` - This Week summary with distributed tasks
- `DayPlanCard` - Individual day's plan with load indicator
- `RoutineStrip` - Morning/evening/weekly routine display
- `PlanningAssistant` - AI-powered planning suggestions

**Routes (future):**
- `/today` - Today's view (default)
- `/week` - This Week view
- `/daily-os/routines` - Routine management

**Data Dependencies:**
- Life Map tasks and projects
- Calendar events (from Integrations Hub)
- Self OS energy patterns and flags
- Journal & Mood context for load adjustments

---

### 4. Journal & Mood

**Blueprint:** `docs/23_journal_mood_blueprint.md`  
**Component Path:** `web/src/features/journal-mood/JournalMoodPage.jsx`  
**Current Status:** Placeholder component

**Planned Components:**
- `MoodCheckIn` - Quick mood/emotion input (1-2 taps)
- `JournalEditor` - Free-form text entry with optional tags
- `JournalTimeline` - Chronological view of entries
- `MoodTrendChart` - Simple visualization of mood over time
- `ReflectionSummary` - AI-generated weekly/monthly summaries

**Routes (future):**
- `/journal` - Main journal view
- `/journal/:id` - Individual entry detail
- `/journal/reflections` - Weekly/monthly review summaries

**Data Dependencies:**
- Journal entries and mood snapshots
- Links to DayPlans, Goals, Projects
- Self OS tags and flags for pattern detection

---

### 5. Integrations Hub

**Blueprint:** `docs/28_integrations_hub_blueprint.md`  
**Component Path:** `web/src/features/integrations/IntegrationsPage.jsx`  
**Current Status:** Placeholder component

**Planned Components:**
- `IntegrationsList` - Available and connected services
- `IntegrationCard` - Individual service card with status
- `ConnectCalendarFlow` - OAuth flow for calendar connection
- `IntegrationSettings` - Scope management and sync controls

**Routes (future):**
- `/settings/integrations` - Main integrations management
- `/settings/integrations/:providerId` - Provider-specific settings

**Data Dependencies:**
- Integration providers and connections
- External events and tasks (normalized)
- OAuth tokens and permissions

---

### 6. AI Agents & Automation

**Blueprint:** `docs/2A_ai_agents_automation_blueprint.md`  
**Component Path:** `web/src/features/automations/AutomationsPage.jsx`  
**Current Status:** Placeholder component

**Planned Components:**
- `AutomationToggles` - Enable/disable pre-built automation rules
- `AutomationExplanation` - Plain-language explanation of what each automation does
- `AutomationHistory` - Log of automated actions taken
- `AgentStatus` - Overview of active AI agents and their roles

**Routes (future):**
- `/settings/automations` - Automation management
- `/settings/automations/history` - Action log
- `/settings/agents` - Agent configuration (future)

**Data Dependencies:**
- Automation rules and settings
- Automation logs
- Agent status and activity

---

## Tab Navigation System

### How It Works

1. **State Management**: `App.jsx` uses React `useState` to track `activeSectionId`
2. **Section Array**: `SECTIONS` array defines all available sections with:
   - `id`: Unique identifier (used in URL/state)
   - `label`: Display name in tab button
   - `component`: React component to render
3. **Tab Rendering**: Maps over `SECTIONS` to create tab buttons
4. **Content Rendering**: Finds active section and renders its component

### Adding a New Section

To add a new pillar/section:

1. **Create Feature Folder:**
   ```bash
   mkdir -p web/src/features/new-pillar
   ```

2. **Create Component:**
   ```jsx
   // web/src/features/new-pillar/NewPillarPage.jsx
   export default function NewPillarPage() {
     return <div>New Pillar Content</div>;
   }
   ```

3. **Import in App.jsx:**
   ```jsx
   import NewPillarPage from "./features/new-pillar/NewPillarPage.jsx";
   ```

4. **Add to SECTIONS Array:**
   ```jsx
   const SECTIONS = [
     // ... existing sections
     { id: "new-pillar", label: "New Pillar", component: <NewPillarPage /> },
   ];
   ```

5. **Update Documentation:**
   - Add entry to this mapping document
   - Update `docs/01_docs_index.md` if it's a new blueprint
   - Update `web/src/features/FEATURES_OVERVIEW.md`

---

## Future Evolution

### Phase 1: Placeholder → Basic UI (v0.1)
- Replace placeholder components with basic structure
- Add simple forms and displays
- No backend integration yet

### Phase 2: Backend Integration (v0.2)
- Connect components to API endpoints
- Add data fetching (React Query/SWR)
- Implement basic CRUD operations

### Phase 3: AI Integration (v0.3)
- Add AI agent interfaces
- Implement suggestion displays
- Add automation toggles

### Phase 4: Advanced Features (v1.0+)
- Full automation studio UI
- Multi-space support
- Advanced visualizations

---

## Component Organization Principles

1. **Feature-Based Folders**: Each pillar has its own folder
2. **Page Components**: Top-level page components in feature root
3. **Sub-Components**: Reusable components within feature folder
4. **Shared Components**: Common UI elements in `web/src/components/`
5. **Hooks**: Feature-specific hooks in `web/src/hooks/` or feature folder
6. **API Client**: Centralized in `web/src/lib/apiClient.ts` (future)

---

## Data Flow (Future)

```
User Interaction (Component)
  ↓
API Client (web/src/lib/apiClient.ts)
  ↓
Backend API (api/src/routes/)
  ↓
Business Logic (api/src/modules/{pillar}/)
  ↓
Data Layer (Life Graph)
  ↓
Response → Component State Update
```

---

## Notes for Developers

- **Keep components small and focused**: Each component should have a single responsibility
- **Use functional components**: Prefer React hooks over class components
- **Type safety (future)**: Plan for TypeScript migration
- **Accessibility**: Ensure keyboard navigation and screen reader support
- **Responsive design**: Mobile-first approach for all components
- **Documentation**: Add JSDoc comments for complex components

---

## Related Documents

- [Architecture Overview](./40_architecture_overview.md) - System-wide architecture
- [Product Blueprint Overview](./10_product_blueprint_overview.md) - Product structure
- [Roadmap v0](./60_roadmap_v0.md) - Implementation phases
- [Features Overview](../web/src/features/FEATURES_OVERVIEW.md) - Detailed feature status

