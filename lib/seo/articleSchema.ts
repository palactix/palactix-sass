import type { BlogPost } from "@/features/blog/types/blog.types";

export function generateArticleSchema(blog: BlogPost, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.description,
    "image": `/images/blog/${blog.slug}.jpg`,
    "datePublished": blog.created_at,
    "dateModified": blog.updated_at,
    "author": {
      "@type": "Person",
      "name": blog.author,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Palactix",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.palactix.com/images/p-logo.svg",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url,
    },
    "keywords": blog.tags.join(", "),
    "articleSection": "Blog",
    "wordCount": 100 // blog.content.trim().split(/\s+/).length,
  };
}
