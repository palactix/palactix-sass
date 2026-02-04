"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogPost, solutionMap } from "@/features/blog";

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

export function BlogSidebar({blog}: {blog: BlogPost}) {
  
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

  return (
    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 lg:self-start">
      {/* Why You Are Here */}
      <CollapsibleSection
        title="Why You Are Here"
        isOpen={sidebarSections.whyYouAreHere}
        onToggle={() => toggleSidebarSection('whyYouAreHere')}
      >
        <p className="text-sm">
          You&apos;re exploring whether owning your social media infrastructure makes more sense than renting it.
        </p>
      </CollapsibleSection>
      
      
      {/* Table of Contents */}
      <CollapsibleSection
        title="Table of Contents"
        isOpen={sidebarSections.tableOfContents}
        onToggle={() => toggleSidebarSection('tableOfContents')}
        >
          <TableOfContents blog={blog} />
      </CollapsibleSection>
      

      {/* The Solutions Map */}

      <CollapsibleSection 
        title="The Solutions Map"
        isOpen={sidebarSections.solutionsMap}
        onToggle={() => toggleSidebarSection('solutionsMap')}
      >
        
        <div className="divide-y divide-border/40">
          {/* THE ECONOMICS */}

          {
            solutionMap.map(section => (
              <AccordionItem
                key={section.label}
                title={section.label.toLocaleUpperCase()}
                isOpen={openSections[section.id]}
                onToggle={() => toggleSection(section.id)}
                isActive={section.id === blog.slug}
              >
                {section.posts.map(post => (
                  <Link 
                    key={post.slug}
                    href={post.slug} 
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
            ))
          }
        </div>
      </CollapsibleSection>

      {/* The Next Move */}
      <CollapsibleSection
        title="The Next Move"
        isOpen={sidebarSections.nextMove}
        onToggle={() => toggleSidebarSection('nextMove')}
      >
        <Link 
          href="/blog/hidden-risk-shared-app-ids"
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
        >
          Read: The Hidden Risk of Shared App IDs
        </Link>
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

const TableOfContents = ({blog}: {blog: BlogPost}) => {
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
      {blog.table_of_contents.map((item: { level: number; title: string; id: string }) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          onClick={(e) => handleTOCClick(e, item.id)}
          className={`block text-sm text-muted-foreground hover:text-foreground transition-colors ${item.level === 2 ? 'pl-4' : 'pl-8'} py-1`}
        >
          {item.title}
        </a>
      ))}
    </div>
  );
};