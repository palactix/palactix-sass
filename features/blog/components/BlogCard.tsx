"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BlogListItem } from "@/features/blog/types/blog.types";

interface BlogCardProps {
  blog: BlogListItem;
  index: number;
}

export function BlogCard({ blog, index }: BlogCardProps) {
  const formattedDate = new Date(blog.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30">
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          <Image
            src={`/images/blog/${blog.slug}.jpg`}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardHeader className="flex-1">
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
          <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
            {blog.title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground line-clamp-3 mt-2">
            {blog.description}
          </p>
        </CardHeader>

        <CardContent>
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {blog.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter>
          <Button variant="ghost" className="w-full group/btn" asChild>
            <Link href={`/blog/${blog.slug}`}>
              Read More
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
