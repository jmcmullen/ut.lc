/// <reference types="vinxi/types/client" />
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StartClient } from "@tanstack/react-start";
import { hydrateRoot } from "react-dom/client";
import { createRouter } from "./router";

const router = createRouter();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
});

hydrateRoot(
  document,
  <QueryClientProvider client={queryClient}>
    <StartClient router={router} />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
);
