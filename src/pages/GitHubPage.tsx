/**
 * GitHubPage.tsx
 * --------------
 * Search GitHub repositories using the public GitHub Search API.
 *
 * Features:
 *  - Free, no authentication required (60 req/hour limit)
 *  - GSAP stagger reveal on search results
 *  - Glass search input with GSAP focus glow
 *  - Sort by stars or last updated
 *  - Language color coding via LANG_COLORS map
 */
import { useState, useEffect } from 'react'
import type { FC } from 'react'
import gsap from 'gsap'
import PageContainer from '../components/ui/PageContainer'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import { dynColor } from '../utils/dynColor'

/* ══════════════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════════════ */
interface Repo {
  id              : number
  full_name       : string
  description     : string | null
  stargazers_count: number
  language        : string | null
  html_url        : string
  topics          : string[]
  updated_at      : string
}

/* ── Language → color mapping for repo language dot ── */
const LANG_COLORS: Record<string, string> = {
  TypeScript : '#3178C6',
  JavaScript : '#F7DF1E',
  Python     : '#3572A5',
  Rust       : '#DEA584',
  Go         : '#00ADD8',
  CSS        : '#563D7C',
  HTML       : '#E34F26',
}

/* ══════════════════════════════════════════════════════════════
   GITHUB PAGE
   ══════════════════════════════════════════════════════════════ */
const GitHubPage: FC = () => {

  /* ── State ── */
  const [query,   setQuery]   = useState('')
  const [repos,   setRepos]   = useState<Repo[]>([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [total,   setTotal]   = useState(0)
  const [sort,    setSort]    = useState<'stars' | 'updated'>('stars')

  /* ── GSAP: stagger results in when repos list changes ── */
  useEffect(() => {
    if (repos.length === 0) return
    const cards = document.querySelectorAll('.repo-card')
    gsap.fromTo(
      cards,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out' },
    )
  }, [repos])

  /* ── Search: hits GitHub Search API ── */
  async function search(q = query, s = sort) {
    if (!q.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(q.trim())}&sort=${s}&per_page=12&order=desc`,
        { headers: { Accept: 'application/vnd.github.v3+json' } },
      )
      if (!res.ok) {
        if (res.status === 403) throw new Error('تجاوزت حد الطلبات (60/ساعة) — حاول بعد شوية')
        throw new Error(`GitHub API error: ${res.status}`)
      }
      const data = await res.json()
      setRepos(data.items || [])
      setTotal(data.total_count || 0)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'حصل خطأ في البحث')
    } finally {
      setLoading(false)
    }
  }

  /* ── Sort handler: re-searches with new sort if results exist ── */
  function handleSort(s: 'stars' | 'updated') {
    setSort(s)
    if (repos.length > 0) search(query, s)
  }

  /* ── GSAP search input focus/blur glow ── */
  function handleSearchFocus(e: React.FocusEvent<HTMLInputElement>) {
    gsap.to(e.currentTarget, { boxShadow: '0 0 0 3px rgba(59,130,246,0.20)', duration: 0.25 })
  }
  function handleSearchBlur(e: React.FocusEvent<HTMLInputElement>) {
    gsap.to(e.currentTarget, { boxShadow: '0 0 0 0px transparent', duration: 0.20 })
  }

  /* ── Quick search suggestions ── */
  const suggestions = [
    'react interview questions',
    'frontend roadmap',
    'javascript algorithms',
    'typescript starter',
    'tailwind components',
  ]

  /* ══════════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════════ */
  return (
    <PageContainer>

      {/* ── Page header ── */}
      <div style={{ paddingTop: 32, paddingBottom: 16 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
          fontWeight: 800, color: 'var(--color-text)', marginBottom: 4,
        }}>
          GitHub Search
        </h1>
        <p style={{ fontSize: 12, color: 'var(--color-text-subtle)' }}>
          ابحث في GitHub عن repos · مجاني · 60 طلب/ساعة
        </p>
      </div>

      {/* ── Search input + button ── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          placeholder="مثال: react interview questions, typescript starter..."
          style={{
            flex: 1, padding: '11px 16px',
            background: 'rgba(255,255,255,0.035)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, outline: 'none',
            color: 'var(--color-text)', fontSize: 13,
            fontFamily: 'inherit',
            transition: 'border-color var(--transition-fast)',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.14)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)' }}
        />
        <Button onClick={() => search()} disabled={loading || !query.trim()}>
          {loading ? <LoadingSpinner size="sm" /> : 'بحث'}
        </Button>
      </div>

      {/* ── Sort controls — shown when results exist ── */}
      {repos.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          marginBottom: 18, fontSize: 12, color: 'var(--color-text-subtle)',
        }}>
          <span>ترتيب حسب:</span>
          {(['stars', 'updated'] as const).map(s => (
            <button
              key={s}
              onClick={() => handleSort(s)}
              style={{
                padding: '4px 12px', borderRadius: 8, cursor: 'pointer',
                fontSize: 12, fontFamily: 'inherit',
                background: sort === s ? 'var(--color-primary-dim)' : 'transparent',
                border: `1px solid ${sort === s ? 'var(--color-primary)' : 'rgba(255,255,255,0.09)'}`,
                color: sort === s ? 'var(--color-primary)' : 'var(--color-text-subtle)',
                transition: 'all var(--transition-fast)',
              }}
            >
              {s === 'stars' ? '⭐ Stars' : '🕐 آخر تحديث'}
            </button>
          ))}
          <span style={{ marginRight: 'auto' }}>
            {total.toLocaleString()} نتيجة
          </span>
        </div>
      )}

      {/* ── Quick suggestions — shown before first search ── */}
      {repos.length === 0 && !loading && !error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          flexWrap: 'wrap', marginTop: 8,
        }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-subtle)' }}>اقتراحات:</span>
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => { setQuery(s); search(s) }}
              style={{
                fontSize: 11, padding: '4px 12px', borderRadius: 8, cursor: 'pointer',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                color: 'var(--color-text-muted)', fontFamily: 'inherit',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--color-primary)'
                e.currentTarget.style.color       = 'var(--color-primary)'
                e.currentTarget.style.background  = 'var(--color-primary-dim)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                e.currentTarget.style.color       = 'var(--color-text-muted)'
                e.currentTarget.style.background  = 'rgba(255,255,255,0.025)'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* ── Loading state ── */}
      {loading && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 12, padding: '64px 0',
          color: 'var(--color-text-subtle)', fontSize: 13,
        }}>
          <LoadingSpinner size="md" />
          جاري البحث في GitHub...
        </div>
      )}

      {/* ── Error state ── */}
      {error && !loading && (
        <div style={{
          background: 'rgba(244,63,94,0.055)',
          border: '1px solid rgba(244,63,94,0.20)',
          borderRadius: 12, padding: '14px 16px',
          fontSize: 13, color: 'var(--color-error)',
          marginBottom: 16,
        }}>
          {error}
        </div>
      )}

      {/* ── Empty search results ── */}
      {!loading && !error && repos.length === 0 && query && (
        <EmptyState icon="🔍" title="مفيش نتائج" desc="جرب كلمات بحث تانية" />
      )}

      {/* ── Results grid — repo-card for GSAP targeting ── */}
      {!loading && repos.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 12,
          paddingBottom: 48,
        }}>
          {repos.map(repo => {
            const langColor = repo.language
              ? (LANG_COLORS[repo.language] || '#94A3B8')
              : '#44445a'
            return (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="repo-card glass-card"
                style={{
                  ...dynColor(langColor),
                  display: 'block',
                  padding: '16px 18px',
                  textDecoration: 'none',
                  opacity: 0, // GSAP reveals
                  transition: 'border-color var(--transition-normal), box-shadow var(--transition-normal)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.borderColor = 'var(--c)'
                  el.style.boxShadow   = 'var(--shadow-glass), 0 0 20px var(--c-glow, rgba(59,130,246,0.15))'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.borderColor = 'rgba(59,130,246,0.15)'
                  el.style.boxShadow   = 'var(--shadow-glass)'
                }}
              >
                {/* Repo full name */}
                <div style={{
                  fontSize: 13, fontWeight: 700,
                  color: 'var(--color-primary)',
                  marginBottom: 6, wordBreak: 'break-word',
                  transition: 'color var(--transition-fast)',
                }}>
                  {repo.full_name}
                </div>

                {/* Description */}
                <p style={{
                  fontSize: 12, color: 'var(--color-text-subtle)',
                  lineHeight: 1.75, marginBottom: 12,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  minHeight: '2.5rem',
                }}>
                  {repo.description || '—'}
                </p>

                {/* Topic badges */}
                {repo.topics?.length > 0 && (
                  <div style={{
                    display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12,
                  }}>
                    {repo.topics.slice(0, 4).map(t => (
                      <span
                        key={t}
                        style={{
                          fontSize: 10, padding: '2px 7px', borderRadius: 5,
                          background: 'var(--color-primary-dim)',
                          border: '1px solid rgba(124,92,252,0.18)',
                          color: 'var(--color-primary)',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Meta: stars, language, date */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  fontSize: 11, color: 'var(--color-text-subtle)',
                }}>
                  <span>⭐ {repo.stargazers_count.toLocaleString()}</span>
                  {repo.language && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{
                        width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                        background: langColor, display: 'inline-block',
                      }} />
                      {repo.language}
                    </span>
                  )}
                  <span style={{ marginRight: 'auto' }}>
                    {new Date(repo.updated_at).toLocaleDateString('ar-EG', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </a>
            )
          })}
        </div>
      )}

    </PageContainer>
  )
}

export default GitHubPage
