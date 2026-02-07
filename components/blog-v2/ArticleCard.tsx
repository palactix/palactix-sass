import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/features/blog";

interface ArticleCardProps {
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

export function ArticleCard({ post }: ArticleCardProps) {
  const image = post.featured_image_url || post.image;
  const primaryTag = post.tags?.[0] || post.seo_keywords?.[0];
  const dateText = formatDate(post.published_at || post.created_at);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition duration-200 ease-out hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-200 ease-out group-hover:scale-105"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
          {primaryTag && (
            <span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
              {primaryTag}
            </span>
          )}
          {post.tags?.slice(1, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-lg font-semibold leading-tight text-foreground line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>

        <div className="mt-auto flex items-center justify-between text-sm text-muted-foreground">
          <span>{dateText}</span>
          {post.readTime ? <span>{post.readTime} min read</span> : null}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent transition duration-200 ease-out group-hover:border-primary/40" />
    </Link>
  );
}
