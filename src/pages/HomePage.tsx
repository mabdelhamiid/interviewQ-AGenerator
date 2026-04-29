import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { CATEGORIES, LEVELS } from '../constants'
import PageContainer from '../components/ui/PageContainer'
import Button from '../components/ui/Button'
import { dynColor } from '../utils/dynColor'

const FREE_PROVIDERS = [
  { name: 'Google Gemini', desc: '3 موديلات مجانية',         color: '#4285F4', link: 'https://aistudio.google.com/app/apikey'    },
  { name: 'Groq',          desc: 'الأسرع · مجاني تماماً',    color: '#F55036', link: 'https://console.groq.com/keys'             },
  { name: 'Cerebras',      desc: 'أسرع inference في العالم', color: '#7C3AED', link: 'https://cloud.cerebras.ai'                 },
  { name: 'OpenRouter',    desc: '4+ موديلات مجانية',        color: '#6366F1', link: 'https://openrouter.ai/keys'                },
  { name: 'Together.ai',   desc: 'free credits عند التسجيل', color: '#0EA5E9', link: 'https://api.together.xyz/settings/api-keys' },
  { name: 'Mistral AI',    desc: 'free tier متاح',            color: '#FF7000', link: 'https://console.mistral.ai/api-keys'       },
]

const HomePage: FC = () => {
  const navigate = useNavigate()
  const { totalQuestions, questionSets, keys } = useAppContext()
  const hasAnyKey     = Object.values(keys).some(Boolean)
  const totalSections = Object.keys(questionSets).filter(k => questionSets[k]?.length > 0).length

  const stats = [
    { value: totalQuestions, label: 'سؤال محفوظ', color: '#60A5FA', icon: '📚' },
    { value: totalSections,  label: 'قسم نشط',    color: '#34D399', icon: '⚡' },
    { value: 19,             label: 'AI Model',    color: '#a78bfa', icon: '🤖' },
    { value: 18,             label: 'تصنيف',       color: '#22d3ee', icon: '🗂' },
  ]

  return (
    <PageContainer>

      {/* ══ Hero ══════════════════════════════════════════════════════════ */}
      <section className="text-center pt-20 pb-16 px-5 relative">

        {/* Glow disc behind title */}
        <div
          className="absolute top-8 left-1/2 -translate-x-1/2 w-[500px] h-[200px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(124,92,252,0.2) 0%, transparent 70%)' }}
        />

        {/* Eyebrow label */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[10px] font-bold text-[var(--color-text-subtle)] uppercase tracking-widest mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
          AI-Powered · RTL Arabic · 9 Providers
        </div>

        <h1 className="relative text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          <span className="gradient-text">Interview Coach</span>
          <br />
          <span className="text-[var(--color-text)] text-3xl md:text-4xl">للـ Frontend Developers</span>
        </h1>

        <p className="relative text-sm text-[var(--color-text-subtle)] mb-10 max-w-lg mx-auto leading-relaxed">
          ولّد أسئلة مقابلة لا نهائية بالعربي مع إجابات تفصيلية وكود. 19 AI model، 18 تصنيف، 3 مستويات.
        </p>

        {/* Stats row */}
        <div className="flex gap-3 justify-center mb-10 flex-wrap">
          {stats.map(s => (
            <div
              key={s.label}
              style={dynColor(s.color)}
              className="relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 text-center min-w-[108px] group hover:border-[var(--c)] hover:-translate-y-1 transition-all duration-200 overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                style={{ background: 'radial-gradient(circle at 50% 100%, var(--c-dim) 0%, transparent 70%)' }}
              />
              <div className="text-2xl mb-1" aria-hidden="true">{s.icon}</div>
              <div className="text-3xl font-extrabold text-[var(--c)] tabular-nums">{s.value}</div>
              <div className="text-[10px] text-[var(--color-text-subtle)] mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex gap-3 justify-center flex-wrap">
          <Button size="lg" onClick={() => navigate('/generate')}>
            ابدأ التوليد الآن
          </Button>
          <Button size="lg" variant="secondary" onClick={() => navigate('/github')}>
            GitHub Search
          </Button>
          {!hasAnyKey && (
            <Button size="lg" variant="secondary" onClick={() => navigate('/settings')}>
              أضف API Key مجاناً
            </Button>
          )}
          {totalQuestions > 0 && (
            <Button size="lg" variant="ghost" onClick={() => navigate('/saved')}>
              المحفوظة ({totalQuestions})
            </Button>
          )}
        </div>

        {/* No-key warning */}
        {!hasAnyKey && (
          <div className="mt-6 text-xs text-[var(--color-warning)] bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.2)] rounded-xl py-2.5 px-4 inline-flex items-center gap-2">
            محتاج API Key واحد على الأقل —
            <button
              className="text-[var(--color-info)] underline hover:no-underline"
              onClick={() => navigate('/settings')}
            >
              روح الإعدادات
            </button>
          </div>
        )}
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-l from-transparent via-[var(--color-border)] to-transparent my-2" />

      {/* ══ Categories ════════════════════════════════════════════════════ */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-[var(--color-text)]">التصنيفات المتاحة</h2>
            <p className="text-xs text-[var(--color-text-subtle)] mt-0.5">{CATEGORIES.length} تصنيف تقني</p>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
          {CATEGORIES.map(cat => {
            const count = LEVELS.reduce((s, l) => s + (questionSets[`${cat.id}-${l.id}`]?.length || 0), 0)
            return (
              <button
                key={cat.id}
                style={dynColor(cat.color)}
                onClick={() => navigate(`/generate?cat=${cat.id}`)}
                aria-label={`${cat.label}${count > 0 ? ` — ${count} سؤال` : ''}`}
                className={[
                  'group relative bg-[var(--color-surface)] border rounded-xl p-3 text-right',
                  'flex items-center gap-2 transition-all duration-200',
                  'hover:bg-[var(--c-dim)] hover:-translate-y-0.5 hover:shadow-md',
                  count > 0
                    ? 'border-[var(--c-dim)]'
                    : 'border-[var(--color-border)] hover:border-[var(--c)]',
                ].join(' ')}
              >
                <span className="text-base flex-shrink-0" aria-hidden="true">{cat.icon}</span>
                <span className="text-xs font-semibold flex-1 truncate text-[var(--c)]">{cat.label}</span>
                {count > 0 && (
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                    style={{ background: 'var(--c-dim)', color: 'var(--c)' }}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-l from-transparent via-[var(--color-border)] to-transparent my-10" />

      {/* ══ Free Providers ════════════════════════════════════════════════ */}
      <section className="mb-8">
        <div className="mb-5">
          <h2 className="text-base font-bold text-[var(--color-text)]">Providers المجانية</h2>
          <p className="text-xs text-[var(--color-text-subtle)] mt-0.5">API key مجاني تماماً — بدون credit card</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {FREE_PROVIDERS.map(m => (
            <div
              key={m.name}
              style={dynColor(m.color)}
              className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-3 flex items-center gap-3 hover:border-[var(--c)] transition-all duration-200"
            >
              <div
                className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold"
                style={{ background: 'var(--c-dim)', color: 'var(--c)' }}
                aria-hidden="true"
              >
                {m.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-[var(--color-text)] truncate">{m.name}</div>
                <div className="text-[11px] text-[var(--color-text-subtle)]">{m.desc}</div>
              </div>
              <a
                href={m.link}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] px-2.5 py-1.5 rounded-lg font-bold flex-shrink-0 transition-all hover:opacity-90"
                style={{ background: 'var(--c-dim)', color: 'var(--c)' }}
                aria-label={`احصل على API Key من ${m.name}`}
              >
                احصل على Key ↗
              </a>
            </div>
          ))}
        </div>
      </section>

    </PageContainer>
  )
}

export default HomePage
