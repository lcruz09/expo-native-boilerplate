# Testing Expectations

- New/changed code must include tests at the appropriate level; colocate under `__tests__/` where relevant.
- Aim for: 100% coverage on utilities/hooks/stores, 70–95% on components. Service logic requires unit coverage and error paths.
- Use Jest + jest-expo; reuse shared mocks from `jest.setup.js` (BLE, MMKV, navigation, colors).
- Prefer Arrange → Act → Assert; keep one focused assertion per test when possible.

# When to Add Tests

- New features, bug fixes, edge cases, and error handling should be covered.
- Add regression tests mirroring the reported issue when fixing bugs.
- For BLE/services, mock underlying transports; assert parsed data, state transitions, and callbacks.

# Test Placement

- Components: `components/.../__tests__/Component.test.tsx` (near the component folder).
- Hooks: `hooks/.../__tests__/useThing.test.ts`.
- Services: `services/<Service>/__tests__/...` with constants/utils typed errors.

# Standard Commands

- Run unit/component tests: `npm test -- <pattern>` or `npm test` for full suite.
- Lint (if needed): `npm run lint`.
- Type-check: `npm run typecheck` (if available in package scripts).

# Practical Guidance

- Mock timers/intervals for workout timers/ BLE scans; clean up mocks.
- Use `waitFor` for async UI updates; avoid arbitrary `setTimeout` in tests.
- Snapshot only for stable, low-variance UI; prefer explicit assertions.
- Avoid network/real BLE calls; always mock external services and storage.
