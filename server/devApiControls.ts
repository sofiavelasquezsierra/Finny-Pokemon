import type { Connect } from 'vite'

const MAX_DELAY_MS = 5000

// Dev-only middleware (mounted in vite.config.ts, never by the production
// server) so loading and error states can be demoed against a local API that
// otherwise responds instantly:
//   ?delay=<ms>      wait before responding (capped at 5s)
//   ?failFrom=<page> respond 500 for that page and every later one
export const devApiControls: Connect.NextHandleFunction = (req, res, next) => {
  if (!req.url?.startsWith('/api/')) return next()

  const params = new URL(req.url, 'http://localhost').searchParams
  const delay = Math.min(Number(params.get('delay')) || 0, MAX_DELAY_MS)
  const failFrom = Number(params.get('failFrom')) || Infinity
  const page = Number(params.get('page')) || 1

  setTimeout(() => {
    if (page >= failFrom) {
      res.statusCode = 500
      res.end()
      return
    }
    next()
  }, delay)
}
