# Interview Pro — CLAUDE.md

## Project Overview
**Interview Coach** — AI-powered interview Q&A generator
Stack: React 19 + TypeScript + Vite + Tailwind v4 + GSAP
Path: C:\Users\HP\interview-pro

---

## Active Skills (use all of these)

### frontend-design skill
- Avoid "AI slop" aesthetics — no generic layouts, no purple gradients on white
- Design direction: brutally minimal dark developer tool (Linear.app / Vercel / Raycast)
- Typography must feel intentional — Cairo for Arabic + Inter for UI/code
- Motion: one well-orchestrated page load reveal, nothing more
- Spatial composition: generous negative space, tight grid, clean hierarchy
- Every component must feel like it belongs in a $50/month SaaS product

### theme-factory skill
Apply "Midnight Galaxy" variant — customized:
- BG: #0a0a0f (deeper than default)
- Surface: #111118
- Border: #1e1e2e
- Accent: #6366f1 (indigo)
- Text: #e8e8f0 / muted #6b6b80

### web-artifacts-builder awareness
- Component structure: atomic — small reusable pieces
- State management: React 19 hooks only, no extra libs
- Tailwind v4: use CSS variables approach, no arbitrary values except clamp()

---

## Design System — NON-NEGOTIABLE

### Fonts
- **Cairo** — headings (h1-h6), logo, Arabic text, nav items
- **Inter** — body text, labels, inputs, buttons, code
- DELETE from index.css: Syne, DM Sans (they crash the font rendering)
- index.html already has Google Fonts imports — do NOT touch index.html

### Colors (CSS variables — set in index.css :root)
```css
--bg-primary: #0a0a0f;
--bg-surface: #111118;
--bg-elevated: #16161f;
--border-subtle: #1e1e2e;
--border-default: #2a2a3e;
--text-primary: #e8e8f0;
--text-muted: #6b6b80;
--text-faint: #3a3a50;
--accent: #6366f1;
--accent-hover: #4f46e5;
--accent-muted: rgba(99,102,241,0.1);
```

### Layout — MUST BE IDENTICAL on every page
```
max-width: 1200px
padding: clamp(20px, 4vw, 56px) — horizontal only
PageContainer wraps ALL page content — no exceptions
```

### Motion (GSAP only — subtle)
```js
// Page entry — this pattern ONLY, nothing else
gsap.from(el, { opacity: 0, y: 16, duration: 0.45, ease: 'power2.out', stagger: 0.07 })
```
- ScrollTrigger allowed for content reveals only
- NO: scale, rotation, neon pulse, heavy timelines, bounce

---

## Pages
- Shell.tsx — sidebar nav (persistent)
- HomePage — hero + feature highlights
- GeneratePage — main AI Q&A generator
- SavedPage — saved questions list
- SettingsPage — user preferences
- GitHubPage — repo info / contribution

---

## Root Causes to Fix (in this order)

1. **FONTS** — index.css uses Syne+DM Sans, index.html loads Cairo+Inter → system fallback everywhere
2. **SCROLL** — Lenis lerp:0.08 too slow + conflicts sticky sidebar → remove Lenis, use CSS scroll-behavior:smooth
3. **LAYOUT** — PageContainer (px-6) vs HomePage (clamp 24-64px) → unify to clamp(20px,4vw,56px) max-w-[1200px]
4. **PAGES** — GeneratePage/SavedPage/SettingsPage/GitHubPage missing PageContainer → CSS broken
5. **FAVICON** — replace /public/favicon.svg with "IC" mark matching sidebar logo

---

## Component Standards

### PageContainer.tsx
```tsx
// EXACT implementation required:
export default function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-[clamp(20px,4vw,56px)] py-8">
      {children}
    </div>
  )
}
```

### Sidebar Shell.tsx
- Fixed left sidebar: w-[220px] on desktop, collapsible on mobile
- bg: var(--bg-surface)
- border-right: 1px solid var(--border-subtle)
- Nav items: Cairo font, 14px, hover accent underline (not bg highlight)

### Buttons
```tsx
// Primary
className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-[Inter] text-sm px-4 py-2 rounded-md transition-colors"
// Ghost
className="border border-[var(--border-default)] hover:border-[var(--accent)] text-[var(--text-muted)] hover:text-[var(--text-primary)] font-[Inter] text-sm px-4 py-2 rounded-md transition-colors"
```

---

## Rules (Senior Dev Mode)
- Read ALL files before touching anything
- Fix root causes first — never add features
- One phase at a time, report changes after each
- Preserve all existing functionality
- No inline styles that override the design system
- After all phases: npm run build must pass with zero errors
- Final step: git add . && git commit -m "fix: fonts, scroll, layout, pages, favicon — design system unified"