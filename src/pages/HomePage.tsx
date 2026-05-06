/**
 * HomePage.tsx
 * ------------
 * Landing page for Interview Coach.
 *
 * Sections (top → bottom):
 *  1. Hero      — headline split-text reveal, floating 3D mock card, CTA buttons
 *  2. Stats Bar — animated counters triggered on scroll enter
 *  3. Features  — 4 glass cards with stagger reveal
 *  4. Categories — chip grid with wave stagger
 *  5. Providers  — free API provider cards
 *
 * Motion:
 *  - GSAP ScrollTrigger owns all scroll-based animations
 *  - Mouse parallax on hero orbs via mousemove
 *  - All animations wrapped in gsap.context() for clean unmount
 */
import { type FC, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAppContext } from '../context/AppContext'
import { CATEGORIES, LEVELS } from '../constants'
import { dynColor } from '../utils/dynColor'

gsap.registerPlugin(ScrollTrigger)

/* ══════════════════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════════════════ */

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

/* Stats bar items — values are animated by GSAP */
const STATS_ITEMS = [
  { target: 19,   label: 'AI Model'    },
  { target: 18,   label: 'تصنيف تقني'  },
  { target: 3,    label: 'مستوى'       },
  { target: null, label: 'سؤال محفوظ'  }, // null = uses totalQuestions from context
]

/* ══════════════════════════════════════════════════════════════
   MOCK CARD — 3D preview card floating in hero
   ══════════════════════════════════════════════════════════════ */
const MockCard: FC = () => (
  /* Perspective wrapper gives the card its 3D tilt */
  <div style={{ perspective: '1000px', width: '100%', maxWidth: 360 }}>
    <div
      className="glass-card"
      style={{
        padding: '24px 20px',
        transform: 'rotateY(-8deg) rotateX(5deg)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {/* Category + level badges */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
          background: 'rgba(59,130,246,0.13)', color: 'var(--color-accent)',
          border: '1px solid rgba(59,130,246,0.25)',
        }}>
          JavaScript
        </span>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
          background: 'rgba(124,92,252,0.13)', color: 'var(--color-primary)',
          border: '1px solid rgba(124,92,252,0.25)',
        }}>
          Senior
        </span>
      </div>

      {/* Sample question text */}
      <p style={{
        fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
        color: 'var(--color-text)', lineHeight: 1.55, marginBottom: 14,
      }}>
        ما الفرق بين Prototype و Class في JavaScript؟
      </p>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.055)', marginBottom: 14 }} />

      {/* Sample answer preview */}
      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: 14 }}>
        كلاهما يُستخدم لإنشاء objects وتحقيق الـ inheritance، لكن Class هو syntactic sugar فوق الـ prototype chain...
      </p>

      {/* Code snippet block */}
      <div style={{
        background: 'rgba(0,0,0,0.42)', borderRadius: 8,
        padding: '10px 14px', marginBottom: 14,
      }}>
        <code style={{
          fontFamily: 'var(--font-family-mono, monospace)', fontSize: 11,
          color: '#93c5fd', display: 'block', lineHeight: 1.7,
        }}>
          {'class Animal {'}<br />
          {'  constructor(name) {'}<br />
          {'    this.name = name'}<br />
          {'  }'}<br />
          {'}'}
        </code>
      </div>

      {/* Card footer actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <span style={{
          fontSize: 11, padding: '4px 10px', borderRadius: 6,
          background: 'rgba(16,185,129,0.11)', color: '#10b981', fontWeight: 600,
        }}>✓ محفوظ</span>
        <span style={{
          fontSize: 11, padding: '4px 10px', borderRadius: 6,
          background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-subtle)', fontWeight: 600,
        }}>↗ توسيع</span>
      </div>
    </div>
  </div>
)

/* ══════════════════════════════════════════════════════════════
   HOMEPAGE
   ══════════════════════════════════════════════════════════════ */
const HomePage: FC = () => {
  const navigate = useNavigate()
  const { totalQuestions, questionSets, keys } = useAppContext()
  const hasAnyKey = Object.values(keys).some(Boolean)

  /* ── Refs for GSAP targets ── */
  const pageRef      = useRef<HTMLDivElement>(null)
  const headlineRef  = useRef<HTMLHeadingElement>(null)
  const heroTextRef  = useRef<HTMLDivElement>(null)
  const heroCardRef  = useRef<HTMLDivElement>(null)
  const statsRef     = useRef<HTMLDivElement>(null)
  const featuresRef  = useRef<HTMLDivElement>(null)
  const catsRef      = useRef<HTMLDivElement>(null)
  const providersRef = useRef<HTMLDivElement>(null)
  const orb1Ref      = useRef<HTMLDivElement>(null)
  const orb2Ref      = useRef<HTMLDivElement>(null)

  /* Animated counter display values */
  const [counts, setCounts] = useState([0, 0, 0, 0])

  /* ── GSAP animations ── */
  useEffect(() => {
    /* Wrap in gsap.context for clean scope and unmount cleanup */
    const ctx = gsap.context(() => {

      /* ── 1. Hero headline reveal ── */
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.hero-word')
        gsap.from(words, {
          opacity: 0, y: 16,
          duration: 0.45,
          stagger: 0.07,
          ease: 'power2.out',
          delay: 0.1,
        })
      }

      /* ── 2. Hero body text + CTA fade up ── */
      if (heroTextRef.current) {
        const items = heroTextRef.current.querySelectorAll('.hero-item')
        gsap.fromTo(
          items,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0,
            duration: 0.65,
            stagger: 0.1,
            ease: 'power2.out',
            delay: 0.5,
          },
        )
      }

      /* ── 3. Hero card: fade in ── */
      if (heroCardRef.current) {
        gsap.from(heroCardRef.current, {
          opacity: 0, y: 16,
          duration: 0.45,
          ease: 'power2.out',
          delay: 0.3,
        })
      }

      /* ── 4. Stats counter animation ── */
      if (statsRef.current) {
        const targets = [19, 18, 3, totalQuestions]
        const obj = { v0: 0, v1: 0, v2: 0, v3: 0 }

        ScrollTrigger.create({
          trigger: statsRef.current,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(obj, {
              v0: targets[0], v1: targets[1],
              v2: targets[2], v3: targets[3],
              duration: 1.4,
              ease: 'power2.out',
              onUpdate: () => {
                setCounts([
                  Math.floor(obj.v0),
                  Math.floor(obj.v1),
                  Math.floor(obj.v2),
                  Math.floor(obj.v3),
                ])
              },
            })
          },
        })
      }

      /* ── 5. Features grid: stagger reveal ── */
      if (featuresRef.current) {
        const cards = featuresRef.current.querySelectorAll('.feature-card')
        gsap.from(cards, {
          opacity: 0, y: 16,
          duration: 0.45,
          stagger: 0.07,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 80%',
          },
        })
      }

      /* ── 6. Category chips: stagger reveal ── */
      if (catsRef.current) {
        const chips = catsRef.current.querySelectorAll('.cat-chip')
        gsap.from(chips, {
          opacity: 0, y: 16,
          duration: 0.45,
          stagger: { each: 0.04, from: 'start' },
          ease: 'power2.out',
          scrollTrigger: {
            trigger: catsRef.current,
            start: 'top 85%',
          },
        })
      }

      /* ── 7. Providers: stagger reveal ── */
      if (providersRef.current) {
        const cards = providersRef.current.querySelectorAll('.provider-card')
        gsap.from(cards, {
          opacity: 0, y: 16,
          duration: 0.45,
          stagger: 0.07,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: providersRef.current,
            start: 'top 85%',
          },
        })
      }

    }, pageRef)

    /* ── Mouse parallax on hero orbs ── */
    function handleMouseMove(e: MouseEvent) {
      const { clientX, clientY } = e
      const cx = window.innerWidth  / 2
      const cy = window.innerHeight / 2
      const dx = (clientX - cx) / cx   // -1 to 1
      const dy = (clientY - cy) / cy   // -1 to 1

      if (orb1Ref.current) {
        gsap.to(orb1Ref.current, {
          x: dx * 28, y: dy * 18,
          duration: 1.4, ease: 'power1.out', overwrite: 'auto',
        })
      }
      if (orb2Ref.current) {
        gsap.to(orb2Ref.current, {
          x: -dx * 20, y: -dy * 14,
          duration: 1.6, ease: 'power1.out', overwrite: 'auto',
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      ctx.revert()
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [totalQuestions])

  /* ══════════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════════ */
  return (
    <div ref={pageRef}>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section style={{
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        padding: 'clamp(48px, 8vw, 96px) clamp(24px, 5vw, 64px)',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Hero ambient orbs — moved by mouse parallax */}
        <div
          ref={orb1Ref}
          style={{
            position: 'absolute', top: '0%', right: '20%',
            width: 600, height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(124,92,252,0.18) 0%, transparent 68%)',
            pointerEvents: 'none',
          }}
        />
        <div
          ref={orb2Ref}
          style={{
            position: 'absolute', bottom: '5%', left: '0%',
            width: 440, height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(59,130,246,0.13) 0%, transparent 68%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{
          maxWidth: 1200, margin: '0 auto', width: '100%',
          display: 'flex', alignItems: 'center',
          gap: 'clamp(32px, 6vw, 80px)',
        }}>

          {/* ── Text column ── */}
          <div ref={heroTextRef} style={{ flex: '1 1 55%', minWidth: 0 }}>

            {/* Eyebrow pill — animated via heroTextRef stagger */}
            <div
              className="hero-item"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '5px 14px', borderRadius: 99,
                border: '1px solid rgba(59,130,246,0.25)',
                background: 'rgba(59,130,246,0.07)',
                fontSize: 10, fontWeight: 700,
                color: 'var(--color-accent)', letterSpacing: '0.08em',
                marginBottom: 28, opacity: 0, // GSAP starts here
              }}
            >
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--color-accent)', display: 'inline-block',
              }} />
              AI-Powered · 19 Model · 18 تصنيف
            </div>

            {/* Main headline — words split for GSAP reveal */}
            <h1
              ref={headlineRef}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                fontWeight: 800, lineHeight: 1.05,
                marginBottom: 12,
                display: 'flex', flexWrap: 'wrap',
                gap: '0 16px',
                perspective: '600px',
              }}
            >
              {['Interview', 'Coach'].map(word => (
                <span
                  key={word}
                  className="hero-word gradient-text"
                  style={{ display: 'inline-block', opacity: 0 }} // GSAP animates from here
                >
                  {word}
                </span>
              ))}
            </h1>

            {/* Sub-headline */}
            <h2
              className="hero-item"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.3rem, 2.5vw, 1.85rem)',
                fontWeight: 600, color: 'var(--color-text)',
                marginBottom: 20, opacity: 0, // GSAP
              }}
            >
              للـ Frontend Developers
            </h2>

            {/* Body copy */}
            <p
              className="hero-item"
              style={{
                fontSize: 15, lineHeight: 1.9,
                color: 'var(--color-text-muted)',
                maxWidth: 500, marginBottom: 40,
                opacity: 0, // GSAP
              }}
            >
              ولّد أسئلة مقابلة لا نهائية بالعربي مع إجابات تفصيلية وكود.
              19 AI model، 18 تصنيف تقني، 3 مستويات.
            </p>

            {/* CTA buttons */}
            <div
              className="hero-item"
              style={{ display: 'flex', gap: 12, flexWrap: 'wrap', opacity: 0 }}
            >
              {/* Primary CTA */}
              <button
                onClick={() => navigate('/generate')}
                style={{
                  padding: '13px 30px', borderRadius: 12, border: 'none',
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                  color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  boxShadow: 'var(--shadow-glow)',
                  transition: 'all var(--transition-fast)', fontFamily: 'inherit',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform  = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow  = '0 0 44px rgba(59,130,246,0.42), 0 0 14px rgba(59,130,246,0.24)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform  = 'translateY(0)'
                  e.currentTarget.style.boxShadow  = 'var(--shadow-glow)'
                }}
              >
                ابدأ التوليد الآن →
              </button>

              {/* Secondary CTA */}
              <button
                onClick={() => navigate('/github')}
                style={{
                  padding: '13px 30px', borderRadius: 12,
                  background: 'transparent', color: 'var(--color-text)',
                  fontWeight: 600, fontSize: 14, cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.13)',
                  transition: 'all var(--transition-fast)', fontFamily: 'inherit',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(59,130,246,0.45)'
                  e.currentTarget.style.background  = 'rgba(59,130,246,0.07)'
                  e.currentTarget.style.transform   = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)'
                  e.currentTarget.style.background  = 'transparent'
                  e.currentTarget.style.transform   = 'translateY(0)'
                }}
              >
                GitHub Search
              </button>

              {/* API key nudge — shown only when no keys configured */}
              {!hasAnyKey && (
                <button
                  onClick={() => navigate('/settings')}
                  style={{
                    padding: '13px 26px', borderRadius: 12,
                    background: 'transparent', color: 'var(--color-text-muted)',
                    fontWeight: 600, fontSize: 13, cursor: 'pointer',
                    border: '1px solid rgba(255,255,255,0.07)',
                    transition: 'all var(--transition-fast)', fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color       = 'var(--color-text)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color       = 'var(--color-text-muted)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                  }}
                >
                  أضف API Key مجاناً
                </button>
              )}
            </div>

            {/* No-key warning notice */}
            {!hasAnyKey && (
              <div
                className="hero-item"
                style={{
                  marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '8px 16px', borderRadius: 10,
                  background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.20)',
                  fontSize: 12, color: 'var(--color-warning, #f59e0b)', opacity: 0,
                }}
              >
                محتاج API Key واحد على الأقل —
                <button
                  onClick={() => navigate('/settings')}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--color-accent)', textDecoration: 'underline',
                    fontSize: 12, fontFamily: 'inherit',
                  }}
                >
                  روح الإعدادات
                </button>
              </div>
            )}
          </div>

          {/* ── 3D Mock Card column ── */}
          <div
            ref={heroCardRef}
            style={{
              flex: '0 0 42%',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              opacity: 0, // GSAP animates in
            }}
          >
            <MockCard />
          </div>

        </div>
      </section>

      {/* ══ STATS BAR ═════════════════════════════════════════ */}
      <div
        ref={statsRef}
        style={{
          background: 'rgba(255,255,255,0.022)',
          borderTop: '1px solid rgba(255,255,255,0.055)',
          borderBottom: '1px solid rgba(255,255,255,0.055)',
          padding: 'clamp(28px, 5vw, 44px) clamp(24px, 5vw, 64px)',
        }}
      >
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 24, textAlign: 'center',
        }}>
          {STATS_ITEMS.map(({ label }, i) => (
            <div key={label}>
              {/* Animated number */}
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 3vw, 2.75rem)',
                fontWeight: 800, color: 'var(--color-text)',
                lineHeight: 1, marginBottom: 8,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {counts[i]}
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500 }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ FEATURES ══════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) clamp(24px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
              color: 'var(--color-accent)', marginBottom: 12, textTransform: 'uppercase',
            }}>
              المميزات
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.4rem, 3vw, 2.1rem)',
              fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2,
            }}>
              كل اللي تحتاجه للتحضير
            </h2>
          </div>

          {/* Feature cards grid — each has class feature-card for GSAP targeting */}
          <div
            ref={featuresRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 20,
            }}
          >
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="feature-card glass-card gradient-border lift-3d"
                style={{ padding: 28, opacity: 0 }} // GSAP animates in
              >
                {/* Icon container */}
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, marginBottom: 20,
                  boxShadow: `0 4px 16px ${f.accent}22`,
                }}>
                  {f.icon}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: 15,
                  fontWeight: 700, color: 'var(--color-text)', marginBottom: 10,
                }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--color-text-muted)' }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gradient divider ── */}
      <div style={{
        height: 1,
        background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.06), transparent)',
        margin: '0 clamp(24px, 5vw, 64px)',
      }} />

      {/* ══ CATEGORIES ════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(48px, 7vw, 80px) clamp(24px, 5vw, 64px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Section header */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 18,
              fontWeight: 700, color: 'var(--color-text)', marginBottom: 4,
            }}>
              التصنيفات المتاحة
            </h2>
            <p style={{ fontSize: 12, color: 'var(--color-text-subtle)' }}>
              {CATEGORIES.length} تصنيف تقني
            </p>
          </div>

          {/* Category chips — class cat-chip for GSAP wave stagger */}
          <div
            ref={catsRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))',
              gap: 8,
            }}
          >
            {CATEGORIES.map(cat => {
              /* Count questions saved for this category across all levels */
              const count = LEVELS.reduce((s, l) => s + (questionSets[`${cat.id}-${l.id}`]?.length || 0), 0)
              const vars  = dynColor(cat.color)
              return (
                <button
                  key={cat.id}
                  className="cat-chip"
                  aria-label={`${cat.label}${count > 0 ? ` — ${count} سؤال` : ''}`}
                  onClick={() => navigate(`/generate?cat=${cat.id}`)}
                  style={{
                    ...vars,
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 12px', borderRadius: 11,
                    background: count > 0 ? 'var(--c-dim)' : 'rgba(255,255,255,0.025)',
                    border: `1px solid ${count > 0 ? 'var(--c-dim)' : 'rgba(255,255,255,0.065)'}`,
                    cursor: 'pointer', textAlign: 'right',
                    transition: 'all var(--transition-fast)',
                    fontFamily: 'inherit',
                    opacity: 0, // GSAP starts invisible
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--c)'
                    e.currentTarget.style.background  = 'var(--c-dim)'
                    e.currentTarget.style.transform   = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow   = '0 4px 16px var(--c-glow, rgba(59,130,246,0.18))'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = count > 0 ? 'var(--c-dim)' : 'rgba(255,255,255,0.065)'
                    e.currentTarget.style.background  = count > 0 ? 'var(--c-dim)' : 'rgba(255,255,255,0.025)'
                    e.currentTarget.style.transform   = 'translateY(0)'
                    e.currentTarget.style.boxShadow   = 'none'
                  }}
                >
                  <span style={{ fontSize: 15, flexShrink: 0 }} aria-hidden="true">{cat.icon}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 600, flex: 1,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    color: 'var(--c)',
                  }}>
                    {cat.label}
                  </span>
                  {count > 0 && (
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '1px 5px',
                      borderRadius: 4, background: 'var(--c-dim)',
                      color: 'var(--c)', flexShrink: 0,
                    }}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Gradient divider ── */}
      <div style={{
        height: 1,
        background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.06), transparent)',
        margin: '0 clamp(24px, 5vw, 64px)',
      }} />

      {/* ══ FREE PROVIDERS ════════════════════════════════════ */}
      <section style={{ padding: 'clamp(48px, 7vw, 80px) clamp(24px, 5vw, 64px) clamp(64px, 10vw, 100px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Section header */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 18,
              fontWeight: 700, color: 'var(--color-text)', marginBottom: 4,
            }}>
              Providers المجانية
            </h2>
            <p style={{ fontSize: 12, color: 'var(--color-text-subtle)' }}>
              API key مجاني تماماً — بدون credit card
            </p>
          </div>

          {/* Provider cards grid — class provider-card for GSAP side reveals */}
          <div
            ref={providersRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 10,
            }}
          >
            {FREE_PROVIDERS.map((m) => (
              <div
                key={m.name}
                className="provider-card glass-card"
                style={{
                  ...dynColor(m.color),
                  display: 'flex', alignItems: 'center',
                  gap: 14, padding: '14px 16px',
                  opacity: 0, // GSAP reveals
                }}
              >
                {/* Provider initial avatar */}
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 800,
                  background: 'var(--c-dim)', color: 'var(--c)',
                }} aria-hidden="true">
                  {m.name[0]}
                </div>

                {/* Provider name + description */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 700, color: 'var(--color-text)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {m.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-subtle)' }}>
                    {m.desc}
                  </div>
                </div>

                {/* Get key link */}
                <a
                  href={m.link} target="_blank" rel="noreferrer"
                  aria-label={`احصل على API Key من ${m.name}`}
                  style={{
                    fontSize: 10, padding: '5px 12px', borderRadius: 8,
                    fontWeight: 700, flexShrink: 0,
                    background: 'var(--c-dim)', color: 'var(--c)',
                    textDecoration: 'none',
                    transition: 'opacity var(--transition-fast)',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.70' }}
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
