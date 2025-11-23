# HumanOS – Product Blueprint Overview  
**File:** `10_product_blueprint_overview.md`  
**Depends on:** `00_humanos_vision_and_principles.md`  
**Version:** v0.1 (High-level map)

---

## 1. Purpose of this document

This document provides a **high-level product map** of HumanOS:

- What are the main product pillars and modules?
- Which ones are **Core (Kernel)** for early versions?
- Which ones are **Layer 2 / Layer 3** (to be built later)?
- How do different **user roles** (User, Creator, Service Provider, etc.) interact with them?

It is **not** a technical architecture document and **not** a UX wireframe.  
It is the bridge between **vision** (00) and **detailed feature blueprints** (20-xx).

---

## 2. Product layers (mental model)

We think about HumanOS in three main layers:

1. **Experience Spaces (WHO & CONTEXT)**  
   - Self / Relationship / Family / Team / Organization / Community.
   - Each space has a “home” view, goals, rituals, and data.

2. **Capability Pillars (WHAT IT CAN DO)**  
   - Self OS, Life Map, Daily OS, Journal & Mood, Relations, Work & Money, Health & Energy, Creativity, Integrations Hub, Marketplace, AI Agents.

3. **System Components (HOW IT RUNS)**  
   - Web app (UI shell).
   - Core API & data model (Life Graph).
   - AI orchestration layer (agents, prompts, tools).
   - Integrations layer (connections to external apps).
   - Ecosystem services (accounts, billing, reputation).

This file focuses on **Experience Spaces + Capability Pillars**.  
System Components will be described in later architecture docs (`40_*` series).

---

## 3. Experience Spaces – overview

| Space              | Description                                                      | Priority |
|--------------------|------------------------------------------------------------------|----------|
| Self Space         | The personal hub: self-profile, life map, daily OS, journal…    | **Core** |
| Relationship Space | 1:1 spaces (partner, friend, parent–child, mentor–mentee).      | Core L2  |
| Family Space       | Household coordination: calendar, chores, budget, wellbeing.    | L2       |
| Team / Crew Space  | Small teams: creative crews, study groups, small startups.      | L2       |
| Organization Space | Companies/institutions using HumanOS across employees.          | L3       |
| Community / Guild  | Communities around craft/interest (writers, devs, etc.).        | L3       |
| World / Planet     | Aggregated, anonymous insights; symbolic global view.           | L3       |

For **v0.x / v1.0**, Self Space is the primary focus.  
Other spaces must be designed so they **reuse the same engine** (goals/projects/rituals) instead of inventing separate systems.

---

## 4. Capability Pillars – global overview

Each pillar will later have its own `20_xx_*` feature blueprint.  
Here we define them, their priority level, and main responsibilities.

### Legend

- **Level**
  - `KERNEL` – required for HumanOS to be meaningful at all.
  - `L2` – strongly desired for v1.x, but can ship later.
  - `L3` – expansion for later phases.
- **Scope v1** – what early versions MUST support.
- **Future** – direction for later evolution.

---

### 4.1 Pillar table

| Pillar                       | Level   | Scope v1 (short)                                                      | Future direction                                                    |
|-----------------------------|---------|------------------------------------------------------------------------|---------------------------------------------------------------------|
| Self OS                     | KERNEL  | Deep self-profile, personality snapshot, values, energy rhythms.      | More assessments, adaptive models, longitudinal “self history”.     |
| Life Map (Goals & Domains)  | KERNEL  | Life domains, goals → projects → tasks tree.                           | Cross-domain conflict detection, simulations, scenario planning.    |
| Daily OS                    | KERNEL  | Today/This Week, routines, realistic planning.                         | Multi-space planning (self + family + team at once).                |
| Journal & Mood OS           | KERNEL  | Journaling + mood logging linked to goals/events.                      | Voice, multimodal journaling; deeper pattern insights.              |
| Relations OS                | L2      | List of key people, simple rituals & reminders.                        | Full 1:1 spaces, conflict repair flows, shared plans.              |
| Work & Money OS             | L2      | Work projects, light income/expense tracking.                          | Cashflow modelling, opportunities pipeline, career navigation.      |
| Health & Energy OS          | L2      | Sleep/movement basics, simple habits, manual logs.                     | Integrations with wearables, advanced recovery planning.            |
| Creativity & Expression OS  | L2      | Idea capture, creative project pipelines.                              | Publishing workflows, public/portfolio layers.                      |
| Integrations Hub            | KERNEL  | Calendar + 1–2 task/notes tools; basic read/write actions.             | Rich multi-app orchestration, social & content platforms.           |
| Ecosystem & Marketplace     | L2/L3   | Profiles for providers/creators (read-only in early stage).           | Full marketplace: programs, services, payments, reputation.         |
| AI Agents & Automation      | KERNEL  | Core co-pilot + a few focused agents (Planning, Reflection, Focus).   | Visual automation studio, custom agents by users & providers.       |

---

## 5. Roles & how they interact with pillars

HumanOS is not only for “end users”.  
From day one, the design must respect multiple roles:

### 5.1 Roles

- **Individual User**  
  - Uses Self Space + main pillars (Self OS, Life Map, Daily OS, Journal, etc.).
- **Creator**  
  - Uses Creativity OS + Marketplace to publish content, templates, and workflows.
- **Service Provider** (coach, therapist, consultant, teacher…)  
  - Uses:
    - Their own Self Space (everyone is also a user).
    - Dedicated Provider tools:
      - Client spaces (linked to the user’s Self Space with consent).
      - Programs and sessions.
- **Community Builder**  
  - Uses Community/Guild Spaces to host collective challenges and programs.
- **Admin / Owner**  
  - Handles billing, organization-level settings (for org deployments).

### 5.2 Role x Pillar matrix (v1.x focus)

| Pillar / Role               | Individual User | Creator | Service Provider | Community Builder |
|-----------------------------|-----------------|---------|------------------|-------------------|
| Self OS                     | ★★★             | ★★★     | ★★★              | ★★                |
| Life Map                    | ★★★             | ★★★     | ★★★              | ★★                |
| Daily OS                    | ★★★             | ★★★     | ★★★              | ★★                |
| Journal & Mood OS           | ★★★             | ★★★     | ★★               | ★                 |
| Relations OS                | ★★              | ★       | ★★               | ★★ (community ties)|
| Work & Money OS             | ★★              | ★★★     | ★★★              | ★★                |
| Health & Energy OS          | ★★              | ★★      | ★★               | ★                 |
| Creativity & Expression OS  | ★★              | ★★★     | ★★               | ★★★               |
| Integrations Hub            | ★★★             | ★★★     | ★★★              | ★★                |
| Ecosystem & Marketplace     | ★★              | ★★★     | ★★★              | ★★★               |
| AI Agents & Automation      | ★★★             | ★★★     | ★★★              | ★★                |

(★ = importance; 3 stars = central.)

For **MVP / Kernel**, we optimize primarily for the **Individual User** experience, but make sure the data model will later support Creators/Providers without rewriting everything.

---

## 6. HumanOS Kernel – what MUST exist first

The **Kernel** is the smallest viable HumanOS that can honestly be called a “Digital Life OS”.

### 6.1 Kernel pillars

Kernel = the combination of:

1. **Self OS (minimal, but real)**
2. **Life Map (Goals, Domains, Projects, Tasks)**
3. **Daily OS (Today / This Week + routines)**
4. **Journal & Mood OS (simple, linked to goals/time)**
5. **Integrations Hub (Calendar + at least one Tasks/Notes tool)**
6. **AI Co-Pilot (core agent)**
   - Knows the user’s profile and current goals.
   - Can:
     - Help plan a week.
     - Reflect on a past week.
     - Suggest adjustments.

### 6.2 Kernel user journeys

Early product should support (well):

1. **First-time onboarding**
   - Short, engaging flow that:
     - Creates basic self-profile (values, energy, focus).
     - Sets 2–3 top priorities for the next 4–8 weeks.
     - Syncs at least one calendar.
     - Generates a “First Week Plan”.

2. **Daily usage**
   - “What should I do today?” view.
   - Quick journaling & mood check.
   - Small, meaningful nudges:
     - “You planned 5 things, realistically you can do 3.”
     - “Yesterday was heavy, consider a lighter day.”

3. **Weekly review**
   - AI-assisted review:
     - What worked, what didn’t, what changed.
   - Update priorities, reorganize backlog.

If these journeys feel powerful and humane, the product is on the right track—even before relationships, marketplace, or advanced health features exist.

---

## 7. Layer 2 – major expansions after Kernel

After Kernel is stable, we gradually build **Layer 2**:

### 7.1 Relations OS & spaces

- 1:1 spaces:
  - Shared goals (e.g., saving, trips, communication rituals).
  - Joint check-ins.
- Tools:
  - Conversation templates.
  - “Repair after conflict” guides.
  - Shared todo lists with emotional context.

### 7.2 Work & Money OS

- Projects with:
  - Income, time cost, energy cost.
- Simple money dashboards:
  - Income sources, recurring expenses, saving goals.
- AI support:
  - Helping prioritize income-generating vs long-term projects.
  - Protecting health while chasing goals.

### 7.3 Health & Energy OS

- Habit packs:
  - “Sleep reset”, “Move gently”, “Unplug ritual”.
- Integrations with external trackers (where possible).
- Connecting health signals with workload decisions.

### 7.4 Creativity & Expression OS

- Workspaces for creative projects.
- Publishing pipelines for:
  - Articles, videos, songs, scripts, etc.
- Optional link to external platforms for publishing.

### 7.5 Early Ecosystem / Provider mode

- Basic provider profiles.
- Ability for a user to “link” with a provider and share selected data (with consent).
- Simple session notes and homework tasks inside HumanOS.

---

## 8. Layer 3 – long-term evolution

Layer 3 describes ambitious, long-term features that build on a mature Kernel + Layer 2:

- Full **Organization Spaces** for companies (with strict privacy).
- Rich **Community/Guild Spaces** with shared programs, events, and challenges.
- Advanced **Marketplace**:
  - Tiered programs.
  - Revenue sharing, affiliate systems.
- User-created **Automation libraries** and **custom AI agents** published into the ecosystem.
- Deep **World / Planet View** dashboards (fully anonymized) used for research and social projects.

Layer 3 must never break the **ethical constraints and red lines** defined in the Vision & Principles (00).

---

## 9. Relationship with other documents

This file (`10_product_blueprint_overview.md`) is the **hub** for product structure.

- Vision & ethics → `00_humanos_vision_and_principles.md`
- Product overview (this file) → `10_product_blueprint_overview.md`
- Detailed feature blueprints:
  - `20_self_os_blueprint.md`
  - `21_life_map_blueprint.md`
  - `22_daily_os_blueprint.md`
  - `23_journal_mood_blueprint.md`
  - `24_relations_os_blueprint.md`
  - `25_work_money_blueprint.md`
  - `26_health_energy_blueprint.md`
  - `27_creativity_blueprint.md`
  - `28_integrations_hub_blueprint.md`
  - `29_marketplace_blueprint.md`
  - `2A_ai_agents_automation_blueprint.md`
- Architecture & technical docs:
  - `40_architecture_overview.md`
  - `41_frontend_architecture.md`
  - `42_backend_architecture.md`
  - `43_ai_orchestration_architecture.md`
  - `44_integrations_architecture.md`

As the project evolves, updates here must stay **high-level and stable**, while the detailed blueprints can be more dynamic.

---
