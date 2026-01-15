import type { BlogPost } from "@/features/blog/types/blog.types";


function dateToTimeZoneString(dateStr: string) {
  return new Date(dateStr.replace(" ", "T") + "Z").toISOString();
}

export function generateArticleSchema(blog: BlogPost, url: string) {


  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.description,
    "image": blog.image,
    "datePublished": dateToTimeZoneString(blog.created_at),
    "dateModified": dateToTimeZoneString(blog.updated_at),
    "author": {
      "@type": "Person",
      "name": blog.author,
      "url": "https://x.com/_JitendraM",
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
    "wordCount": blog.wordCount // blog.content.trim().split(/\s+/).length,
  };
}
