// src/pages/SettingsPage.tsx
// ══════════════════════════════════════════
// صفحة الإعدادات - إدارة الـ API Keys
// ══════════════════════════════════════════

import { useState } from 'react'
import type { CSSProperties, FC } from 'react'
import { useAppContext } from '../context/AppContext'
import { PROVIDER_INFO } from '../constants'
import type { ApiKeys } from '../types'

const SettingsPage: FC = () => {
  const { keys, setKeys } = useAppContext()
  const [saved, setSaved] = useState(false)
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})

  function handleKeyChange(provider: keyof ApiKeys, value: string) {
    const newKeys = { ...keys, [provider]: value }
    setKeys(newKeys)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function toggleShow(pid: string) {
    setShowKeys(prev => ({ ...prev, [pid]: !prev[pid] }))
  }

  const freeProviders  = ['google', 'groq', 'openrouter', 'mistral', 'cohere'] as const
  const paidProviders  = ['anthropic', 'openai'] as const

  return (
    <div style={styles.page}>
      <div style={styles.inner}>

        <div style={styles.header}>
          <h1 style={styles.title}>⚙️ الإعدادات</h1>
          {saved && <span style={styles.savedBadge}>✓ تم الحفظ تلقائياً</span>}
        </div>

        {/* Free APIs */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>🆓 APIs المجانية</h2>
            <span style={styles.freePill}>مجاني · بدون credit card</span>
          </div>
          <p style={styles.sectionDesc}>
            ابدأ بـ Google Gemini أو Groq — الاتنين مجانيين تماماً وبيديك كميات كبيرة.
          </p>

          {freeProviders.map(pid => {
            const info = PROVIDER_INFO[pid]
            const val  = keys[pid]
            return (
              <div key={pid} style={styles.keyCard}>
                <div style={styles.keyCardHeader}>
                  <div style={{ ...styles.providerDot, background: info.color }} />
                  <div>
                    <div style={{ ...styles.providerName, color: info.color }}>{info.label}</div>
                    <div style={styles.providerNote}>{info.instructions}</div>
                  </div>
                  <a href={info.getKeyLink} target="_blank" rel="noreferrer"
                    style={{ ...styles.getKeyLink, color: info.color, borderColor: info.color + '44', background: info.color + '11' }}>
                    احصل على Key مجاني ↗
                  </a>
                </div>
                <div style={styles.inputRow}>
                  <input
                    type={showKeys[pid] ? 'text' : 'password'}
                    placeholder={info.placeholder}
                    value={val}
                    onChange={e => handleKeyChange(pid, e.target.value)}
                    style={{ ...styles.input, borderColor: val ? info.color + '77' : '#0F2444' }}
                  />
                  <button onClick={() => toggleShow(pid)} style={styles.showBtn}>
                    {showKeys[pid] ? '🙈' : '👁'}
                  </button>
                  {val && <span style={styles.checkmark}>✓</span>}
                </div>
              </div>
            )
          })}
        </section>

        {/* Paid APIs */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>💳 APIs المدفوعة</h2>
            <span style={styles.paidPill}>محتاج رصيد</span>
          </div>
          <p style={styles.sectionDesc}>
            أقوى في الجودة، بس بتكلف. ابدأ بالمجاني الأول.
          </p>

          {paidProviders.map(pid => {
            const info = PROVIDER_INFO[pid]
            const val  = keys[pid]
            return (
              <div key={pid} style={styles.keyCard}>
                <div style={styles.keyCardHeader}>
                  <div style={{ ...styles.providerDot, background: info.color }} />
                  <div>
                    <div style={{ ...styles.providerName, color: info.color }}>{info.label}</div>
                    <div style={styles.providerNote}>{info.instructions}</div>
                  </div>
                  <a href={info.getKeyLink} target="_blank" rel="noreferrer"
                    style={{ ...styles.getKeyLink, color: info.color, borderColor: info.color + '44', background: info.color + '11' }}>
                    احصل على Key ↗
                  </a>
                </div>
                <div style={styles.inputRow}>
                  <input
                    type={showKeys[pid] ? 'text' : 'password'}
                    placeholder={info.placeholder}
                    value={val}
                    onChange={e => handleKeyChange(pid, e.target.value)}
                    style={{ ...styles.input, borderColor: val ? info.color + '77' : '#0F2444' }}
                  />
                  <button onClick={() => toggleShow(pid)} style={styles.showBtn}>
                    {showKeys[pid] ? '🙈' : '👁'}
                  </button>
                  {val && <span style={styles.checkmark}>✓</span>}
                </div>
              </div>
            )
          })}
        </section>

        {/* Security Note */}
        <div style={styles.secNote}>
          <span style={{ fontSize: 16 }}>🔒</span>
          <div>
            <div style={{ fontWeight: 600, color: '#60A5FA', marginBottom: 4 }}>أمان الـ Keys</div>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
              الـ API keys بتتحفظ في localStorage على جهازك فقط — مش بتتبعت لأي سيرفر.
              المشروع ده local بالكامل. في الـ production، استخدم متغيرات البيئة (.env).
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  page: { padding: '0 40px 60px' },
  inner: { maxWidth: 700, margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', gap: 16, padding: '32px 0 24px' },
  title: { fontSize: 24, fontWeight: 800, color: '#F1F5F9', margin: 0 },
  savedBadge: { fontSize: 12, color: '#22C55E', background: '#22C55E11', border: '1px solid #22C55E33', borderRadius: 20, padding: '4px 12px' },
  section: { marginBottom: 36 },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: '#94A3B8', margin: 0 },
  freePill: { fontSize: 11, fontWeight: 700, color: '#22C55E', background: '#22C55E11', border: '1px solid #22C55E33', borderRadius: 20, padding: '2px 10px' },
  paidPill: { fontSize: 11, fontWeight: 700, color: '#EAB308', background: '#EAB30811', border: '1px solid #EAB30833', borderRadius: 20, padding: '2px 10px' },
  sectionDesc: { fontSize: 13, color: '#334155', marginBottom: 16 },
  keyCard: { background: 'linear-gradient(135deg, #040F22, #050F24)', border: '1px solid #0F2444', borderRadius: 12, padding: '16px', marginBottom: 12 },
  keyCardHeader: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 },
  providerDot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
  providerName: { fontSize: 14, fontWeight: 700 },
  providerNote: { fontSize: 11, color: '#334155', marginTop: 2 },
  getKeyLink: { marginRight: 'auto', fontSize: 11, padding: '4px 12px', border: '1px solid', borderRadius: 8, textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' },
  inputRow: { display: 'flex', alignItems: 'center', gap: 8 },
  input: { flex: 1, padding: '9px 12px', background: '#020B18', border: '1px solid', borderRadius: 8, color: '#CBD5E1', fontSize: 13, outline: 'none', fontFamily: 'monospace' },
  showBtn: { padding: '8px', background: 'transparent', border: '1px solid #0F2444', borderRadius: 8, cursor: 'pointer', fontSize: 14 },
  checkmark: { fontSize: 16, color: '#22C55E', flexShrink: 0 },
  secNote: { display: 'flex', gap: 14, background: '#1D4ED811', border: '1px solid #1D4ED833', borderRadius: 12, padding: '16px', marginTop: 8 },
}

export default SettingsPage
