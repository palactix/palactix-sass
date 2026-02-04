import { ReactNode } from "react";

export interface BlogFAQ {
  q: string;
  a: string;
}

export interface BlogMetadata {
  title: string;
  description: string;
  date: string; // YYYY-MM-DD format
  tags: string[];
  image: string;
  author: string;
  faqs?: BlogFAQ[];
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface BlogPost extends BlogMetadata {
  slug: string;
  content: ReactNode; // Compiled MDX content
  readTime?: number; // in minutes
  wordCount: number;
  table_of_contents: { title: string; id: string; level: number }[];
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
