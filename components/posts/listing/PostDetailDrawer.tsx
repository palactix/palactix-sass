"use client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { usePostsListing } from "@/features/posts/hooks/usePostsListing";
import { useGetPost } from "@/features/posts/hooks/usePosts";
import { Button } from "@/components/ui/button";
import { PostPreviewCard } from "./PostPreviewCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

export const PostDetailDrawer = ({ 
  isDrawerOpen, 
  closeDrawer, 
  selectedPostId 
}: ReturnType<typeof usePostsListing>) => {
    
  const { data: post, isLoading } = useGetPost(selectedPostId || "");

  // Always render the Sheet component so it can handle enter/exit animations via the 'open' prop.
  // The content inside handles the loading/empty states.

  return (
    <Sheet open={isDrawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] flex flex-col p-0">
        {isLoading ? (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        ) : post ? (
            <>
                <SheetHeader className="p-6 border-b">
                    <SheetTitle>Post Details</SheetTitle>
                    <SheetDescription>
                        Created on {format(new Date(post.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </SheetDescription>
                </SheetHeader>
                
                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-6">
                        {/* Status Section */}
                        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border">
                            <div>
                                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Status</div>
                                <div className="font-semibold capitalize text-sm">{post.status.replace("_", " ")}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Channel</div>
                                <div className="font-medium flex items-center justify-end gap-2 text-sm">
                                    {/* Using post.channel.icon if available or fallback */}
                                    {post.channel.name} 
                                </div>
                            </div>
                        </div>

                        {/* Preview */}
                        <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                Preview
                                <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                    {post.channel.name}
                                </span>
                            </h3>
                            <div className="flex justify-center bg-muted/30 border rounded-xl p-8 transition-colors">
                                <PostPreviewCard post={post} />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Caption</h3>
                                <div className="p-3 bg-muted/40 rounded-md border text-sm whitespace-pre-wrap">
                                    {post.caption}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-muted/20 rounded-lg border">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Scheduled For</h3>
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        {post.scheduled_at ? (
                                            <>
                                                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                                {format(new Date(post.scheduled_at), "MMM d, yyyy h:mm a")}
                                            </>
                                        ) : (
                                            <>
                                                <span className="h-2 w-2 rounded-full bg-gray-300"></span>
                                                Not scheduled
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4 bg-muted/20 rounded-lg border">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Created By</h3>
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                       <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">
                                            {post.user?.name?.[0]}
                                       </div>
                                       {post.user?.name}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <div className="p-6 border-t bg-background">
                    <div className="flex gap-3 justify-end">
                        <Button variant="outline" onClick={closeDrawer}>Close</Button>
                        <Button className="bg-[#2ea44f] hover:bg-[#2ea44f]/90">Edit Post</Button>
                    </div>
                </div>
            </>
        ) : (
            <div className="p-6 text-center text-muted-foreground">Post not found</div>
        )}
      </SheetContent>
    </Sheet>
  );
};
