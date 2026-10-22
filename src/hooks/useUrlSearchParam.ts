import { useEffect } from 'react'

export function readUrlSearchParam(key: string) {
  return new URLSearchParams(window.location.search).get(key) ?? ''
}

// Mirrors a value into the query string. replaceState (not pushState) so
// typing doesn't add a history entry per keystroke.
export function useSyncUrlSearchParam(key: string, value: string) {
  useEffect(() => {
    const url = new URL(window.location.href)
    if (value) url.searchParams.set(key, value)
    else url.searchParams.delete(key)
    window.history.replaceState(window.history.state, '', url)
  }, [key, value])
}
