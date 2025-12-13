"use client";

import { ReactNode, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "@/lib/query/queryClient";
import { Toaster } from "sonner";
import { ConfirmProvider } from "@/features/confirm";
import { SheetProvider } from "./providers/SheetProvider";

export function Providers({ children }: { children: ReactNode }) {
  const [qc] = useState(() => createQueryClient());
  return (
    <QueryClientProvider client={qc}>
      <SheetProvider>
        {children}
        <Toaster position="bottom-right" richColors />
        <ConfirmProvider />
      </SheetProvider>
    </QueryClientProvider>
  );
}
