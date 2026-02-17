# Architecture Principles

- Follow SOLID: single responsibility per component/hook; minimal props; depend on abstractions.
- Favor composition/extension instead of modifying components; variants must be swappable.
- Keep interfaces tight; avoid unused props.

# DRY Expectations

- Extract shared UI/logic into atoms/hooks/utils; avoid duplicating UI structures.
- Centralize constants/magic values; shared mocks live in `jest.setup.js`.

# Atomic Design

- Atoms: pure UI, no business logic (`components/atoms`).
- Molecules: small combinations with tiny logic (`components/molecules`).
- Organisms: feature sections that orchestrate hooks/state (`components/organisms`).
- Pages: route orchestration only (`app/`).

# Component Size & Splitting

- Consider splitting when files exceed ~200 lines or contain distinct visual/logic sections.
- Use sub-component folder pattern (e.g., `components/molecules/MyComponent/SubPart.tsx`, `__tests__/`).
- One component per file; arrow functions; named exports preferred for reuse.

# File Structure

- Keep new code within existing hierarchy: `app/`, `components/`, `hooks/`, `providers/`, `stores/`, `services/`, `i18n/`, `assets/`.
