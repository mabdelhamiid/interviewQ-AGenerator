/**
 * BankPage.tsx
 * ------------
 * Static question bank — 589 curated senior-level Q&A items
 * across 10 categories, all in Arabic.
 *
 * Features:
 *  - Full-text search across questions + answers
 *  - Category filter sidebar
 *  - Accordion expand/collapse per question
 *  - Senior tips toggle
 *  - Progress counter
 *  - GSAP stagger entrance on filter change
 */
import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import type { FC } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../utils/motion'
import { QUESTION_BANK } from '../data/questionBank'
import type { BankSection } from '../data/questionBank'
import EmptyState from '../components/ui/EmptyState'
import { dynColor } from '../utils/dynColor'

/* ══════════════════════════════════════════════════════════════
   BANK PAGE
   ══════════════════════════════════════════════════════════════ */
const BankPage: FC = () => {
  const [selectedCat, setSelectedCat] = useState<string>('all')
  const [search,      setSearch]      = useState('')
  const [openQ,       setOpenQ]       = useState<string | null>(null)
  const [showTip,     setShowTip]     = useState<Record<string, boolean>>({})
  const listRef = useRef<HTMLDivElement>(null)

  /* ── Derived: filtered sections ── */
  const filtered = useMemo<BankSection[]>(() => {
    const query = search.trim().toLowerCase()

    return QUESTION_BANK
      .filter(s => selectedCat === 'all' || s.id === selectedCat)
      .map(s => ({
        ...s,
        questions: s.questions.filter(q =>
          !query ||
          q.q.toLowerCase().includes(query) ||
          q.a.toLowerCase().includes(query)
        ),
      }))
      .filter(s => s.questions.length > 0)
  }, [selectedCat, search])

  const totalVisible = useMemo(
    () => filtered.reduce((acc, s) => acc + s.questions.length, 0),
    [filtered],
  )

  /* ── GSAP: stagger cards whenever results change ── */
  useEffect(() => {
    if (!listRef.current) return
    const cards = listRef.current.querySelectorAll('.bank-card')
    if (cards.length === 0) return
    if (prefersReducedMotion()) {
      gsap.set(cards, { opacity: 1, y: 0 })
      return
    }
    gsap.fromTo(
      cards,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, stagger: 0.04, duration: 0.38, ease: 'power2.out', clearProps: 'transform' },
    )
  }, [selectedCat, search])

  /* ── Handlers ── */
  const toggleQ   = useCallback((key: string) => setOpenQ(prev => prev === key ? null : key), [])
  const toggleTip = useCallback((key: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setShowTip(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const totalAll = QUESTION_BANK.reduce((a, s) => a + s.questions.length, 0)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', maxWidth: 1200, margin: '0 auto', paddingTop: 24, paddingBottom: 48, paddingRight: 'clamp(20px,4vw,56px)', paddingLeft: 'clamp(20px,4vw,56px)' }}>

      {/* ══ SIDEBAR: category filter ══════════════════════════ */}
      <aside
        style={{
          width: 200,
          minWidth: 200,
          flexShrink: 0,
          padding: '20px 8px',
          position: 'sticky',
          top: 0,
          height: 'calc(100vh)',
          overflowY: 'auto',
          borderLeft: '1px solid rgba(255,255,255,0.065)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
        aria-label="تصفية التصنيفات"
      >
        <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, paddingRight: 8 }}>
          التصنيف
        </p>

        {/* All button */}
        <button
          onClick={() => { setSelectedCat('all'); setOpenQ(null) }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', padding: '8px 10px', borderRadius: 8, marginBottom: 2,
            background: selectedCat === 'all' ? 'rgba(99,102,241,0.12)' : 'transparent',
            border: selectedCat === 'all' ? '1px solid rgba(99,102,241,0.30)' : '1px solid transparent',
            color: selectedCat === 'all' ? '#818cf8' : 'var(--color-text-muted)',
            cursor: 'pointer', fontSize: 11, fontWeight: selectedCat === 'all' ? 700 : 400,
            fontFamily: 'inherit', transition: 'all 110ms',
          }}
          onMouseEnter={e => { if (selectedCat !== 'all') (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
          onMouseLeave={e => { if (selectedCat !== 'all') (e.currentTarget as HTMLElement).style.background = 'transparent' }}
        >
          <span>الكل</span>
          <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 6, background: 'rgba(99,102,241,0.12)', color: '#818cf8' }}>
            {totalAll}
          </span>
        </button>

        {/* Per-category buttons */}
        {QUESTION_BANK.map(s => {
          const isSel = selectedCat === s.id
          return (
            <button
              key={s.id}
              onClick={() => { setSelectedCat(s.id); setOpenQ(null) }}
              style={dynColor(s.color)}
              className={[
                'flex items-center gap-1.5 w-full px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all border mb-0.5',
                isSel
                  ? 'border-[var(--c)] bg-[var(--c-dim)] text-[var(--c)]'
                  : 'border-transparent text-[var(--color-text-subtle)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--color-text-muted)]',
              ].join(' ')}
            >
              <span style={{ flexShrink: 0, width: 16, textAlign: 'center' }} aria-hidden="true">{s.label.slice(0, 2)}</span>
              <span style={{ flex: 1, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</span>
              <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 6, background: 'var(--c-dim)', color: 'var(--c)', flexShrink: 0 }}>
                {s.questions.length}
              </span>
            </button>
          )
        })}
      </aside>

      {/* ══ MAIN CONTENT ════════════════════════════════════════ */}
      <main style={{ flex: 1, minWidth: 0, padding: '20px 24px 40px' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)',
            fontWeight: 800, color: 'var(--color-text)', marginBottom: 4,
          }}>
            مكتبة الأسئلة
          </h1>
          <p style={{ fontSize: 12, color: 'var(--color-text-subtle)' }}>
            {totalAll} سؤال مُعدّ مسبقاً · مستوى Senior · عربي كامل
          </p>
        </div>

        {/* ── Search ── */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <span style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--color-text-subtle)', fontSize: 14, pointerEvents: 'none',
          }}>
            🔍
          </span>
          <input
            type="search"
            placeholder="ابحث في الأسئلة والإجابات..."
            value={search}
            onChange={e => { setSearch(e.target.value); setOpenQ(null) }}
            style={{
              width: '100%', padding: '10px 38px 10px 14px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--color-border)',
              borderRadius: 10, outline: 'none',
              color: 'var(--color-text)', fontSize: 13, fontFamily: 'inherit',
              transition: 'border-color 110ms',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.55)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--color-border)' }}
          />
        </div>

        {/* ── Results count ── */}
        {(search || selectedCat !== 'all') && (
          <p style={{ fontSize: 11, color: 'var(--color-text-subtle)', marginBottom: 14 }}>
            {totalVisible} نتيجة
            {search && <span> · بحث: "<span style={{ color: 'var(--color-accent)' }}>{search}</span>"</span>}
          </p>
        )}

        {/* ── Empty state ── */}
        {totalVisible === 0 && (
          <EmptyState icon="🔍" title="ما فيش نتائج" desc="جرب كلمة بحث مختلفة أو اختار تصنيف آخر" />
        )}

        {/* ── Question cards ── */}
        <div ref={listRef}>
          {filtered.map(section => (
            <div key={section.id} style={{ marginBottom: 28 }}>

              {/* Section header */}
              {(selectedCat === 'all' || filtered.length > 1) && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  marginBottom: 10, paddingBottom: 8,
                  borderBottom: `1px solid color-mix(in srgb, ${section.color} 13%, transparent)`,
                }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
                    background: `color-mix(in srgb, ${section.color} 10%, transparent)`, color: section.color,
                    border: `1px solid color-mix(in srgb, ${section.color} 20%, transparent)`,
                  }}>
                    {section.label}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--color-text-subtle)' }}>
                    {section.questions.length} سؤال
                  </span>
                </div>
              )}

              {/* Questions */}
              {section.questions.map((item, qi) => {
                const key    = `${section.id}-${qi}`
                const isOpen = openQ === key

                return (
                  <div
                    key={key}
                    className="bank-card"
                    style={{
                      background: 'var(--bg-surface)',
                      border: `1px solid ${isOpen ? section.color + '44' : 'var(--border-subtle)'}`,
                      borderRadius: 10,
                      marginBottom: 6,
                      overflow: 'hidden',
                      transition: 'border-color 150ms',
                      boxShadow: isOpen ? `0 0 16px color-mix(in srgb, ${section.color} 7%, transparent)` : 'none',
                    }}
                  >
                    {/* Question row */}
                    <button
                      onClick={() => toggleQ(key)}
                      aria-expanded={isOpen}
                      style={{
                        width: '100%', textAlign: 'right', padding: '11px 14px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 6, flexShrink: 0,
                          background: `color-mix(in srgb, ${section.color} 10%, transparent)`, color: section.color,
                        }}>
                          {String(qi + 1).padStart(2, '0')}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)', lineHeight: 1.5 }}>
                          {item.q}
                        </span>
                      </div>
                      <span style={{
                        color: section.color, fontSize: 14, flexShrink: 0, marginTop: 2,
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 250ms',
                        display: 'inline-block',
                      }} aria-hidden="true">▾</span>
                    </button>

                    {/* Answer panel */}
                    {isOpen && (
                      <div style={{
                        borderTop: `1px solid color-mix(in srgb, ${section.color} 13%, transparent)`,
                        background: 'var(--bg-primary)',
                        animation: 'fadeIn 0.2s ease-out both',
                      }}>
                        {/* Answer body */}
                        <pre style={{
                          padding: '14px 16px', margin: 0,
                          fontSize: 12.5, lineHeight: 1.9,
                          color: 'var(--color-text-muted)',
                          whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                          fontFamily: 'inherit',
                        }}>
                          {item.a}
                        </pre>

                        {/* Senior tip toggle */}
                        {item.senior && (
                          <div style={{
                            margin: '0 14px 14px',
                            borderRadius: 8,
                            border: `1px solid color-mix(in srgb, ${section.color} 20%, transparent)`,
                            overflow: 'hidden',
                          }}>
                            <button
                              onClick={e => toggleTip(key, e)}
                              style={{
                                width: '100%', textAlign: 'right', padding: '7px 12px',
                                background: `color-mix(in srgb, ${section.color} 5%, transparent)`, border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: 6,
                                fontSize: 11, fontWeight: 700, color: section.color,
                                fontFamily: 'inherit',
                              }}
                            >
                              <span>⭐ نصيحة Senior</span>
                              <span style={{ marginRight: 'auto', fontSize: 10, opacity: 0.7 }}>
                                {showTip[key] ? 'إخفاء ▴' : 'عرض ▾'}
                              </span>
                            </button>
                            {showTip[key] && (
                              <div style={{
                                padding: '8px 12px 10px',
                                background: `color-mix(in srgb, ${section.color} 3%, transparent)`,
                                fontSize: 12, lineHeight: 1.75,
                                color: 'var(--color-text-muted)',
                                borderTop: `1px solid color-mix(in srgb, ${section.color} 13%, transparent)`,
                                animation: 'fadeIn 0.18s ease-out both',
                              }}>
                                {item.senior}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default BankPage
