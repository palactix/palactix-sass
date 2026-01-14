"use client";

import { BlogCard } from "./BlogCard";
import type { BlogListItem } from "@/features/blog/types/blog.types";

interface BlogGridProps {
  blogs: BlogListItem[];
}

export function BlogGrid({ blogs }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog, index) => (
        <BlogCard key={blog.slug} blog={blog} index={index} />
      ))}
    </div>
  );
}
