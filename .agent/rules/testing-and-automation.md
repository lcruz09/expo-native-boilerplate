# Testing Expectations

- New/changed code must include tests at the appropriate level; colocate under `__tests__/` where relevant.
- Aim for: 100% coverage on utilities/hooks/stores, 70–95% on components. Service logic requires unit coverage and error paths.
- Use Jest + jest-expo; reuse shared mocks from `jest.setup.js` (navigation, colors, storage).
- Prefer Arrange → Act → Assert; keep one focused assertion per test when possible.

# When to Add Tests

- New features, bug fixes, edge cases, and error handling should be covered.
- Add regression tests mirroring the reported issue when fixing bugs.
- For services, mock underlying transports; assert parsed data, state transitions, and callbacks.

# Test Placement

- Components: `components/.../__tests__/Component.test.tsx` (near the component folder).
- Hooks: `hooks/.../__tests__/useThing.test.ts`.
- Services: `services/<Service>/__tests__/...` with constants/utils typed errors.
- Stores: `stores/<feature>/__tests__/<featureStore>.test.ts`.

# Standard Commands

- Run all tests: `yarn test`
- Run a specific file: `yarn test -- <pattern>`
- Watch mode: `yarn test:watch`
- Coverage report: `yarn test:coverage`
- Lint: `yarn lint`
- Type-check: `yarn tsc --noEmit`
- Full pre-commit check: `yarn pre-commit`

# Mocking Patterns

### Supabase service mocks (jest.mock hoisting)

`jest.mock` is hoisted before variable declarations. Define all `jest.fn()` calls **inside** the factory and retrieve them with `jest.requireMock()`:

```typescript
jest.mock('../client', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

const mockAuth = (
  jest.requireMock('../client') as { supabase: { auth: Record<string, jest.Mock> } }
).supabase.auth;
```

### Zustand store testing

Reset store state between tests using `act` + `setState` to avoid cross-test leakage:

```typescript
import { act } from '@testing-library/react-native';
import { useFeatureStore } from '../featureStore';

beforeEach(() => {
  act(() => {
    useFeatureStore.setState({
      /* initial state */
    });
  });
});
```

Mock `@/services/storage/kvStorage` to prevent SQLite dependency in unit tests:

```typescript
jest.mock('@/services/storage/kvStorage', () => ({
  createZustandStorage: jest.fn(() => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  })),
  STORAGE_IDS: { SETTINGS: 'settings' },
}));
```

# Practical Guidance

- Use `waitFor` for async UI updates; avoid arbitrary `setTimeout` in tests.
- Snapshot only for stable, low-variance UI; prefer explicit assertions.
- Always mock external services, Supabase client, and storage — never hit real APIs or SQLite in unit tests.
- Mock `@/config` in tests that import modules which call `config/index.ts` (it throws on missing env vars).
