import { type FC, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { CATEGORIES, LEVELS } from '../constants'
import { dynColor } from '../utils/dynColor'

/* ── Data ───────────────────────────────────────────────────── */
const FREE_PROVIDERS = [
  { name: 'Google Gemini', desc: '3 موديلات مجانية',         color: '#4285F4', link: 'https://aistudio.google.com/app/apikey'     },
  { name: 'Groq',          desc: 'الأسرع · مجاني تماماً',    color: '#F55036', link: 'https://console.groq.com/keys'              },
  { name: 'Cerebras',      desc: 'أسرع inference في العالم', color: '#7C3AED', link: 'https://cloud.cerebras.ai'                  },
  { name: 'OpenRouter',    desc: '4+ موديلات مجانية',        color: '#6366F1', link: 'https://openrouter.ai/keys'                 },
  { name: 'Together.ai',   desc: 'free credits عند التسجيل', color: '#0EA5E9', link: 'https://api.together.xyz/settings/api-keys' },
  { name: 'Mistral AI',    desc: 'free tier متاح',            color: '#FF7000', link: 'https://console.mistral.ai/api-keys'        },
]

const FEATURES = [
  { icon: '⚡', title: 'توليد فوري بـ AI',  desc: '19 موديل AI يولّد أسئلة مقابلة لا نهائية مع إجابات تفصيلية وكود جاهز', accent: 'var(--color-accent)'   },
  { icon: '🎯', title: 'ثلاثة مستويات',     desc: 'Junior أو Mid أو Senior — كل مستوى بأسلوب وعمق مختلف يناسب موقفك',    accent: 'var(--color-primary)'  },
  { icon: '🗂',  title: '18 تصنيف تقني',    desc: 'JavaScript، React، CSS، Git، TypeScript وأكثر — غطّي كل ما تحتاجه',   accent: '#10b981'               },
  { icon: '📚', title: 'احفظ وراجع',        desc: 'احفظ أسئلتك المفضلة وراجعها وقت ما تريد — بدون إنترنت',               accent: '#f59e0b'               },
]

/* ── Hooks ──────────────────────────────────────────────────── */
function useInView(ref: React.RefObject<Element | null>, threshold = 0.15) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, threshold])
  return inView
}

function useCounter(target: number, active: boolean, duration = 1200) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    if (target === 0) { setValue(0); return }
    let current = 0
    const increment = target / (duration / 16)
    const id = setInterval(() => {
      current += increment
      if (current >= target) { setValue(target); clearInterval(id); return }
      setValue(Math.floor(current))
    }, 16)
    return () => clearInterval(id)
  }, [active, target, duration])
  return value
}

/* ── MockCard ───────────────────────────────────────────────── */
const MockCard: FC = () => (
  <div style={{ perspective: '1000px', width: '100%', maxWidth: 360 }}>
    <div
      className="glass-card"
      style={{
        animation: 'floatY 4s ease-in-out infinite',
        padding: '24px 20px',
        transform: 'rotateY(-7deg) rotateX(4deg)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Badges */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: 'rgba(59,130,246,0.14)', color: 'var(--color-accent)', border: '1px solid rgba(59,130,246,0.28)' }}>
          JavaScript
        </span>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: 'rgba(124,92,252,0.14)', color: 'var(--color-primary)', border: '1px solid rgba(124,92,252,0.28)' }}>
          Senior
        </span>
      </div>

      {/* Question */}
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.55, marginBottom: 14 }}>
        ما الفرق بين Prototype و Class في JavaScript؟
      </p>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 14 }} />

      {/* Answer */}
      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.75, marginBottom: 14 }}>
        كلاهما يُستخدم لإنشاء objects وتحقيق الـ inheritance، لكن Class هو syntactic sugar فوق الـ prototype chain...
      </p>

      {/* Code snippet */}
      <div style={{ background: 'rgba(0,0,0,0.40)', borderRadius: 8, padding: '10px 14px', marginBottom: 14 }}>
        <code style={{ fontFamily: 'var(--font-family-mono)', fontSize: 11, color: '#93c5fd', display: 'block', lineHeight: 1.65 }}>
          {'class Animal {'}<br />
          {'  constructor(name) {'}<br />
          {'    this.name = name'}<br />
          {'  }'}<br />
          {'}'}
        </code>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', gap: 8 }}>
        <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: 'rgba(16,185,129,0.12)', color: '#10b981', fontWeight: 600 }}>✓ محفوظ</span>
        <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-subtle)', fontWeight: 600 }}>↗ توسيع</span>
      </div>
    </div>
  </div>
)

/* ── HomePage ───────────────────────────────────────────────── */
const HomePage: FC = () => {
  const navigate     = useNavigate()
  const { totalQuestions, questionSets, keys } = useAppContext()
  const hasAnyKey    = Object.values(keys).some(Boolean)

  const statsRef    = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  const statsInView    = useInView(statsRef)
  const featuresInView = useInView(featuresRef)

  const c1 = useCounter(19,            statsInView)
  const c2 = useCounter(18,            statsInView)
  const c3 = useCounter(3,             statsInView)
  const c4 = useCounter(totalQuestions, statsInView)

  /* ── btn helpers ── */
  const accentBtn = {
    padding: '13px 30px', borderRadius: 12, border: 'none',
    background: 'var(--color-accent)', color: '#fff',
    fontWeight: 700, fontSize: 14, cursor: 'pointer',
    boxShadow: 'var(--shadow-glow)',
    transition: 'all var(--transition-fast)',
    fontFamily: 'inherit',
  } satisfies React.CSSProperties

  const ghostBtn = {
    padding: '13px 30px', borderRadius: 12,
    background: 'transparent', color: 'var(--color-text)',
    fontWeight: 600, fontSize: 14, cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.14)',
    transition: 'all var(--transition-fast)',
    fontFamily: 'inherit',
  } satisfies React.CSSProperties

  return (
    <div>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section style={{
        minHeight: '90vh',
        display: 'flex', alignItems: 'center',
        padding: 'clamp(48px, 8vw, 96px) clamp(24px, 5vw, 64px)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Ambient glows */}
        <div style={{ position: 'absolute', top: '5%', right: '25%', width: 560, height: 360, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(124,92,252,0.16) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%',  width: 400, height: 300, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 65%)',  pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', gap: 'clamp(32px, 6vw, 80px)' }}>

          {/* Text block */}
          <div style={{ flex: '1 1 55%', minWidth: 0 }}>

            {/* Eyebrow */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '4px 14px', borderRadius: 99,
              border: '1px solid rgba(59,130,246,0.28)',
              background: 'rgba(59,130,246,0.08)',
              fontSize: 11, fontWeight: 700,
              color: 'var(--color-accent)', letterSpacing: '0.07em',
              marginBottom: 28,
              animation: 'fadeUp 0.4s ease-out both',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-block', animation: 'glowPulse 2s ease-in-out infinite' }} />
              AI-Powered · 19 Model · 18 تصنيف
            </div>

            {/* Headline — word-by-word stagger */}
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 800, lineHeight: 1.1,
              marginBottom: 10,
              display: 'flex', flexWrap: 'wrap', gap: '0 14px',
            }}>
              {['Interview', 'Coach'].map((word, i) => (
                <span
                  key={word}
                  className="gradient-text"
                  style={{ animation: `fadeUp 0.5s ease-out ${i * 130}ms both`, display: 'inline-block' }}
                >
                  {word}
                </span>
              ))}
            </h1>

            {/* Sub-headline */}
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.4rem, 2.8vw, 2rem)',
              fontWeight: 600, color: 'var(--color-text)',
              marginBottom: 20,
              animation: 'fadeUp 0.5s ease-out 300ms both',
            }}>
              للـ Frontend Developers
            </h2>

            {/* Body */}
            <p style={{
              fontSize: 15, lineHeight: 1.85,
              color: 'var(--color-text-muted)',
              maxWidth: 500, marginBottom: 40,
              animation: 'fadeUp 0.5s ease-out 420ms both',
            }}>
              ولّد أسئلة مقابلة لا نهائية بالعربي مع إجابات تفصيلية وكود.
              19 AI model، 18 تصنيف تقني، 3 مستويات.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', animation: 'fadeUp 0.5s ease-out 520ms both' }}>
              <button
                style={accentBtn}
                onClick={() => navigate('/generate')}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.background = 'var(--color-accent-hover)'
                  el.style.transform  = 'translateY(-2px)'
                  el.style.boxShadow  = '0 0 40px rgba(59,130,246,0.40), 0 0 12px rgba(59,130,246,0.22)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.background = 'var(--color-accent)'
                  el.style.transform  = 'translateY(0)'
                  el.style.boxShadow  = 'var(--shadow-glow)'
                }}
              >
                ابدأ التوليد الآن →
              </button>

              <button
                style={ghostBtn}
                onClick={() => navigate('/github')}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.borderColor = 'rgba(59,130,246,0.50)'
                  el.style.background  = 'rgba(59,130,246,0.08)'
                  el.style.transform   = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.borderColor = 'rgba(255,255,255,0.14)'
                  el.style.background  = 'transparent'
                  el.style.transform   = 'translateY(0)'
                }}
              >
                GitHub Search
              </button>

              {!hasAnyKey && (
                <button
                  style={{ ...ghostBtn, borderColor: 'rgba(255,255,255,0.08)', color: 'var(--color-text-muted)', fontSize: 13 }}
                  onClick={() => navigate('/settings')}
                  onMouseEnter={e => {
                    e.currentTarget.style.color       = 'var(--color-text)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color       = 'var(--color-text-muted)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  }}
                >
                  أضف API Key مجاناً
                </button>
              )}
            </div>

            {/* No-key notice */}
            {!hasAnyKey && (
              <div style={{
                marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 16px', borderRadius: 10,
                background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.20)',
                fontSize: 12, color: 'var(--color-warning)',
                animation: 'fadeIn 0.4s ease-out 640ms both',
              }}>
                محتاج API Key واحد على الأقل —
                <button
                  onClick={() => navigate('/settings')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-accent)', textDecoration: 'underline', fontSize: 12, fontFamily: 'inherit' }}
                >
                  روح الإعدادات
                </button>
              </div>
            )}
          </div>

          {/* 3D Mock Card */}
          <div style={{ flex: '0 0 42%', display: 'flex', justifyContent: 'center', alignItems: 'center', animation: 'fadeUp 0.6s ease-out 200ms both' }}>
            <MockCard />
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ═════════════════════════════════════════ */}
      <div
        ref={statsRef}
        style={{
          background: 'rgba(255,255,255,0.025)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: 'clamp(32px, 5vw, 48px) clamp(24px, 5vw, 64px)',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, textAlign: 'center' }}>
          {[
            { value: c1, label: 'AI Model'     },
            { value: c2, label: 'تصنيف تقني'   },
            { value: c3, label: 'مستوى'         },
            { value: c4, label: 'سؤال محفوظ'   },
          ].map(({ value, label }) => (
            <div key={label}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 3vw, 2.75rem)',
                fontWeight: 800, color: 'var(--color-text)',
                lineHeight: 1, marginBottom: 8,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {value}
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ FEATURES ══════════════════════════════════════════ */}
      <section ref={featuresRef} style={{ padding: 'clamp(56px, 8vw, 96px) clamp(24px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-accent)', marginBottom: 12, textTransform: 'uppercase' }}>
              المميزات
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3vw, 2.1rem)', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2 }}>
              كل اللي تحتاجه للتحضير
            </h2>
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="glass-card lift-3d"
                style={{
                  padding: 28,
                  opacity: featuresInView ? 1 : 0,
                  transform: featuresInView ? 'translateY(0)' : 'translateY(24px)',
                  transition: `opacity 0.5s ease-out ${i * 100}ms, transform 0.5s ease-out ${i * 100}ms`,
                }}
              >
                <div style={{
                  width: 46, height: 46, borderRadius: 12,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, marginBottom: 20,
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--color-text)', marginBottom: 10 }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.75, color: 'var(--color-text-muted)' }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.07), transparent)', margin: '0 clamp(24px, 5vw, 64px)' }} />

      {/* ══ CATEGORIES ════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(48px, 7vw, 80px) clamp(24px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
              التصنيفات المتاحة
            </h2>
            <p style={{ fontSize: 13, color: 'var(--color-text-subtle)' }}>{CATEGORIES.length} تصنيف تقني</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: 8 }}>
            {CATEGORIES.map(cat => {
              const count = LEVELS.reduce((s, l) => s + (questionSets[`${cat.id}-${l.id}`]?.length || 0), 0)
              const vars  = dynColor(cat.color)
              return (
                <button
                  key={cat.id}
                  aria-label={`${cat.label}${count > 0 ? ` — ${count} سؤال` : ''}`}
                  onClick={() => navigate(`/generate?cat=${cat.id}`)}
                  style={{
                    ...vars,
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 12px', borderRadius: 12,
                    background: count > 0 ? 'var(--c-dim)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${count > 0 ? 'var(--c-dim)' : 'rgba(255,255,255,0.07)'}`,
                    cursor: 'pointer', textAlign: 'right',
                    transition: 'all var(--transition-fast)',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--c)'
                    e.currentTarget.style.background  = 'var(--c-dim)'
                    e.currentTarget.style.transform   = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = count > 0 ? 'var(--c-dim)' : 'rgba(255,255,255,0.07)'
                    e.currentTarget.style.background  = count > 0 ? 'var(--c-dim)' : 'rgba(255,255,255,0.03)'
                    e.currentTarget.style.transform   = 'translateY(0)'
                  }}
                >
                  <span style={{ fontSize: 16, flexShrink: 0 }} aria-hidden="true">{cat.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--c)' }}>
                    {cat.label}
                  </span>
                  {count > 0 && (
                    <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 4, background: 'var(--c-dim)', color: 'var(--c)', flexShrink: 0 }}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.07), transparent)', margin: '0 clamp(24px, 5vw, 64px)' }} />

      {/* ══ FREE PROVIDERS ════════════════════════════════════ */}
      <section style={{ padding: 'clamp(48px, 7vw, 80px) clamp(24px, 5vw, 64px) clamp(64px, 10vw, 100px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
              Providers المجانية
            </h2>
            <p style={{ fontSize: 13, color: 'var(--color-text-subtle)' }}>API key مجاني تماماً — بدون credit card</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
            {FREE_PROVIDERS.map(m => (
              <div
                key={m.name}
                className="glass-card"
                style={{ ...dynColor(m.color), display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px' }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, background: 'var(--c-dim)', color: 'var(--c)' }} aria-hidden="true">
                  {m.name[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-subtle)' }}>{m.desc}</div>
                </div>
                <a
                  href={m.link} target="_blank" rel="noreferrer"
                  aria-label={`احصل على API Key من ${m.name}`}
                  style={{ fontSize: 10, padding: '5px 12px', borderRadius: 8, fontWeight: 700, flexShrink: 0, background: 'var(--c-dim)', color: 'var(--c)', textDecoration: 'none', transition: 'opacity var(--transition-fast)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.75' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
                >
                  احصل على Key ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

export default HomePage
