# Component Contracts

- Explicit props interfaces + JSDoc with `@example` where useful.
- Theme-aware: pull colors from `useColors()`; never hardcode hex/color names.
- Use `Typography`/`Icon` atoms; no emojis in UI (emojis OK in logs/translations/docs).
- One component per file; arrow functions; named exports for reusable pieces.

# Interaction & Pressables

- Use custom `Pressable` atom for all taps; it handles haptics + opacity.
- Provide feedback: visual (opacity/scale) and tactile (haptics). Avoid raw RN Pressable unless extending behavior.
- Resolve swipe/press conflicts with refs to guard against concurrent gestures.

# Example: Basic Pressable

```tsx
import { Pressable } from "@/components/atoms/Pressable";

<Pressable onPress={onSelect}>
  <Typography variant="body">{label}</Typography>
</Pressable>;
```

# Emojis vs Icons

- ✅ Icons via `@/components/atoms/Icon` (Ionicons); theme colors applied.
- ❌ No UI emojis. Emojis allowed in logs/translation strings/docs.

# File Headers & Comments

- Skip redundant file headers; keep comments focused on intent over mechanics.
