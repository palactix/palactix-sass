import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/components/ui/utils";

interface StaticPageShellProps {
  title: string;
  description?: string;
  eyebrow?: string;
  backHref?: string;
  backLabel?: string;
  children: ReactNode;
  containerClassName?: string;
  articleClassName?: string;
}

export function StaticPageShell({
  title,
  description,
  eyebrow,
  backHref,
  backLabel = "Back",
  children,
  containerClassName,
  articleClassName,
}: StaticPageShellProps) {
  return (
    <div className="border-b border-border/60 bg-background">
      <div className={cn("mx-auto w-full max-w-4xl px-6 py-16", containerClassName)}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          {backHref ? (
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 border border-primary/40 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
            >
              ← {backLabel}
            </Link>
          ) : (
            <span aria-hidden>&nbsp;</span>
          )}
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">{eyebrow}</p>}
        </div>

        <div className="mt-6 space-y-2 text-center">
          <h1 className="text-3xl font-semibold text-foreground md:text-4xl">{title}</h1>
          {description && <p className="text-base text-foreground/70">{description}</p>}
        </div>

        <article
          className={cn(
            "mt-12 space-y-4 text-base leading-7 text-foreground/80 [&_a]:text-primary [&_a]:underline [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-8 [&_h3]:text-xl [&_strong]:text-foreground [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_li]:mt-2",
            articleClassName,
          )}
        >
          {children}
        </article>
      </div>
    </div>
  );
}
