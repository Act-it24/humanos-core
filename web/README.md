# HumanOS Web Application

**Location:** `web/`  
**Technology:** React + Vite  
**Status:** v0.1 – Skeleton with placeholder components

---

## Overview

The HumanOS web application is the frontend interface for the Digital Life OS. It provides a single-page application (SPA) with tab-based navigation between the six core Kernel pillars.

This app serves as the primary user interface where people interact with:
- Their Self OS profile (values, traits, energy patterns)
- Their Life Map (domains, goals, projects)
- Their Daily OS (today/this week planning)
- Their Journal & Mood (reflections and emotional tracking)
- Integrations (connected external services)
- Automations & AI (intelligent co-pilot and rules)

---

## Project Structure

```
web/
├── src/
│   ├── features/              # Feature-based modules (one per pillar)
│   │   ├── self-os/
│   │   │   └── SelfOSPage.jsx
│   │   ├── life-map/
│   │   │   └── LifeMapPage.jsx
│   │   ├── daily-os/
│   │   │   └── DailyOSPage.jsx
│   │   ├── journal-mood/
│   │   │   └── JournalMoodPage.jsx
│   │   ├── integrations/
│   │   │   └── IntegrationsPage.jsx
│   │   └── automations/
│   │       └── AutomationsPage.jsx
│   ├── App.jsx                # Main app component with tab navigation
│   ├── App.css                # Global styles
│   ├── main.jsx               # Application entry point
│   └── index.css              # Base styles
│
├── public/                     # Static assets
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── vite.config.js             # Vite configuration
└── README.md                   # This file
```

---

## Feature Folders

Each pillar has its own feature folder under `src/features/`. This organization:

- **Keeps related code together** – All Self OS code lives in one place
- **Makes navigation easy** – Developers and AI tools can find code quickly
- **Scales well** – New features can be added without cluttering

### Current Structure

Each feature folder currently contains:
- A main page component (e.g., `SelfOSPage.jsx`)
- Placeholder content (will be replaced with real implementations)

### Future Structure

As features are implemented, each folder will grow:

```
features/self-os/
  ├── SelfOSPage.jsx           # Main page
  ├── components/             # Sub-components
  │   ├── ValuesSelector.jsx
  │   ├── TraitsSummary.jsx
  │   └── FlagsEditor.jsx
  ├── hooks/                   # Custom hooks (if needed)
  │   └── useSelfOSProfile.js
  └── utils/                   # Feature-specific utilities (if needed)
```

See [FEATURES_OVERVIEW.md](src/features/FEATURES_OVERVIEW.md) for detailed status of each feature.

---

## Tab Navigation

The app uses a **tab-based navigation system** defined in `App.jsx`:

1. **SECTIONS Array**: Defines all available sections with:
   - `id`: Unique identifier
   - `label`: Display name in tab button
   - `component`: React component to render

2. **State Management**: Uses React `useState` to track `activeSectionId`

3. **Rendering**: 
   - Maps over `SECTIONS` to create tab buttons
   - Renders the active section's component in the main content area

### Adding a New Section

To add a new pillar/section:

1. Create feature folder: `mkdir -p src/features/new-pillar`
2. Create component: `src/features/new-pillar/NewPillarPage.jsx`
3. Import in `App.jsx`: `import NewPillarPage from "./features/new-pillar/NewPillarPage.jsx"`
4. Add to `SECTIONS` array: `{ id: "new-pillar", label: "New Pillar", component: <NewPillarPage /> }`

See [Kernel-to-UI Mapping](../../docs/30_kernel_ui_mapping.md) for more details.

---

## Development

### Prerequisites

- Node.js 18+ and npm

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   - Usually available at `http://localhost:5173`
   - Check terminal for exact URL

### Available Scripts

- `npm run dev` – Start development server with hot reload
- `npm run build` – Build for production
- `npm run preview` – Preview production build locally
- `npm run lint` – Run ESLint

### Development Workflow

1. **Make changes** to components in `src/features/`
2. **See updates** automatically in browser (HMR)
3. **Test** functionality manually (test suite planned for later)
4. **Commit** with clear messages (see [CONTRIBUTING.md](../../CONTRIBUTING.md))

---

## Styling

Currently using **inline styles** in components. This will evolve as the UI matures.

**Future considerations:**
- CSS framework (TailwindCSS, etc.)
- Component library (if needed)
- Design system tokens
- Responsive design patterns

**Current patterns:**
- Dark theme with gradient backgrounds
- Tab buttons with active states
- Consistent spacing and typography

---

## State Management

**Current:** React `useState` for local component state

**Future:** 
- React Query or SWR for server state
- Context API for shared state (if needed)
- Avoid heavy global state libraries unless necessary

---

## API Integration (Future)

When backend is implemented:

1. **API Client**: Centralized in `src/lib/apiClient.ts`
2. **Endpoints**: Defined per feature (e.g., `/api/self-os/profile`)
3. **Data Fetching**: React Query or SWR hooks
4. **Error Handling**: Consistent error boundaries and messages

See [Architecture Overview](../../docs/40_architecture_overview.md) for backend structure.

---

## Component Guidelines

- **Functional components** – Use hooks, not classes
- **Small and focused** – Single responsibility
- **Clear names** – Self-documenting code
- **Accessibility** – Keyboard navigation, screen reader support
- **Responsive** – Mobile-first approach

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for detailed coding standards.

---

## Related Documentation

- [Kernel-to-UI Mapping](../../docs/30_kernel_ui_mapping.md) – How blueprints map to components
- [Features Overview](src/features/FEATURES_OVERVIEW.md) – Detailed feature status
- [Architecture Overview](../../docs/40_architecture_overview.md) – System architecture
- [Roadmap v0](../../docs/60_roadmap_v0.md) – Implementation phases

---

## Current Status

**v0.1** – Skeleton phase:
- ✅ Tab navigation working
- ✅ Placeholder components for all 6 pillars
- ✅ Basic styling and layout
- ⏳ Real implementations (Phase 1+)

**Next:** See [Roadmap v0](../../docs/60_roadmap_v0.md) Phase 1 for frontend skeleton enhancement.

---

## Notes

- This is a **work in progress** – Many features are placeholders
- **Documentation is source of truth** – See `docs/` for product specs
- **AI-assisted development** – Code is generated with AI tools using docs as context
- **Keep it simple** – v1 focuses on Kernel pillars, not advanced features
