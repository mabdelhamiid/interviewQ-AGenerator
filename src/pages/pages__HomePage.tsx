// src/pages/HomePage.tsx
// ══════════════════════════════════════════
// الصفحة الرئيسية - Dashboard
// ══════════════════════════════════════════

import type { CSSProperties, FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { CATEGORIES, LEVELS } from '../constants'

const HomePage: FC = () => {
  const navigate = useNavigate()
  const { totalQuestions, questionSets, keys } = useAppContext()

  const hasAnyKey = Object.values(keys).some(Boolean)
  const totalSections = Object.keys(questionSets).length

  return (
    <div style={styles.page}>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroGlow} />
        <h1 style={styles.heroTitle}>
          AI Frontend Interview Coach
        </h1>
        <p style={styles.heroSub}>
          ولّد أسئلة مقابلة لا نهائية بـ 17 AI model · React + TypeScript
        </p>

        {/* Stats */}
        <div style={styles.statsRow}>
          {[
            { value: totalQuestions, label: 'سؤال محفوظ', color: '#60A5FA' },
            { value: totalSections,  label: 'قسم نشط',    color: '#34D399' },
            { value: 17,             label: 'AI Model',    color: '#A78BFA' },
            { value: 18,             label: 'تصنيف',       color: '#FB923C' },
          ].map(stat => (
            <div key={stat.label} style={styles.statCard}>
              <div style={{ ...styles.statValue, color: stat.color }}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={styles.ctaRow}>
          <button style={styles.primaryBtn} onClick={() => navigate('/generate')}>
            ⚡ ابدأ التوليد
          </button>
          {!hasAnyKey && (
            <button style={styles.secondaryBtn} onClick={() => navigate('/settings')}>
              ⚙️ أضف API Key مجاني
            </button>
          )}
          {totalQuestions > 0 && (
            <button style={styles.secondaryBtn} onClick={() => navigate('/saved')}>
              💾 الأسئلة المحفوظة ({totalQuestions})
            </button>
          )}
        </div>

        {/* Warning لو مفيش key */}
        {!hasAnyKey && (
          <div style={styles.warning}>
            ⚠️ محتاج API Key واحد على الأقل علشان تبدأ —{' '}
            <span
              style={{ color: '#60A5FA', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => navigate('/settings')}
            >
              روح الإعدادات
            </span>
          </div>
        )}
      </section>

      {/* Categories Grid */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>📚 التصنيفات المتاحة</h2>
        <div style={styles.categoriesGrid}>
          {CATEGORIES.map(cat => {
            const count = LEVELS.reduce((sum, level) => {
              return sum + (questionSets[`${cat.id}-${level.id}`]?.length || 0)
            }, 0)
            return (
              <div
                key={cat.id}
                style={{ ...styles.catCard, borderColor: count > 0 ? cat.color + '55' : '#0F2444' }}
                onClick={() => navigate(`/generate?cat=${cat.id}`)}
              >
                <span style={styles.catIcon}>{cat.icon}</span>
                <span style={{ ...styles.catLabel, color: cat.color }}>{cat.label}</span>
                {count > 0 && (
                  <span style={{ ...styles.catCount, background: cat.color + '22', color: cat.color }}>
                    {count}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Free Models */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>🆓 AI Models المجانية</h2>
        <div style={styles.modelsGrid}>
          {[
            { name: 'Google Gemini', desc: '3 موديلات مجانية', color: '#4285F4', link: 'https://aistudio.google.com/app/apikey' },
            { name: 'Groq',          desc: '4 موديلات مجانية · الأسرع', color: '#F55036', link: 'https://console.groq.com/keys' },
            { name: 'OpenRouter',    desc: '4 موديلات مجانية', color: '#6366F1', link: 'https://openrouter.ai/keys' },
            { name: 'Mistral AI',    desc: 'free tier',        color: '#FF7000', link: 'https://console.mistral.ai/api-keys' },
          ].map(m => (
            <div key={m.name} style={styles.modelCard}>
              <div style={{ ...styles.modelDot, background: m.color }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#CBD5E1' }}>{m.name}</div>
                <div style={{ fontSize: 11, color: '#475569' }}>{m.desc}</div>
              </div>
              <a href={m.link} target="_blank" rel="noreferrer"
                style={{ ...styles.getKeyLink, color: m.color, borderColor: m.color + '44' }}>
                احصل على Key ↗
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  page: { padding: '0 40px 60px', maxWidth: 1400, margin: '0 auto' },
  hero: {
    textAlign: 'center', padding: '60px 20px 40px',
    position: 'relative',
  },
  heroGlow: {
    position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
    width: 600, height: 300, borderRadius: '50%',
    background: 'radial-gradient(circle, #1D4ED822 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  heroTitle: {
    fontSize: 36, fontWeight: 800, margin: '0 0 12px',
    background: 'linear-gradient(135deg, #60A5FA, #93C5FD, #38BDF8)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  heroSub: { fontSize: 16, color: '#475569', margin: '0 0 32px' },
  statsRow: { display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' },
  statCard: {
    background: 'linear-gradient(135deg, #040F22, #050F24)',
    border: '1px solid #0F2444', borderRadius: 12,
    padding: '16px 28px', textAlign: 'center',
    minWidth: 100,
  },
  statValue: { fontSize: 32, fontWeight: 800 },
  statLabel: { fontSize: 12, color: '#475569', marginTop: 4 },
  ctaRow: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' },
  primaryBtn: {
    padding: '12px 28px',
    background: 'linear-gradient(135deg, #1D4ED8, #2563EB)',
    border: 'none', borderRadius: 12,
    color: '#fff', cursor: 'pointer',
    fontSize: 15, fontWeight: 700,
    boxShadow: '0 4px 20px #1D4ED844',
  },
  secondaryBtn: {
    padding: '12px 24px',
    background: 'transparent',
    border: '1px solid #1E3A5F',
    borderRadius: 12, color: '#60A5FA',
    cursor: 'pointer', fontSize: 14, fontWeight: 600,
  },
  warning: {
    marginTop: 20, fontSize: 13, color: '#EAB308',
    background: '#EAB30811', border: '1px solid #EAB30833',
    borderRadius: 8, padding: '8px 16px', display: 'inline-block',
  },
  section: { marginTop: 48 },
  sectionTitle: { fontSize: 18, fontWeight: 700, color: '#94A3B8', marginBottom: 20 },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: 10,
  },
  catCard: {
    background: 'linear-gradient(135deg, #040F22, #040D1E)',
    border: '1px solid', borderRadius: 10,
    padding: '14px 16px',
    cursor: 'pointer', transition: 'all 0.2s',
    display: 'flex', alignItems: 'center', gap: 8,
  },
  catIcon: { fontSize: 16, flexShrink: 0 },
  catLabel: { fontSize: 12, fontWeight: 600, flex: 1 },
  catCount: {
    fontSize: 10, fontWeight: 700,
    padding: '2px 6px', borderRadius: 8, flexShrink: 0,
  },
  modelsGrid: { display: 'flex', flexDirection: 'column', gap: 10 },
  modelCard: {
    background: 'linear-gradient(135deg, #040F22, #040D1E)',
    border: '1px solid #0F2444', borderRadius: 10,
    padding: '14px 16px',
    display: 'flex', alignItems: 'center', gap: 12,
  },
  modelDot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
  getKeyLink: {
    marginRight: 'auto', fontSize: 11,
    padding: '3px 10px', borderRadius: 6,
    border: '1px solid', textDecoration: 'none',
    fontWeight: 600,
  },
}

export default HomePage
