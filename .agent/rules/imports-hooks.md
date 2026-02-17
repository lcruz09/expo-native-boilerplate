# Import Style

- Prefer named imports; avoid `import * as` unless library idiomatic.
- Import React hooks/types directly (`useState`, `useEffect`, `ReactNode`, etc.).
- Declare imports at top; avoid inline `import()` for types/values (runtime dynamic imports are the exception).

# useState vs useRef

- If UI must update → `useState`; if internal tracking only → `useRef` (e.g., gesture flags, timers, previous values).
- Reduce re-renders by keeping non-UI ffags in refs.

# Custom Hooks

- One hook per file under `hooks/<feature>/`.
- Return `{ state, actions }` objects; keep single responsibility.
- Include concise JSDoc and examples where helpful.
