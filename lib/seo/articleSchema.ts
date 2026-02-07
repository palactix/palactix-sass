import type { BlogPost } from "@/features/blog/types/blog.types";

export function generateArticleSchema(blog: BlogPost, url: string) {
  const keywords = blog.tags?.length ? blog.tags : blog.seo_keywords || [];
  const wordCount = blog.wordCount || (blog.content_markdown ? blog.content_markdown.trim().split(/\s+/).length : undefined);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.description,
    "image": blog.featured_image_url,
    "datePublished": blog.published_at,
    "dateModified": blog.updated_at,
    "author": {
      "@type": "Person",
      "name": blog.author_name,
      "url": "https://www.linkedin.com/in/jitendrameena",
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
    "keywords": keywords.join(", "),
    "articleSection": "Blog",
    "wordCount": wordCount,
    "url": url,
  };
}
