/// <reference types="vinxi/types/client" />
import { hydrateRoot } from 'react-dom/client'
import { StartClient } from '@tanstack/react-start'
import { createRouter } from './router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const router = createRouter()
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
})

hydrateRoot(
  document, 
  <QueryClientProvider client={queryClient}>
    <StartClient router={router} />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
)
