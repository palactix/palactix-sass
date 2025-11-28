"use client";

import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { toast } from "sonner";
import type { NormalizedApiError } from "@/lib/api/error-handler";

export function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        const e = error as NormalizedApiError;
        if (e?.message) toast.error(e.message);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        const e = error as NormalizedApiError;
        if (e?.message) toast.error(e.message);
      },
    }),
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          const e = error as NormalizedApiError;
          if (e.status === 401 || e.status === 422) return false;
          return failureCount < 2;
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: (failureCount, error) => {
          const e = error as NormalizedApiError;
          if (e.status === 401 || e.status === 422) return false;
          return failureCount < 1;
        },
      },
    },
  });
}
