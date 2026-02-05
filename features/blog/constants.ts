const branch = "main";
//const branch = "29-day-15-blog";

export const BLOG_CONFIG = {
  POSTS_PER_PAGE: 9,
  GITHUB_CONTENT_BASE_URL: `https://raw.githubusercontent.com/palactix/content/refs/heads/${branch}/blog`,
  GITHUB_API_BASE_URL: "https://api.github.com/repos/palactix/content/contents/blog?ref=" + branch,
  CACHE_REVALIDATE_SECONDS: 60 * 60, // 1 hour
  SUGGESTED_POSTS_COUNT: 3,
  EXCERPT_LENGTH: 150, // characters
} as const;
