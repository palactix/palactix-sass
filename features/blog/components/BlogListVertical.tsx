"use client";

import { BlogListItemCard } from "./BlogListItemCard";
import type { BlogListItem } from "@/features/blog/types/blog.types";

interface BlogListVerticalProps {
  blogs: BlogListItem[];
}

export function BlogListVertical({ blogs }: BlogListVerticalProps) {
  return (
    <div className="flex flex-col gap-6">
      {blogs.map((blog, index) => (
        <BlogListItemCard 
          key={blog.slug} 
          blog={blog} 
          index={index}
          isFeatured={index === 0} // First blog is featured
        />
      ))}
    </div>
  );
}
