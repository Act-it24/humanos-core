# Contributing to HumanOS

Thank you for your interest in contributing to HumanOS! This guide explains how to propose changes, our development philosophy, and coding standards.

---

## Philosophy

### Docs as Source of Truth

- **Product decisions are documented first** in `docs/`
- Blueprints (20-2A) define what features should do
- Architecture docs (40+) define how systems should work
- Code should align with documentation, not the other way around

### Keep the Kernel Small

- Focus on **Kernel pillars** (Self OS, Life Map, Daily OS, Journal & Mood, Integrations, AI & Automation) before Layer 2
- Each feature should be **deep and meaningful**, not shallow and numerous
- Avoid feature creep – if it's not in a blueprint, discuss it first

### Human-First Development

- Respect user energy, time, and attention
- No dark patterns, no manipulation
- Privacy and safety are non-negotiable
- See [Vision & Principles](docs/00_humanos_vision_and_principles.md) for full constraints

---

## Development Workflow

### Branch & Pull Request

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes:**
   - Follow coding style (see below)
   - Update documentation if needed
   - Test locally

3. **Commit with clear messages:**
   - Use conventional commit format (see below)
   - Be specific about what changed and why

4. **Push and create a Pull Request:**
   - Push your branch: `git push origin feature/your-feature-name`
   - Create PR on GitHub with:
     - Clear title
     - Description of changes
     - Reference to related issues/docs

5. **Review process:**
   - PRs will be reviewed for:
     - Alignment with blueprints and architecture
     - Code quality and style
     - Documentation updates
   - Address feedback and update PR as needed

### Commit Messages

Use conventional commit format:

```
<type>(<scope>): <subject>

<body (optional)>

<footer (optional)>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(self-os): add values selector component

Implements the values selection UI from the Self OS blueprint.
Users can now select 5-7 core values during onboarding.

docs: update roadmap with Phase 1 details

fix(daily-os): correct day plan date handling
```

**Scope** should match the feature/pillar (e.g., `self-os`, `life-map`, `daily-os`, `journal-mood`, `integrations`, `automations`) or be `docs`, `chore`, etc.

---

## Coding Style

### General Principles

- **Functional React** – Prefer functional components and hooks
- **Small, focused components** – Single responsibility
- **Clear names** – Variables, functions, and components should be self-documenting
- **Comments for "why"** – Not for "what" (code should be clear enough)

### React/JavaScript

- Use functional components with hooks
- Keep components small (< 200 lines when possible)
- Extract reusable logic into custom hooks
- Prefer `const` over `let`, avoid `var`
- Use meaningful variable names:
  - ✅ `userProfile`, `activeGoals`, `moodSnapshot`
  - ❌ `data`, `item`, `temp`

### File Organization

- **Feature-based folders** under `web/src/features/`
- Each feature has its own folder with:
  - Main page component (e.g., `SelfOSPage.jsx`)
  - Sub-components in `components/` subfolder
  - Hooks in `hooks/` subfolder (if needed)
- Shared components go in `web/src/components/`
- Utilities go in `web/src/lib/`

### Example Structure

```
web/src/features/self-os/
  ├── SelfOSPage.jsx
  ├── components/
  │   ├── ValuesSelector.jsx
  │   ├── TraitsSummary.jsx
  │   └── FlagsEditor.jsx
  └── hooks/
      └── useSelfOSProfile.js
```

### Styling

- Currently using inline styles (will evolve)
- Keep styles consistent with existing patterns
- Consider mobile responsiveness
- Ensure accessibility (keyboard navigation, screen readers)

### TypeScript (Future)

- Plan for TypeScript migration
- When adding new code, consider TypeScript-friendly patterns
- Avoid `any` types, use proper interfaces

---

## Documentation Standards

### When to Update Docs

- **Always** when adding new features (update relevant blueprint)
- **Always** when changing architecture (update architecture docs)
- **Always** when fixing bugs that reveal design issues
- **Consider** when refactoring significantly

### Documentation Format

- Use Markdown
- Follow existing doc structure (see blueprints for pattern)
- Include metadata block at top:
  ```markdown
  **File:** `filename.md`
  **Version:** v1.0
  **Status:** Active / Baseline / Draft
  **Depends on:** (list related docs)
  ```
- Use clear headings (## for main sections, ### for subsections)
- Add examples and code snippets where helpful

---

## Testing

### Current State

- No formal test suite yet (planned for Phase 9)
- Manual testing expected for now

### Future Testing

- Unit tests for business logic
- Integration tests for API endpoints
- Component tests for UI (React Testing Library)
- E2E tests for critical user flows

---

## AI-Assisted Development

HumanOS is built with heavy use of AI coding assistants (Cursor, Codex, Gemini, etc.). This is encouraged, but:

- **Review AI-generated code** – Don't blindly accept suggestions
- **Understand the code** – Make sure you can explain what it does
- **Align with docs** – AI should use blueprints and architecture as context
- **Maintain quality** – AI code should meet the same standards as human-written code

---

## Questions & Discussion

- **Architecture questions:** See `docs/40_architecture_overview.md`
- **Product questions:** See relevant blueprint in `docs/20_*.md` through `docs/2A_*.md`
- **Implementation questions:** See `docs/60_roadmap_v0.md` for phases
- **General questions:** Open a GitHub issue or discussion

---

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Respect privacy and security boundaries
- Follow the HumanOS Charter principles (see `docs/00_humanos_vision_and_principles.md`)

---

## Getting Help

1. **Read the docs** – Most questions are answered in `docs/`
2. **Check existing issues** – See if your question was already asked
3. **Open an issue** – For bugs, feature requests, or questions
4. **Start a discussion** – For design/architecture discussions

---

Thank you for contributing to HumanOS! 🚀

