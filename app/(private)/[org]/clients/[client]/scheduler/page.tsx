"use client";

import { useState } from "react";
import { Calendar, Clock, Send, Sparkles, Image as ImageIcon, Video, X, Plus, Upload, ChevronDown, AlertCircle, Check } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChooseAccounts } from "@/components/scheduler/ChooseAccounts";
import { useUser } from "@/features/auth/api/auth.queries";

export default function ClientSchedulerPage() {
  // Helper to get platform logo from slug (for mock data)
  const getPlatformLogo = (slug: string) => {
    return `/images/channels/${slug}.svg`;
  };
  const [media, setMedia] = useState<any[]>([]);

  const { data: user } = useUser()
  
  const [separateCaptions, setSeparateCaptions] = useState(false);
  const [globalCaption, setGlobalCaption] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  // Mock data - replace with actual API
  const availableAccounts = [
    { id: "ig1", platform: "Instagram", icon: "instagram", username: "@acmecorp", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" },
    { id: "ig2", platform: "Instagram", icon: "instagram", username: "@acme_official", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop" },
    { id: "li1", platform: "LinkedIn", icon: "linkedin", username: "Acme Corp", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop" },
    { id: "x1", platform: "X", icon: "x", username: "@acme_tech", avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop" },
    { id: "fb1", platform: "Facebook", icon: "facebook", username: "Acme Corporation", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop" },
  ];

  const getPlatformBadgeColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram": return "bg-gradient-to-br from-purple-500 to-pink-500 text-white";
      case "linkedin": return "bg-blue-600 text-white";
      case "x": return "bg-black dark:bg-white text-white dark:text-black";
      case "facebook": return "bg-blue-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newMedia = files.slice(0, 10 - media.length).map((file, index) => ({
      id: Date.now() + index,
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
      altText: "",
    }));
    setMedia([...media, ...newMedia]);
  };

  const removeMedia = (id: number) => {
    setMedia(media.filter(m => m.id !== id));
  };

  const selectedAccounts = [1, 2];
  

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm">
        <div className="container max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">Create Post</h1>
              {selectedAccounts.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {selectedAccounts.length} {selectedAccounts.length === 1 ? 'account' : 'accounts'} selected
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <Input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="h-9 w-36"
                />
                <Clock className="h-4 w-4 ml-2" />
                <Input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="h-9 w-28"
                />
              </div>
              <Separator orientation="vertical" className="h-8" />
              <Button variant="outline" size="default" className="gap-2">
                <Send className="h-4 w-4" />
                Post Now
              </Button>
              <Button size="default" className="gap-2">
                <Clock className="h-4 w-4" />
                Schedule Post
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex">
        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <div className="container max-w-5xl mx-auto space-y-6">
            {/* Media Upload Section */}
            <Card className="p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Media Upload</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Upload up to 10 images or videos (Max 50MB each)</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {media.length} / 10
                </Badge>
              </div>

              <div className="space-y-4">
                {/* Upload Button */}
                {media.length < 10 && (
                  <label className="cursor-pointer">
                    <div className="border-2 border-dashed rounded-lg p-8 hover:border-primary/50 hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-4">
                          <Upload className="h-6 w-6 text-primary" />
                        </div>
                        <div className="text-center">
                          <p className="font-medium">Click to upload media</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG, GIF, MP4, MOV up to 50MB
                          </p>
                        </div>
                      </div>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleMediaUpload}
                      className="hidden"
                    />
                  </label>
                )}

                {/* Media Grid */}
                {media.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {media.map((item) => (
                      <Card key={item.id} className="p-3 space-y-3 border-2 hover:border-primary/50 transition-colors">
                        <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                          {item.type === "video" ? (
                            <video src={item.url} className="w-full h-full object-cover" />
                          ) : (
                            <Image src={item.url} alt="" fill className="object-cover" />
                          )}
                          <div className="absolute top-2 left-2">
                            <Badge variant="secondary" className="text-[10px] bg-black/70 text-white border-0">
                              {item.type === "video" ? <Video className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                            </Badge>
                          </div>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="absolute top-2 right-2 h-7 w-7"
                            onClick={() => removeMedia(item.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <div>
                          <Label className="text-xs mb-1.5">Alt Text (Optional)</Label>
                          <Input
                            placeholder="Describe this media..."
                            value={item.altText}
                            onChange={(e) => {
                              const updated = media.map(m =>
                                m.id === item.id ? { ...m, altText: e.target.value } : m
                              );
                              setMedia(updated);
                            }}
                            className="h-8 text-xs"
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Choose Accounts Section */}
            { user && <ChooseAccounts client={user} /> }

            {/* Caption Section */}
            <Card className="p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Caption</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Write your post caption</p>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    AI Generate
                  </Button>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="separate-captions" className="text-sm cursor-pointer">
                      Separate captions
                    </Label>
                    <Switch
                      id="separate-captions"
                      checked={separateCaptions}
                      onCheckedChange={setSeparateCaptions}
                    />
                  </div>
                </div>
              </div>

              {!separateCaptions ? (
                <div>
                  <Textarea
                    placeholder="Write your caption here... Use #hashtags and @mentions"
                    value={globalCaption}
                    onChange={(e) => setGlobalCaption(e.target.value)}
                    className="min-h-32 resize-none"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground">
                      {globalCaption.length} characters
                    </p>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        Add Emoji
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        Add Hashtags
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedAccounts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Select accounts first to write separate captions</p>
                    </div>
                  ) : (
                    selectedAccounts.map((accountId) => {
                      const account = availableAccounts.find(a => a.id === accountId);
                      if (!account) return null;
                      
                      return (
                        <Card key={accountId} className="p-3 border-2">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2.5">
                              <div className="relative">
                                <div className="w-7 h-7 rounded-full overflow-hidden border">
                                  <Image src={account.avatar} alt={account.username} width={28} height={28} className="object-cover" />
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background bg-background flex items-center justify-center">
                                  <Image
                                    src={getPlatformLogo(account.icon)}
                                    alt={account.platform}
                                    width={10}
                                    height={10}
                                    className="w-2 h-2 object-contain"
                                  />
                                </div>
                              </div>
                              <div>
                                <p className="font-semibold text-xs">{account.username}</p>
                                <p className="text-[10px] text-muted-foreground">{account.platform}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="text-[10px] text-muted-foreground">0 characters</p>
                              <Button variant="ghost" size="sm" className="text-[10px] h-6 px-2">
                                Use Global
                              </Button>
                            </div>
                          </div>
                          <Textarea
                            placeholder={`Caption for ${account.username}...`}
                            className="min-h-16 resize-none text-xs"
                          />
                        </Card>
                      );
                    })
                  )}
                </div>
              )}
            </Card>

            {/* First Comment Section */}
            <Card className="p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">First Comment</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Add a first comment to your post (optional)</p>
                </div>
              </div>
              <Textarea
                placeholder="Add a first comment that will be posted immediately after your post goes live..."
                className="min-h-24 resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">0 characters</p>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  Add Emoji
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Sidebar - Compact Account Preview */}
        <div className="w-20 border-l bg-muted/50 p-3 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
          
          {selectedAccounts.length === 0 ? (
            <div className="text-center py-12">
              <div className="rounded-full bg-muted p-3 w-fit mx-auto mb-2">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="space-y-3">
                {selectedAccounts.map((accountId) => {
                  const account = availableAccounts.find(a => a.id === accountId);
                  if (!account) return null;

                  return (
                    <TooltipProvider key={accountId}>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <div className="relative cursor-pointer hover:scale-110 transition-transform">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border hover:border-primary">
                              <Image src={account.avatar} alt={account.username} width={48} height={48} className="object-cover" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-background bg-background flex items-center justify-center shadow-sm">
                              <Image
                                src={getPlatformLogo(account.icon)}
                                alt={account.platform}
                                width={16}
                                height={16}
                                className="w-4 h-4 object-contain"
                              />
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="p-0 w-80 border-2">
                          {/* Platform-specific preview */}
                          <div className="bg-background">
                            {/* Post Header */}
                            <div className="p-4 border-b">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden border">
                                  <Image src={account.avatar} alt={account.username} width={40} height={40} className="object-cover" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-sm">{account.username}</p>
                                  <p className="text-xs text-muted-foreground">Just now</p>
                                </div>
                                <Badge className={`text-xs ${getPlatformBadgeColor(account.platform)}`}>
                                  {account.platform}
                                </Badge>
                              </div>
                            </div>

                            {/* Post Media */}
                            {media.length > 0 && (
                              <div className="relative aspect-square bg-muted">
                                {media[0].type === "video" ? (
                                  <video src={media[0].url} className="w-full h-full object-cover" controls />
                                ) : (
                                  <Image src={media[0].url} alt="" fill className="object-cover" />
                                )}
                                {media.length > 1 && (
                                  <div className="absolute top-3 right-3">
                                    <Badge className="bg-black/70 text-white border-0">
                                      1 / {media.length}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Post Caption */}
                            <div className="p-4">
                              <p className="text-sm whitespace-pre-wrap">
                                <span className="font-semibold">{account.username}</span>{" "}
                                {globalCaption || "No caption yet..."}
                              </p>
                              {!globalCaption && (
                                <p className="text-xs text-muted-foreground mt-2 italic">
                                  Add a caption to see the full preview
                                </p>
                              )}
                            </div>

                            {/* Platform-specific footer */}
                            <div className="px-4 pb-4 flex items-center gap-4 text-muted-foreground">
                              <div className="flex items-center gap-1.5 text-xs">
                                <div className="w-5 h-5 rounded-full border flex items-center justify-center">
                                  ❤️
                                </div>
                                <span>0</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs">
                                <div className="w-5 h-5 rounded-full border flex items-center justify-center">
                                  💬
                                </div>
                                <span>0</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs">
                                <div className="w-5 h-5 rounded-full border flex items-center justify-center">
                                  ↗️
                                </div>
                              </div>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}