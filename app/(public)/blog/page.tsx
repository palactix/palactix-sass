import { Metadata } from "next";
import Script from "next/script";
import { Container } from "@/components/Container";
import { fetchBlogsWithPagination, fetchBlogTags, fetchBlogCategories } from "@/features/blog/api/blog.api";
import { BlogLanding } from "@/components/blog-v2/BlogLanding";

export const metadata: Metadata = {
  title: "Blog | Palactix - Social Media Management Insights",
  description:
    "Insights, updates, and stories from the Palactix team. Learn about social media management, agency growth, and platform updates.",
  openGraph: {
    title: "Blog | Palactix",
    description:
      "Insights, updates, and stories from the Palactix team. Learn about social media management, agency growth, and platform updates.",
    type: "website",
  },
};

interface BlogListPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function BlogListPage({ searchParams }: BlogListPageProps) {
  const resolvedParams = await searchParams;
  const currentPage = resolvedParams.page ? parseInt(resolvedParams.page, 10) : 1;

  let blogData;
  let tags;
  let categories;
  let error: string | null = null;

  try {
    const [blogsResp, tagsResp, categoriesResp] = await Promise.all([
      fetchBlogsWithPagination(currentPage),
      fetchBlogTags(),
      fetchBlogCategories(),
    ]);
    blogData = blogsResp;
    tags = tagsResp;
    categories = categoriesResp;
  } catch (err) {
    error = "Failed to load blogs. Please try again later.";
    console.error("Failed to fetch blogs:", err);
  }

  const blogs = blogData?.blogs || [];
  const featured = currentPage === 1 && blogs.length > 0 ? blogs[0] : null;
  const remainingBlogs = currentPage === 1 && blogs.length > 0 ? blogs.slice(1) : blogs;
  const tagsList = tags ? tags : [];
  const categoriesList = categories ? categories : [];
  const listItems = (featured ? [featured, ...remainingBlogs] : blogs).map((post, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `https://www.palactix.com/blog/${post.slug}`,
    name: post.title,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Container>
        <Script
          id="blog-breadcrumb-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://www.palactix.com/",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Blog",
                  item: "https://www.palactix.com/blog",
                },
              ],
            }),
          }}
        />
        {listItems.length > 0 && (
          <Script
            id="blog-itemlist-schema"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                name: "Palactix Blog Posts",
                numberOfItems: listItems.length,
                itemListOrder: "Descending",
                itemListElement: listItems,
              }),
            }}
          />
        )}
        <div className="py-16 md:py-24">
          {error ? (
            <div className="rounded-2xl border border-border/60 bg-card p-8 text-center text-destructive">
              Failed to load blogs. Please try again later.
            </div>
          ) : (
            <BlogLanding
              blogs={remainingBlogs}
              featured={featured}
              tags={tagsList}
              categories={categoriesList}
              pagination={blogData || null}
            />
          )}
        </div>
      </Container>
    </div>
  );
}
