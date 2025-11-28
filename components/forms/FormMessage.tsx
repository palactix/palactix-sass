import { ReactNode } from "react";

export function FormMessage({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <p className="text-xs text-destructive mt-1">{children}</p>;
}
