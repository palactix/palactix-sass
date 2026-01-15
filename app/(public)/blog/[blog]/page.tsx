import Script from "next/script";
import { Container } from "@/components/Container";
import { BlogHero } from "@/features/blog/components/BlogHero";
import { BlogContent } from "@/features/blog/components/BlogContent";
import { BlogNavigation } from "@/features/blog/components/BlogNavigation";
import { SuggestedPosts } from "@/features/blog/components/SuggestedPosts";
import { BlogDetailClientWrapper } from "@/features/blog/components/BlogDetailClientWrapper";
import { SocialShare } from "@/features/blog/components/SocialShare";
import { FAQs } from "@/components/shared/FAQs";
import { fetchBlogBySlug, fetchSuggestedBlogs, fetchAdjacentBlogs } from "@/features/blog";
import { generateArticleSchema } from "@/lib/seo/articleSchema";
import { generateFAQSchema } from "@/lib/seo/faqSchema";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface BlogDetailPageProps {
  params: {
    blog: string;
  };
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  
  try {
    const blog = await fetchBlogBySlug(resolvedParams.blog);
    
    return {
      title: `${blog.title} - Palactix Blog`,
      description: blog.description,
      keywords: blog.tags.join(", "),
      authors: [{ name: blog.author }],
      openGraph: {
        title: blog.title,
        description: blog.description,
        type: "article",
        publishedTime: blog.created_at,
        authors: [blog.author],
        tags: blog.tags,
        images: [blog.image],
      },
      twitter: {
        card: "summary_large_image",
        title: blog.title,
        description: blog.description,
        images: [blog.image],
      },
    };
  } catch {
    return {
      title: "Blog Post Not Found - Palactix",
      description: "The blog post you're looking for doesn't exist.",
    };
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const blogparams = await params;
  const slug = blogparams.blog;

  let blog;
  let suggestedBlogs;
  let adjacentBlogs;

  try {
    blog = await fetchBlogBySlug(slug);
    [suggestedBlogs, adjacentBlogs] = await Promise.all([
      fetchSuggestedBlogs(slug, blog.tags),
      fetchAdjacentBlogs(slug),
    ]);
  } catch (error) {
    console.error("Failed to fetch blog:", error);
    notFound();
  }

  // Transform FAQs to match the FAQs component format
  const transformedFaqs = blog.faqs?.map((faq) => ({
    question: faq.q,
    answer: faq.a,
  })) || [];

  const blogUrl = `https://www.palactix.com/blog/${slug}`;

  

  return (
    <>
      {/* Article Schema */}
      <Script
        id="article-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateArticleSchema(blog, blogUrl)),
        }}
      />

      {/* FAQ Schema */}
      {transformedFaqs.length > 0 && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateFAQSchema(transformedFaqs)),
          }}
        />
      )}

      <div className="min-h-screen bg-linear-to-b from-background to-muted/30 py-12">
      <Container>
        <div className="py-12">
          {/* Hero Section */}
          <BlogHero
            title={blog.title}
            description={blog.description}
            author={blog.author}
            date={blog.created_at}
            readTime={blog.readTime || 5}
            tags={blog.tags}
            image={blog.image}
          />

          {/* Main Content */}
          <div className="max-w-4xl mx-auto mt-12">
            <BlogDetailClientWrapper>
              
              {/* Social Share */}
              <SocialShare title={blog.title} url={blogUrl} />
              <BlogContent content={blog.content} />

               {/* FAQs Section */}
              {transformedFaqs.length > 0 && (
                <FAQs faqs={transformedFaqs} />
              )}
              
            </BlogDetailClientWrapper>

            {/* Navigation */}
            <BlogNavigation
              prev={adjacentBlogs?.prev || null}
              next={adjacentBlogs?.next || null}
            />
          </div>

          {/* Suggested Posts */}
          {suggestedBlogs && suggestedBlogs.length > 0 && (
            <div className="max-w-7xl mx-auto mt-16">
              <SuggestedPosts blogs={suggestedBlogs} />
            </div>
          )}
        </div>
      </Container>

      </div>
    </>
  );
}
