import { useState } from 'react'
import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { CATEGORIES, LEVELS } from '../constants'
import PageContainer from '../components/ui/PageContainer'
import SectionHeader from '../components/ui/SectionHeader'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import { dynColor } from '../utils/dynColor'

const SavedPage: FC = () => {
  const navigate = useNavigate()
  const { questionSets, clearQuestions, clearAllQuestions, totalQuestions, toast } = useAppContext()
  const [openQ,      setOpenQ]      = useState<string | null>(null)
  const [confirmKey, setConfirmKey] = useState<string | null>(null)
  const [confirmAll, setConfirmAll] = useState(false)

  const sections = Object.entries(questionSets).filter(([, qs]) => qs.length > 0)

  function handleClearSection(key: string) {
    clearQuestions(key)
    setConfirmKey(null)
    toast('تم مسح القسم', 'success')
  }

  function handleClearAll() {
    clearAllQuestions()
    setConfirmAll(false)
    toast('تم مسح كل الأسئلة', 'success')
  }

  return (
    <PageContainer>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 pt-8 pb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--color-text)]">الأسئلة المحفوظة</h1>
          <p className="text-xs text-[var(--color-text-subtle)] mt-1">
            {totalQuestions} سؤال في {sections.length} قسم
          </p>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <Button size="sm" onClick={() => navigate('/generate')}>ولّد أكتر</Button>
          {totalQuestions > 0 && !confirmAll && (
            <Button size="sm" variant="danger" onClick={() => setConfirmAll(true)}>
              مسح الكل
            </Button>
          )}
          {confirmAll && (
            <div className="flex items-center gap-2 bg-[rgba(244,63,94,0.08)] border border-[rgba(244,63,94,0.25)] rounded-lg px-3 py-1.5">
              <span className="text-xs text-[var(--color-error)]">مسح كل الأسئلة؟</span>
              <button
                className="text-xs font-bold text-[var(--color-error)] hover:underline"
                onClick={handleClearAll}
              >
                نعم
              </button>
              <button
                className="text-xs text-[var(--color-text-subtle)] hover:text-[var(--color-text-muted)]"
                onClick={() => setConfirmAll(false)}
              >
                لا
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Empty */}
      {totalQuestions === 0 && (
        <EmptyState
          icon="📭"
          title="مفيش أسئلة محفوظة لسه"
          desc="ولّد أسئلة من صفحة التوليد"
          action={<Button onClick={() => navigate('/generate')}>ابدأ التوليد</Button>}
        />
      )}

      {/* Sections */}
      {sections.map(([key, qs]) => {
        const [catId, levelId] = key.split('-')
        const cat   = CATEGORIES.find(c => c.id === catId)
        const level = LEVELS.find(l => l.id === levelId)
        if (!cat || !level) return null

        const isConfirming = confirmKey === key

        return (
          <div key={key} className="mb-8">
            <SectionHeader
              title={
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    style={dynColor(cat.color)}
                    className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--c-dim)] text-[var(--c)]"
                  >
                    {cat.icon} {cat.label}
                  </span>
                  <span
                    style={dynColor(level.color)}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--c-dim)] text-[var(--c)]"
                  >
                    {level.label}
                  </span>
                  <span className="text-xs text-[var(--color-text-subtle)] bg-[var(--color-surface-2)] px-2.5 py-1 rounded-full">
                    {qs.length} سؤال
                  </span>
                </div>
              }
              action={
                <div className="flex gap-1.5 items-center">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(`/generate?cat=${catId}&level=${levelId}`)}
                  >
                    أضف أكتر
                  </Button>
                  {!isConfirming ? (
                    <Button size="sm" variant="danger" onClick={() => setConfirmKey(key)}>
                      مسح
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-[rgba(244,63,94,0.08)] border border-[rgba(244,63,94,0.25)] rounded-lg px-2.5 py-1">
                      <span className="text-[11px] text-[var(--color-error)]">تأكيد؟</span>
                      <button className="text-[11px] font-bold text-[var(--color-error)] hover:underline" onClick={() => handleClearSection(key)}>نعم</button>
                      <button className="text-[11px] text-[var(--color-text-subtle)]" onClick={() => setConfirmKey(null)}>لا</button>
                    </div>
                  )}
                </div>
              }
            />

            {qs.map((item, i) => {
              const qKey   = `${key}-${i}`
              const isOpen = openQ === qKey
              return (
                <div
                  key={i}
                  style={dynColor(cat.color)}
                  className={[
                    'border rounded-xl overflow-hidden mb-1.5 bg-[var(--color-surface)] transition-all',
                    isOpen
                      ? 'border-[var(--c)]'
                      : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]',
                  ].join(' ')}
                >
                  <button
                    onClick={() => setOpenQ(isOpen ? null : qKey)}
                    aria-expanded={isOpen}
                    aria-controls={`saved-answer-${qKey}`}
                    className="w-full text-right px-4 py-3 bg-transparent cursor-pointer flex items-start justify-between gap-3"
                  >
                    <div className="flex items-center gap-1.5 flex-1 flex-wrap">
                      <Badge
                        style={dynColor(cat.color)}
                        className="bg-[var(--c-dim)] text-[var(--c)]"
                      >
                        Q{i + 1}
                      </Badge>
                      <Badge
                        style={dynColor(item.modelColor)}
                        className="bg-[var(--c-dim)] text-[var(--c)]"
                      >
                        {item.modelIcon} {item.modelLabel.split(' ')[0]}
                      </Badge>
                      <span className="text-xs font-medium text-[var(--color-text-muted)] leading-snug">
                        {item.q}
                      </span>
                    </div>
                    <span
                      className="flex-shrink-0 text-sm text-[var(--color-text-subtle)] transition-transform duration-300"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      aria-hidden="true"
                    >
                      ▾
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      id={`saved-answer-${qKey}`}
                      className="border-t border-[var(--color-border)] px-4 py-3.5 bg-[var(--color-bg)] animate-fade-in"
                    >
                      <pre className="m-0 text-[12.5px] leading-[1.85] text-[var(--color-text-muted)] whitespace-pre-wrap break-words">
                        {item.a}
                      </pre>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      })}
    </PageContainer>
  )
}

export default SavedPage
