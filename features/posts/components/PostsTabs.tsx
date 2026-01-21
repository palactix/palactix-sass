"use client";

import { memo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export interface PostsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
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
  activeTab,
  onTabChange,
  counts,
}: PostsTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
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
