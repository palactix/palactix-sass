import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { BLOG_CONFIG } from "../constants";
import type { BlogPost, BlogListItem, BlogPaginationData } from "../types/blog.types";

interface GitHubFileItem {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
}

/**
 * Fetch list of blog files from GitHub API
 */
async function fetchBlogFiles(): Promise<GitHubFileItem[]> {
  const response = await fetch(BLOG_CONFIG.GITHUB_API_BASE_URL, {
    next: { revalidate: BLOG_CONFIG.CACHE_REVALIDATE_SECONDS },
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch blog files: ${response.status}`);
  }

  const files = await response.json() as GitHubFileItem[];
  
  // Filter only files (not directories) - files may or may not have .md extension
  return files.filter((file) => file.type === "file" && file.download_url);
}

/**
 * Fetch and parse a single blog post
 */
async function fetchBlogContent(slug: string): Promise<BlogPost> {
  // Try without extension first, then with .md
  let url = `${BLOG_CONFIG.GITHUB_CONTENT_BASE_URL}/${slug}`;
  
  let response = await fetch(url, {
    next: { revalidate: BLOG_CONFIG.CACHE_REVALIDATE_SECONDS },
    headers: {
      Accept: "text/plain",
    },
  });

  // If failed, try with .md extension
  if (!response.ok) {
    url = `${BLOG_CONFIG.GITHUB_CONTENT_BASE_URL}/${slug}.md`;
    response = await fetch(url, {
      next: { revalidate: BLOG_CONFIG.CACHE_REVALIDATE_SECONDS },
      headers: {
        Accept: "text/plain",
      },
    });
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch blog: ${slug}`);
  }

  const markdown = await response.text();
  const { data, content: rawContent } = matter(markdown);

  // Compile MDX content
  const { content: compiledContent } = await compileMDX({
    source: rawContent,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkBreaks],
      },
    },
  });

  // Calculate read time (avg 200 words per minute)
  const wordCount = rawContent.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  return {
    slug,
    title: data.title as string,
    description: data.description as string,
    date: data.date as string,
    tags: data.tags as string[],
    image: data.image as string,
    author: data.author as string,
    faqs: data.faqs,
    created_at: data.created_at as string,
    updated_at: data.updated_at as string,
    content: compiledContent,
    readTime,
    wordCount
  };
}

/**
 * Fetch all blog posts with metadata
 */
export async function fetchAllBlogs(): Promise<BlogListItem[]> {
  const files = await fetchBlogFiles();
  
  const blogs = await Promise.all(
    files.map(async (file) => {
      // Remove .md extension if present, otherwise use name as-is
      const slug = file.name;
      
      // Fetch raw content for excerpt
      const url = `${BLOG_CONFIG.GITHUB_CONTENT_BASE_URL}/${slug}`;
      const response = await fetch(url, {
        next: { revalidate: BLOG_CONFIG.CACHE_REVALIDATE_SECONDS },
        headers: { Accept: "text/plain" },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch blog metadata: ${slug}`);
      }
      
      const markdown = await response.text();
      const { data, content: rawContent } = matter(markdown);
      
      // Extract excerpt from raw content
      const plainText = rawContent
        .replace(/#{1,6}\s+/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/[*_~`]/g, "")
        .trim();
      const excerpt = plainText.length <= BLOG_CONFIG.EXCERPT_LENGTH 
        ? plainText 
        : plainText.substring(0, BLOG_CONFIG.EXCERPT_LENGTH).trim() + "...";
      
      return {
        slug: data.slug,
        title: data.title as string,
        description: data.description as string,
        date: data.date as string,
        created_at: data.created_at as string,
        updated_at: data.updated_at as string,
        tags: data.tags as string[],
        image: data.image as string,
        author: data.author as string,
        faqs: data.faqs,
        excerpt,
      };
    })
  );

  // Sort by date (newest first)
  return blogs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

/**
 * Fetch blog posts with pagination
 */
export async function fetchBlogsWithPagination(page = 1): Promise<BlogPaginationData> {
  const allBlogs = await fetchAllBlogs();
  const totalBlogs = allBlogs.length;
  const totalPages = Math.ceil(totalBlogs / BLOG_CONFIG.POSTS_PER_PAGE);
  
  // Validate page number
  const currentPage = Math.max(1, Math.min(page, totalPages));
  
  const startIndex = (currentPage - 1) * BLOG_CONFIG.POSTS_PER_PAGE;
  const endIndex = startIndex + BLOG_CONFIG.POSTS_PER_PAGE;
  
  const blogs = allBlogs.slice(startIndex, endIndex);
  
  return {
    blogs,
    currentPage,
    totalPages,
    totalBlogs,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

/**
 * Fetch a single blog post by slug
 */
export async function fetchBlogBySlug(slug: string): Promise<BlogPost> {
  return fetchBlogContent(slug);
}

/**
 * Get suggested/related blog posts by tags
 */
export async function fetchSuggestedBlogs(currentSlug: string, tags: string[]): Promise<BlogListItem[]> {
  const allBlogs = await fetchAllBlogs();
  
  // Filter out current blog and score by matching tags
  const scoredBlogs = allBlogs
    .filter((blog) => blog.slug !== currentSlug)
    .map((blog) => {
      const matchingTags = blog.tags.filter((tag) => tags.includes(tag));
      return {
        blog,
        score: matchingTags.length,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  // Return top N blogs
  return scoredBlogs
    .slice(0, BLOG_CONFIG.SUGGESTED_POSTS_COUNT)
    .map((item) => item.blog);
}

/**
 * Get previous and next blog posts
 */
export async function fetchAdjacentBlogs(currentSlug: string): Promise<{
  prev: BlogListItem | null;
  next: BlogListItem | null;
}> {
  const allBlogs = await fetchAllBlogs();
  const currentIndex = allBlogs.findIndex((blog) => blog.slug === currentSlug);
  
  if (currentIndex === -1) {
    return { prev: null, next: null };
  }
  
  return {
    prev: currentIndex > 0 ? allBlogs[currentIndex - 1] : null,
    next: currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null,
  };
}
