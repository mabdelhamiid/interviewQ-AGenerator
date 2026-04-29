import type { FC } from 'react'
import { NavLink } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const NAV = [
  { to: '/',         label: 'الرئيسية'    },
  { to: '/generate', label: 'توليد أسئلة' },
  { to: '/saved',    label: 'محفوظة'      },
  { to: '/github',   label: 'GitHub'      },
  { to: '/settings', label: 'الإعدادات'   },
]

const Header: FC = () => {
  const { totalQuestions, clearAllQuestions, toast } = useAppContext()

  function handleClearAll() {
    clearAllQuestions()
    toast('تم مسح كل الأسئلة', 'success')
  }

  return (
    <header
      className="sticky top-0 z-[100] border-b border-[var(--color-border)]"
      style={{ background: 'rgba(7,7,17,0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
    >
      <div className="max-w-[1280px] mx-auto flex items-center gap-6 h-[60px] px-6">

        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2.5 flex-shrink-0"
          aria-label="Interview Coach — الصفحة الرئيسية"
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{
              background: 'var(--color-primary)',
              boxShadow: '0 0 16px var(--color-primary-glow)',
            }}
          >
            IC
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-bold text-[var(--color-text)] leading-tight">Interview Coach</div>
            <div className="text-[10px] text-[var(--color-text-subtle)]">AI · React + TypeScript</div>
          </div>
        </NavLink>

        {/* Nav links */}
        <nav className="flex items-center gap-0.5 flex-1 overflow-x-auto" aria-label="التنقل الرئيسي">
          {NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                [
                  'flex items-center h-[60px] px-3 text-xs font-medium whitespace-nowrap',
                  'border-b-2 transition-all duration-150',
                  isActive
                    ? 'text-[var(--color-primary)] border-[var(--color-primary)] bg-[var(--color-primary-dim)]'
                    : 'text-[var(--color-text-subtle)] border-transparent hover:text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]',
                ].join(' ')
              }
            >
              {label}
              {to === '/saved' && totalQuestions > 0 && (
                <span className="mr-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--color-primary-dim)] text-[var(--color-primary)]">
                  {totalQuestions}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Clear all */}
        {totalQuestions > 0 && (
          <button
            onClick={handleClearAll}
            className="flex-shrink-0 text-xs text-[var(--color-text-subtle)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 transition-all hover:text-[var(--color-error)] hover:border-[rgba(244,63,94,0.4)]"
            aria-label="مسح كل الأسئلة المحفوظة"
          >
            مسح الكل
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
