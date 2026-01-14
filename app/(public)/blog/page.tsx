import { Metadata } from "next";
import { Container } from "@/components/Container";
import { BlogListVertical } from "@/features/blog/components/BlogListVertical";
import { BlogPagination } from "@/features/blog/components/BlogPagination";
import { BlogListClientWrapper } from "@/features/blog/components/BlogListClientWrapper";
import { fetchBlogsWithPagination } from "@/features/blog/api/blog.api";
//import { organizationSchema } from "@/lib/seo/organizationSchema";

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
  let error = null;

  try {
    blogData = await fetchBlogsWithPagination(currentPage);
  } catch (err) {
    error = err;
    console.error("Failed to fetch blogs:", err);
  }

  return (
    <>
     
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <Container>
          <div className="py-16 md:py-24">
            {/* Header with Client-side animation wrapper */}
            <BlogListClientWrapper>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                  Blog
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Insights, updates, and stories from the Palactix team. Learn about
                  social media management, agency growth, and platform updates.
                </p>
              </div>
            </BlogListClientWrapper>

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-destructive">
                  Failed to load blogs. Please try again later.
                </p>
              </div>
            )}

            {/* Blog Vertical List */}
            {blogData && blogData.blogs.length > 0 && (
              <>
                <BlogListVertical blogs={blogData.blogs} />

                {/* Pagination */}
                {blogData.totalPages > 1 && (
                  <BlogPagination
                    currentPage={blogData.currentPage}
                    totalPages={blogData.totalPages}
                    hasNext={blogData.hasNext}
                    hasPrev={blogData.hasPrev}
                  />
                )}
              </>
            )}

            {/* Empty State */}
            {blogData && blogData.blogs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No blogs found.</p>
              </div>
            )}
          </div>
        </Container>
      </div>
    </>
  );
}
