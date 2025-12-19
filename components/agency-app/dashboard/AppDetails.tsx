"use client";

import { Copy, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useMyAgencyApp, useChannels } from "@/features/agency-app/api/agency-app.queries";
import { useState } from "react";

export function AppDetails() {
  const { data: myApp } = useMyAgencyApp();
  const { data: allChannels } = useChannels();


  const [description, setDescription] = useState(myApp?.description);

  const handleCopyInfo = () => {
    if (!myApp || !allChannels) return;

    const appName = myApp.name || "My Agency App";
    
    // Derive active platforms from data
    const activePlatforms = allChannels.map(channel => {
      const appChannel = myApp.channels?.find(c => c.channel_id === channel.id);
      const isConnected = !!(appChannel && (appChannel.client_id || appChannel.client_secret));
      return {
        name: channel.name,
        appId: appChannel?.client_id,
        connected: isConnected
      };
    }).filter(p => p.connected);

    const info = `App Name: ${appName}\nRedirect URI: https://palactix.com/oauth/meta\n\n` + 
      activePlatforms.map(p => `${p.name} App ID: ${p.appId}`).join('\n');
      
    navigator.clipboard.writeText(info);
    toast.success("App info copied to clipboard");
  };

  // TODO: Implement save description logic (e.g. on blur or a save button, or auto-save)
  // For now, it just updates local state.

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        App Details <span className="text-sm font-normal text-muted-foreground ml-2">(Optional — improves trust on some consent screens)</span>
      </h3>
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="space-y-3">
              <Label>App Logo</Label>
              <div className="h-32 w-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group relative overflow-hidden">
                <Upload className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs">Upload PNG</span>
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium">
                  512x512
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <Label>App Description</Label>
              <Textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] resize-none"
                placeholder="Enter a description for your app..."
              />
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={handleCopyInfo}>
                  <Copy className="mr-2 h-3 w-3" /> Copy App Info
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
