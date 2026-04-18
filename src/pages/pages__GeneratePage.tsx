// src/pages/GeneratePage.tsx
// ══════════════════════════════════════════
// صفحة توليد الأسئلة
// ══════════════════════════════════════════

import { useState } from 'react'
import type { CSSProperties, FC } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { CATEGORIES, LEVELS, LOADING_MSGS } from '../constants'
import { AI_MODELS } from '../constants/models'
import { robustParseJSON, buildPrompt } from '../utils/parser'
import type { Question } from '../types'

const GeneratePage: FC = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { keys, selectedModel, setSelectedModel, questionSets, addQuestions, clearQuestions } = useAppContext()

  // الـ category والـ level من الـ URL params
  const selectedCat   = searchParams.get('cat')   || 'javascript'
  const selectedLevel = searchParams.get('level') || 'mid'

  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState<string | null>(null)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [openQ,      setOpenQ]      = useState<number | null>(null)

  const storeKey     = `${selectedCat}-${selectedLevel}`
  const currentQs    = questionSets[storeKey] || []
  const currentCat   = CATEGORIES.find(c => c.id === selectedCat)!
  const currentLevel = LEVELS.find(l => l.id === selectedLevel)!
  const currentModel = AI_MODELS.find(m => m.id === selectedModel)!

  // تحديث الـ URL لما يتغير الـ category أو level
  function setCat(cat: string)     { setSearchParams({ cat, level: selectedLevel }); setOpenQ(null) }
  function setLevel(level: string) { setSearchParams({ cat: selectedCat, level });   setOpenQ(null) }

  async function handleGenerate(count: number) {
    const apiKey = currentModel.getKey(keys)
    if (!apiKey) {
      setError(`⚠️ محتاج API Key للـ ${currentModel.label} — روح الإعدادات`)
      return
    }
    setLoading(true); setError(null); setOpenQ(null)
    let mi = 0; setLoadingMsg(LOADING_MSGS[0])
    const iv = setInterval(() => { mi = (mi + 1) % LOADING_MSGS.length; setLoadingMsg(LOADING_MSGS[mi]) }, 2500)
    try {
      const prompt = buildPrompt(currentCat.label, currentLevel.label, currentQs, count)
      const raw    = await currentModel.call(prompt, 'أنت خبير frontend developer. أجب بـ JSON فقط. الأسئلة بالعربية والكود بالإنجليزية. كل إجابة: شرح مفصل + كود + use cases + best practices. استخدم ━━━ للفصل.', apiKey)
      const parsed = robustParseJSON(raw)
      const newQs: Question[] = (parsed.questions || [])
        .filter(q => q.q && q.a)
        .map(q => ({ q: q.q, a: q.a, modelId: currentModel.id, modelLabel: currentModel.label, modelColor: currentModel.color, modelIcon: currentModel.icon }))
      if (newQs.length === 0) throw new Error('مرجعش أسئلة — جرب مرة تانية')
      addQuestions(storeKey, newQs)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'حصل خطأ')
    } finally {
      clearInterval(iv); setLoading(false)
    }
  }

  return (
    <div style={styles.page}>

      {/* ── Sidebar ── */}
      <aside style={styles.sidebar}>

        {/* Level */}
        <div style={styles.sideSection}>
          <div style={styles.sideLabel}>المستوى</div>
          {LEVELS.map(l => (
            <button key={l.id} onClick={() => setLevel(l.id)}
              style={{ ...styles.sideBtn, borderColor: selectedLevel === l.id ? l.color : '#0F2444', background: selectedLevel === l.id ? l.color + '22' : 'transparent', color: selectedLevel === l.id ? l.color : '#334155' }}>
              {l.label}
            </button>
          ))}
        </div>

        {/* Categories */}
        <div style={styles.sideSection}>
          <div style={styles.sideLabel}>التصنيف</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {CATEGORIES.map(cat => {
              const cnt = questionSets[`${cat.id}-${selectedLevel}`]?.length || 0
              const isSel = selectedCat === cat.id
              return (
                <button key={cat.id} onClick={() => setCat(cat.id)}
                  style={{ ...styles.catSideBtn, borderColor: isSel ? cat.color : 'transparent', background: isSel ? cat.color + '11' : 'transparent', color: isSel ? cat.color : '#334155' }}>
                  <span>{cat.icon}</span>
                  <span style={{ flex: 1, textAlign: 'right' }}>{cat.label}</span>
                  {cnt > 0 && <span style={{ ...styles.cnt, background: cat.color + '22', color: cat.color }}>{cnt}</span>}
                </button>
              )
            })}
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main style={styles.main}>

        {/* Model Selector */}
        <div style={styles.modelSection}>
          <div style={styles.sideLabel}>اختار الـ AI Model:</div>
          <div style={styles.modelsRow}>
            {AI_MODELS.map(model => {
              const hasKey = !!model.getKey(keys)
              const isSel  = selectedModel === model.id
              return (
                <button key={model.id} onClick={() => setSelectedModel(model.id)}
                  style={{ ...styles.modelBtn, borderColor: isSel ? model.color : hasKey ? model.color + '44' : '#0F2444', background: isSel ? model.color + '22' : 'transparent', color: isSel ? model.color : hasKey ? model.color + 'cc' : '#1E3A5F', boxShadow: isSel ? `0 0 12px ${model.color}44` : 'none' }}>
                  {model.icon} {model.label}
                  {model.free && <span style={styles.freeBadge}>FREE</span>}
                  {!hasKey && <span style={{ fontSize: 9, color: '#EF4444' }}>🔑</span>}
                </button>
              )
            })}
          </div>
        </div>

        {/* Generate Panel */}
        <div style={styles.generatePanel}>
          <div style={styles.generateInfo}>
            <span style={{ ...styles.chip, background: currentCat.color + '22', color: currentCat.color }}>{currentCat.icon} {currentCat.label}</span>
            <span style={{ ...styles.chip, background: currentLevel.color + '22', color: currentLevel.color }}>{currentLevel.label}</span>
            <span style={{ ...styles.chip, background: currentModel.color + '22', color: currentModel.color }}>{currentModel.icon} {currentModel.label}</span>
            <span style={{ fontSize: 12, color: '#334155' }}>{currentQs.length} سؤال</span>
          </div>

          <div style={styles.generateBtns}>
            {([10, 20, 30] as const).map(n => (
              <button key={n} onClick={() => handleGenerate(n)} disabled={loading}
                style={{ ...styles.genBtn, background: loading ? '#0F172A' : `linear-gradient(135deg, ${currentCat.color}dd, ${currentCat.color}88)`, color: loading ? '#334155' : '#fff', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : `0 4px 20px ${currentCat.color}44` }}>
                {loading ? '⏳' : `+ ولّد ${n} سؤال`}
              </button>
            ))}
            {currentQs.length > 0 && (
              <>
                <button onClick={() => clearQuestions(storeKey)} style={styles.clearBtn}>🗑 مسح</button>
                <button onClick={() => navigate('/saved')} style={styles.savedBtn}>💾 عرض المحفوظة</button>
              </>
            )}
            {!currentModel.getKey(keys) && (
              <button onClick={() => navigate('/settings')} style={styles.keyBtn}>⚙️ أضف API Key</button>
            )}
          </div>

          {loading && (
            <div style={{ ...styles.loadingBar, borderColor: currentCat.color + '44', color: currentCat.color }}>
              <span style={{ ...styles.spinner, borderTopColor: currentCat.color }} />
              {loadingMsg}
            </div>
          )}
          {error && <div style={styles.errorBar}>{error}</div>}
        </div>

        {/* Empty State */}
        {currentQs.length === 0 && !loading && (
          <div style={styles.empty}>
            <div style={{ fontSize: 48 }}>🤖</div>
            <div style={{ fontSize: 15, color: '#334155', marginTop: 12 }}>
              {currentModel.icon} {currentModel.label} جاهز يولّد أسئلة {currentCat.label}
            </div>
            <div style={{ fontSize: 12, color: '#1E3A5F', marginTop: 6 }}>مستوى {currentLevel.label}</div>
          </div>
        )}

        {/* Questions */}
        {currentQs.map((item, i) => {
          const isOpen = openQ === i
          return (
            <div key={i} style={{ ...styles.qCard, borderColor: isOpen ? item.modelColor + '55' : '#0F2444', boxShadow: isOpen ? `0 0 20px ${item.modelColor}22` : '0 2px 8px #00000033' }}>
              <button onClick={() => setOpenQ(isOpen ? null : i)} style={styles.qHeader}>
                <div style={styles.qMeta}>
                  <span style={{ ...styles.badge, background: currentCat.color + '22', color: currentCat.color }}>Q{i + 1}</span>
                  <span style={{ ...styles.badge, background: currentLevel.color + '22', color: currentLevel.color }}>{selectedLevel.toUpperCase()}</span>
                  <span style={{ ...styles.badge, background: item.modelColor + '22', color: item.modelColor }}>{item.modelIcon} {item.modelLabel.split(' ')[0]}</span>
                  <span style={styles.qText}>{item.q}</span>
                </div>
                <span style={{ color: currentCat.color, fontSize: 18, transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s', flexShrink: 0 }}>▾</span>
              </button>
              {isOpen && (
                <div style={styles.answerBox}>
                  <pre style={styles.answerPre}>{item.a}</pre>
                </div>
              )}
            </div>
          )
        })}

        {currentQs.length > 0 && !loading && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button onClick={() => handleGenerate(10)}
              style={{ ...styles.genBtn, padding: '11px 32px', borderRadius: 28, background: `linear-gradient(135deg, ${currentCat.color}cc, ${currentCat.color}66)`, color: '#fff', boxShadow: `0 4px 20px ${currentCat.color}44`, cursor: 'pointer' }}>
              ⚡ ولّد 10 أكتر
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  page: { display: 'flex', gap: 0, minHeight: 'calc(100vh - 60px)' },
  sidebar: {
    width: 220, flexShrink: 0,
    background: 'linear-gradient(180deg, #040F22, #030D1E)',
    borderLeft: '1px solid #0F2444',
    padding: '20px 12px',
    overflowY: 'auto', maxHeight: 'calc(100vh - 60px)',
    position: 'sticky', top: 60,
  },
  sideSection: { marginBottom: 24 },
  sideLabel: { fontSize: 11, color: '#334155', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  sideBtn: {
    display: 'block', width: '100%', padding: '7px 12px',
    border: '1px solid', borderRadius: 8,
    cursor: 'pointer', fontSize: 12, fontWeight: 600,
    marginBottom: 4, textAlign: 'right',
  },
  catSideBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    width: '100%', padding: '6px 10px',
    border: '1px solid', borderRadius: 7,
    cursor: 'pointer', fontSize: 11,
  },
  cnt: { fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 8 },
  main: { flex: 1, padding: '20px 32px 40px', overflowX: 'hidden' },
  modelSection: { marginBottom: 16 },
  modelsRow: { display: 'flex', gap: 4, flexWrap: 'wrap' },
  modelBtn: {
    padding: '5px 10px', borderRadius: 8, border: '1px solid',
    cursor: 'pointer', fontSize: 11,
    display: 'flex', alignItems: 'center', gap: 4,
    transition: 'all 0.15s',
  },
  freeBadge: { fontSize: 8, fontWeight: 700, padding: '1px 4px', background: '#22C55E22', color: '#22C55E', borderRadius: 4 },
  generatePanel: {
    background: 'linear-gradient(135deg, #040F22, #050F24)',
    border: '1px solid #0F2444', borderRadius: 14,
    padding: '16px', marginBottom: 16,
  },
  generateInfo: { display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' },
  chip: { padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 },
  generateBtns: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  genBtn: { padding: '8px 16px', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700 },
  clearBtn: { padding: '8px 14px', background: 'transparent', border: '1px solid #0F2444', borderRadius: 10, color: '#334155', cursor: 'pointer', fontSize: 13 },
  savedBtn: { padding: '8px 14px', background: 'transparent', border: '1px solid #1E40AF44', borderRadius: 10, color: '#60A5FA', cursor: 'pointer', fontSize: 13 },
  keyBtn:  { padding: '8px 14px', background: '#EF444411', border: '1px solid #EF444433', borderRadius: 10, color: '#FCA5A5', cursor: 'pointer', fontSize: 13 },
  loadingBar: { marginTop: 12, padding: '10px 14px', background: '#020B18', borderRadius: 10, border: '1px solid', fontSize: 13, display: 'flex', alignItems: 'center', gap: 10 },
  spinner: { display: 'inline-block', width: 13, height: 13, border: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 },
  errorBar: { marginTop: 10, padding: '10px 14px', background: '#EF444411', border: '1px solid #EF444433', borderRadius: 10, fontSize: 12, color: '#FCA5A5' },
  empty: { textAlign: 'center', padding: '60px 20px', color: '#1E3A5F' },
  qCard: { background: 'linear-gradient(135deg, #040F22, #040D1E)', border: '1px solid', borderRadius: 12, overflow: 'hidden', transition: 'all 0.2s', marginBottom: 8 },
  qHeader: { width: '100%', textAlign: 'right', padding: '12px 14px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  qMeta: { display: 'flex', alignItems: 'center', gap: 6, flex: 1, flexWrap: 'wrap' },
  badge: { padding: '2px 7px', borderRadius: 6, fontSize: 10, fontWeight: 700, flexShrink: 0 },
  qText: { fontSize: 13, fontWeight: 500, color: '#94A3B8', lineHeight: 1.4 },
  answerBox: { borderTop: '1px solid #0F2444', padding: '14px 16px', background: 'linear-gradient(135deg, #020B18, #020910)' },
  answerPre: { margin: 0, fontFamily: "'Consolas','Monaco',monospace", fontSize: 12.5, lineHeight: 1.85, color: '#94A3B8', whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
}

export default GeneratePage
