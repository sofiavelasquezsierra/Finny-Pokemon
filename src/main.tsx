import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './globals.css'
import App from './App'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Refetching an infinite query refetches every loaded page in sequence,
      // and the data is a static fixture, so never treat it as stale
      refetchOnWindowFocus: false,
      // The default of 3 retries with backoff delays the error state by ~7s
      retry: 1,
      staleTime: Infinity
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
)
