"use client";
import { usePostsListing } from "@/features/posts/hooks/usePostsListing";
import { PostsFilterBar } from "./PostsFilterBar";
import { PostsTable } from "./PostsTable";
import { PostDetailDrawer } from "./PostDetailDrawer";
import { PostsPagination } from "./PostsPagination";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { buildOrgUrl } from "@/lib/utils/org-urls"; // Assuming this utility exists based on existing code

export const PostsListingPage = () => {
  const listing = usePostsListing();
  const router = useRouter();

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
            <p className="text-muted-foreground mt-1">Manage and schedule your content across all platforms.</p>
         </div>
         <Button 
            className="bg-[#2ea44f] hover:bg-[#2ea44f]/90" 
            onClick={() => router.push(buildOrgUrl("/scheduler"))}
         >
            <Plus className="mr-2 h-4 w-4" /> Create Post
         </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col space-y-4">
        {listing.selectedRowIds.length > 0 ? (
            <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-primary">{listing.selectedRowIds.length} posts selected</span>
                    <Button variant="ghost" size="sm" onClick={listing.clearSelection} className="h-auto p-0 text-xs text-muted-foreground hover:text-primary">
                        Dismiss
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="h-8 bg-background">
                        Approve
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 bg-background">
                        Schedule
                    </Button>
                     <Button size="sm" variant="outline" className="h-8 bg-background text-destructive hover:text-destructive">
                        Delete
                    </Button>
                </div>
            </div>
        ) : (
             <PostsFilterBar {...listing} />
        )}
        
        <PostsTable {...listing} />
        
        <PostsPagination 
             currentPage={listing.pagination.currentPage}
             lastPage={listing.pagination.lastPage}
             total={listing.pagination.total}
             perPage={listing.pagination.perPage}
             setParams={listing.setParams}
        />
      </div>

      <PostDetailDrawer {...listing} />
    </div>
  );
};
