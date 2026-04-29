import { useState } from 'react'
import type { FC } from 'react'
import { useAppContext } from '../context/AppContext'
import { PROVIDER_INFO } from '../constants'
import type { ApiKeys } from '../types'
import PageContainer from '../components/ui/PageContainer'
import { dynColor } from '../utils/dynColor'

const FREE_PROVIDERS  = ['google', 'groq', 'cerebras', 'openrouter', 'together', 'mistral', 'cohere'] as const
const PAID_PROVIDERS  = ['anthropic', 'openai'] as const

const SettingsPage: FC = () => {
  const { keys, setKeys, toast } = useAppContext()
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})

  function handleChange(provider: keyof ApiKeys, value: string) {
    setKeys({ ...keys, [provider]: value })
    toast('تم الحفظ تلقائياً', 'success')
  }

  function toggleShow(pid: string) {
    setShowKeys(prev => ({ ...prev, [pid]: !prev[pid] }))
  }

  function renderCard(pid: keyof ApiKeys) {
    const info = PROVIDER_INFO[pid]
    const val  = keys[pid]
    if (!info) return null

    return (
      <div
        key={pid}
        style={dynColor(info.color)}
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 mb-3 hover:border-[var(--c)] transition-all"
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ background: 'var(--c)' }}
            aria-hidden="true"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-[var(--c)]">{info.label}</div>
            <div className="text-[11px] text-[var(--color-text-subtle)]">{info.instructions}</div>
          </div>
          <a
            href={info.getKeyLink}
            target="_blank"
            rel="noreferrer"
            className="text-[10px] px-2.5 py-1 rounded-lg border font-semibold flex-shrink-0 hover:opacity-80 transition-opacity border-[var(--c)] bg-[var(--c-dim)] text-[var(--c)]"
            aria-label={`احصل على API Key من ${info.label}`}
          >
            احصل على Key ↗
          </a>
        </div>

        <div className="flex items-center gap-2">
          <input
            type={showKeys[pid] ? 'text' : 'password'}
            placeholder={info.placeholder}
            value={val}
            onChange={e => handleChange(pid, e.target.value)}
            autoComplete="off"
            spellCheck={false}
            aria-label={`API Key لـ ${info.label}`}
            className={[
              'flex-1 px-3 py-2 bg-[var(--color-surface-2)] border rounded-lg text-[var(--color-text)]',
              'text-xs font-mono outline-none transition-colors',
              'placeholder:text-[var(--color-text-subtle)]',
              'focus:border-[var(--color-border-focus)]',
              val ? 'border-[var(--c)]' : 'border-[var(--color-border)]',
            ].join(' ')}
          />
          <button
            onClick={() => toggleShow(pid)}
            className="px-2.5 py-2 bg-transparent border border-[var(--color-border)] rounded-lg text-sm hover:border-[var(--color-border-hover)] transition-colors"
            aria-label={showKeys[pid] ? 'إخفاء الـ key' : 'إظهار الـ key'}
          >
            {showKeys[pid] ? '🙈' : '👁'}
          </button>
          {val && (
            <span className="text-[var(--color-success)] text-base flex-shrink-0" aria-label="تم إدخال الـ key">
              ✓
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <PageContainer>
      <div className="pt-8 pb-6">
        <h1 className="text-2xl font-extrabold text-[var(--color-text)]">الإعدادات</h1>
        <p className="text-xs text-[var(--color-text-subtle)] mt-1">
          API keys بتتحفظ تلقائياً في localStorage
        </p>
      </div>

      {/* Free APIs */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-sm font-bold text-[var(--color-text-muted)]">APIs المجانية</h2>
          <span className="text-[10px] font-bold text-[var(--color-success)] bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.25)] rounded-full px-2.5 py-0.5">
            مجاني · بدون credit card
          </span>
        </div>
        <p className="text-xs text-[var(--color-text-subtle)] mb-4">
          ابدأ بـ Google Gemini أو Groq أو Cerebras — مجانيين تماماً.
        </p>
        {FREE_PROVIDERS.map(renderCard)}
      </section>

      {/* Paid APIs */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-sm font-bold text-[var(--color-text-muted)]">APIs المدفوعة</h2>
          <span className="text-[10px] font-bold text-[var(--color-warning)] bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.25)] rounded-full px-2.5 py-0.5">
            محتاج رصيد
          </span>
        </div>
        <p className="text-xs text-[var(--color-text-subtle)] mb-4">
          أقوى في الجودة — ابدأ بالمجاني الأول.
        </p>
        {PAID_PROVIDERS.map(renderCard)}
      </section>

      {/* Security note */}
      <div className="flex gap-3 bg-[rgba(59,130,246,0.06)] border border-[rgba(59,130,246,0.2)] rounded-xl p-4 mb-4">
        <div>
          <div className="text-sm font-semibold text-[var(--color-info)] mb-1">أمان الـ Keys</div>
          <div className="text-xs text-[var(--color-text-subtle)] leading-relaxed">
            الـ API keys بتتحفظ في localStorage على جهازك فقط — مش بتتبعت لأي سيرفر. المشروع ده local بالكامل.
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default SettingsPage
