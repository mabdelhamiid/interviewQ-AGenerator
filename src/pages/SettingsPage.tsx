/**
 * SettingsPage.tsx
 * ----------------
 * API key management for all supported AI providers.
 *
 * Features:
 *  - GSAP sequential card reveal on mount
 *  - GSAP-animated input focus glow
 *  - Glass card per provider with dynColor theming
 *  - Password show/hide toggle
 *  - Auto-save on input change (via AppContext)
 */
import { useState, useEffect } from 'react'
import type { FC } from 'react'
import gsap from 'gsap'
import { useAppContext } from '../context/AppContext'
import { PROVIDER_INFO } from '../constants'
import type { ApiKeys } from '../types'
import PageContainer from '../components/ui/PageContainer'
import { dynColor } from '../utils/dynColor'

/* ── Provider groupings ──────────────────────────────────── */
const FREE_PROVIDERS = ['google', 'groq', 'cerebras', 'openrouter', 'together', 'mistral', 'cohere'] as const
const PAID_PROVIDERS = ['anthropic', 'openai'] as const

/* ══════════════════════════════════════════════════════════════
   SETTINGS PAGE
   ══════════════════════════════════════════════════════════════ */
const SettingsPage: FC = () => {
  const { keys, setKeys, toast } = useAppContext()
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})

  /* ── GSAP: stagger reveal all provider cards on mount ── */
  useEffect(() => {
    const cards = document.querySelectorAll('.provider-card')
    if (!cards.length) return
    gsap.fromTo(
      cards,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, stagger: 0.09, duration: 0.5, ease: 'power2.out', delay: 0.1 },
    )
  }, [])

  /* ── Handler: update a provider key (auto-saves to localStorage via context) ── */
  function handleChange(provider: keyof ApiKeys, value: string) {
    setKeys({ ...keys, [provider]: value })
    toast('تم الحفظ تلقائياً', 'success')
  }

  /* ── Handler: toggle password visibility for a provider ── */
  function toggleShow(pid: string) {
    setShowKeys(prev => ({ ...prev, [pid]: !prev[pid] }))
  }

  /* ── GSAP focus glow on input ── */
  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    gsap.to(e.currentTarget, { boxShadow: '0 0 0 3px rgba(124,92,252,0.20)', duration: 0.25 })
  }

  /* ── GSAP blur: remove glow from input ── */
  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    gsap.to(e.currentTarget, { boxShadow: '0 0 0 0px transparent', duration: 0.20 })
  }

  /* ── Render a single provider card ── */
  function renderCard(pid: keyof ApiKeys) {
    const info = PROVIDER_INFO[pid]
    const val  = keys[pid]
    if (!info) return null

    return (
      /* provider-card: GSAP target + glass surface */
      <div
        key={pid}
        className="provider-card glass-card"
        style={{
          ...dynColor(info.color),
          padding: '16px 18px',
          marginBottom: 10,
          opacity: 0, // GSAP will reveal
          transition: 'border-color var(--transition-fast)',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--c)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.15)' }}
      >
        {/* Provider header: dot, name, instructions, get-key link */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12,
        }}>
          {/* Color dot indicator */}
          <div
            style={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0, background: 'var(--c)' }}
            aria-hidden="true"
          />

          {/* Name + instructions */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--c)' }}>{info.label}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-subtle)', marginTop: 1 }}>{info.instructions}</div>
          </div>

          {/* Get key external link */}
          <a
            href={info.getKeyLink}
            target="_blank"
            rel="noreferrer"
            aria-label={`احصل على API Key من ${info.label}`}
            style={{
              fontSize: 10, padding: '4px 12px', borderRadius: 8, fontWeight: 700,
              flexShrink: 0, textDecoration: 'none',
              border: '1px solid var(--c)', background: 'var(--c-dim)', color: 'var(--c)',
              transition: 'opacity var(--transition-fast)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.70' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
          >
            احصل على Key ↗
          </a>
        </div>

        {/* API key input row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type={showKeys[pid] ? 'text' : 'password'}
            placeholder={info.placeholder}
            value={val}
            onChange={e => handleChange(pid, e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoComplete="off"
            spellCheck={false}
            aria-label={`API Key لـ ${info.label}`}
            style={{
              flex: 1, padding: '9px 12px',
              background: 'rgba(0,0,0,0.25)',
              border: `1px solid ${val ? 'var(--c)' : 'rgba(255,255,255,0.09)'}`,
              borderRadius: 9, outline: 'none',
              color: 'var(--color-text)', fontSize: 12,
              fontFamily: 'var(--font-family-mono)',
              transition: 'border-color var(--transition-fast)',
            }}
          />

          {/* Show/hide password toggle */}
          <button
            onClick={() => toggleShow(pid)}
            style={{
              padding: '8px 10px', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 9, fontSize: 14, cursor: 'pointer',
              transition: 'border-color var(--transition-fast)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.18)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)' }}
            aria-label={showKeys[pid] ? 'إخفاء الـ key' : 'إظهار الـ key'}
          >
            {showKeys[pid] ? '🙈' : '👁'}
          </button>

          {/* Valid checkmark — shown when key is entered */}
          {val && (
            <span
              style={{ color: 'var(--color-success)', fontSize: 16, flexShrink: 0 }}
              aria-label="تم إدخال الـ key"
            >
              ✓
            </span>
          )}
        </div>
      </div>
    )
  }

  /* ══════════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════════ */
  return (
    <PageContainer>

      {/* ── Page header ── */}
      <div style={{ paddingTop: 32, paddingBottom: 24 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
          fontWeight: 800, color: 'var(--color-text)',
        }}>
          الإعدادات
        </h1>
        <p style={{ fontSize: 11, color: 'var(--color-text-subtle)', marginTop: 4 }}>
          API keys بتتحفظ تلقائياً في localStorage
        </p>
      </div>

      {/* ── Free APIs section ── */}
      <section style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)' }}>
            APIs المجانية
          </h2>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 99,
            background: 'rgba(16,185,129,0.09)', color: 'var(--color-success)',
            border: '1px solid rgba(16,185,129,0.22)',
          }}>
            مجاني · بدون credit card
          </span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-text-subtle)', marginBottom: 16 }}>
          ابدأ بـ Google Gemini أو Groq أو Cerebras — مجانيين تماماً.
        </p>
        {FREE_PROVIDERS.map(renderCard)}
      </section>

      {/* ── Paid APIs section ── */}
      <section style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)' }}>
            APIs المدفوعة
          </h2>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 99,
            background: 'rgba(245,158,11,0.09)', color: 'var(--color-warning)',
            border: '1px solid rgba(245,158,11,0.22)',
          }}>
            محتاج رصيد
          </span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-text-subtle)', marginBottom: 16 }}>
          أقوى في الجودة — ابدأ بالمجاني الأول.
        </p>
        {PAID_PROVIDERS.map(renderCard)}
      </section>

      {/* ── Security notice ── */}
      <div style={{
        display: 'flex', gap: 14,
        background: 'rgba(59,130,246,0.055)',
        border: '1px solid rgba(59,130,246,0.18)',
        borderRadius: 14, padding: '16px 18px',
        marginBottom: 16,
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-info)', marginBottom: 5 }}>
            أمان الـ Keys
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-subtle)', lineHeight: 1.75 }}>
            الـ API keys بتتحفظ في localStorage على جهازك فقط — مش بتتبعت لأي سيرفر. المشروع ده local بالكامل.
          </div>
        </div>
      </div>

    </PageContainer>
  )
}

export default SettingsPage
