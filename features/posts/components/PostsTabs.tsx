"use client";

import { memo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export interface PostsTabsProps {
  counts?: {
    all: number;
    my_drafts: number;
    needs_approval: number;
    scheduled: number;
    published: number;
    failed: number;
  };
}

export const PostsTabs = memo(function PostsTabs({
  counts,
}: PostsTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "all";

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "all") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    // Reset to page 1 when tab changes
    params.delete("page");
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.push(newUrl, { scroll: false });
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-6 lg:w-auto">
        <TabsTrigger value="all" className="relative">
          All Posts
          {counts?.all ? (
            <Badge variant="secondary" className="ml-2 h-5 px-1 text-xs">
              {counts.all}
            </Badge>
          ) : null}
        </TabsTrigger>
        <TabsTrigger value="my_drafts">
          My Drafts
          {counts?.my_drafts ? (
            <Badge variant="secondary" className="ml-2 h-5 px-1 text-xs">
              {counts.my_drafts}
            </Badge>
          ) : null}
        </TabsTrigger>
        <TabsTrigger value="needs_approval">
          Needs Approval
          {counts?.needs_approval ? (
            <Badge variant="destructive" className="ml-2 h-5 px-1 text-xs">
              {counts.needs_approval}
            </Badge>
          ) : null}
        </TabsTrigger>
        <TabsTrigger value="scheduled">
          Scheduled
          {counts?.scheduled ? (
            <Badge variant="secondary" className="ml-2 h-5 px-1 text-xs">
              {counts.scheduled}
            </Badge>
          ) : null}
        </TabsTrigger>
        <TabsTrigger value="published">
          Published
          {counts?.published ? (
            <Badge variant="secondary" className="ml-2 h-5 px-1 text-xs">
              {counts.published}
            </Badge>
          ) : null}
        </TabsTrigger>
        <TabsTrigger value="failed">
          Failed
          {counts?.failed ? (
            <Badge variant="destructive" className="ml-2 h-5 px-1 text-xs">
              {counts.failed}
            </Badge>
          ) : null}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
});
