"use client";

import { useTheme } from "next-themes";
import { ChannelIcon } from "@/features/agency-app/types/agency-app.types";
import { getPlatformIcon } from "@/lib/utils/platform-icons";

/**
 * Hook to get the appropriate channel logo URL based on current theme.
 * Wraps getPlatformIcon utility with automatic theme detection.
 * 
 * @example
 * const getChannelLogo = useChannelLogo();
 * const logoUrl = getChannelLogo(channel.icon);
 */
export function useChannelLogo() {
  const { resolvedTheme } = useTheme();

  return (icon: ChannelIcon): string => {
    return getPlatformIcon(icon, resolvedTheme);
  };
}
