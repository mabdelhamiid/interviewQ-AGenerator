import { useState, useRef, useCallback } from 'react'
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

const GeneratePage: FC = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { keys, selectedModel, setSelectedModel, questionSets, clearQuestions, toast } = useAppContext()

  const selectedCat   = searchParams.get('cat')   || 'javascript'
  const selectedLevel = searchParams.get('level') || 'mid'
  const storeKey      = `${selectedCat}-${selectedLevel}`

  const currentCat   = CATEGORIES.find(c => c.id === selectedCat) ?? CATEGORIES[0]
  const currentLevel = LEVELS.find(l => l.id === selectedLevel)   ?? LEVELS[1]

  const { loading, error, loadingMsg, generate, currentModel, currentQs } = useGenerate({
    storeKey, currentCat, currentLevel,
  })

  const [openQ, setOpenQ] = useState<number | null>(null)
  const modelRefs = useRef<(HTMLButtonElement | null)[]>([])

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

  function setCat(cat: string)     { setSearchParams({ cat, level: selectedLevel }); setOpenQ(null) }
  function setLevel(level: string) { setSearchParams({ cat: selectedCat, level });   setOpenQ(null) }

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => toast('تم نسخ الإجابة', 'success'))
  }, [toast])

  const handleClear = useCallback(() => {
    clearQuestions(storeKey)
    toast('تم مسح الأسئلة', 'info')
  }, [clearQuestions, storeKey, toast])

  return (
    <div className="max-w-[1280px] mx-auto flex min-h-[calc(100vh-60px)]">

      {/* ══ Sidebar ══════════════════════════════════════════════════════ */}
      <aside
        className="w-[200px] flex-shrink-0 border-l border-[var(--color-border)] bg-[var(--color-surface)] p-4 overflow-y-auto max-h-[calc(100vh-60px)] sticky top-[60px]"
        aria-label="الفلاتر"
      >
        {/* Level selector */}
        <div className="mb-6">
          <p className="text-[9px] font-bold text-[var(--color-text-subtle)] uppercase tracking-widest mb-2">
            المستوى
          </p>
          <div role="radiogroup" aria-label="مستوى الأسئلة">
            {LEVELS.map(l => (
              <button
                key={l.id}
                role="radio"
                aria-checked={selectedLevel === l.id}
                onClick={() => setLevel(l.id)}
                style={dynColor(l.color)}
                className={[
                  'block w-full text-right px-3 py-2 mb-1 rounded-lg text-xs font-semibold transition-all border',
                  selectedLevel === l.id
                    ? 'border-[var(--c)] bg-[var(--c-dim)] text-[var(--c)]'
                    : 'border-transparent text-[var(--color-text-subtle)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-muted)]',
                ].join(' ')}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category selector */}
        <div>
          <p className="text-[9px] font-bold text-[var(--color-text-subtle)] uppercase tracking-widest mb-2">
            التصنيف
          </p>
          <div role="list" aria-label="تصنيفات الأسئلة">
            {CATEGORIES.map(cat => {
              const cnt  = questionSets[`${cat.id}-${selectedLevel}`]?.length || 0
              const isSel = selectedCat === cat.id
              return (
                <button
                  key={cat.id}
                  role="listitem"
                  onClick={() => setCat(cat.id)}
                  aria-pressed={isSel}
                  style={dynColor(cat.color)}
                  className={[
                    'flex items-center gap-1.5 w-full px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all border mb-0.5',
                    isSel
                      ? 'border-[var(--c)] bg-[var(--c-dim)] text-[var(--c)]'
                      : 'border-transparent text-[var(--color-text-subtle)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-muted)]',
                  ].join(' ')}
                >
                  <span className="flex-shrink-0 w-4 text-center" aria-hidden="true">{cat.icon}</span>
                  <span className="flex-1 text-right truncate">{cat.label}</span>
                  {cnt > 0 && (
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0"
                      style={{ background: 'var(--c-dim)', color: 'var(--c)' }}
                    >
                      {cnt}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </aside>

      {/* ══ Main ═════════════════════════════════════════════════════════ */}
      <main className="flex-1 p-5 md:p-8 overflow-x-hidden min-w-0">

        {/* ── Model selector ── */}
        <section className="mb-5">
          <p className="text-[9px] font-bold text-[var(--color-text-subtle)] uppercase tracking-widest mb-2">
            AI Model
          </p>
          <div
            className="flex gap-1.5 flex-wrap"
            role="radiogroup"
            aria-label="اختيار موديل الذكاء الاصطناعي"
          >
            {AI_MODELS.map((model, idx) => {
              const hasKey = !!model.getKey(keys)
              const isSel  = selectedModel === model.id
              return (
                <button
                  key={model.id}
                  ref={el => { modelRefs.current[idx] = el }}
                  role="radio"
                  aria-checked={isSel}
                  onClick={() => setSelectedModel(model.id)}
                  onKeyDown={e => handleModelKeyDown(e, idx)}
                  tabIndex={isSel ? 0 : -1}
                  style={dynColor(model.color)}
                  className={[
                    'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-all',
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
                    <span className="text-[8px] font-bold px-1 py-px bg-[rgba(34,197,94,0.15)] text-[var(--color-success)] rounded">
                      FREE
                    </span>
                  )}
                  {!hasKey && (
                    <span className="text-[9px] text-[var(--color-warning)]" aria-label="يحتاج API key">●</span>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        {/* ── Generate panel ── */}
        <div
          style={dynColor(currentCat.color)}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 mb-5 relative overflow-hidden"
        >
          {/* Subtle top border accent */}
          <div
            className="absolute top-0 right-0 left-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, var(--c-dim), transparent)' }}
          />

          {/* Current selection chips */}
          <div className="flex gap-2 mb-4 flex-wrap items-center">
            <span
              className="px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1"
              style={{ background: 'var(--c-dim)', color: 'var(--c)' }}
            >
              <span aria-hidden="true">{currentCat.icon}</span>
              {currentCat.label}
            </span>
            <span
              style={dynColor(currentLevel.color)}
              className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--c-dim)] text-[var(--c)]"
            >
              {currentLevel.label}
            </span>
            <span
              style={dynColor(currentModel.color)}
              className="px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 bg-[var(--c-dim)] text-[var(--c)]"
            >
              <span aria-hidden="true">{currentModel.icon}</span>
              {currentModel.label}
            </span>
            {currentQs.length > 0 && (
              <span className="text-xs text-[var(--color-text-subtle)] mr-auto">
                {currentQs.length} سؤال
              </span>
            )}
          </div>

          {/* Generate buttons */}
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
            {currentQs.length > 0 && (
              <>
                <Button variant="ghost" size="sm" onClick={handleClear}>مسح</Button>
                <Button variant="secondary" size="sm" onClick={() => navigate('/saved')}>المحفوظة</Button>
              </>
            )}
            {!currentModel.getKey(keys) && (
              <Button variant="danger" size="sm" onClick={() => navigate('/settings')}>
                أضف API Key
              </Button>
            )}
          </div>

          {/* Loading bar */}
          {loading && (
            <div
              style={{ borderColor: `${currentCat.color}44`, color: currentCat.color, background: `${currentCat.color}08` }}
              className="mt-3 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-xs"
            >
              <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin flex-shrink-0" aria-hidden="true" />
              {loadingMsg}
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mt-3 px-3.5 py-2.5 rounded-xl border text-xs text-[var(--color-error)]"
              style={{ background: 'rgba(244,63,94,0.06)', borderColor: 'rgba(244,63,94,0.25)' }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && <SkeletonList count={5} />}

        {/* Empty state */}
        {currentQs.length === 0 && !loading && (
          <EmptyState
            icon="🤖"
            title={`${currentModel.label} جاهز يولّد أسئلة ${currentCat.label}`}
            desc={`مستوى ${currentLevel.label} · اختار عدد الأسئلة فوق`}
          />
        )}

        {/* ── Question cards ── */}
        {!loading && currentQs.map((item, i) => {
          const isOpen = openQ === i
          return (
            <div
              key={i}
              style={dynColor(item.modelColor)}
              className={[
                'border rounded-2xl overflow-hidden transition-all duration-200 mb-2 bg-[var(--color-surface)]',
                isOpen
                  ? 'border-[var(--c)] shadow-[0_0_20px_var(--c-glow)]'
                  : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]',
              ].join(' ')}
            >
              {/* Question header */}
              <button
                onClick={() => setOpenQ(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`answer-${i}`}
                className="w-full text-right px-4 py-3.5 bg-transparent cursor-pointer flex items-start justify-between gap-3 group"
              >
                <div className="flex items-start gap-2 flex-1 flex-wrap">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 tabular-nums mt-0.5"
                    style={{ background: 'var(--c-dim)', color: 'var(--c)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 mt-0.5"
                    style={{ background: `${currentLevel.color}22`, color: currentLevel.color }}
                  >
                    {selectedLevel.toUpperCase()}
                  </span>
                  <span className="text-sm font-medium text-[var(--color-text)] leading-snug">
                    {item.q}
                  </span>
                </div>
                <span
                  className="flex-shrink-0 text-[var(--color-text-subtle)] transition-transform duration-300 mt-1"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  aria-hidden="true"
                >
                  ▾
                </span>
              </button>

              {/* Answer panel */}
              {isOpen && (
                <div
                  id={`answer-${i}`}
                  className="border-t border-[var(--color-border)] bg-[var(--color-bg)] animate-fade-in"
                >
                  <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)]">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                      style={{ background: 'var(--c-dim)', color: 'var(--c)' }}
                    >
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
                  <pre className="px-4 py-4 text-[12.5px] leading-[1.9] text-[var(--color-text-muted)] whitespace-pre-wrap break-words m-0">
                    {item.a}
                  </pre>
                </div>
              )}
            </div>
          )
        })}

        {/* Load more */}
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
