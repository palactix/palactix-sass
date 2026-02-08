"use client";

import { useSharedFilters } from "@/components/shared/filters/useSharedFilters";
import { TAG_FILTER_CONFIG } from "../config/filterConfig";

/**
 * Tag-specific filter hook
 * Just wraps the generic useSharedFilters with TAG config
 */
export function useTagFilters() {
  return useSharedFilters(TAG_FILTER_CONFIG);
}

