"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, List } from "lucide-react";
import type { BlogListItem } from "@/features/blog/types/blog.types";

interface BlogNavigationProps {
  prev: BlogListItem | null;
  next: BlogListItem | null;
}

export function BlogNavigation({ prev, next }: BlogNavigationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="flex flex-col md:flex-row items-center justify-between gap-4 pt-12 border-t"
    >
      {/* Previous Blog */}
      <div className="w-full md:w-auto">
        {prev ? (
          <Button variant="outline" size="lg" asChild className="w-full md:w-auto">
            <Link href={`/blog/${prev.slug}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              <div className="text-left">
                <div className="text-xs text-muted-foreground">Previous</div>
                <div className="font-medium line-clamp-1">{prev.title}</div>
              </div>
            </Link>
          </Button>
        ) : (
          <div className="w-full md:w-auto h-[60px]" />
        )}
      </div>

      {/* Back to Blog List */}
      <Button variant="ghost" size="lg" asChild>
        <Link href="/blog">
          <List className="mr-2 h-4 w-4" />
          All Posts
        </Link>
      </Button>

      {/* Next Blog */}
      <div className="w-full md:w-auto">
        {next ? (
          <Button variant="outline" size="lg" asChild className="w-full md:w-auto">
            <Link href={`/blog/${next.slug}`}>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Next</div>
                <div className="font-medium line-clamp-1">{next.title}</div>
              </div>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <div className="w-full md:w-auto h-[60px]" />
        )}
      </div>
    </motion.div>
  );
}
