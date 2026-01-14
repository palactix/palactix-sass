"use client";

import { Button } from "@/components/ui/button";
import { Twitter, Linkedin, Facebook, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

interface SocialShareProps {
  title: string;
  url: string;
}

export function SocialShare({ title, url }: SocialShareProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="flex flex-col gap-4 py-8 border-y border-border my-8">
      <h3 className="text-lg font-semibold">Share this article</h3>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="gap-2"
        >
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Twitter"
          >
            <Twitter className="h-4 w-4" />
            Twitter
          </a>
        </Button>

        <Button
          variant="outline"
          size="sm"
          asChild
          className="gap-2"
        >
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </a>
        </Button>

        <Button
          variant="outline"
          size="sm"
          asChild
          className="gap-2"
        >
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Facebook"
          >
            <Facebook className="h-4 w-4" />
            Facebook
          </a>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className="gap-2"
        >
          <LinkIcon className="h-4 w-4" />
          Copy Link
        </Button>
      </div>
    </div>
  );
}
