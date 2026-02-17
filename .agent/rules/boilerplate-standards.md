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
