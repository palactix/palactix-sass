import { ReactNode } from "react";

export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogMetadata {
  title: string;
  description: string;
  excerpt: string;
  date: string; // YYYY-MM-DD format

  // !deprecated - use seo_keywords instead
  tags: string[];
  seo_keywords: string[];
  // !deprecated - use featured_image_url instead
  image: string;
  seo_title: string;
  seo_description: string;
  featured_image_url: string;
  author: string;
  faqs?: BlogFAQ[];
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface BlogPost extends BlogMetadata {
  slug: string;
  content: ReactNode; // Compiled MDX content
  content_html: string; // Raw HTML content
  readTime?: number; // in minutes
  wordCount: number;
  table_of_contents: { title: string; slug: string; level: number }[];
}

export interface BlogListItem extends BlogMetadata {
  slug: string;
  excerpt: string;
}

export interface BlogPaginationData {
  blogs: BlogListItem[];
  currentPage: number;
  totalPages: number;
  totalBlogs: number;
  hasNext: boolean;
  hasPrev: boolean;
}
