import { compileMDX } from "next-mdx-remote/rsc";
import { cache, use } from "react";
import type { ReactNode } from "react";

const DEFAULT_REVALIDATE = 60 * 60 * 24; // 1 day

interface StaticContentResult {
  content: ReactNode;
  source: string;
}

const fetchStaticContent = cache(async (url: string, revalidate: number): Promise<StaticContentResult> => {
  const response = await fetch(url, {
    next: { revalidate },
    headers: {
      Accept: "text/plain",
    },
  });

  if (!response.ok) {
    throw new Error(`Unable to load static content from ${url} (status ${response.status})`);
  }

  const source = await response.text();
  const { content } = await compileMDX({ source });

  return { content, source };
});

interface UseStaticContentParams {
  url: string;
  revalidate?: number;
}

export const STATIC_CONTENT_CACHE_SECONDS = DEFAULT_REVALIDATE;

export function useStaticContent({ url, revalidate = DEFAULT_REVALIDATE }: UseStaticContentParams) {
  return use(fetchStaticContent(url, revalidate));
}

export async function getStaticContent({ url, revalidate = DEFAULT_REVALIDATE }: UseStaticContentParams) {
  return fetchStaticContent(url, revalidate);
}
