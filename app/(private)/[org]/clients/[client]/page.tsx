"use client";

import { Calendar, ChevronDown, AlertTriangle, FileText, Clock, Edit, Eye, ExternalLink, Image as ImageIcon, Video, XCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConnectedAccountsCard } from "@/components/clients/dashboard/ConnectedAccountsCard";
import { useParams } from "next/navigation";

export default function ClientPage() {
  const params = useParams();
  const clientId = params?.client ? parseInt(params.client as string) : null;

  
  // Mock data - replace with actual API calls
  const client = {
    name: "Acme Corp",
    platforms: ["Instagram", "LinkedIn", "X"],
  };

  const publishingStats = {
    scheduled: 8,
    drafts: 3,
    needsAttention: 1,
  };

  const upcomingPosts = [
    { 
      id: 1, 
      date: "Mon, 11 Sep", 
      time: "10:00 AM",
      platform: "Instagram", 
      platformIcon: "instagram",
      title: "Product launch teaser",
      caption: "Excited to announce our newest product! Stay tuned for the big reveal coming next week 🚀",
      mediaType: "image",
      mediaThumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"
    },
    { 
      id: 2, 
      date: "Wed, 13 Sep", 
      time: "09:30 AM",
      platform: "LinkedIn", 
      platformIcon: "linkedin",
      title: "Behind the scenes post",
      caption: "A glimpse into our creative process. Our team working hard to bring you the best experience.",
      mediaType: "video",
      mediaThumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop"
    },
    { 
      id: 3, 
      date: "Fri, 15 Sep", 
      time: "06:00 PM",
      platform: "X", 
      platformIcon: "x",
      title: "Weekly insight thread",
      caption: "🧵 Thread: 5 lessons we learned this week about product development and customer feedback...",
      mediaType: "none",
      mediaThumbnail: null
    },
  ];

  const alerts = [
    { id: 1, message: "Instagram account disconnected", severity: "error", action: "Reconnect now" },
    { id: 2, message: "1 scheduled post is missing media", severity: "error", action: "Add media" },
  ];

  const drafts = [
    { 
      id: 1, 
      title: "September campaign – Post 1",
      mediaType: "image",
      mediaThumbnail: "https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=400&fit=crop",
      platforms: ["Instagram", "Facebook"]
    },
    { 
      id: 2, 
      title: "Client testimonial post",
      mediaType: "video",
      mediaThumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
      platforms: ["LinkedIn"]
    },
    { 
      id: 3, 
      title: "Feature announcement",
      mediaType: "image",
      mediaThumbnail: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=400&fit=crop",
      platforms: ["X", "LinkedIn"]
    },
  ];

  const getPlatformBadgeColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram": return "bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0";
      case "linkedin": return "bg-blue-600 text-white border-0";
      case "x": return "bg-black dark:bg-white text-white dark:text-black border-0";
      case "facebook": return "bg-blue-500 text-white border-0";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container max-w-7xl mx-auto py-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              {client.platforms.map((platform, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {platform}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Switch Client
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Client A</DropdownMenuItem>
                <DropdownMenuItem>Client B</DropdownMenuItem>
                <DropdownMenuItem>Client C</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="lg" className="gap-2">
              <Calendar className="h-4 w-4" />
              Open Scheduler
            </Button>
          </div>
        </div>

        {/* CRITICAL: Needs Attention Banner - RED ALERT */}
        {alerts.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-xl shadow-sm border-2 border-red-200 dark:border-red-800">
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-red-100 dark:bg-red-900/50 p-2.5 shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-red-950 dark:text-red-100">
                    Action Required
                    <Badge variant="secondary" className="bg-red-200 dark:bg-red-900/50 text-red-950 dark:text-red-300 border-red-300 dark:border-red-800">
                      {alerts.length} {alerts.length === 1 ? 'issue' : 'issues'}
                    </Badge>
                  </h2>
                  <div className="space-y-2">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between bg-white dark:bg-red-950/20 rounded-lg p-3 border border-red-200 dark:border-red-800/50">
                        <div className="flex items-center gap-3">
                          <XCircle className="h-4 w-4 shrink-0 text-red-700 dark:text-red-500" />
                          <span className="font-semibold text-red-950 dark:text-red-100">{alert.message}</span>
                        </div>
                        <Button size="sm" variant="default" className="bg-red-600 hover:bg-red-700 text-white shrink-0">
                          {alert.action}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Publishing Status - Enhanced */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{publishingStats.scheduled}</p>
                  <p className="text-xs text-muted-foreground font-medium">Scheduled Posts</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">Next 7d</Badge>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-orange-500/5 to-orange-500/10 border-orange-500/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-orange-500/10 p-2">
                  <FileText className="h-4 w-4 text-orange-600 dark:text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{publishingStats.drafts}</p>
                  <p className="text-xs text-muted-foreground font-medium">Drafts Waiting</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">Ready</Badge>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-red-500/5 to-red-500/10 border-red-500/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-red-500/10 p-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{publishingStats.needsAttention}</p>
                  <p className="text-xs text-muted-foreground font-medium">Needs Attention</p>
                </div>
              </div>
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5">Urgent</Badge>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Posts - 2/3 width */}
          <Card className="lg:col-span-2 shadow-sm">
            <div className="p-6 border-b bg-muted/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Upcoming Posts</h2>
                <Button variant="link" className="text-sm">
                  View all →
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {upcomingPosts.map((post) => (
                <Card key={post.id} className="border-l-4 border-l-primary hover:shadow-md transition-all">
                  <div className="p-4">
                    <div className="flex gap-4">
                      {/* Media Thumbnail */}
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0 border-2 border-border">
                        {post.mediaThumbnail ? (
                          <>
                            <Image
                              src={post.mediaThumbnail}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur rounded-full p-1">
                              {post.mediaType === "video" ? (
                                <Video className="h-3 w-3 text-white" />
                              ) : (
                                <ImageIcon className="h-3 w-3 text-white" />
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Post Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <Badge className={`${getPlatformBadgeColor(post.platform)} text-xs font-semibold`}>
                              {post.platform}
                            </Badge>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              <span className="font-medium">{post.date}</span>
                              <span>•</span>
                              <span className="font-semibold">{post.time}</span>
                            </div>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <h3 className="font-semibold mb-1.5 text-sm">{post.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{post.caption}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Drafts - 1/3 width */}
          <Card className="shadow-sm">
            <div className="p-6 border-b bg-muted/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Drafts</h2>
                <Button variant="link" className="text-sm">
                  View all →
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {drafts.map((draft) => (
                <Card key={draft.id} className="hover:shadow-md transition-shadow group border-l-4 border-l-orange-500">
                  <div className="p-3">
                    <div className="relative w-full h-28 rounded-lg overflow-hidden bg-muted mb-3 border">
                      <Image
                        src={draft.mediaThumbnail}
                        alt={draft.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur rounded-full p-1.5">
                        {draft.mediaType === "video" ? (
                          <Video className="h-3 w-3 text-white" />
                        ) : (
                          <ImageIcon className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button size="sm" variant="secondary" className="gap-2">
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                      </div>
                    </div>
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">{draft.title}</h3>
                    <div className="flex gap-1.5 flex-wrap">
                      {draft.platforms.map((platform, idx) => (
                        <Badge key={idx} variant="outline" className="text-[10px] px-1.5 py-0">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>

        {/* Connected Accounts */}
        <ConnectedAccountsCard clientId={clientId!} />

        {/* Bottom Actions */}
        <div className="flex gap-3 justify-center pb-6">
          <Button size="lg" className="gap-2 px-8">
            <ExternalLink className="h-4 w-4" />
            View All Posts
          </Button>
        </div>
      </div>
    </div>
  );
}