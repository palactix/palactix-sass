"use client";

import { useState, useEffect } from "react";
import { Plus, Check, AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import Image from "next/image";
import { getPlatformIcon } from "@/lib/utils/platform-icons";

import { PlatformSetupDialog } from "./PlatformSetupDialog";
import { Platform } from "@/types/platform";
import { ConnectedPlatform } from "./types";

interface ConnectedPlatformsProps {
  platforms: ConnectedPlatform[];
}

export function ConnectedPlatforms({ platforms: initialPlatforms }: ConnectedPlatformsProps) {
  const [platforms, setPlatforms] = useState<ConnectedPlatform[]>(initialPlatforms);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPlatformId, setEditingPlatformId] = useState<string | null>(null);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [platformToEdit, setPlatformToEdit] = useState<Platform | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    setPlatforms(initialPlatforms);
  }, [initialPlatforms]);

  const activePlatforms = platforms.filter(p => p.connected);

  const handleRemovePlatform = (id: string) => {
    // TODO: Implement API call
    setPlatforms(prev => prev.map(p => p.id === id ? { ...p, connected: false } : p));
    toast.success("Platform removed");
  };

  const handleAddPlatform = (id: string, appId: string) => {
    // TODO: Implement API call
    setPlatforms(prev => prev.map(p => p.id === id ? { ...p, connected: true, appId, lastUsed: "Just now" } : p));
    setIsAddModalOpen(false);
    toast.success(`${platforms.find(p => p.id === id)?.name} connected successfully`);
  };

  const handleChangeCredentials = (id: string, appId: string) => {
    // TODO: Implement API call
    setPlatforms(prev => prev.map(p => p.id === id ? { ...p, appId } : p));
    setEditingPlatformId(null);
    setPlatformToEdit(null);
    toast.success("Credentials updated. Clients notified to reconnect.", {
      duration: 5000,
      icon: <Check className="h-4 w-4 text-green-500" />
    });
  };

  const initiateChangeCredentials = (platform: Platform) => {
    setPlatformToEdit(platform);
    setIsWarningModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Connected Platforms</h3>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Platform
        </Button>
      </div>

      <div className="grid gap-4">
        {activePlatforms.map(platform => (
          <Card key={platform.id} className="p-0 overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="p-6 flex-1 flex items-start gap-4">
                <div className={`p-3 rounded-full bg-background border shadow-sm`}>
                  <Image
                    src={getPlatformIcon(platform.icon, theme)}
                    alt={platform.name}
                    width={24}
                    height={24}
                    className="h-6 w-6 object-contain"
                    unoptimized
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-lg">{platform.name}</h4>
                    <Badge variant="secondary" className="text-green-600 bg-green-50 hover:bg-green-50">Connected</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>Last used {platform.lastUsed}</span>
                    <span>•</span>
                    <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">App ID: {platform.appId}</span>
                  </div>
                </div>
              </div>
              <div className="bg-muted/30 p-4 sm:w-[200px] flex flex-row sm:flex-col items-center sm:justify-center gap-2 border-t sm:border-t-0 sm:border-l">
                <Button variant="outline" size="sm" className="w-full" onClick={() => initiateChangeCredentials(platform)}>
                  Change Credentials
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="mr-2 h-4 w-4" /> Remove
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove {platform.name}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Removing {platform.name} will <span className="font-bold text-destructive">disable posting</span> for all clients on this platform.
                        You can re-add it later.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleRemovePlatform(platform.id)} className="bg-destructive hover:bg-destructive/90">Remove Platform</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        ))}
        {activePlatforms.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed rounded-xl text-muted-foreground">
            No platforms connected. Add one to get started.
          </div>
        )}
      </div>

      {/* Add Platform Modal */}
      <PlatformSetupDialog
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        mode="add"
        platforms={platforms.filter(p => !p.connected)}
        onComplete={handleAddPlatform}
      />

      {/* Warning Modal for Change Credentials */}
      <AlertDialog open={isWarningModalOpen} onOpenChange={setIsWarningModalOpen}>
        <AlertDialogContent className="border-l-4 border-destructive">
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertTriangle className="h-5 w-5" />
              <AlertDialogTitle>Warning: This will disconnect ALL your clients</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="space-y-3 text-foreground">
              <p>Changing credentials invalidates every existing connection to <strong>{platformToEdit?.name}</strong>.</p>
              <p>Every client will need to re-authorize with the new app.</p>
              <p className="font-medium">This usually takes 1–3 days and cannot be undone.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => {
                setIsWarningModalOpen(false);
                setEditingPlatformId(platformToEdit?.id || null);
              }}
            >
              Yes, Change Credentials
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Credentials Modal */}
      {platformToEdit && (
        <PlatformSetupDialog
          open={!!editingPlatformId}
          onOpenChange={(open) => {
            if (!open) {
              setEditingPlatformId(null);
              setPlatformToEdit(null);
            }
          }}
          mode="edit"
          initialPlatform={platformToEdit}
          platforms={[platformToEdit]}
          onComplete={handleChangeCredentials}
        />
      )}
    </div>
  );
}
