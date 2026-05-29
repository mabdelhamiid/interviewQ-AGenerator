/**
 * SavedPage.tsx
 * -------------
 * Displays all saved question sets grouped by category + level.
 *
 * Features:
 *  - GSAP stagger entrance on mount
 *  - Glass card surfaces for each group
 *  - Accordion expand/collapse for individual questions
 *  - Inline confirmation for delete actions (no browser confirm())
 */
import { useState, useEffect } from 'react'
import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useAppContext } from '../context/AppContext'
import { CATEGORIES, LEVELS } from '../constants'
import PageContainer from '../components/ui/PageContainer'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { dynColor } from '../utils/dynColor'

/* ══════════════════════════════════════════════════════════════
   SAVED PAGE
   ══════════════════════════════════════════════════════════════ */
const SavedPage: FC = () => {
  const navigate = useNavigate()
  const { questionSets, clearQuestions, clearAllQuestions, totalQuestions, toast } = useAppContext()

  /* ── Local UI state ── */
  const [openQ,       setOpenQ]       = useState<string | null>(null)   // expanded question key
  const [confirmKey,  setConfirmKey]  = useState<string | null>(null)   // section pending delete confirm
  const [confirmAll,  setConfirmAll]  = useState(false)                  // all-delete confirm state

  /* ── Derive visible sections (non-empty sets) ── */
  const sections = Object.entries(questionSets).filter(([, qs]) => qs.length > 0)

  /* ── GSAP: stagger entrance when sections change ── */
  useEffect(() => {
    const cards = document.querySelectorAll('.saved-group')
    if (cards.length === 0) return
    gsap.fromTo(
      cards,
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, stagger: 0.10, duration: 0.55, ease: 'power2.out' },
    )
  }, [sections.length])

  /* ── Handlers ── */
  function handleClearSection(key: string) {
    clearQuestions(key)
    setConfirmKey(null)
    toast('تم مسح القسم', 'success')
  }

  function handleClearAll() {
    clearAllQuestions()
    setConfirmAll(false)
    toast('تم مسح كل الأسئلة', 'success')
  }

  /* ══════════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════════ */
  return (
    <PageContainer>

      {/* ── Page header ── */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        gap: 16, paddingTop: 32, paddingBottom: 24, flexWrap: 'wrap',
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
            fontWeight: 800, color: 'var(--color-text)',
          }}>
            الأسئلة المحفوظة
          </h1>
          <p style={{ fontSize: 11, color: 'var(--color-text-subtle)', marginTop: 4 }}>
            {totalQuestions} سؤال في {sections.length} قسم
          </p>
        </div>

        {/* Action buttons row */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button size="sm" onClick={() => navigate('/generate')}>ولّد أكتر</Button>

          {/* Clear all — show button or inline confirm */}
          {totalQuestions > 0 && !confirmAll && (
            <Button size="sm" variant="danger" onClick={() => setConfirmAll(true)}>
              مسح الكل
            </Button>
          )}
          {confirmAll && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(244,63,94,0.07)',
              border: '1px solid rgba(244,63,94,0.22)',
              borderRadius: 10, padding: '6px 12px',
            }}>
              <span style={{ fontSize: 12, color: 'var(--color-error)' }}>مسح كل الأسئلة؟</span>
              <button
                onClick={handleClearAll}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 700, color: 'var(--color-error)', fontFamily: 'inherit',
                }}
              >
                نعم
              </button>
              <button
                onClick={() => setConfirmAll(false)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'inherit',
                }}
              >
                لا
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Empty state — shown when no saved questions ── */}
      {sections.length === 0 && (
        <EmptyState
          icon="📚"
          title="مفيش أسئلة محفوظة"
          desc="ولّد أسئلة من صفحة التوليد وبيتحفظوا تلقائياً"
        />
      )}

      {/* ── Question groups ── */}
      {sections.map(([key, questions]) => {
        /* Parse the key: "catId-levelId" format */
        const [catId, levelId] = key.split('-')
        const cat   = CATEGORIES.find(c => c.id === catId)
        const level = LEVELS.find(l => l.id === levelId)
        if (!cat || !level) return null

        const catVars   = dynColor(cat.color)
        const levelVars = dynColor(level.color)

        return (
          /* Group card — class saved-group for GSAP targeting */
          <div
            key={key}
            className="saved-group glass-card"
            style={{ ...catVars, marginBottom: 14, opacity: 0 /* GSAP sets to 1 */ }}
          >

            {/* ── Group header ── */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 18px',
              borderBottom: '1px solid rgba(255,255,255,0.055)',
              flexWrap: 'wrap', gap: 10,
            }}>
              {/* Category + level badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 99,
                  background: 'var(--c-dim)', color: 'var(--c)',
                  border: '1px solid var(--c-dim)',
                }}>
                  <span aria-hidden="true" style={{ marginLeft: 5 }}>{cat.icon}</span>
                  {cat.label}
                </span>
                <span style={{
                  ...levelVars,
                  fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99,
                  background: 'var(--c-dim)', color: 'var(--c)',
                }}>
                  {level.label}
                </span>
                <span style={{ fontSize: 12, color: 'var(--color-text-subtle)' }}>
                  {questions.length} سؤال
                </span>
              </div>

              {/* Delete section — button or inline confirm */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {confirmKey !== key ? (
                  <button
                    onClick={() => setConfirmKey(key)}
                    style={{
                      fontSize: 11, padding: '4px 12px', borderRadius: 8,
                      background: 'transparent',
                      border: '1px solid rgba(244,63,94,0.20)',
                      color: 'rgba(244,63,94,0.60)',
                      cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all var(--transition-fast)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(244,63,94,0.45)'
                      e.currentTarget.style.color       = '#f43f5e'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(244,63,94,0.20)'
                      e.currentTarget.style.color       = 'rgba(244,63,94,0.60)'
                    }}
                  >
                    مسح القسم
                  </button>
                ) : (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'rgba(244,63,94,0.07)',
                    border: '1px solid rgba(244,63,94,0.22)',
                    borderRadius: 8, padding: '4px 10px',
                  }}>
                    <span style={{ fontSize: 11, color: 'var(--color-error)' }}>تأكيد؟</span>
                    <button
                      onClick={() => handleClearSection(key)}
                      style={{
                        fontSize: 11, fontWeight: 700, color: 'var(--color-error)',
                        background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >
                      نعم
                    </button>
                    <button
                      onClick={() => setConfirmKey(null)}
                      style={{
                        fontSize: 11, color: 'var(--color-text-muted)',
                        background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >
                      لا
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ── Individual questions accordion ── */}
            {questions.map((q, i) => {
              const qKey   = `${key}-${i}`
              const isOpen = openQ === qKey

              return (
                <div
                  key={i}
                  style={{
                    borderBottom: i < questions.length - 1
                      ? '1px solid rgba(255,255,255,0.04)'
                      : 'none',
                  }}
                >
                  {/* Question toggle button */}
                  <button
                    onClick={() => setOpenQ(isOpen ? null : qKey)}
                    aria-expanded={isOpen}
                    style={{
                      width: '100%', textAlign: 'right',
                      padding: '12px 18px',
                      background: 'transparent', border: 'none',
                      cursor: 'pointer', fontFamily: 'inherit',
                      display: 'flex', alignItems: 'flex-start',
                      justifyContent: 'space-between', gap: 12,
                    }}
                  >
                    {/* Question number + text */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700,
                        padding: '2px 6px', borderRadius: 5,
                        background: 'var(--c-dim)', color: 'var(--c)',
                        flexShrink: 0, fontVariantNumeric: 'tabular-nums', marginTop: 2,
                      }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span style={{
                        fontSize: 13, fontWeight: 500,
                        color: 'var(--color-text)', lineHeight: 1.5,
                      }}>
                        {q.q}
                      </span>
                    </div>

                    {/* Expand chevron */}
                    <span style={{
                      fontSize: 13, color: 'var(--color-text-subtle)', flexShrink: 0,
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform var(--transition-normal)',
                      marginTop: 2,
                    }}>
                      ▾
                    </span>
                  </button>

                  {/* Answer panel — shown when expanded */}
                  {isOpen && (
                    <div
                      style={{
                        padding: '4px 18px 18px',
                        background: 'rgba(255,255,255,0.02)',
                        borderTop: '1px solid rgba(255,255,255,0.04)',
                        animation: 'fadeIn 0.25s ease-out both',
                      }}
                    >
                      {/* AI model label */}
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        marginBottom: 10, marginTop: 8,
                      }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 5,
                          background: 'var(--c-dim)', color: 'var(--c)',
                        }}>
                          {q.modelIcon} {q.modelLabel?.split(' ')[0]}
                        </span>
                        {/* Copy answer button */}
                        <button
                          onClick={() => navigator.clipboard.writeText(q.a).then(() => toast('تم نسخ الإجابة', 'success'))}
                          style={{
                            fontSize: 10, padding: '3px 10px', borderRadius: 7,
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: 'var(--color-text-subtle)', cursor: 'pointer',
                            fontFamily: 'inherit',
                            transition: 'all var(--transition-fast)',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text)' }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-subtle)' }}
                        >
                          نسخ
                        </button>
                      </div>

                      {/* Answer text */}
                      <pre style={{
                        fontSize: 12, lineHeight: 1.9,
                        color: 'var(--color-text-muted)',
                        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                        fontFamily: 'inherit', margin: 0,
                      }}>
                        {q.a}
                      </pre>
                    </div>
                  )}
                </div>
              )
            })}

          </div>
        )
      })}

      {/* Bottom spacer */}
      <div style={{ height: 48 }} />

    </PageContainer>
  )
}

export default SavedPage
