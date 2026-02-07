import { ReactNode } from "react";

export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogNavPost {
  id: number;
  slug: string;
  title: string;
}

export interface BlogCategoryPosts {
  id: number;
  name: string;
  posts: BlogNavPost[];
}

export interface BlogMetadata {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  description?: string;
  featured_image_url: string;
  image?: string; // optional legacy image field
  author_name: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  seo_title: string;
  seo_description: string;
  seo_keywords?: string[];
  tags: string[]; // optional legacy / derived tags
  categories?: string[];
  faqs?: BlogFAQ[];
  next_post?: BlogNavPost | null;
  prev_post?: BlogNavPost | null;
}

export interface BlogPost extends BlogMetadata {
  content?: ReactNode; // compiled MDX content from markdown
  content_markdown?: string; // raw markdown content
  readTime?: number; // in minutes
  wordCount?: number;
  table_of_contents?: { title: string; slug: string; level: number; id?: string }[];
}

export interface BlogPaginationData {
  blogs: BlogPost[];
  currentPage: number;
  totalPages: number;
  totalBlogs: number;
  hasNext: boolean;
  hasPrev: boolean;
}
