"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BlogListItem } from "@/features/blog/types/blog.types";

interface BlogListItemCardProps {
  blog: BlogListItem;
  index: number;
  isFeatured?: boolean;
}

export function BlogListItemCard({ blog, index, isFeatured = false }: BlogListItemCardProps) {
  const formattedDate = new Date(blog.updated_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  console.log(formattedDate, blog.updated_at);
  

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group flex flex-col ${isFeatured ? 'md:flex-row' : 'md:flex-row'} gap-6 p-6 rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 bg-card`}
    >
      {/* Image */}
      <div className={`relative ${isFeatured ? 'md:w-1/2' : 'md:w-1/3'} ${isFeatured ? 'h-[400px]' : 'h-[200px]'} w-full overflow-hidden rounded-lg bg-muted shrink-0`}>
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes={isFeatured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>5 min read</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/blog/${blog.slug}`}>
            <h2 className={`${isFeatured ? 'text-3xl md:text-4xl' : 'text-2xl'} font-bold line-clamp-2 group-hover:text-primary transition-colors mb-3`}>
              {blog.title}
            </h2>
          </Link>

          {/* Description */}
          <p className={`text-muted-foreground ${isFeatured ? 'text-lg line-clamp-4' : 'line-clamp-3'} mb-4`}>
            {blog.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.slice(0, isFeatured ? 4 : 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Read More Button */}
        <div>
          <Button variant="ghost" className="group/btn p-0 h-auto" asChild>
            <Link href={`/blog/${blog.slug}`} className="flex items-center gap-2">
              <span className="font-semibold">Read Full Article</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
