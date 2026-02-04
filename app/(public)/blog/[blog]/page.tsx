import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";
import { Container } from "@/components/Container";
import { fetchBlogBySlug } from "@/features/blog";
import { generateArticleSchema } from "@/lib/seo/articleSchema";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BlogSidebar } from "./components/BlogSidebar";
import { ShareButtons } from "./components/ShareButtons";
import { BlogContent } from "@/features/blog/components/BlogContent";


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
      title: `${blog.title}`,
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
      title: "Blog Post Not Found",
      description: "The blog post you're looking for doesn't exist.",
    };
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const blogparams = await params;
  const slug = blogparams.blog;

  let blog;

  try {
    blog = await fetchBlogBySlug(slug);
  } catch (error) {
    console.error("Failed to fetch blog:", error);
    notFound();
  }

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

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 pt-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content - Left Section */}
            <div className="lg:col-span-8">
              {/* Series Context Strip */}
              <div className="mb-4 px-4 py-3 bg-muted/50 border border-border/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  This article is part of an ongoing series on infrastructure ownership for social media agencies.
                  <Link href="/blog/series/infrastructure-ownership" className="ml-2 text-primary hover:text-primary/80 underline underline-offset-2">
                    View the full series →
                  </Link>
                </p>
              </div>

              <article className="bg-card rounded-lg shadow-sm border border-border/40 overflow-hidden">
                {/* Featured Image */}
                <div className="relative w-full h-[400px] bg-muted">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                <div className="p-8 md:p-12">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    {blog.title}
                  </h1>


                  {/* Description */}
                  <p className="text-xl text-muted-foreground mb-6">
                    {blog.description}
                  </p>

                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={blog.date}>
                        {new Date(blog.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{blog.readTime || 5} minutes read</span>
                    </div>
                  </div>

                  <Separator className="mb-8" />

                  {/* Blog Content */}
                  <BlogContent content={blog.content} />
                  <Separator className="my-8" />

                  {/* Author Info */}
                  <div className="mb-8 p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                    <p className="font-semibold text-foreground mb-1">Written by {blog.author}</p>
                    <p className="text-sm text-muted-foreground">
                      Building Palactix — infrastructure ownership for social media agencies.
                    </p>
                  </div>

                  {/* Share Section */}
                  <ShareButtons title={blog.title} url={blogUrl} />
                </div>
              </article>
            </div>

            {/* Sidebar - Right Section (Client Component) */}
            <BlogSidebar blog={blog} />
          </div>

          {/* CTA Section */}
          <div className="mt-16 mb-8">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
              <CardContent className="p-8 md:p-12 text-center">
                <p className="text-lg md:text-xl text-foreground/90 mb-6 max-w-3xl mx-auto leading-relaxed">
                  Palactix is being built for social media agencies that want to own their publishing infrastructure instead of renting it per seat.
                </p>
                <p className="text-base text-muted-foreground mb-8 max-w-2xl mx-auto">
                  This blog is part of that thinking — written publicly, before the product is finished.
                </p>
                <Button size="lg" className="font-semibold" asChild>
                  <Link href="/about">
                    Why Palactix exists →
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
    </>
  );
}