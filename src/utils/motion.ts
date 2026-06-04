/**
 * Returns true if the user has requested reduced motion in their OS settings.
 * Use this before running GSAP animations to respect accessibility preferences.
 */
export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
