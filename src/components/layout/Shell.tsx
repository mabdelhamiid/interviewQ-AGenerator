import { type FC, type ReactNode, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

/* ── Icons ──────────────────────────────────────────────────── */
const IconHome = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const IconGenerate = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)
const IconSaved = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
)
const IconGitHub = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
)
const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)
const IconChevron = ({ flipped }: { flipped: boolean }) => (
  <svg
    width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: flipped ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 300ms cubic-bezier(0.4,0,0.2,1)' }}
  >
    <polyline points="15 18 9 12 15 6"/>
  </svg>
)

/* ── Nav config ─────────────────────────────────────────────── */
const NAV = [
  { to: '/',         label: 'الرئيسية',    Icon: IconHome,     end: true  },
  { to: '/generate', label: 'توليد أسئلة', Icon: IconGenerate, end: false },
  { to: '/saved',    label: 'محفوظة',      Icon: IconSaved,    end: false },
  { to: '/github',   label: 'GitHub',      Icon: IconGitHub,   end: false },
  { to: '/settings', label: 'الإعدادات',   Icon: IconSettings, end: false },
]

/* ── Shell ──────────────────────────────────────────────────── */
interface ShellProps {
  children: ReactNode
}

const Shell: FC<ShellProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const { totalQuestions, clearAllQuestions, toast } = useAppContext()
  const location = useLocation()

  const sidebarW = collapsed ? 64 : 240

  function handleClearAll() {
    clearAllQuestions()
    toast('تم مسح كل الأسئلة', 'success')
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-bg)' }}>

      {/* ── Sidebar ── */}
      <aside
        style={{
          width: sidebarW,
          minWidth: sidebarW,
          background: 'var(--color-sidebar-bg)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          transition: 'width 300ms cubic-bezier(0.4,0,0.2,1), min-width 300ms cubic-bezier(0.4,0,0.2,1)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 50,
        }}
      >
        {/* Logo row */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: collapsed ? '0 13px' : '0 16px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'var(--color-accent)',
              boxShadow: 'var(--shadow-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 14,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            IC
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden', animation: 'fadeIn 180ms ease-out both' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--color-text)', whiteSpace: 'nowrap' }}>
                Interview Coach
              </div>
              <div style={{ fontSize: 10, color: 'var(--color-text-subtle)', whiteSpace: 'nowrap' }}>
                AI · React + TypeScript
              </div>
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '8px 6px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', overflowX: 'hidden' }}>
          {NAV.map(({ to, label, Icon, end }) => {
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
                  height: 44,
                  padding: collapsed ? '0 13px' : '0 12px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  color: isActive ? '#fff' : 'var(--color-text-muted)',
                  background: isActive ? 'var(--color-sidebar-active)' : 'transparent',
                  boxShadow: isActive ? 'inset 0 0 0 1px rgba(59,130,246,0.3), var(--shadow-glow)' : 'none',
                  transition: 'all var(--transition-fast)',
                  position: 'relative',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
                onMouseEnter={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'
                }}
                onMouseLeave={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'
                }}
              >
                {/* Active left-bar accent */}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '20%',
                      height: '60%',
                      width: 3,
                      borderRadius: '3px 0 0 3px',
                      background: 'var(--color-accent)',
                      boxShadow: '0 0 8px var(--color-accent)',
                    }}
                  />
                )}

                <span style={{ flexShrink: 0, color: isActive ? 'var(--color-accent)' : 'inherit' }}>
                  <Icon />
                </span>

                {!collapsed && (
                  <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, flex: 1, animation: 'fadeIn 150ms ease-out both' }}>
                    {label}
                  </span>
                )}

                {/* Saved badge */}
                {!collapsed && isSaved && totalQuestions > 0 && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '1px 6px',
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

        {/* Bottom: clear all + collapse toggle */}
        <div
          style={{
            padding: '8px 6px 12px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            flexShrink: 0,
          }}
        >
          {/* Clear all — only when expanded and has items */}
          {!collapsed && totalQuestions > 0 && (
            <button
              onClick={handleClearAll}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                height: 36,
                padding: '0 12px',
                borderRadius: 8,
                background: 'transparent',
                border: '1px solid rgba(244,63,94,0.25)',
                color: 'rgba(244,63,94,0.7)',
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                width: '100%',
                fontFamily: 'inherit',
                animation: 'fadeIn 150ms ease-out both',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.background = 'rgba(244,63,94,0.08)'
                el.style.color = '#f43f5e'
                el.style.borderColor = 'rgba(244,63,94,0.5)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.background = 'transparent'
                el.style.color = 'rgba(244,63,94,0.7)'
                el.style.borderColor = 'rgba(244,63,94,0.25)'
              }}
            >
              مسح الكل ({totalQuestions})
            </button>
          )}

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? 'توسيع القائمة' : 'طي القائمة'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 8,
              height: 36,
              padding: collapsed ? '0 13px' : '0 12px',
              borderRadius: 8,
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-subtle)',
              fontSize: 12,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              width: '100%',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <IconChevron flipped={!collapsed} />
            {!collapsed && <span style={{ animation: 'fadeIn 150ms ease-out both' }}>طي القائمة</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Ambient glows */}
        <div
          style={{
            position: 'fixed',
            top: -200,
            right: -150,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,92,252,0.10) 0%, transparent 65%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: 'fixed',
            bottom: -300,
            left: -200,
            width: 700,
            height: 700,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 65%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Grid texture */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
            opacity: 0.02,
            backgroundImage: `
              linear-gradient(rgba(240,240,255,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(240,240,255,1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  )
}

export default Shell
