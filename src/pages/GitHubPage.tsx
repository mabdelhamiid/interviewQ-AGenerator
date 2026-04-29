import { useState } from 'react'
import type { FC } from 'react'
import PageContainer from '../components/ui/PageContainer'
import SectionHeader from '../components/ui/SectionHeader'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import { dynColor } from '../utils/dynColor'

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

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178C6', JavaScript: '#F7DF1E', Python: '#3572A5',
  Rust: '#DEA584', Go: '#00ADD8', CSS: '#563D7C', HTML: '#E34F26',
}

const GitHubPage: FC = () => {
  const [query,   setQuery]   = useState('')
  const [repos,   setRepos]   = useState<Repo[]>([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [total,   setTotal]   = useState(0)
  const [sort,    setSort]    = useState<'stars' | 'updated'>('stars')

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

  function handleSort(s: 'stars' | 'updated') {
    setSort(s)
    if (repos.length > 0) search(query, s)
  }

  const suggestions = ['react interview questions', 'frontend roadmap', 'javascript algorithms', 'typescript starter', 'tailwind components']

  return (
    <PageContainer>
      <div className="pt-8 pb-4">
        <SectionHeader
          title="🔍 GitHub Search"
          subtitle="ابحث في GitHub عن repos · مجاني · 60 طلب/ساعة"
        />

        {/* Search box */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            placeholder="مثال: react interview questions, typescript starter..."
            className="flex-1 px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] outline-none focus:border-[var(--color-border-focus)] transition-colors font-sans"
          />
          <Button onClick={() => search()} disabled={loading || !query.trim()}>
            {loading ? <LoadingSpinner size="sm" /> : 'بحث'}
          </Button>
        </div>

        {/* Sort */}
        {repos.length > 0 && (
          <div className="flex items-center gap-2 mb-4 text-xs text-[var(--color-text-subtle)]">
            <span>ترتيب حسب:</span>
            {(['stars', 'updated'] as const).map(s => (
              <button
                key={s}
                onClick={() => handleSort(s)}
                className={[
                  'px-2.5 py-1 rounded-lg border transition-colors',
                  sort === s
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-dim)] text-[var(--color-primary)]'
                    : 'border-[var(--color-border)] text-[var(--color-text-subtle)] hover:text-[var(--color-text-muted)] hover:border-[var(--color-border-hover)]',
                ].join(' ')}
              >
                {s === 'stars' ? '⭐ Stars' : '🕐 آخر تحديث'}
              </button>
            ))}
            <span className="mr-auto text-[var(--color-text-subtle)]">{total.toLocaleString()} نتيجة</span>
          </div>
        )}

        {/* Suggestions */}
        {repos.length === 0 && !loading && !error && (
          <div className="flex items-center gap-2 flex-wrap mt-2">
            <span className="text-xs text-[var(--color-text-subtle)]">اقتراحات:</span>
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => { setQuery(s); search(s) }}
                className="text-xs px-2.5 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-dim)] transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center gap-3 py-16 text-[var(--color-text-subtle)] text-sm">
          <LoadingSpinner size="md" />
          جاري البحث في GitHub...
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-[rgba(244,63,94,0.06)] border border-[rgba(244,63,94,0.2)] rounded-xl p-4 text-sm text-[var(--color-error)] mb-4">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && repos.length === 0 && query && (
        <EmptyState icon="🔍" title="مفيش نتائج" desc="جرب كلمات بحث تانية" />
      )}

      {/* Results grid */}
      {!loading && repos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-8">
          {repos.map(repo => {
            const langColor = repo.language ? (LANG_COLORS[repo.language] || '#94A3B8') : '#44445a'
            return (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                style={dynColor(langColor)}
                className="glass block rounded-xl p-4 no-underline hover:border-[var(--c)] hover:shadow-[0_4px_24px_var(--c-glow)] transition-all group"
              >
                {/* Repo name */}
                <div className="text-sm font-bold text-[var(--color-primary)] group-hover:text-[var(--c)] mb-1.5 truncate transition-colors">
                  {repo.full_name}
                </div>

                {/* Description */}
                <p className="text-xs text-[var(--color-text-subtle)] leading-relaxed mb-3 line-clamp-2 min-h-[2.5rem]">
                  {repo.description || '—'}
                </p>

                {/* Topics */}
                {repo.topics?.length > 0 && (
                  <div className="flex gap-1 flex-wrap mb-3">
                    {repo.topics.slice(0, 4).map(t => (
                      <span
                        key={t}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-primary-dim)] border border-[rgba(124,92,252,0.2)] text-[var(--color-primary)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Meta row */}
                <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-subtle)]">
                  <span className="flex items-center gap-1">
                    ⭐ {repo.stargazers_count.toLocaleString()}
                  </span>
                  {repo.language && (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: langColor }} />
                      {repo.language}
                    </span>
                  )}
                  <span className="mr-auto">
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
