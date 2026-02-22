# Import Style

- Prefer named imports; avoid `import * as` unless library idiomatic.
- Import React hooks/types directly (`useState`, `useEffect`, `ReactNode`, etc.).
- Declare imports at top; avoid inline `import()` for types/values (runtime dynamic imports are the exception).

# useState vs useRef

- If UI must update → `useState`; if internal tracking only → `useRef` (e.g., gesture flags, timers, previous values).
- Reduce re-renders by keeping non-UI flags in refs.

# Custom Hooks

- One hook per file under `hooks/<feature>/`.
- Return `{ state, actions }` objects; keep single responsibility.
- Include concise JSDoc and examples where helpful.

# Effect-only Hooks

Some hooks exist solely for side effects and return nothing (e.g., `useDeepLinking`). These are called once in a layout component and don't expose state. Use this pattern for app-level event listeners (deep links, push notifications, etc.):

```typescript
export const useDeepLinking = () => {
  useEffect(() => {
    const subscription = Linking.addEventListener('url', handleUrl);
    return () => subscription.remove();
  }, []);
};
```
