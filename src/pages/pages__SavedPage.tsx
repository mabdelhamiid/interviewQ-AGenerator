// src/pages/SavedPage.tsx
// ══════════════════════════════════════════
// صفحة الأسئلة المحفوظة
// ══════════════════════════════════════════

import { useState } from 'react'
import type { CSSProperties, FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { CATEGORIES, LEVELS } from '../constants'

const SavedPage: FC = () => {
  const navigate = useNavigate()
  const { questionSets, clearQuestions, clearAllQuestions, totalQuestions } = useAppContext()
  const [openQ, setOpenQ] = useState<string | null>(null)
  const [filterCat] = useState<string>('all')

  // كل الـ sections اللي فيها أسئلة
  const sections = Object.entries(questionSets)
    .filter(([, qs]) => qs.length > 0)
    .filter(([key]) => filterCat === 'all' || key.startsWith(filterCat))

  return (
    <div style={styles.page}>
      <div style={styles.inner}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>💾 الأسئلة المحفوظة</h1>
            <p style={styles.subtitle}>{totalQuestions} سؤال في {sections.length} قسم</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => navigate('/generate')} style={styles.generateBtn}>
              ⚡ ولّد أكتر
            </button>
            {totalQuestions > 0 && (
              <button onClick={() => { if (confirm('مسح كل الأسئلة؟')) clearAllQuestions() }} style={styles.clearBtn}>
                🗑 مسح الكل
              </button>
            )}
          </div>
        </div>

        {/* فارغة */}
        {totalQuestions === 0 && (
          <div style={styles.empty}>
            <div style={{ fontSize: 48 }}>📭</div>
            <p style={{ color: '#334155', marginTop: 12 }}>مفيش أسئلة محفوظة لسه</p>
            <button onClick={() => navigate('/generate')} style={styles.generateBtn}>
              ابدأ التوليد
            </button>
          </div>
        )}

        {/* Sections */}
        {sections.map(([key, qs]) => {
          const [catId, levelId] = key.split('-')
          const cat   = CATEGORIES.find(c => c.id === catId)
          const level = LEVELS.find(l => l.id === levelId)
          if (!cat || !level) return null

          return (
            <div key={key} style={styles.section}>
              {/* Section Header */}
              <div style={styles.sectionHeader}>
                <span style={{ ...styles.catChip, background: cat.color + '22', color: cat.color }}>
                  {cat.icon} {cat.label}
                </span>
                <span style={{ ...styles.levelChip, background: level.color + '22', color: level.color }}>
                  {level.label}
                </span>
                <span style={styles.count}>{qs.length} سؤال</span>
                <div style={{ flex: 1 }} />
                <button
                  onClick={() => navigate(`/generate?cat=${catId}&level=${levelId}`)}
                  style={styles.addMoreBtn}
                >
                  + أضف أكتر
                </button>
                <button onClick={() => clearQuestions(key)} style={styles.sectionClear}>🗑</button>
              </div>

              {/* Questions */}
              {qs.map((item, i) => {
                const qKey = `${key}-${i}`
                const isOpen = openQ === qKey
                return (
                  <div key={i} style={{ ...styles.qCard, borderColor: isOpen ? cat.color + '55' : '#0F2444' }}>
                    <button onClick={() => setOpenQ(isOpen ? null : qKey)} style={styles.qHeader}>
                      <div style={styles.qMeta}>
                        <span style={{ ...styles.badge, background: cat.color + '22', color: cat.color }}>Q{i + 1}</span>
                        <span style={{ ...styles.badge, background: item.modelColor + '22', color: item.modelColor }}>
                          {item.modelIcon} {item.modelLabel.split(' ')[0]}
                        </span>
                        <span style={styles.qText}>{item.q}</span>
                      </div>
                      <span style={{ color: cat.color, fontSize: 16, transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s', flexShrink: 0 }}>▾</span>
                    </button>
                    {isOpen && (
                      <div style={styles.answerBox}>
                        <pre style={styles.answerPre}>{item.a}</pre>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  page: { padding: '0 40px 60px' },
  inner: { maxWidth: 1000, margin: '0 auto' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '32px 0 24px', flexWrap: 'wrap', gap: 16 },
  title: { fontSize: 24, fontWeight: 800, color: '#F1F5F9', margin: 0 },
  subtitle: { fontSize: 13, color: '#475569', marginTop: 4 },
  generateBtn: { padding: '8px 18px', background: 'linear-gradient(135deg, #1D4ED8, #2563EB)', border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700 },
  clearBtn: { padding: '8px 16px', background: 'transparent', border: '1px solid #1E3A5F', borderRadius: 10, color: '#475569', cursor: 'pointer', fontSize: 13 },
  empty: { textAlign: 'center', padding: '80px 20px', color: '#1E3A5F' },
  section: { marginBottom: 32 },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' },
  catChip: { padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700 },
  levelChip: { padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  count: { fontSize: 12, color: '#334155', background: '#0F2444', padding: '3px 10px', borderRadius: 20 },
  addMoreBtn: { padding: '5px 12px', background: 'transparent', border: '1px solid #1E40AF44', borderRadius: 8, color: '#60A5FA', cursor: 'pointer', fontSize: 12 },
  sectionClear: { padding: '5px 10px', background: 'transparent', border: '1px solid #1E3A5F', borderRadius: 8, color: '#475569', cursor: 'pointer', fontSize: 13 },
  qCard: { background: 'linear-gradient(135deg, #040F22, #040D1E)', border: '1px solid', borderRadius: 12, overflow: 'hidden', marginBottom: 6, transition: 'border-color 0.2s' },
  qHeader: { width: '100%', textAlign: 'right', padding: '12px 14px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  qMeta: { display: 'flex', alignItems: 'center', gap: 6, flex: 1, flexWrap: 'wrap' },
  badge: { padding: '2px 7px', borderRadius: 6, fontSize: 10, fontWeight: 700, flexShrink: 0 },
  qText: { fontSize: 13, fontWeight: 500, color: '#94A3B8', lineHeight: 1.4 },
  answerBox: { borderTop: '1px solid #0F2444', padding: '14px 16px', background: '#020B18' },
  answerPre: { margin: 0, fontFamily: "'Consolas','Monaco',monospace", fontSize: 12.5, lineHeight: 1.85, color: '#94A3B8', whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
}

export default SavedPage
