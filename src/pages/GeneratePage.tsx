import { useState, useRef, useCallback, useEffect } from 'react'
import type { FC, KeyboardEvent } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { CATEGORIES, LEVELS } from '../constants'
import { AI_MODELS } from '../constants/models'
import { useGenerate } from '../hooks/useGenerate'
import { dynColor } from '../utils/dynColor'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import SkeletonList from '../components/ui/SkeletonCard'
import type { Question } from '../types'
import confetti from 'canvas-confetti'
import gsap from 'gsap'

/* ── Types ──────────────────────────────────────────────────── */
type Rating       = 'good' | 'ok' | 'bad'
type PracticeMode = 'idle' | 'practicing' | 'results'

/* ── Constants ──────────────────────────────────────────────── */
const TIMER_TOTAL = 90
const RADIUS      = 32
const CIRC        = 2 * Math.PI * RADIUS

const RATING_BTNS: { rating: Rating; label: string; bg: string; color: string; border: string }[] = [
  { rating: 'good', label: '✓  عرفتها', bg: 'rgba(16,185,129,0.12)',  color: '#10b981', border: 'rgba(16,185,129,0.35)' },
  { rating: 'ok',   label: '~  تقريباً',  bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'rgba(245,158,11,0.35)' },
  { rating: 'bad',  label: '✗  ما عرفت', bg: 'rgba(244,63,94,0.12)',   color: '#f43f5e', border: 'rgba(244,63,94,0.35)'  },
]

/* ── CircularTimer ──────────────────────────────────────────── */
const CircularTimer: FC<{ timeLeft: number }> = ({ timeLeft }) => {
  const offset = CIRC * (1 - timeLeft / TIMER_TOTAL)
  const color  = timeLeft < 20 ? '#f43f5e' : timeLeft < 45 ? '#f59e0b' : 'var(--color-accent)'
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" style={{ flexShrink: 0 }} aria-label={`${timeLeft} ثانية متبقية`}>
      <circle cx="36" cy="36" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3" />
      <circle
        cx="36" cy="36" r={RADIUS} fill="none"
        stroke={color} strokeWidth="3"
        strokeDasharray={CIRC} strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
        style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.4s ease' }}
      />
      <text x="36" y="41" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="700" fontFamily="Syne, system-ui">
        {timeLeft}
      </text>
    </svg>
  )
}

/* ── useCounter ─────────────────────────────────────────────── */
function useCounter(target: number, active: boolean, duration = 1200) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    if (target === 0) { setVal(0); return }
    let current = 0
    const inc = target / (duration / 16)
    const id = setInterval(() => {
      current += inc
      if (current >= target) { setVal(target); clearInterval(id); return }
      setVal(Math.floor(current))
    }, 16)
    return () => clearInterval(id)
  }, [active, target, duration])
  return val
}

/* ── PracticeCard ───────────────────────────────────────────── */
interface PracticeCardProps {
  question   : Question
  idx        : number
  total      : number
  catColor   : string
  levelColor : string
  onRate     : (r: Rating) => void
  onExit     : () => void
}

const PracticeCard: FC<PracticeCardProps> = ({
  question, idx, total, catColor, levelColor, onRate, onExit,
}) => {
  /* ── Practice Card state ── */
  const [showAnswer, setShowAnswer] = useState(false)
  const [userNote,   setUserNote]   = useState('')
  const [timeLeft,   setTimeLeft]   = useState(TIMER_TOTAL)
  const [exiting,    setExiting]    = useState(false)

  /* ── Timer countdown ── */
  useEffect(() => {
    if (timeLeft <= 0) return
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timeLeft])

  /* ── Rating handler with exit animation ── */
  function handleRate(rating: Rating) {
    setExiting(true)
    setTimeout(() => onRate(rating), 260)
  }

  const progress = (idx / total) * 100

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)', position: 'relative' }}>

      {/* ── Fixed progress bar ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 200, background: 'rgba(255,255,255,0.05)' }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${catColor}, var(--color-accent))`,
          boxShadow: `0 0 10px ${catColor}88`,
          transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>

      {/* ── Practice header with exit button + timer ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 32px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
        background: 'rgba(var(--color-bg-rgb, 10,10,20), 0.75)',
        flexShrink: 0,
      }}>
        <button
          onClick={onExit}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--color-text-subtle)', fontSize: 13,
            fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6,
            transition: 'color var(--transition-fast)',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-subtle)' }}
        >
          ← خروج
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600 }}>
            {idx + 1} / {total}
          </span>
          <CircularTimer timeLeft={timeLeft} />
        </div>
      </div>

      {/* ── Practice content area ── */}
      <div
        style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: 'clamp(28px, 5vw, 56px) clamp(16px, 5vw, 48px)',
          maxWidth: 740, margin: '0 auto', width: '100%',
          animation: exiting ? 'slideOutLeft 0.26s ease-out forwards' : 'slideInRight 0.35s ease-out both',
        }}
      >
        {/* ── Question glass card ── */}
        <div
          className="glass-card"
          style={{
            width: '100%',
            padding: 'clamp(22px, 4vw, 40px)',
            marginBottom: 24,
            boxShadow: 'var(--shadow-glass), var(--shadow-lift)',
          }}
        >
          {/* Category + question number badges */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 99,
              background: `${catColor}18`, color: catColor, border: `1px solid ${catColor}44`,
            }}>
              {question.modelIcon} {question.modelLabel.split(' ')[0]}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 99,
              background: `${levelColor}18`, color: levelColor, border: `1px solid ${levelColor}44`,
            }}>
              سؤال {idx + 1}
            </span>
          </div>

          {/* Question text */}
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.1rem, 2.5vw, 1.45rem)',
            fontWeight: 700, lineHeight: 1.6,
            color: 'var(--color-text)', margin: 0,
          }}>
            {question.q}
          </p>
        </div>

        {/* ── User note textarea (pre-answer) ── */}
        {!showAnswer && (
          <div style={{ width: '100%', marginBottom: 20, animation: 'fadeIn 0.3s ease-out both' }}>
            <label style={{
              display: 'block', fontSize: 12, fontWeight: 600,
              color: 'var(--color-text-muted)', marginBottom: 8,
            }}>
              دوّن إجابتك (اختياري)
            </label>
            <textarea
              value={userNote}
              onChange={e => setUserNote(e.target.value)}
              placeholder="اكتب ما تعرفه قبل ما تشوف الإجابة..."
              rows={4}
              style={{
                width: '100%', padding: '14px 16px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 12, resize: 'vertical',
                color: 'var(--color-text)', fontSize: 14,
                fontFamily: 'inherit', lineHeight: 1.75,
                transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
                outline: 'none', boxSizing: 'border-box',
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = 'rgba(59,130,246,0.55)'
                e.currentTarget.style.boxShadow   = '0 0 0 3px rgba(59,130,246,0.10)'
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'
                e.currentTarget.style.boxShadow   = 'none'
              }}
            />
          </div>
        )}

        {/* ── Reveal answer button ── */}
        {!showAnswer && (
          <button
            onClick={() => setShowAnswer(true)}
            style={{
              width: '100%', padding: '14px 40px', borderRadius: 12,
              background: 'var(--color-accent)', color: '#fff',
              fontWeight: 700, fontSize: 15, border: 'none',
              cursor: 'pointer', boxShadow: 'var(--shadow-glow)',
              transition: 'all var(--transition-fast)', fontFamily: 'inherit',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--color-accent-hover)'
              e.currentTarget.style.transform  = 'translateY(-2px)'
              e.currentTarget.style.boxShadow  = '0 0 40px rgba(59,130,246,0.40)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--color-accent)'
              e.currentTarget.style.transform  = 'translateY(0)'
              e.currentTarget.style.boxShadow  = 'var(--shadow-glow)'
            }}
          >
            اعرض إجابة الـ AI
          </button>
        )}

        {/* ── AI answer + self-rating ── */}
        {showAnswer && (
          <div style={{ width: '100%', animation: 'fadeUp 0.4s ease-out both' }}>
            {/* Answer glass card */}
            <div
              className="glass-card"
              style={{ padding: 'clamp(18px, 3vw, 30px)', marginBottom: 20, borderColor: 'rgba(59,130,246,0.22)' }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 16,
              }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-accent)' }}>
                  إجابة الـ AI
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText(question.a)}
                  style={{
                    fontSize: 11, padding: '4px 10px', borderRadius: 8,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'var(--color-text-subtle)', cursor: 'pointer',
                    fontFamily: 'inherit', transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-subtle)' }}
                >
                  نسخ
                </button>
              </div>
              <pre style={{
                fontSize: 13, lineHeight: 1.9,
                color: 'var(--color-text-muted)',
                whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                fontFamily: 'inherit', margin: 0,
              }}>
                {question.a}
              </pre>
            </div>

            {/* ── Self-rating buttons ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {RATING_BTNS.map(({ rating, label, bg, color, border }) => (
                <button
                  key={rating}
                  onClick={() => handleRate(rating)}
                  style={{
                    padding: '14px 8px', borderRadius: 12,
                    background: bg, color, border: `1px solid ${border}`,
                    fontWeight: 700, fontSize: 14, cursor: 'pointer',
                    transition: 'all var(--transition-fast)', fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform  = 'translateY(-3px)'
                    e.currentTarget.style.boxShadow  = `0 6px 20px ${color}33`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform  = 'translateY(0)'
                    e.currentTarget.style.boxShadow  = 'none'
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── ResultsView ────────────────────────────────────────────── */
interface ResultsViewProps {
  questions: Question[]
  ratings  : Rating[]
  catColor : string
  onReplay : () => void
  onExit   : () => void
}

const ResultsView: FC<ResultsViewProps> = ({ questions, ratings, catColor: _catColor, onReplay, onExit }) => {
  /* ── Score calculation ── */
  const total = questions.length
  const good  = ratings.filter(r => r === 'good').length
  const ok    = ratings.filter(r => r === 'ok').length
  const bad   = ratings.filter(r => r === 'bad').length
  const score = total > 0 ? Math.round(((good * 1 + ok * 0.5) / total) * 100) : 0

  /* ── Animated counter + bars-in state ── */
  const [counting, setCounting] = useState(false)
  const [barsIn,   setBarsIn]   = useState(false)
  const displayScore = useCounter(score, counting)

  /* ── Trigger animations on mount ── */
  useEffect(() => {
    const t1 = setTimeout(() => setCounting(true), 120)
    const t2 = setTimeout(() => setBarsIn(true),   500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  /* ── Confetti on high score ── */
  useEffect(() => {
    if (score < 70) return
    const t = setTimeout(() => {
      confetti({
        particleCount: 130, spread: 80, origin: { y: 0.55 },
        colors: ['#3b82f6', '#7c5cfc', '#10b981', '#f59e0b', '#f0f0ff'],
      })
    }, 500)
    return () => clearTimeout(t)
  }, [score])

  /* ── Score color + label ── */
  const scoreColor = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#f43f5e'
  const scoreLabel = score >= 70 ? 'أداء ممتاز! 🎉' : score >= 40 ? 'أداء جيد، واصل!' : 'تحتاج مراجعة أكتر'

  /* ── Performance bars data ── */
  const bars = [
    { label: 'عرفت',    count: good, color: '#10b981', pct: total > 0 ? (good / total) * 100 : 0 },
    { label: 'تقريباً', count: ok,   color: '#f59e0b', pct: total > 0 ? (ok   / total) * 100 : 0 },
    { label: 'ما عرفت', count: bad,  color: '#f43f5e', pct: total > 0 ? (bad  / total) * 100 : 0 },
  ]

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 'clamp(32px, 6vw, 64px)', background: 'var(--color-bg)',
    }}>

      {/* ── Ambient glow blob ── */}
      <div style={{
        position: 'fixed', top: '15%', left: '50%', transform: 'translateX(-50%)',
        width: 560, height: 420, borderRadius: '50%', pointerEvents: 'none',
        background: `radial-gradient(ellipse, ${scoreColor}18 0%, transparent 65%)`,
      }} />

      <div style={{ maxWidth: 580, width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>

        {/* ── Score circle with glow ring ── */}
        <div style={{
          width: 160, height: 160, borderRadius: '50%',
          margin: '0 auto 28px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: `radial-gradient(circle, ${scoreColor}15 0%, transparent 70%)`,
          border: `2px solid ${scoreColor}44`,
          boxShadow: `0 0 48px ${scoreColor}22, 0 0 80px ${scoreColor}11, inset 0 0 24px ${scoreColor}08`,
          animation: 'fadeUp 0.5s ease-out both',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 800,
            color: scoreColor, lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {displayScore}
          </span>
          <span style={{ fontSize: 14, color: 'var(--color-text-muted)', marginTop: 4 }}>/ 100</span>
        </div>

        {/* ── Score label ── */}
        <p style={{
          fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700,
          color: 'var(--color-text)', marginBottom: 8,
          animation: 'fadeUp 0.5s ease-out 100ms both',
        }}>
          {scoreLabel}
        </p>

        {/* ── Summary line ── */}
        <p style={{
          fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 40,
          animation: 'fadeUp 0.5s ease-out 200ms both',
        }}>
          {total} سؤال · {good} عرفت · {ok} تقريباً · {bad} ما عرفت
        </p>

        {/* ── Performance bars glass card ── */}
        <div
          className="glass-card"
          style={{ padding: 24, marginBottom: 32, animation: 'fadeUp 0.5s ease-out 300ms both' }}
        >
          {bars.map(({ label, count, color, pct }) => (
            <div key={label} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color }}>{count} سؤال</span>
              </div>
              {/* Animated progress bar */}
              <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 4,
                  background: `linear-gradient(90deg, ${color}, ${color}bb)`,
                  boxShadow: `0 0 8px ${color}55`,
                  width: barsIn ? `${pct}%` : '0%',
                  transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)',
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA buttons ── */}
        <div style={{
          display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap',
          animation: 'fadeUp 0.5s ease-out 400ms both',
        }}>
          <button
            onClick={onReplay}
            style={{
              padding: '13px 32px', borderRadius: 12,
              background: 'var(--color-accent)', color: '#fff',
              fontWeight: 700, fontSize: 14, border: 'none',
              cursor: 'pointer', boxShadow: 'var(--shadow-glow)',
              transition: 'all var(--transition-fast)', fontFamily: 'inherit',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-accent-hover)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-accent)';       e.currentTarget.style.transform = 'translateY(0)' }}
          >
            ↺ تكرار الجلسة
          </button>
          <button
            onClick={onExit}
            style={{
              padding: '13px 32px', borderRadius: 12,
              background: 'transparent', color: 'var(--color-text)',
              fontWeight: 600, fontSize: 14,
              border: '1px solid rgba(255,255,255,0.14)',
              cursor: 'pointer', transition: 'all var(--transition-fast)', fontFamily: 'inherit',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            ← رجوع للتوليد
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── GeneratePage ───────────────────────────────────────────── */
const GeneratePage: FC = () => {
  /* ── Router + context ── */
  const navigate      = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { keys, selectedModel, setSelectedModel, questionSets, clearQuestions, toast } = useAppContext()

  /* ── Derived filter values ── */
  const selectedCat   = searchParams.get('cat')   || 'javascript'
  const selectedLevel = searchParams.get('level') || 'mid'
  const storeKey      = `${selectedCat}-${selectedLevel}`

  const currentCat   = CATEGORIES.find(c => c.id === selectedCat) ?? CATEGORIES[0]
  const currentLevel = LEVELS.find(l => l.id === selectedLevel)   ?? LEVELS[1]

  /* ── Generate hook ── */
  const { loading, error, loadingMsg, generate, currentModel, currentQs } = useGenerate({
    storeKey, currentCat, currentLevel,
  })

  /* ── Accordion + model refs ── */
  const [openQ,   setOpenQ]   = useState<number | null>(null)
  const modelRefs = useRef<(HTMLButtonElement | null)[]>([])

  /* ── Practice state ── */
  const [practiceMode,    setPracticeMode]    = useState<PracticeMode>('idle')
  const [practiceIdx,     setPracticeIdx]     = useState(0)
  const [practiceRatings, setPracticeRatings] = useState<Rating[]>([])

  /* ── Practice handlers ── */
  function startPractice() {
    setPracticeIdx(0)
    setPracticeRatings([])
    setPracticeMode('practicing')
  }

  function handleRate(rating: Rating) {
    const next = [...practiceRatings, rating]
    setPracticeRatings(next)
    if (practiceIdx + 1 >= currentQs.length) {
      setPracticeMode('results')
    } else {
      setPracticeIdx(i => i + 1)
    }
  }

  function exitPractice() {
    setPracticeMode('idle')
    setPracticeIdx(0)
    setPracticeRatings([])
  }

  /* ── Model keyboard navigation ── */
  function handleModelKeyDown(e: KeyboardEvent<HTMLButtonElement>, idx: number) {
    const total = AI_MODELS.length
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      modelRefs.current[(idx - 1 + total) % total]?.focus()
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      modelRefs.current[(idx + 1) % total]?.focus()
    }
  }

  /* ── Filter setters ── */
  function setCat(cat: string)     { setSearchParams({ cat, level: selectedLevel }); setOpenQ(null) }
  function setLevel(level: string) { setSearchParams({ cat: selectedCat, level });   setOpenQ(null) }

  /* ── Copy + clear handlers ── */
  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => toast('تم نسخ الإجابة', 'success'))
  }, [toast])

  const handleClear = useCallback(() => {
    clearQuestions(storeKey)
    toast('تم مسح الأسئلة', 'info')
  }, [clearQuestions, storeKey, toast])

  /* ── GSAP: stagger entrance for model selector on mount ── */
  useEffect(() => {
    const els = modelRefs.current.filter(Boolean)
    if (els.length === 0) return
    gsap.from(els, { opacity: 0, y: 16, duration: 0.45, stagger: 0.04, ease: 'power2.out' })
  }, []) // run once on mount

  /* ── GSAP: stagger entrance for question cards ── */
  useEffect(() => {
    if (currentQs.length === 0) return
    const cards = document.querySelectorAll('.q-card')
    gsap.fromTo(
      cards,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, stagger: 0.07, duration: 0.45, ease: 'power2.out' },
    )
  }, [currentQs])

  /* ── Practice mode renders (keep above normal view) ── */
  if (practiceMode === 'practicing' && currentQs[practiceIdx]) {
    return (
      <PracticeCard
        key={practiceIdx}
        question={currentQs[practiceIdx]}
        idx={practiceIdx}
        total={currentQs.length}
        catColor={currentCat.color}
        levelColor={currentLevel.color}
        onRate={handleRate}
        onExit={exitPractice}
      />
    )
  }

  if (practiceMode === 'results') {
    return (
      <ResultsView
        questions={currentQs}
        ratings={practiceRatings}
        catColor={currentCat.color}
        onReplay={startPractice}
        onExit={exitPractice}
      />
    )
  }

  /* ── Normal generate view ── */
  return (
    <div className="max-w-[1200px] mx-auto flex min-h-[calc(100vh-60px)]">

      {/* ── Sidebar: glass panel with category + level filters ── */}
      <aside
        className="glass w-[200px] flex-shrink-0 p-4 overflow-y-auto max-h-[calc(100vh-60px)] sticky top-[60px]"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(255,255,255,0.065)',
          borderRight: 'none',
        }}
        aria-label="الفلاتر"
      >
        {/* ── Level filter ── */}
        <div className="mb-6">
          <p className="text-[9px] font-bold text-[var(--color-text-subtle)] uppercase tracking-widest mb-2">المستوى</p>
          <div role="radiogroup" aria-label="مستوى الأسئلة">
            {LEVELS.map(l => (
              <button
                key={l.id} role="radio" aria-checked={selectedLevel === l.id}
                onClick={() => setLevel(l.id)} style={dynColor(l.color)}
                className={[
                  'block w-full text-right px-3 py-2 mb-1 rounded-lg text-xs font-semibold transition-all border',
                  selectedLevel === l.id
                    ? 'border-[var(--c)] bg-[var(--c-dim)] text-[var(--c)]'
                    : 'border-transparent text-[var(--color-text-subtle)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--color-text-muted)]',
                ].join(' ')}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Category filter ── */}
        <div>
          <p className="text-[9px] font-bold text-[var(--color-text-subtle)] uppercase tracking-widest mb-2">التصنيف</p>
          <div role="list" aria-label="تصنيفات الأسئلة">
            {CATEGORIES.map(cat => {
              const cnt   = questionSets[`${cat.id}-${selectedLevel}`]?.length || 0
              const isSel = selectedCat === cat.id
              return (
                <button
                  key={cat.id} role="listitem" onClick={() => setCat(cat.id)}
                  aria-pressed={isSel} style={dynColor(cat.color)}
                  className={[
                    'flex items-center gap-1.5 w-full px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all border mb-0.5',
                    isSel
                      ? 'border-[var(--c)] bg-[var(--c-dim)] text-[var(--c)]'
                      : 'border-transparent text-[var(--color-text-subtle)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--color-text-muted)]',
                  ].join(' ')}
                >
                  <span className="flex-shrink-0 w-4 text-center" aria-hidden="true">{cat.icon}</span>
                  <span className="flex-1 text-right truncate">{cat.label}</span>
                  {cnt > 0 && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0" style={{ background: 'var(--c-dim)', color: 'var(--c)' }}>
                      {cnt}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <main className="flex-1 p-5 md:p-8 overflow-x-hidden min-w-0">

        {/* ── Model selector with 3D tilt (GSAP useEffect) ── */}
        <section className="mb-5">
          <p className="text-[9px] font-bold text-[var(--color-text-subtle)] uppercase tracking-widest mb-2">AI Model</p>
          <div className="flex gap-1.5 flex-wrap" role="radiogroup" aria-label="اختيار موديل الذكاء الاصطناعي">
            {AI_MODELS.map((model, idx) => {
              const hasKey = !!model.getKey(keys)
              const isSel  = selectedModel === model.id
              return (
                <button
                  key={model.id}
                  ref={el => { modelRefs.current[idx] = el }}
                  role="radio" aria-checked={isSel}
                  onClick={() => setSelectedModel(model.id)}
                  onKeyDown={e => handleModelKeyDown(e, idx)}
                  tabIndex={isSel ? 0 : -1}
                  style={dynColor(model.color)}
                  className={[
                    'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-colors',
                    isSel
                      ? 'border-[var(--c)] bg-[var(--c-dim)] text-[var(--c)] shadow-[0_0_12px_var(--c-glow)]'
                      : hasKey
                        ? 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--c)] hover:bg-[var(--c-dim)] hover:text-[var(--c)]'
                        : 'border-[var(--color-border)] text-[var(--color-text-subtle)] opacity-60 hover:opacity-100',
                  ].join(' ')}
                >
                  <span aria-hidden="true">{model.icon}</span>
                  {model.label}
                  {model.free && (
                    <span className="text-[8px] font-bold px-1 py-px bg-[rgba(34,197,94,0.15)] text-[var(--color-success)] rounded">FREE</span>
                  )}
                  {!hasKey && <span className="text-[9px] text-[var(--color-warning)]" aria-label="يحتاج API key">●</span>}
                </button>
              )
            })}
          </div>
        </section>

        {/* ── Generate panel (glass-card) ── */}
        <div
          style={dynColor(currentCat.color)}
          className="glass-card mb-5 p-4 relative overflow-hidden"
        >
          {/* Subtle top gradient line */}
          <div className="absolute top-0 right-0 left-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--c-dim), transparent)' }} />

          {/* ── Active filter badges ── */}
          <div className="flex gap-2 mb-4 flex-wrap items-center">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1" style={{ background: 'var(--c-dim)', color: 'var(--c)' }}>
              <span aria-hidden="true">{currentCat.icon}</span>{currentCat.label}
            </span>
            <span style={dynColor(currentLevel.color)} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--c-dim)] text-[var(--c)]">
              {currentLevel.label}
            </span>
            <span style={dynColor(currentModel.color)} className="px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 bg-[var(--c-dim)] text-[var(--c)]">
              <span aria-hidden="true">{currentModel.icon}</span>{currentModel.label}
            </span>
            {currentQs.length > 0 && (
              <span className="text-xs text-[var(--color-text-subtle)] mr-auto">{currentQs.length} سؤال</span>
            )}
          </div>

          {/* ── Generate count buttons + actions ── */}
          <div className="flex gap-2 flex-wrap items-center">
            {([10, 20, 30] as const).map(n => (
              <button
                key={n}
                onClick={() => { generate(n); setOpenQ(null) }}
                disabled={loading}
                style={{ background: currentCat.color, boxShadow: `0 4px 16px ${currentCat.color}44` }}
                className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.97]"
                aria-label={`توليد ${n} سؤال`}
              >
                {loading ? '...' : `ولّد ${n}`}
              </button>
            ))}

            {/* ── Practice + clear + saved buttons ── */}
            {currentQs.length > 0 && !loading && (
              <>
                <button
                  onClick={startPractice}
                  style={{
                    padding: '6px 16px', borderRadius: 10,
                    background: 'rgba(59,130,246,0.14)',
                    border: '1px solid rgba(59,130,246,0.35)',
                    color: 'var(--color-accent)',
                    fontSize: 12, fontWeight: 700,
                    cursor: 'pointer', transition: 'all var(--transition-fast)',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.22)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.14)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  ▶ ممارسة {currentQs.length} سؤال
                </button>
                <Button variant="ghost" size="sm" onClick={handleClear}>مسح</Button>
                <Button variant="secondary" size="sm" onClick={() => navigate('/saved')}>المحفوظة</Button>
              </>
            )}

            {/* ── Missing API key warning ── */}
            {!currentModel.getKey(keys) && (
              <Button variant="danger" size="sm" onClick={() => navigate('/settings')}>أضف API Key</Button>
            )}
          </div>

          {/* ── Loading indicator (glass style) ── */}
          {loading && (
            <div
              style={{
                borderColor: `${currentCat.color}44`,
                color: currentCat.color,
                background: `${currentCat.color}08`,
                backdropFilter: 'blur(8px)',
              }}
              className="mt-3 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-xs"
            >
              <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin flex-shrink-0" aria-hidden="true" />
              {loadingMsg}
            </div>
          )}

          {/* ── Error message ── */}
          {error && (
            <div role="alert" className="mt-3 px-3.5 py-2.5 rounded-xl border text-xs text-[var(--color-error)]" style={{ background: 'rgba(244,63,94,0.06)', borderColor: 'rgba(244,63,94,0.25)' }}>
              {error}
            </div>
          )}
        </div>

        {/* ── Skeleton loading state ── */}
        {loading && <SkeletonList count={5} />}

        {/* ── Empty state ── */}
        {currentQs.length === 0 && !loading && (
          <EmptyState
            icon="🤖"
            title={`${currentModel.label} جاهز يولّد أسئلة ${currentCat.label}`}
            desc={`مستوى ${currentLevel.label} · اختار عدد الأسئلة فوق`}
          />
        )}

        {/* ── Question cards (stagger entrance via GSAP) ── */}
        {!loading && currentQs.map((item, i) => {
          const isOpen = openQ === i
          return (
            <div
              key={i}
              style={dynColor(item.modelColor)}
              className={[
                'q-card glass-card overflow-hidden transition-colors duration-200 mb-2',
                isOpen
                  ? 'border-[var(--c)] shadow-[0_0_20px_var(--c-glow)]'
                  : 'hover:border-[var(--color-border-hover)]',
              ].join(' ')}
            >
              {/* ── Question toggle button ── */}
              <button
                onClick={() => setOpenQ(isOpen ? null : i)}
                aria-expanded={isOpen} aria-controls={`answer-${i}`}
                className="w-full text-right px-4 py-3.5 bg-transparent cursor-pointer flex items-start justify-between gap-3 group"
              >
                <div className="flex items-start gap-2 flex-1 flex-wrap">
                  {/* Question number badge */}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 tabular-nums mt-0.5" style={{ background: 'var(--c-dim)', color: 'var(--c)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {/* Level badge */}
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 mt-0.5" style={{ background: `${currentLevel.color}22`, color: currentLevel.color }}>
                    {selectedLevel.toUpperCase()}
                  </span>
                  {/* Question text */}
                  <span className="text-sm font-medium text-[var(--color-text)] leading-snug">{item.q}</span>
                </div>
                {/* Chevron with rotation */}
                <span
                  className="flex-shrink-0 text-[var(--color-text-subtle)] transition-transform duration-300 mt-1"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  aria-hidden="true"
                >▾</span>
              </button>

              {/* ── Answer panel (expand/collapse) ── */}
              {isOpen && (
                <div id={`answer-${i}`} className="border-t border-[var(--color-border)] bg-[var(--color-bg)] animate-fade-in">
                  {/* Answer header: model label + copy button */}
                  <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)]">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: 'var(--c-dim)', color: 'var(--c)' }}>
                      {item.modelIcon} {item.modelLabel.split(' ')[0]}
                    </span>
                    <button
                      onClick={() => handleCopy(item.a)}
                      className="text-[11px] text-[var(--color-text-subtle)] hover:text-[var(--color-text)] border border-[var(--color-border)] rounded-lg px-2.5 py-1 transition-all hover:border-[var(--color-border-hover)] font-medium"
                      aria-label="نسخ الإجابة"
                    >
                      نسخ الإجابة
                    </button>
                  </div>
                  {/* Answer body */}
                  <pre className="px-4 py-4 text-[12.5px] leading-[1.9] text-[var(--color-text-muted)] whitespace-pre-wrap break-words m-0">
                    {item.a}
                  </pre>
                </div>
              )}
            </div>
          )
        })}

        {/* ── Load more button ── */}
        {currentQs.length > 0 && !loading && (
          <div className="text-center mt-6 mb-8">
            <button
              onClick={() => generate(10)}
              style={{ background: currentCat.color, boxShadow: `0 4px 20px ${currentCat.color}44` }}
              className="px-10 py-3 rounded-full text-sm font-bold text-white transition-all hover:brightness-110 active:scale-[0.97]"
            >
              ولّد 10 أكتر ↓
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default GeneratePage
