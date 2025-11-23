# HumanOS Documentation Index
**File:** `01_docs_index.md`  
**Version:** v1.0  
**Status:** Active reference  
**Last Updated:** 2024

---

## Purpose

This index provides a comprehensive overview of all HumanOS documentation, organized by type, status, and relationship to product pillars. Use this as a navigation guide when exploring the HumanOS vision, architecture, and implementation details.

---

## Documentation Structure

### Vision & Foundation (00-10)

| File | Title | Type | Status | Summary |
|------|-------|------|--------|---------|
| `00_humanos_vision_and_principles.md` | HumanOS – Vision & Principles | Vision/Charter | **Source of Truth** | Foundational charter defining mission, product definition, core pillars, experience principles, AI principles, data privacy, and red lines. |
| `10_product_blueprint_overview.md` | HumanOS – Product Blueprint Overview | Product Map | Baseline | High-level product map showing experience spaces, capability pillars, roles, kernel definition, and layer priorities (Kernel/L2/L3). |

### Feature Blueprints (20-2A)

| File | Title | Type | Status | Pillar | Depends On |
|------|-------|------|--------|--------|------------|
| `20_self_os_blueprint.md` | Self OS – Feature Blueprint | Feature Blueprint | Baseline | **Self OS** (Kernel) | 00, 10 |
| `21_life_map_blueprint.md` | Life Map OS – Goals, Domains & Projects | Feature Blueprint | Baseline | **Life Map** (Kernel) | 00, 10, 20 |
| `22_daily_os_blueprint.md` | Daily OS – Execution, Rhythm & Focus | Feature Blueprint | Baseline | **Daily OS** (Kernel) | 00, 10, 20, 21 |
| `23_journal_mood_blueprint.md` | Journal & Mood OS – Reflection, Emotion & Meaning | Feature Blueprint | Baseline | **Journal & Mood** (Kernel) | 00, 10, 20, 21, 22 |
| `28_integrations_hub_blueprint.md` | Integrations Hub – App Orchestrator & Data Bridge | Feature Blueprint | Baseline | **Integrations Hub** (Kernel) | 00, 10, 20, 21, 22, 23 |
| `2A_ai_agents_automation_blueprint.md` | AI Agents & Automation Studio – Orchestration & Intelligence | Feature Blueprint | Baseline | **AI Agents & Automation** (Kernel) | 00, 10, 20, 21, 22, 23, 28 |

### Architecture & Technical (30-40)

| File | Title | Type | Status | Summary |
|------|-------|------|--------|---------|
| `30_kernel_ui_mapping.md` | Kernel-to-UI Mapping | Technical Guide | Active | Maps each pillar's blueprint to React component paths, explains tab navigation, and guides adding new sections. |
| `40_architecture_overview.md` | HumanOS – Architecture Overview | Architecture | Baseline | High-level software architecture: system landscape, repository structure, frontend/backend/AI layers, data model, security. |

### Planning & Roadmap (60+)

| File | Title | Type | Status | Summary |
|------|-------|------|--------|---------|
| `60_roadmap_v0.md` | HumanOS v0 Implementation Roadmap | Roadmap | Active | Phases from current skeleton to full Kernel implementation, with goals, files touched, and dependencies. |

---

## Documentation Types

- **Vision/Charter**: Foundational principles and boundaries that must not be violated.
- **Product Map**: High-level product structure and priorities.
- **Feature Blueprint**: Detailed specification for a specific pillar/module.
- **Architecture**: Technical system design and structure.
- **Technical Guide**: Implementation guidance and mappings.
- **Roadmap**: Implementation phases and planning.

---

## Status Definitions

- **Source of Truth**: Authoritative document; changes require careful consideration.
- **Baseline**: Stable reference; may evolve but maintains core meaning.
- **Active**: Living document updated as implementation progresses.
- **Draft**: Work in progress, subject to change.

---

## Pillar Mapping

### Kernel Pillars (v1 Focus)

1. **Self OS** → `20_self_os_blueprint.md`
   - Identity, values, traits, energy rhythms, flags
   - UI: `web/src/features/self-os/`

2. **Life Map** → `21_life_map_blueprint.md`
   - Domains, goals, projects, tasks hierarchy
   - UI: `web/src/features/life-map/`

3. **Daily OS** → `22_daily_os_blueprint.md`
   - Today/This Week views, routines, realistic planning
   - UI: `web/src/features/daily-os/`

4. **Journal & Mood** → `23_journal_mood_blueprint.md`
   - Free-form journaling, mood check-ins, pattern insights
   - UI: `web/src/features/journal-mood/`

5. **Integrations Hub** → `28_integrations_hub_blueprint.md`
   - Calendar, tasks, external app connections
   - UI: `web/src/features/integrations/`

6. **AI Agents & Automation** → `2A_ai_agents_automation_blueprint.md`
   - Core agents, automation studio, safety layer
   - UI: `web/src/features/automations/`

### Layer 2 Pillars (Future)

- Relations OS (not yet blueprinted)
- Work & Money OS (not yet blueprinted)
- Health & Energy OS (not yet blueprinted)
- Creativity & Expression OS (not yet blueprinted)
- Ecosystem & Marketplace (not yet blueprinted)

---

## Reading Paths

### For New Contributors
1. Start with `00_humanos_vision_and_principles.md` to understand the mission.
2. Read `10_product_blueprint_overview.md` for product structure.
3. Review `30_kernel_ui_mapping.md` to see how blueprints map to code.
4. Explore specific feature blueprints (20-2A) as needed.
5. Check `60_roadmap_v0.md` for implementation priorities.

### For Developers
1. `40_architecture_overview.md` for system architecture.
2. `30_kernel_ui_mapping.md` for UI structure.
3. Feature blueprints (20-2A) for specific pillar details.
4. `60_roadmap_v0.md` for what to build next.

### For Product/Design
1. `00_humanos_vision_and_principles.md` for principles and constraints.
2. `10_product_blueprint_overview.md` for product map.
3. Feature blueprints (20-2A) for detailed specifications.

---

## Document Dependencies

```
00 (Vision) 
  └─> 10 (Product Overview)
       ├─> 20 (Self OS)
       │    └─> 21 (Life Map)
       │         └─> 22 (Daily OS)
       │              └─> 23 (Journal & Mood)
       │                   └─> 28 (Integrations)
       │                        └─> 2A (AI & Automation)
       │
       └─> 40 (Architecture)
            └─> 30 (Kernel-UI Mapping)
                 └─> 60 (Roadmap)
```

---

## Notes

- All documentation is in Markdown format.
- File naming convention: `NN_description.md` where NN is a two-digit number indicating document category and order.
- Blueprints (20-2A) follow a consistent structure: Purpose, User Problems, Scope, Data Model, User Journeys, Interactions, AI Involvement, Privacy, Edge Cases, Open Questions.
- Architecture docs (40+) focus on technical implementation details.
- Vision and principles (00) should be treated as immutable unless explicitly updated through careful review.

---

## Quick Links

- [Vision & Principles](./00_humanos_vision_and_principles.md)
- [Product Blueprint Overview](./10_product_blueprint_overview.md)
- [Kernel-to-UI Mapping](./30_kernel_ui_mapping.md)
- [Architecture Overview](./40_architecture_overview.md)
- [Roadmap v0](./60_roadmap_v0.md)

