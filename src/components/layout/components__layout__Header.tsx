// src/components/layout/Header.tsx
// ══════════════════════════════════════════
// الـ Header الثابت - فيه التنقل بين الصفحات
// ══════════════════════════════════════════

import type { CSSProperties, FC } from 'react'
import { NavLink } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const Header: FC = () => {
  const { totalQuestions, clearAllQuestions } = useAppContext()
  const navLinks = [
    { to: '/',        label: '🏠 الرئيسية' },
    { to: '/generate', label: '⚡ توليد أسئلة' },
    { to: '/saved',    label: `💾 محفوظة (${totalQuestions})` },
    { to: '/settings', label: '⚙️ الإعدادات' },
  ]

  return (
    <header style={styles.header}>
      <div style={styles.inner}>

        {/* Logo */}
        <NavLink to="/" style={styles.logo}>
          <div style={styles.logoIcon}>💻</div>
          <div>
            <div style={styles.logoTitle}>Interview Coach</div>
            <div style={styles.logoSub}>AI · React + TypeScript</div>
          </div>
        </NavLink>

        {/* Navigation */}
        <nav style={styles.nav}>
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                ...styles.navLink,
                color:           isActive ? '#60A5FA' : '#475569',
                borderBottom:    isActive ? '2px solid #3B82F6' : '2px solid transparent',
                background:      isActive ? '#1D4ED811' : 'transparent',
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Clear All */}
        {totalQuestions > 0 && (
          <button
            onClick={() => { if (confirm('مسح كل الأسئلة المحفوظة؟')) clearAllQuestions() }}
            style={styles.clearBtn}
          >
            🗑 مسح الكل
          </button>
        )}
      </div>
    </header>
  )
}

const styles: Record<string, CSSProperties> = {
  header: {
    background: 'linear-gradient(180deg, #040F22ee 0%, #030D1Eee 100%)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid #0F2444',
    position: 'sticky', top: 0, zIndex: 100,
    padding: '0 40px',
  },
  inner: {
    maxWidth: 1400, margin: '0 auto',
    display: 'flex', alignItems: 'center', gap: 24,
    height: 60,
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 10,
    textDecoration: 'none', flexShrink: 0,
  },
  logoIcon: {
    width: 36, height: 36, borderRadius: 8,
    background: 'linear-gradient(135deg, #1D4ED8, #0F4C81)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 18,
  },
  logoTitle: { fontSize: 14, fontWeight: 700, color: '#F1F5F9' },
  logoSub:   { fontSize: 10, color: '#475569' },
  nav: {
    display: 'flex', alignItems: 'center', gap: 4, flex: 1,
  },
  navLink: {
    padding: '4px 14px', borderRadius: '6px 6px 0 0',
    textDecoration: 'none', fontSize: 13, fontWeight: 500,
    transition: 'all 0.2s', whiteSpace: 'nowrap',
    height: 60, display: 'flex', alignItems: 'center',
  },
  clearBtn: {
    padding: '5px 12px', background: 'transparent',
    border: '1px solid #1E3A5F', borderRadius: 8,
    color: '#475569', cursor: 'pointer', fontSize: 12, flexShrink: 0,
  },
}

export default Header
