import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { BlogPost } from "@/features/blog";

interface FeaturedCardProps {
  post: BlogPost;
}

const formatDate = (value: string | undefined) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
};

export function FeaturedCard({ post }: FeaturedCardProps) {
  const image = post.featured_image_url || post.image;
  const dateText = formatDate(post.published_at || post.created_at);

  return (
    <div className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-lg shadow-primary/5">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image}
            alt={post.title}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-500 ease-out hover:scale-105"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20" />
        )}
      </div>

      <div className="p-6 md:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
          {post.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{post.author_name}</span>
          <span>•</span>
          <span>{dateText}</span>
          {post.readTime ? (
            <>
              <span>•</span>
              <span>{post.readTime} min read</span>
            </>
          ) : null}
        </div>

        <h2 className="mt-3 text-2xl md:text-3xl font-semibold leading-tight text-foreground">
          {post.title}
        </h2>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed md:max-w-4xl">
          {post.description || post.excerpt}
        </p>

        <Link
          href={`/blog/${post.slug}`}
          className="mt-6 inline-flex items-center gap-2 text-base font-semibold text-primary transition duration-150 ease-out hover:gap-3"
        >
          Read Article <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
