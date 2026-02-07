"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogPost, BlogCategoryPosts } from "@/features/blog";

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
      <div
        className={`pb-3 px-2 space-y-2 overflow-hidden transition-[max-height] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ maxHeight: isOpen ? 800 : 0 }}
        aria-hidden={!isOpen}
      >
        {children}
      </div>
    </div>
  );
}

export function BlogSidebar({blog, categories}: {blog: BlogPost; categories: BlogCategoryPosts[]}) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    categories.forEach((c, index) => {
      const sectionId = c.name || String(c.id);
      const containsActive = (c.posts || []).some((p) => p.slug === blog.slug);
      initial[sectionId] = containsActive || index === 0; // open the active section or first by default
    });
    return initial;
  });

  const [sidebarSections, setSidebarSections] = useState({
    whyYouAreHere: true,
    tableOfContents: true,
    solutionsMap: false,
    nextMove: false,
  });

  const [activeHeading, setActiveHeading] = useState<string | null>(null);

  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setScrollProgress(progress);

      // Auto-expand for remaining widgets
      setSidebarSections(prev => {
        const next = { ...prev };
        if (progress > 30) {
          next.solutionsMap = true;
        }
        if (progress > 70) {
          next.nextMove = true;
        }
        return next;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Observe headings to highlight active TOC item
  useEffect(() => {
    const ids = blog.table_of_contents?.map((t) => t.slug).filter(Boolean) || [];
    if (ids.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop);
        if (visible[0]) {
          setActiveHeading(visible[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "0px 0px -70% 0px",
        threshold: [0, 0.25, 0.5, 1],
      }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [blog.table_of_contents]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleSidebarSection = (section: keyof typeof sidebarSections) => {
    // First two remain always open
    if (section === 'whyYouAreHere' || section === 'tableOfContents') return;
    setSidebarSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 lg:self-start">
      {/* Why You Are Here */}
      <CollapsibleSection
        title="Why You Are Here"
        isOpen={true}
        onToggle={() => {}}
      >
        <p className="text-sm">
          You&apos;re exploring whether owning your social media infrastructure makes more sense than renting it.
        </p>
      </CollapsibleSection>
      
      
      {/* Table of Contents */}
      {
        blog.table_of_contents !== undefined && 
          <CollapsibleSection
            title="Table of Contents"
            isOpen={true}
            onToggle={() => {}}
            >
              <TableOfContents blog={blog} activeHeading={activeHeading} />
          </CollapsibleSection>
      }

      {/* The Solutions Map */}

      <CollapsibleSection 
        title="The Solutions Map"
        isOpen={sidebarSections.solutionsMap}
        onToggle={() => toggleSidebarSection('solutionsMap')}
      >
        
        <div className="divide-y divide-border/40">
          {categories.map((section) => {
            const sectionId = section.name || String(section.id);
            const posts = (section.posts || []).slice(0, 8);
            const sectionActive = posts.some((p) => p.slug === blog.slug);
            return (
              <AccordionItem
                key={sectionId}
                title={section.name.toLocaleUpperCase()}
                isOpen={openSections[sectionId]}
                onToggle={() => toggleSection(sectionId)}
                isActive={sectionActive}
              >
                {posts.map((post) => (
                  <Link 
                    key={post.slug}
                    href={`/blog/${post.slug}`} 
                    className={`block text-sm ${
                      post.slug === blog.slug ?
                      "text-primary hover:text-primary/80 font-medium" :
                      "text-muted-foreground hover:text-foreground"
                    } transition-colors pl-4 py-1 truncate`}
                    title={post.title}
                  >
                    - {post.title}
                  </Link>
                ))}
              </AccordionItem>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* The Next Move */}
      <CollapsibleSection
        title="The Next Move"
        isOpen={sidebarSections.nextMove}
        onToggle={() => toggleSidebarSection('nextMove')}
      >
        <div className="space-y-2 text-sm">
          {blog.next_post ? (
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide">Next</p>
              <Link href={`/blog/${blog.next_post.slug}`} className="font-medium text-primary hover:text-primary/80 transition-colors underline underline-offset-4">
                {blog.next_post.title}
              </Link>
            </div>
          ) : null}
          {blog.prev_post ? (
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide">Previous</p>
              <Link href={`/blog/${blog.prev_post.slug}`} className="font-medium text-primary hover:text-primary/80 transition-colors underline underline-offset-4">
                {blog.prev_post.title}
              </Link>
            </div>
          ) : null}
          {!blog.next_post && !blog.prev_post ? (
            <p className="text-muted-foreground">No adjacent articles.</p>
          ) : null}
        </div>
      </CollapsibleSection>
    </div>
  );
}


function CollapsibleSection({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card className="transition-all duration-500 opacity-100">
      <CardHeader 
        className={`cursor-pointer hover:bg-muted/50 transition-colors`}
        onClick={onToggle}
      >
        <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center justify-between">
          {title}
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </CardTitle>
      </CardHeader>
      {isOpen && (
        <CardContent className="animate-in fade-in slide-in-from-top-2 duration-300">
          {children}
        </CardContent>
      )}
    </Card>
  );
}

const TableOfContents = ({blog, activeHeading}: {blog: BlogPost; activeHeading: string | null}) => {
  // Smooth scroll handler for TOC links (client-side)
  const handleTOCClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // update the hash without jumping
      history.replaceState(null, '', `#${id}`);
    }
  };

  return (
    <div className="space-y-2">
      {blog.table_of_contents && blog.table_of_contents.map((item: { level: number; title: string; slug: string }) => (
        <a
          key={item.slug}
          href={`#${item.slug}`}
          onClick={(e) => handleTOCClick(e, item.slug)}
          className={`block text-sm transition-colors ${item.level === 2 ? 'pl-4' : 'pl-8'} py-1 ${
            activeHeading === item.slug
              ? 'text-foreground font-semibold border-l-2 border-primary pl-[14px]'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {item.title}
        </a>
      ))}
    </div>
  );
};