"use client";
import { Post, PostStatus } from "@/features/posts/types";
import { usePostsListing } from "@/features/posts/hooks/usePostsListing";
import { useChannelLogo } from "@/hooks/use-channel-logo";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, CheckCircle, XCircle, Eye, AlertCircle, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PostPreviewCard } from "./PostPreviewCard";
import { cn } from "@/lib/utils";

export const PostsTable = ({ 
  posts, 
  isLoading, 
  selectedRowIds, 
  toggleSelection, 
  selectAll, 
  openDrawer 
}: ReturnType<typeof usePostsListing>) => {
  const getChannelLogo = useChannelLogo();
  const allSelected = posts.length > 0 && selectedRowIds.length === posts.length;
  const someSelected = selectedRowIds.length > 0 && selectedRowIds.length < posts.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      selectAll(posts.map(p => p.id));
    } else {
      selectAll([]);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading posts...</div>;
  }
  
  if (posts.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-muted/10 border-dashed">
            <div className="bg-muted p-4 rounded-full mb-4">
                <Edit className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg">No posts found</h3>
            <p className="text-muted-foreground text-sm max-w-sm text-center mt-1">
                Try adjusting your filters or create a new post to get started.
            </p>
          </div>
      )
  }

  return (
    <div className="rounded-md border bg-card text-card-foreground shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={allSelected || someSelected}
                // @ts-ignore
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Post Content</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow 
                key={post.id} 
                className="group cursor-pointer hover:bg-muted/50 data-[state=selected]:bg-muted transition-colors border-b-border"
                data-state={selectedRowIds.includes(post.id) ? "selected" : undefined}
                onClick={(e) => {
                    // Prevent opening drawer if clicking checkbox or actions
                    if ((e.target as HTMLElement).closest('[data-no-drawer]')) return;
                    openDrawer(post.id);
                }}
            >
              <TableCell className="w-[50px]" data-no-drawer>
                <Checkbox 
                  checked={selectedRowIds.includes(post.id)}
                  onCheckedChange={() => toggleSelection(post.id)}
                />
              </TableCell>
              
              <TableCell className="max-w-[400px]">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 rounded-md bg-muted flex-shrink-0 overflow-hidden border relative group/image">
                          {post.media && post.media.length > 0 ? (
                            post.media[0].type === "video" ? (
                                <div className="w-full h-full flex items-center justify-center bg-black text-white text-[10px]">Video</div>
                            ) : (
                                <img src={post.media[0].thumbnail_url || post.media[0].url} alt="" className="h-full w-full object-cover" />
                            )
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground/50">
                                <Edit className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 py-1">
                          <p className="font-medium text-sm truncate text-foreground">{post.caption || "No caption"}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                             {post.tags?.map(tag => (
                                 <Badge variant="outline" className="text-[10px] h-4 px-1 rounded-sm bg-muted/50 font-normal" key={tag.id}>{tag.name}</Badge>
                             ))}
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="start" sideOffset={-10} className="p-0 border-none bg-transparent shadow-none ml-4">
                      <PostPreviewCard post={post} />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>

              <TableCell>
                  <div className="flex items-center gap-2">
                       {/* Placeholder for Client info as it's not in Post object yet */}
                       <div className="h-6 w-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-bold">
                           C1
                       </div>
                       <span className="text-sm">Client 1</span>
                  </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6 border bg-white">
                    <AvatarImage src={getChannelLogo(post.channel.icon as any)} className="object-contain p-0.5" />
                    <AvatarFallback>{post.channel.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm capitalize">{post.channel.name}</span>
                </div>
              </TableCell>

              <TableCell>
                <StatusBadge status={post.status} />
              </TableCell>

              <TableCell>
                <div className="text-sm">
                  {post.scheduled_at ? (
                    <div className="flex flex-col">
                        <span className="font-medium">{format(new Date(post.scheduled_at), "MMM d, yyyy")}</span>
                        <span className="text-muted-foreground text-xs">{format(new Date(post.scheduled_at), "h:mm a")}</span>
                    </div>
                  ) : post.published_at ? (
                    <div className="flex flex-col">
                        <span className="font-medium">{format(new Date(post.published_at), "MMM d, yyyy")}</span>
                        <span className="text-muted-foreground text-xs">Published</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">Not scheduled</span>
                  )}
                </div>
              <TableCell>
                 <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={post.user?.avatar} />
                        <AvatarFallback>{post.user?.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{post.user?.name}</span>
                 </div>
              </TableCell>

              </TableCell>

              <TableCell data-no-drawer>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => openDrawer(post.id)}>
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {post.status === "pending_approval" && (
                        <>
                            <DropdownMenuItem className="text-green-600">
                            <CheckCircle className="mr-2 h-4 w-4" /> Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                            <XCircle className="mr-2 h-4 w-4" /> Reject
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </>
                    )}
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const StatusBadge = ({ status }: { status: PostStatus }) => {
  const styles: Record<string, string> = {
    draft: "bg-gray-100 text-gray-600 hover:bg-gray-200",
    pending_approval: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
    approved: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    scheduled: "bg-purple-100 text-purple-700 hover:bg-purple-200",
    published: "bg-[#2ea44f]/10 text-[#2ea44f] hover:bg-[#2ea44f]/20",
    failed: "bg-red-100 text-red-700 hover:bg-red-200",
    rejected: "bg-red-50 text-red-600 hover:bg-red-100",
  };

  const labels: Record<string, string> = {
    draft: "Draft",
    pending_approval: "Needs Approval",
    approved: "Approved",
    scheduled: "Scheduled",
    published: "Published",
    failed: "Failed",
    rejected: "Rejected",
  };

  const icons: Record<string, React.ReactNode> = {
      draft: <Edit className="h-3 w-3 mr-1" />,
      pending_approval: <Clock className="h-3 w-3 mr-1" />,
      approved: <CheckCircle className="h-3 w-3 mr-1" />,
      scheduled: <Clock className="h-3 w-3 mr-1" />,
      published: <CheckCircle className="h-3 w-3 mr-1" />,
      failed: <AlertCircle className="h-3 w-3 mr-1" />,
      rejected: <XCircle className="h-3 w-3 mr-1" />,
  }

  return (
    <Badge 
        variant="secondary" 
        className={cn("font-medium select-none capitalize", styles[status] || styles.draft)}
    >
      {icons[status]}
      {labels[status] || status}
    </Badge>
  );
};
