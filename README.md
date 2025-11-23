# HumanOS – Digital Life OS

**Repository:** `Act-it24/humanos-core`  
**Status:** v0.1 – Documentation & Skeleton Phase

---

## What is HumanOS?

HumanOS is a **Digital Life Operating System** – a unified platform that helps people understand themselves, design their lives, and coordinate their digital tools around what truly matters.

Unlike fragmented productivity apps, HumanOS:

- **Models the person and their life as a coherent system** – connecting values, goals, daily actions, and emotional reality
- **Transforms vague desires into realistic, actionable plans** – day by day and week by week
- **Coordinates digital tools and services around the human** – rather than forcing constant context-switching
- **Hosts an ecosystem of experts and services** – aligned with human wellbeing, not exploitation

The long-term vision: People use HumanOS as their "home base" where they understand themselves, design their lives, and connect with the right help when needed.

---

## Architecture Overview

HumanOS is built as a multi-layered system:

```
┌─────────────────────────────────────────────────────────┐
│                    Web Frontend                         │
│  (React + Vite) – Tab-based navigation, feature pages  │
└────────────────────┬────────────────────────────────────┘
                      │
┌─────────────────────▼──────────────────────────────────┐
│              Backend API / Application Layer              │
│  Business logic, validation, data persistence (Life Graph)│
└────────────────────┬────────────────────────────────────┘
                      │
┌─────────────────────▼──────────────────────────────────┐
│            AI Orchestration Layer                        │
│  Agents (Planning, Reflection, Focus, etc.) + Safety     │
└────────────────────┬────────────────────────────────────┘
                      │
┌─────────────────────▼──────────────────────────────────┐
│              Integrations Hub                             │
│  External services (Calendar, Tasks, Health, etc.)        │
└────────────────────────────────────────────────────────────┘
                      │
┌─────────────────────▼──────────────────────────────────┐
│              Data Layer (Life Graph)                    │
│  User, Self OS, Life Map, Daily OS, Journal, etc.      │
└─────────────────────────────────────────────────────────┘
```

### Core Pillars (Kernel)

1. **Self OS** – Identity, values, traits, energy rhythms
2. **Life Map** – Domains, goals, projects, tasks
3. **Daily OS** – Today/This Week planning, routines
4. **Journal & Mood** – Reflection, emotion tracking, patterns
5. **Integrations Hub** – Calendar, tasks, external app connections
6. **AI Agents & Automation** – Intelligent co-pilot and automation rules

---

## Repository Structure

```
humanos-core/
├── docs/                      # All product & architecture documentation
│   ├── 00_humanos_vision_and_principles.md
│   ├── 10_product_blueprint_overview.md
│   ├── 20_self_os_blueprint.md
│   ├── 21_life_map_blueprint.md
│   ├── 22_daily_os_blueprint.md
│   ├── 23_journal_mood_blueprint.md
│   ├── 28_integrations_hub_blueprint.md
│   ├── 2A_ai_agents_automation_blueprint.md
│   ├── 30_kernel_ui_mapping.md
│   ├── 40_architecture_overview.md
│   └── 60_roadmap_v0.md
│
├── web/                       # Frontend application (Vite + React)
│   ├── src/
│   │   ├── features/          # Feature-based modules (per pillar)
│   │   │   ├── self-os/
│   │   │   ├── life-map/
│   │   │   ├── daily-os/
│   │   │   ├── journal-mood/
│   │   │   ├── integrations/
│   │   │   └── automations/
│   │   ├── App.jsx            # Main app with tab navigation
│   │   └── main.jsx
│   └── package.json
│
├── .idx/                      # Firebase Studio / IDX environment
│   └── dev.nix                # Do not modify unless necessary
│
├── README.md                   # This file
└── CONTRIBUTING.md            # Contribution guidelines
```

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Running the Web App Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Act-it24/humanos-core.git
   cd humanos-core
   ```

2. **Navigate to the web directory:**
   ```bash
   cd web
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   - The app will be available at `http://localhost:5173` (or the port shown in terminal)

### Current State

The web app currently shows:
- Tab-based navigation between 6 core pillars
- Placeholder components for each pillar
- Basic styling and layout

**Next steps:** See `docs/60_roadmap_v0.md` for implementation phases.

---

## Documentation

### Essential Reading

1. **[Vision & Principles](docs/00_humanos_vision_and_principles.md)**  
   The foundational charter – mission, principles, red lines, and boundaries.

2. **[Product Blueprint Overview](docs/10_product_blueprint_overview.md)**  
   High-level product map showing pillars, priorities, and user roles.

3. **[Architecture Overview](docs/40_architecture_overview.md)**  
   Technical system design, repository structure, and implementation approach.

4. **[Documentation Index](docs/01_docs_index.md)**  
   Complete index of all documentation with summaries and navigation.

### Quick Links

- [Kernel-to-UI Mapping](docs/30_kernel_ui_mapping.md) – How blueprints map to React components
- [Roadmap v0](docs/60_roadmap_v0.md) – Implementation phases and priorities
- [Contributing Guide](CONTRIBUTING.md) – How to contribute to the project

### Feature Blueprints

Each core pillar has a detailed blueprint:
- [Self OS](docs/20_self_os_blueprint.md)
- [Life Map](docs/21_life_map_blueprint.md)
- [Daily OS](docs/22_daily_os_blueprint.md)
- [Journal & Mood](docs/23_journal_mood_blueprint.md)
- [Integrations Hub](docs/28_integrations_hub_blueprint.md)
- [AI Agents & Automation](docs/2A_ai_agents_automation_blueprint.md)

---

## Development Philosophy

- **Docs as source of truth** – Product decisions are documented first
- **Kernel-first** – Complete core pillars before expanding
- **Human-first design** – Respect energy, time, and attention
- **AI-assisted development** – Leverage AI tools while maintaining clarity
- **Progressive complexity** – Start simple, evolve as needed

---

## Technology Stack

**Current:**
- Frontend: React + Vite
- Language: JavaScript (TypeScript planned)
- Styling: Inline styles (CSS framework TBD)

**Planned:**
- Backend: Node.js/Express or Next.js API routes
- Database: PostgreSQL or Firestore
- AI: LLM integration (OpenAI, Gemini, etc.)
- Authentication: JWT or session-based

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- How to propose changes (branch & PR workflow)
- Commit message conventions
- Coding style guidelines
- Philosophy and principles

---

## License

[To be determined]

---

## Contact & Support

- Repository: `Act-it24/humanos-core`
- Issues: [GitHub Issues](https://github.com/Act-it24/humanos-core/issues)

---

## Status

**v0.1** – Documentation & skeleton phase complete. Ready for Phase 1: Frontend skeleton enhancement.

See [Roadmap v0](docs/60_roadmap_v0.md) for detailed implementation phases.
