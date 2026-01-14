import type { BlogPost } from "@/features/blog/types/blog.types";

export function generateArticleSchema(blog: BlogPost, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.description,
    "image": `/images/blog/${blog.slug}.jpg`,
    "datePublished": blog.date,
    "dateModified": blog.date,
    "author": {
      "@type": "Person",
      "name": blog.author,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Palactix",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.palactix.com/logo.png",
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
