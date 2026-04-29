import { useEffect } from 'react'
import type { FC } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
  id: string
  message: string
  type: ToastType
}

interface ToastProps {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
  warning: '⚠',
}

const TYPE_CLASSES: Record<ToastType, string> = {
  success: 'border-[var(--color-success)] bg-[rgba(16,185,129,0.1)]',
  error:   'border-[var(--color-error)]   bg-[rgba(244,63,94,0.1)]',
  info:    'border-[var(--color-info)]    bg-[rgba(59,130,246,0.1)]',
  warning: 'border-[var(--color-warning)] bg-[rgba(245,158,11,0.1)]',
}

const ICON_CLASSES: Record<ToastType, string> = {
  success: 'text-[var(--color-success)]',
  error:   'text-[var(--color-error)]',
  info:    'text-[var(--color-info)]',
  warning: 'text-[var(--color-warning)]',
}

const ToastEntry: FC<{ toast: ToastItem; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 4000)
    return () => clearTimeout(t)
  }, [toast.id, onDismiss])

  return (
    <div
      role="alert"
      aria-live="polite"
      className={[
        'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg',
        'animate-slide-up min-w-[260px] max-w-[360px]',
        TYPE_CLASSES[toast.type],
      ].join(' ')}
    >
      <span className={['text-sm font-bold w-5 text-center flex-shrink-0', ICON_CLASSES[toast.type]].join(' ')}>
        {ICONS[toast.type]}
      </span>
      <span className="text-sm text-[var(--color-text)] flex-1 leading-snug">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-[var(--color-text-subtle)] hover:text-[var(--color-text)] transition-colors flex-shrink-0 text-xs"
        aria-label="إغلاق"
      >
        ✕
      </button>
    </div>
  )
}

const ToastContainer: FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-6 left-6 z-[200] flex flex-col gap-2"
      aria-label="إشعارات"
    >
      {toasts.map(t => (
        <ToastEntry key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

export default ToastContainer
