import type { MetadataRoute } from "next";
import path from "node:path";
import fs from "node:fs";
import { fetchAllBlogs } from "@/features/blog/api/blog.api";

/**
 * Build absolute URL from a pathname and base site URL.
 */
function buildUrl(siteUrl: string, pathname: string) {
  const base = siteUrl.replace(/\/$/, "");
  const pathPart = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${pathPart}`;
}

/**
 * Recursively collect route paths from the app directory, excluding (private) group and dynamic segments.
 * Includes any folder containing a page.tsx. Route groups in parentheses are removed from the path.
 */
function collectStaticRoutes(appDir: string): { route: string; lastModified?: Date }[] {
  const routes: { route: string; lastModified?: Date }[] = [];

  function walk(dir: string, segments: string[]) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    // If current segment is a private group, skip entirely
    const currentName = path.basename(dir);
    if (currentName === "(private)") return;

    // Check if page.tsx/page.ts exists in this directory
    const pageEntry = entries.find(
      (e) => e.isFile() && (e.name === "page.tsx" || e.name === "page.ts")
    );

    // Compute URL path segments (remove route groups and dynamic segments)
    const cleanedSegments = segments.filter((s) => !/^\(.+\)$/.test(s));
    const hasDynamic = cleanedSegments.some((s) => /^\[.+\]$/.test(s));

    if (pageEntry && !hasDynamic) {
      const pathname = "/" + cleanedSegments.join("/");
      // Determine last modified from the page file mtime
      let lastModified: Date | undefined = undefined;
      try {
        const pagePath = path.join(dir, pageEntry.name);
        const stat = fs.statSync(pagePath);
        lastModified = stat.mtime;
      } catch {}

      routes.push({ route: pathname === "/" ? "/" : pathname, lastModified });
    }

    // Recurse into subdirectories
    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), [...segments, entry.name]);
      }
    }
  }

  walk(appDir, []);
  // Ensure unique and sorted
  // Ensure unique by route and sort
  const deduped = new Map<string, { route: string; lastModified?: Date }>();
  for (const r of routes) {
    deduped.set(r.route, r);
  }
  return Array.from(deduped.values()).sort((a, b) => a.route.localeCompare(b.route));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";

  const appDir = path.join(process.cwd(), "app");

  // Collect static page routes (excluding (private) and dynamic segments)
  const staticRoutes = collectStaticRoutes(appDir);

  // Collect blog routes dynamically from GitHub content
  let blogRoutes: { url: string; lastModified?: Date }[] = [];
  try {
    const blogs = await fetchAllBlogs();
    blogRoutes = blogs.map((b) => ({
      url: buildUrl(siteUrl, `/blog/${b.slug}`),
      lastModified: b.date ? new Date(b.date) : undefined,
    }));
  } catch (err) {
    // Fail-soft: if blogs cannot be fetched, skip adding them
    console.error("sitemap: failed to fetch blogs", err);
  }

  // Map static routes to sitemap entries
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: buildUrl(siteUrl, r.route),
    ...(r.lastModified ? { lastModified: r.lastModified } : {}),
    changeFrequency: r.route === "/blog" ? "daily" : "monthly",
    priority: r.route === "/" ? 1 : r.route === "/blog" ? 0.9 : 0.7,
  }));

  // Blog entries with higher update cadence
  const blogEntries: MetadataRoute.Sitemap = blogRoutes.map((br) => ({
    url: br.url,
    ...(br.lastModified ? { lastModified: br.lastModified } : {}),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Also include the blog listing page if present
  return [...staticEntries, ...blogEntries];
}
