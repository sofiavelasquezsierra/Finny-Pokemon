import { useEffect, useState } from 'react'

export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs)
    // A new value before the delay elapses cancels the pending update
    return () => clearTimeout(timeout)
  }, [value, delayMs])

  return debounced
}
