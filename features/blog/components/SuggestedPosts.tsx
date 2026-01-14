"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";
import type { BlogListItem } from "@/features/blog/types/blog.types";

interface SuggestedPostsProps {
  blogs: BlogListItem[];
}

export function SuggestedPosts({ blogs }: SuggestedPostsProps) {
  if (blogs.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="mt-16"
    >
      <h2 className="text-3xl font-bold mb-8">Related Posts</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((blog, index) => (
          <motion.div
            key={blog.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
          >
            <Link href={`/blog/${blog.slug}`}>
              <Card className="group h-full hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 overflow-hidden">
                {/* Image */}
                <div className="relative h-40 w-full overflow-hidden bg-muted">
                  <Image
                    src={`/images/blog/${blog.slug}.jpg`}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(blog.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {blog.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {blog.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center text-primary text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                    Read More
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
