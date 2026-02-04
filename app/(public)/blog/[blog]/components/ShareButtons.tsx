"use client";

import { Share2, Twitter, Linkedin, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonsProps {
  title: string;
  url: string;
}

function ShareButton({ 
  icon: Icon, 
  label, 
  onClick 
}: { 
  icon: React.ComponentType<{className?: string}>; 
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

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const handleShare = (platform: string) => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };
    
    if (urls[platform as keyof typeof urls]) {
      window.open(urls[platform as keyof typeof urls], "_blank", "width=600,height=400");
    }
  };

  return (
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
  );
}
