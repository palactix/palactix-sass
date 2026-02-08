"use client";

import { DynamicFilters } from "@/components/shared/filters/DynamicFilters";
import { useTagFilters } from "@/features/tags/hooks/useTagFilters";
import { TAG_FILTER_CONFIG } from "@/features/tags/config/filterConfig";

export default function TagFilters() {
  const form = useTagFilters();
  
  return <DynamicFilters config={TAG_FILTER_CONFIG} form={form} />;
}