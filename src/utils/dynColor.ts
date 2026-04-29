/**
 * Injects a hex color as CSS custom properties for dynamic Tailwind usage.
 * --c      = full color      → use text-[var(--c)] border-[var(--c)]
 * --c-dim  = 13% alpha bg    → use bg-[var(--c-dim)]
 * --c-glow = 25% alpha glow  → use shadow-[0_0_20px_var(--c-glow)]
 */
export function dynColor(hex: string): React.CSSProperties {
  return {
    '--c':     hex,
    '--c-dim': hex + '22',   // ~13% opacity
    '--c-glow': hex + '40',  // ~25% opacity
  } as React.CSSProperties
}
