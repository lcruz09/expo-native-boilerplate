# Boilerplate Standards & Patterns

This rule ensures that the established architectural patterns are followed when adding new elements to the boilerplate.

## 1. Schema Factory Pattern

All validation schemas must be factory functions that accept a translation function `t`. This ensures that validation messages are always localized.

- **Location**: `schemas/*.ts`
- **Pattern**:

```typescript
export const createXSchema = (t: TFunction) => z.object({ ... });
export type XFormData = z.infer<ReturnType<typeof createXSchema>>;
```

## 2. Page Structure

Pages should remain thin and delegate complex logic to hooks and organisms.

- **Location**: `app/*.tsx`
- **Requirements**:
  - Use `useTranslation` for all text.
  - Use `useColors` for all styling.
  - Avoid direct state manipulation; use specialized **Hooks**.

## 3. Hook Return Pattern

Hooks should return an object containing both state and actions to maintain a consistent API.

- **Location**: `hooks/**/*.ts`
- **Pattern**:

```typescript
export const useFeature = () => {
  // ... logic
  return {
    // State
    data,
    isLoading,
    // Actions
    fetchData,
    updateData,
  };
};
```

## 4. Atomic Component Hierarchy

Ensure components are placed in the correct atomic design folder.

- **Atoms**: Basic UI units (Button, Typography).
- **Molecules**: Combinations of atoms.
- **Organisms**: Complex, autonomous sections of a page.

## 5. Localized Strings

Never hardcode strings in the UI. Always use the `t()` function from `useTranslation()`.

- **Check**: Look for literal strings in JSX that are not keys passed to `t()`.

## 6. Memoized Component Pattern

All pure/presentational components must be wrapped with `React.memo` and assigned a `.displayName`.

- **Why**: Prevents unnecessary re-renders; `displayName` satisfies the `react/display-name` ESLint rule that triggers on anonymous memo wrappers.
- **Pattern**:

```tsx
import { memo } from 'react';

export const MyAtom = memo(({ label }: Props) => {
  return <Typography variant="body">{label}</Typography>;
});
MyAtom.displayName = 'MyAtom';
```

## 7. Zustand Persisted Store Pattern

Persisted stores use `persist` middleware with `createZustandStorage` from `services/storage/kvStorage.ts`.

- **Location**: `stores/<feature>/<featureStore>.ts`
- **Pattern**:

```typescript
import { createZustandStorage, STORAGE_IDS } from '@/services/storage/kvStorage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useFeatureStore = create<FeatureStore>()(
  persist(
    (set) => ({
      // state and actions
    }),
    {
      name: 'feature-storage',
      storage: createJSONStorage(() => createZustandStorage(STORAGE_IDS.SETTINGS)),
      partialize: (state) => ({
        /* only the fields to persist */
      }),
    }
  )
);
```

## 8. Typed Error Interfaces

Never use `any` for error objects. Define an explicit interface matching the expected error shape.

- **Pattern** (see `services/api/supabase/utils.ts`):

```typescript
interface ServiceErrorShape {
  message?: string;
  status?: number;
  code?: string;
}

export const handleServiceError = (error: ServiceErrorShape): DomainError => {
  // ...
};
```

## 9. Config Validation

`config/index.ts` validates all required env vars at module load time. Missing vars throw an `Error` with a formatted message — they never warn silently.

- Add new required vars to the `REQUIRED_VARS` list in `config/index.ts`.
- Optional vars can have defaults; document them in `.env.example`.
