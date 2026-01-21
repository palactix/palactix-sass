"use client";

import { memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface Platform {
  id: string;
  name: string;
  slug: string;
  icon?: {
    "logo-png"?: string;
    "logo-svg"?: string;
  };
}

export interface PlatformIconsProps {
  platforms: Platform[];
  maxVisible?: number;
}

export const PlatformIcons = memo(function PlatformIcons({
  platforms,
  maxVisible = 4,
}: PlatformIconsProps) {
  const visiblePlatforms = platforms.slice(0, maxVisible);
  const remainingCount = platforms.length - maxVisible;

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        {visiblePlatforms.map((platform) => (
          <Tooltip key={platform.id}>
            <TooltipTrigger asChild>
              <div className="relative">
                <Avatar className="h-6 w-6 border">
                  <AvatarImage
                    src={platform.icon?.["logo-png"] || platform.icon?.["logo-svg"]}
                    alt={platform.name}
                  />
                  <AvatarFallback className="text-[10px]">
                    {platform.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{platform.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        {remainingCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                +{remainingCount}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{remainingCount} more platforms</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
});
