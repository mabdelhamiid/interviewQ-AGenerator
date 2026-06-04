import { useState, useEffect } from 'react'

/**
 * Animates a numeric value from 0 to `target` over `duration` ms.
 * Only starts when `active` is true.
 */
export function useCounter(target: number, active: boolean, duration = 1200): number {
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!active) return
    if (target === 0) { setVal(0); return }
    let current = 0
    const inc = target / (duration / 16)
    const id = setInterval(() => {
      current += inc
      if (current >= target) { setVal(target); clearInterval(id); return }
      setVal(Math.floor(current))
    }, 16)
    return () => clearInterval(id)
  }, [active, target, duration])

  return val
}
