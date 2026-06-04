/**
 * TextField.tsx
 * -------------
 * Shared text/password input with GSAP focus glow.
 * Replaces bespoke inputs in GitHubPage and SettingsPage.
 */
import { useRef } from 'react'
import type { FC, InputHTMLAttributes, ReactNode } from 'react'
import gsap from 'gsap'

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Optional element rendered inside the input row on the left (RTL trailing) side */
  suffix?: ReactNode
  /** Highlight the border with the dynColor --c variable when a value is present */
  dynBorder?: boolean
}

const TextField: FC<TextFieldProps> = ({ suffix, dynBorder = false, style, ...props }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFocus() {
    if (!inputRef.current) return
    gsap.to(inputRef.current.parentElement!, {
      boxShadow: '0 0 0 3px rgba(99,102,241,0.22)',
      duration: 0.25,
    })
  }

  function handleBlur() {
    if (!inputRef.current) return
    gsap.to(inputRef.current.parentElement!, {
      boxShadow: '0 0 0 0px transparent',
      duration: 0.20,
    })
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flex: 1,
        background: 'rgba(255,255,255,0.035)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${dynBorder && props.value ? 'var(--c, rgba(255,255,255,0.12))' : 'rgba(255,255,255,0.09)'}`,
        borderRadius: 10,
        transition: 'border-color var(--transition-fast)',
        overflow: 'hidden',
      }}
    >
      <input
        ref={inputRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{
          flex: 1,
          padding: '10px 14px',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'var(--color-text)',
          fontSize: 13,
          fontFamily: 'inherit',
          minWidth: 0,
          ...style,
        }}
        {...props}
      />
      {suffix && (
        <div style={{ paddingLeft: 8, paddingRight: 8, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          {suffix}
        </div>
      )}
    </div>
  )
}

export default TextField
