"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Calendar, 
  Clock, 
  Share2, 
  Twitter, 
  Linkedin, 
  Facebook,
  ChevronDown,
  ChevronRight,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Container } from "@/components/Container";

// Mock data - Replace with actual data fetching
const blogPost = {
  title: "The Hidden Risk of Shared App IDs in Social Media Management",
  description: "Why your agency's publishing power shouldn't depend on rented infrastructure — and what true ownership looks like.",
  featuredImage: "/images/blog-featured.jpg",
  tags: ["Infrastructure", "Agency Tools", "Ownership"],
  publishDate: "2024-02-01",
  readTime: 8,
  author: {
    name: "John Doe",
    avatar: "/images/author.jpg",
    bio: "Product Lead at Palactix, building infrastructure for agencies that want to own their tools.",
  },
  content: `
    <p>Most social media management tools don't tell you upfront: <strong>you're renting their app connections</strong>.</p>
    
    <p>That shared Meta App ID or LinkedIn integration? It's owned by the platform, not you. And when the platform decides to pivot, sunset a feature, or change pricing — you're along for the ride whether you like it or not.</p>
    
    <h2>What This Actually Means</h2>
    
    <p>When you use shared app IDs:</p>
    <ul>
      <li>Your clients' social accounts are connected through <em>someone else's infrastructure</em></li>
      <li>Platform rate limits are shared across all users</li>
      <li>If the platform loses access, so do you</li>
      <li>You can't migrate connections without re-authenticating everything</li>
    </ul>
    
    <h2>The Alternative: API Token Ownership</h2>
    
    <p>Palactix is built differently. When you connect a social account, <strong>you own the API tokens</strong>. They live in your infrastructure, not ours.</p>
    
    <p>This means:</p>
    <ul>
      <li>Portable connections you can take anywhere</li>
      <li>No shared rate limits</li>
      <li>Direct control over refresh cycles</li>
      <li>True infrastructure ownership</li>
    </ul>
    
    <h2>Why This Matters</h2>
    
    <p>For agencies managing dozens or hundreds of client accounts, infrastructure ownership isn't just a technical detail — it's a business continuity issue.</p>
    
    <p>The tools you build your business on should be assets you own, not liabilities you rent.</p>
  `,
};

// Accordion Component
function AccordionItem({ 
  title, 
  children, 
  isOpen, 
  onToggle, 
  isActive 
}: { 
  title: string; 
  children: React.ReactNode; 
  isOpen: boolean; 
  onToggle: () => void;
  isActive?: boolean;
}) {
  return (
    <div className="border-b border-border/40">
      <button
        onClick={onToggle}
        className={`flex items-center justify-between w-full py-3 px-2 text-left hover:bg-muted/50 transition-colors ${
          isActive ? "text-primary font-semibold" : ""
        }`}
      >
        <span className="flex items-center gap-2 text-sm">
          {title}
          {isActive && <CheckCircle2 className="h-4 w-4 text-primary" />}
        </span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="pb-3 px-2 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

// Share Button Component
function ShareButton({ 
  icon: Icon, 
  label, 
  onClick 
}: { 
  icon: any; 
  label: string; 
  onClick: () => void;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="flex items-center gap-2"
    >
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  );
}

export default function BlogDetailPage() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    economics: false,
    infrastructure: true,
  });

  const [sidebarSections, setSidebarSections] = useState({
    whyYouAreHere: true,
    tableOfContents: false,
    solutionsMap: false,
    nextMove: false,
  });

  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setScrollProgress(progress);

      // Auto-expand based on scroll
      if (progress > 30 && !sidebarSections.tableOfContents) {
        setSidebarSections(prev => ({ ...prev, tableOfContents: true }));
      }
      if (progress > 70) {
        if (!sidebarSections.solutionsMap) {
          setSidebarSections(prev => ({ ...prev, solutionsMap: true }));
        }
        if (!sidebarSections.nextMove) {
          setSidebarSections(prev => ({ ...prev, nextMove: true }));
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sidebarSections]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleSidebarSection = (section: keyof typeof sidebarSections) => {
    setSidebarSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = blogPost.title;

  const handleShare = (platform: string) => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    };
    
    if (urls[platform as keyof typeof urls]) {
      window.open(urls[platform as keyof typeof urls], "_blank", "width=600,height=400");
    }
  };

  return (
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
                  src={blogPost.featuredImage}
                  alt={blogPost.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="p-8 md:p-12">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {blogPost.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  {blogPost.title}
                </h1>

                
                {/* Description */}
                <p className="text-xl text-muted-foreground mb-6">
                  {blogPost.description}
                </p>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={blogPost.publishDate}>
                      {new Date(blogPost.publishDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{blogPost.readTime} minutes read</span>
                  </div>
                </div>

                <Separator className="mb-8" />

                {/* Blog Content */}
                <div 
                  className="prose prose-lg dark:prose-invert max-w-none mb-8"
                  dangerouslySetInnerHTML={{ __html: blogPost.content }}
                />

                <Separator className="my-8" />

                {/* Author Info */}
                <div className="mb-8 p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                  <p className="font-semibold text-foreground mb-1">Written by {blogPost.author.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Building Palactix — infrastructure ownership for social media agencies.
                  </p>
                </div>

                {/* Share Section */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Share2 className="h-5 w-5" />
                    <span className="font-semibold">Share:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <ShareButton
                      icon={Twitter}
                      label="Twitter"
                      onClick={() => handleShare("twitter")}
                    />
                    <ShareButton
                      icon={Linkedin}
                      label="LinkedIn"
                      onClick={() => handleShare("linkedin")}
                    />
                    <ShareButton
                      icon={Facebook}
                      label="Facebook"
                      onClick={() => handleShare("facebook")}
                    />
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar - Right Section */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Why You Are Here - Always Expanded */}
            <Card className="transition-all duration-500 opacity-100">
              <CardHeader 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleSidebarSection('whyYouAreHere')}
              >
                <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center justify-between">
                  Why You Are Here
                  {sidebarSections.whyYouAreHere ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </CardTitle>
              </CardHeader>
              {sidebarSections.whyYouAreHere && (
                <CardContent className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <CardDescription className="text-sm">
                    You're exploring whether owning your social media infrastructure makes more sense than renting it.
                  </CardDescription>
                </CardContent>
              )}
            </Card>

            {/* Table of Contents - Expand after 30% scroll or manual toggle */}
            <Card className="transition-all duration-500">
              <CardHeader 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleSidebarSection('tableOfContents')}
              >
                <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center justify-between">
                  Table of Contents
                  {sidebarSections.tableOfContents ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </CardTitle>
              </CardHeader>
              {sidebarSections.tableOfContents && (
                <CardContent className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Link 
                    href="#what-this-means" 
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                  >
                    What This Actually Means
                  </Link>
                  <Link 
                    href="#api-token-ownership" 
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                  >
                    The Alternative: API Token Ownership
                  </Link>
                  <Link 
                    href="#why-it-matters" 
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                  >
                    Why This Matters
                  </Link>
                </CardContent>
              )}
            </Card>

            {/* The Solutions Map - Expand after 70% scroll or manual toggle */}
            <Card className="transition-all duration-500">
              <CardHeader 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleSidebarSection('solutionsMap')}
              >
                <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center justify-between">
                  The Solutions Map
                  {sidebarSections.solutionsMap ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </CardTitle>
              </CardHeader>
              {sidebarSections.solutionsMap && (
                <CardContent className="p-0 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="divide-y divide-border/40">
                    {/* THE ECONOMICS */}
                    <AccordionItem
                      title="THE ECONOMICS"
                      isOpen={openSections.economics}
                      onToggle={() => toggleSection("economics")}
                    >
                      <Link 
                        href="/blog/seat-tax-vs-scale" 
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors pl-4 py-1 truncate"
                        title="Seat Tax vs. Scale: Understanding the true cost of per-seat pricing models"
                      >
                        - Seat Tax vs. Scale: Understanding the true cost of per-seat pricing models
                      </Link>
                      <Link 
                        href="/blog/cost-of-rented-tech" 
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors pl-4 py-1 truncate"
                        title="Cost of Rented Tech: Why dependency on third-party infrastructure is expensive"
                      >
                        - Cost of Rented Tech: Why dependency on third-party infrastructure is expensive
                      </Link>
                    </AccordionItem>

                    {/* THE INFRASTRUCTURE */}
                    <AccordionItem
                      title="THE INFRASTRUCTURE"
                      isOpen={openSections.infrastructure}
                      onToggle={() => toggleSection("infrastructure")}
                      isActive={true}
                    >
                      <Link 
                        href="/blog/api-token-ownership" 
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors pl-4 py-1 truncate"
                        title="API Token Ownership: Taking control of your social media authentication"
                      >
                        - API Token Ownership: Taking control of your social media authentication
                      </Link>
                      <Link 
                        href="/blog/portable-connections" 
                        className="block text-sm text-primary hover:text-primary/80 font-medium transition-colors pl-4 py-1 truncate"
                        title="Portable Connections: Move your integrations anywhere without re-authentication"
                      >
                        - Portable Connections: Move your integrations anywhere without re-authentication
                      </Link>
                    </AccordionItem>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* The Next Move - Expand after 70% scroll or manual toggle */}
            <Card className="border-primary/20 bg-primary/5 transition-all duration-500">
              <CardHeader 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleSidebarSection('nextMove')}
              >
                <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center justify-between">
                  The Next Move
                  {sidebarSections.nextMove ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </CardTitle>
              </CardHeader>
              {sidebarSections.nextMove && (
                <CardContent className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <Link 
                    href="/blog/hidden-risk-shared-app-ids"
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
                  >
                    Read: The Hidden Risk of Shared App IDs
                  </Link>
                </CardContent>
              )}
            </Card>
          </div>
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
  );
}