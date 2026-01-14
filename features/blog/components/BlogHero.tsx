"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Calendar, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BlogHeroProps {
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: number;
  tags: string[];
  image: string;
}

export function BlogHero({ title, description, author, date, readTime, tags, image }: BlogHeroProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="relative">
      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-2xl"
      >
        <Image
          src={`/images/blog/${image}.png`}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 1200px"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Hero Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-white/20 text-white border-white/30">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold mb-4 max-w-4xl">
              {title}
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-3xl">
              {description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{readTime} min read</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
