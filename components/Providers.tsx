"use client";

import { ReactNode, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "@/lib/query/queryClient";
import { Toaster } from "sonner";

export function Providers({ children }: { children: ReactNode }) {
  const [qc] = useState(() => createQueryClient());
  return (
    <QueryClientProvider client={qc}>
      {children}
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
