# Component Contracts

- Explicit props interfaces + JSDoc with `@example` where useful.
- Theme-aware: pull colors from `useColors()`; never hardcode hex/color names.
- Use `Typography`/`Icon` atoms; no emojis in UI (emojis OK in logs/translations/docs).
- One component per file; arrow functions; named exports for reusable pieces.

# Memoization

- Wrap all pure/presentational components with `React.memo`.
- Always assign a `.displayName` string after the definition to satisfy the `react/display-name` ESLint rule (triggered by anonymous memo wrappers).

```tsx
export const MyComponent = memo(({ label }: Props) => {
  return <Typography variant="body">{label}</Typography>;
});
MyComponent.displayName = 'MyComponent';
```

# Accessibility

- All interactive elements must declare `accessibilityRole` (the `Pressable` atom defaults to `"button"`).
- Icon-only buttons must provide an explicit `accessibilityLabel`.
- Decorative icons must be hidden from the accessibility tree (`accessible={false}`, `importantForAccessibility="no"`). Use `isDecorative` prop on the `Icon` atom.
- Reflect loading/disabled state via `accessibilityState={{ disabled, busy }}`.

```tsx
// Icon-only button
<IconButton
  label={t("common.close")}  // becomes accessibilityLabel
  accessibilityState={{ disabled: isLoading, busy: isLoading }}
/>

// Decorative icon inside a labelled button
<Icon name="checkmark" isDecorative />
```

# Interaction & Pressables

- Use custom `Pressable` atom for all taps; it handles haptics + opacity + `accessibilityRole="button"`.
- Provide feedback: visual (opacity/scale) and tactile (haptics). Avoid raw RN Pressable unless extending behavior.
- Resolve swipe/press conflicts with refs to guard against concurrent gestures.

# Example: Basic Pressable

```tsx
import { Pressable } from '@/components/atoms/Pressable';

<Pressable onPress={onSelect}>
  <Typography variant="body">{label}</Typography>
</Pressable>;
```

# Emojis vs Icons

- ✅ Icons via `@/components/atoms/Icon` (Ionicons); theme colors applied.
- ❌ No UI emojis. Emojis allowed in logs/translation strings/docs.

# File Headers & Comments

- Skip redundant file headers; keep comments focused on intent over mechanics.
