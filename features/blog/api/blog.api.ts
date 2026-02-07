import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkSmartypants from "remark-smartypants";
import rehypeSlug from "rehype-slug";

import { BLOG_URLS } from "@/utils/constants/api-routes";
import { api } from "@/lib/api/client";
import { LaravelPagination } from "@/types/api";
import { BLOG_CONFIG } from "../constants";
import type { BlogPost, BlogPaginationData, BlogFAQ } from "../types/blog.types";

type ApiPost = BlogPost & { content?: string };

const getReadStats = (markdown: string) => {
  const wordCount = markdown.trim().length === 0 ? 0 : markdown.trim().split(/\s+/).length;
  const readTime = wordCount === 0 ? 0 : Math.max(1, Math.ceil(wordCount / 200));
  return { wordCount, readTime };
};

export async function fetchBlogsWithPagination(page = 1): Promise<BlogPaginationData> {
  const { data: json } = await api.get<LaravelPagination<ApiPost>>(BLOG_URLS.FETCH_POSTS, {
    params: { page },
  });

  const blogs = (json.data || []) as BlogPost[];

  const totalPages = json.last_page || json.meta?.last_page || 1;
  const currentPage = json.current_page || json.meta?.current_page || page;

  return {
    blogs,
    currentPage,
    totalPages,
    totalBlogs: json.total || blogs.length,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

export async function fetchAllBlogs(): Promise<BlogPost[]> {
  const firstPage = await fetchBlogsWithPagination(1);
  const blogs = [...firstPage.blogs];

  if (firstPage.totalPages > 1) {
    for (let page = 2; page <= firstPage.totalPages; page += 1) {
      const pageData = await fetchBlogsWithPagination(page);
      blogs.push(...pageData.blogs);
    }
  }

  return blogs;
}

export async function fetchBlogBySlug(slug: string): Promise<BlogPost> {
  const { data } = await api.get<{data: ApiPost}>(
    BLOG_URLS.FETCH_POST_BY_SLUG.replace("{slug}", encodeURIComponent(slug))
  );

  const post = data.data;
  
  const markdown = post.content || "";
  const { wordCount, readTime } = getReadStats(markdown);

  const { content: compiledContent } = await compileMDX({
    source: markdown,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkBreaks, remarkSmartypants],
        rehypePlugins: [rehypeSlug],
      },
    },
  });

  return {
    ...post,
    content: compiledContent,
    content_markdown: markdown,
    table_of_contents: (post.table_of_contents || []).map((t) => ({ ...t, id: t.slug })),
    faqs: post.faqs || [],
    readTime,
    wordCount,
  };
}

export async function fetchSuggestedBlogs(currentSlug: string, tags: string[]): Promise<BlogPost[]> {
  const all = await fetchAllBlogs();
  const lowerTags = tags.map((t) => t.toLowerCase());
  return all
    .filter((b) => b.slug !== currentSlug)
    .map((b) => {
      const bTags = (b.tags || []).map((t) => t.toLowerCase());
      const score = bTags.filter((t) => lowerTags.includes(t)).length;
      return { b, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, BLOG_CONFIG.SUGGESTED_POSTS_COUNT)
    .map(({ b }) => b);
}

export async function fetchAdjacentBlogs(currentSlug: string): Promise<{ prev: BlogPost | null; next: BlogPost | null; }> {
  const all = await fetchAllBlogs();
  const index = all.findIndex((b) => b.slug === currentSlug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? all[index - 1] : null,
    next: index < all.length - 1 ? all[index + 1] : null,
  };
}

export async function fetchBlogTags(): Promise<{ id: number; name: string; slug: string }[]> {
  const { data } = await api.get(BLOG_URLS.TAGS);
  return Array.isArray(data) ? data : [];
}

export async function fetchBlogCategories(): Promise<{ id: number; name: string; slug?: string }[]> {
  const { data } = await api.get(BLOG_URLS.CATEGORIES);
  return Array.isArray(data) ? data : [];
}

export function getBlogPostTableOfContents(content: string): { title: string; slug: string; level: number; id: string }[] {
  // Fallback TOC from markdown if API misses it
  const headings = content.match(/^(#{2,3})\s+(.*)$/gm) || [];
  return headings.map((heading: string) => {
    const level = heading.startsWith("###") ? 3 : 2;
    const text = heading.replace(/^(#{2,3})\s+/, "");
    const slug = text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    return { title: text, slug, level, id: slug };
  });
}