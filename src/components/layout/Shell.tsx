/**
 * Shell.tsx
 * ---------
 * Root layout wrapper: collapsible glass sidebar + main content area.
 *
 * Features:
 *  - Glassmorphism sidebar with GSAP-animated active indicator
 *  - GSAP logo glow pulse on mount
 *  - Fixed ambient orbs (GSAP parallax applied in pages)
 *  - Subtle grid-dot background texture
 *  - Collapsible sidebar (240 ↔ 64px) with smooth CSS transition
 */
import { type FC, type ReactNode, useState, useRef, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { useAppContext } from '../../context/AppContext'

/* ══════════════════════════════════════════════════════════════
   ICONS — inline SVG components, no external icon library
   ══════════════════════════════════════════════════════════════ */

const IconHome = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const IconGenerate = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)
const IconSaved = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
)
const IconBank = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
)
const IconGitHub = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
)
const IconSettings = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)

/* Chevron — rotates to indicate sidebar collapse state */
const IconChevron = ({ flipped }: { flipped: boolean }) => (
  <svg
    width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{
      transform: flipped ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 280ms cubic-bezier(0.4,0,0.2,1)',
    }}
  >
    <polyline points="15 18 9 12 15 6"/>
  </svg>
)

/* ══════════════════════════════════════════════════════════════
   NAV CONFIG — route definitions for the sidebar
   ══════════════════════════════════════════════════════════════ */
const NAV = [
  { to: '/',         label: 'الرئيسية',    Icon: IconHome,     end: true  },
  { to: '/generate', label: 'توليد أسئلة', Icon: IconGenerate, end: false },
  { to: '/saved',    label: 'محفوظة',      Icon: IconSaved,    end: false },
  { to: '/bank',     label: 'مكتبة الأسئلة', Icon: IconBank,   end: false },
  { to: '/github',   label: 'GitHub',      Icon: IconGitHub,   end: false },
  { to: '/settings', label: 'الإعدادات',   Icon: IconSettings, end: false },
]

/* ══════════════════════════════════════════════════════════════
   SHELL COMPONENT
   ══════════════════════════════════════════════════════════════ */
interface ShellProps { children: ReactNode }

const Shell: FC<ShellProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const { totalQuestions, clearAllQuestions, toast } = useAppContext()
  const location = useLocation()

  /* Sidebar width changes with collapse state */
  const sidebarW = collapsed ? 64 : 240

  /* Refs for GSAP targets */
  const logoRef = useRef<HTMLDivElement>(null)

  /* ── GSAP: logo fade in on mount ── */
  useEffect(() => {
    if (!logoRef.current) return
    gsap.from(logoRef.current, { opacity: 0, y: 8, duration: 0.45, ease: 'power2.out' })
  }, [])

  /* ── Handler: clear all saved questions ── */
  function handleClearAll() {
    clearAllQuestions()
    toast('تم مسح كل الأسئلة', 'success')
  }

  return (
    <div
      style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}
    >

      {/* ══ SIDEBAR ══════════════════════════════════════════ */}
      <aside
        style={{
          width: sidebarW,
          minWidth: sidebarW,
          /* Deep glass background — editorial dark */
          background: 'var(--color-sidebar-bg)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          /* RTL: border on left (which is the inner edge in RTL) */
          borderLeft: '1px solid rgba(255,255,255,0.055)',
          transition: 'width 280ms cubic-bezier(0.4,0,0.2,1), min-width 280ms cubic-bezier(0.4,0,0.2,1)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 50,
        }}
      >

        {/* ── Logo row ── */}
        <div
          style={{
            height: 60,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: collapsed ? '0 13px' : '0 14px',
            borderBottom: '1px solid rgba(255,255,255,0.055)',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          {/* Logo mark — GSAP glow pulse target */}
          <div
            ref={logoRef}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              boxShadow: '0 2px 8px rgba(99,102,241,0.30)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 12,
              color: '#fff',
              flexShrink: 0,
              letterSpacing: '-0.02em',
            }}
          >
            IC
          </div>

          {/* Brand name — hidden when collapsed */}
          {!collapsed && (
            <div style={{ overflow: 'hidden', animation: 'fadeIn 180ms ease-out both' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 13,
                color: 'var(--color-text)',
                whiteSpace: 'nowrap',
                letterSpacing: '-0.01em',
              }}>
                Interview Coach
              </div>
              <div style={{ fontSize: 9, color: 'var(--color-text-subtle)', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
                AI · React + TypeScript
              </div>
            </div>
          )}
        </div>

        {/* ── Navigation links ── */}
        <nav
          style={{
            flex: 1,
            padding: '8px 6px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
          aria-label="القائمة الرئيسية"
        >
          {NAV.map(({ to, label, Icon, end }) => {
            /* Determine active state manually for style control */
            const isActive = end
              ? location.pathname === to
              : location.pathname.startsWith(to)
            const isSaved = to === '/saved'

            return (
              <NavLink
                key={to}
                to={to}
                end={end}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  height: 42,
                  padding: collapsed ? '0 13px' : '0 11px',
                  borderRadius: 9,
                  textDecoration: 'none',
                  color: isActive ? '#fff' : 'var(--color-text-muted)',
                  /* Active state: semi-transparent blue fill */
                  background: isActive ? 'var(--color-sidebar-active)' : 'transparent',
                  boxShadow: isActive
                    ? 'inset 0 0 0 1px rgba(59,130,246,0.25), 0 0 12px rgba(59,130,246,0.08)'
                    : 'none',
                  transition: 'all var(--transition-fast)',
                  position: 'relative',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
                onMouseEnter={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
                }}
                onMouseLeave={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'
                }}
              >
                {/* Active indicator bar — RTL right edge accent */}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '18%',
                      height: '64%',
                      width: 3,
                      borderRadius: '3px 0 0 3px',
                      background: 'linear-gradient(180deg, var(--color-primary), var(--color-accent))',
                      boxShadow: '0 0 10px var(--color-accent)',
                    }}
                  />
                )}

                {/* Icon — colored when active */}
                <span style={{ flexShrink: 0, color: isActive ? 'var(--color-accent)' : 'inherit' }}>
                  <Icon />
                </span>

                {/* Label — hidden when collapsed */}
                {!collapsed && (
                  <span style={{
                    fontSize: 12,
                    fontWeight: isActive ? 600 : 400,
                    flex: 1,
                    animation: 'fadeIn 140ms ease-out both',
                  }}>
                    {label}
                  </span>
                )}

                {/* Saved count badge */}
                {!collapsed && isSaved && totalQuestions > 0 && (
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      padding: '1px 5px',
                      borderRadius: 99,
                      background: 'var(--color-accent-dim)',
                      color: 'var(--color-accent)',
                      flexShrink: 0,
                    }}
                  >
                    {totalQuestions}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* ── Bottom controls: clear all + collapse toggle ── */}
        <div
          style={{
            padding: '6px 6px 12px',
            borderTop: '1px solid rgba(255,255,255,0.055)',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            flexShrink: 0,
          }}
        >
          {/* Clear all button — only when expanded and has saved questions */}
          {!collapsed && totalQuestions > 0 && (
            <button
              onClick={handleClearAll}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                height: 34,
                padding: '0 11px',
                borderRadius: 8,
                background: 'transparent',
                border: '1px solid rgba(244,63,94,0.22)',
                color: 'rgba(244,63,94,0.65)',
                fontSize: 11,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                width: '100%',
                fontFamily: 'inherit',
                animation: 'fadeIn 150ms ease-out both',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.background    = 'rgba(244,63,94,0.07)'
                el.style.color         = '#f43f5e'
                el.style.borderColor   = 'rgba(244,63,94,0.45)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.background    = 'transparent'
                el.style.color         = 'rgba(244,63,94,0.65)'
                el.style.borderColor   = 'rgba(244,63,94,0.22)'
              }}
            >
              مسح الكل ({totalQuestions})
            </button>
          )}

          {/* Collapse / expand toggle */}
          <button
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? 'توسيع القائمة' : 'طي القائمة'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 8,
              height: 34,
              padding: collapsed ? '0 13px' : '0 11px',
              borderRadius: 8,
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-subtle)',
              fontSize: 11,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              width: '100%',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <IconChevron flipped={!collapsed} />
            {!collapsed && (
              <span style={{ animation: 'fadeIn 140ms ease-out both' }}>طي القائمة</span>
            )}
          </button>
        </div>
      </aside>

      {/* ══ MAIN CONTENT AREA ════════════════════════════════ */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >

        {/* ── Fixed ambient orbs — GSAP parallax targets ── */}
        {/* Purple orb: top-right quadrant */}
        <div
          className="orb orb-purple"
          style={{
            position: 'fixed',
            top: -160,
            right: -120,
            width: 640,
            height: 640,
            zIndex: 0,
          }}
        />
        {/* Blue orb: bottom-left quadrant */}
        <div
          className="orb orb-blue"
          style={{
            position: 'fixed',
            bottom: -280,
            left: -180,
            width: 720,
            height: 720,
            zIndex: 0,
          }}
        />
        {/* Cyan orb: mid-center accent */}
        <div
          className="orb orb-cyan"
          style={{
            position: 'fixed',
            top: '40%',
            left: '30%',
            width: 480,
            height: 320,
            zIndex: 0,
            opacity: 0.6,
          }}
        />

        {/* ── Subtle grid dot texture ── */}
        <div
          className="grid-bg"
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* ── Page content — stacked above decorative layers ── */}
        <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
          {children}
        </div>
      </main>

    </div>
  )
}

export default Shell
