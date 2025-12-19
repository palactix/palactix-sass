"use client";

import { useState, useEffect } from "react";
import { Pencil, Save, X, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { AppStatus } from "@/features/agency-app/types/agency-app.types";
import { useTheme } from "next-themes";
import Image from "next/image";
import { getPlatformIcon } from "@/lib/utils/platform-icons";

import { useUpdateAppNameMutation } from "@/features/agency-app/api/agency-app.queries";
import { Platform } from "@/types/platform";

interface DashboardHeaderProps {
  appId: string;
  appName: string;
  status: AppStatus;
  platforms: Platform[];
}

export function DashboardHeader({ appId, appName: initialAppName, status, platforms }: DashboardHeaderProps) {
  const [appName, setAppName] = useState(initialAppName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(initialAppName);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewPlatformId, setPreviewPlatformId] = useState<string>(platforms[0]?.id || "");
  const { theme } = useTheme();
  
  const updateAppNameMutation = useUpdateAppNameMutation();

  useEffect(() => {
    setAppName(initialAppName);
    setTempName(initialAppName);
  }, [initialAppName]);

  const previewPlatform = platforms.find(p => p.id === previewPlatformId) || platforms[0];

  const handleSaveName = () => {
    if (!tempName.trim()) {
      toast.error("App name cannot be empty");
      return;
    }

    updateAppNameMutation.mutate(
      { appId, payload: { name: tempName } },
      {
        onSuccess: (data) => {
          setAppName(data.name);
          setIsEditingName(false);
          toast.success("App name updated");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update app name");
        }
      }
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 justify-between">
      <div className="flex-1 space-y-4">
        <div className="flex items-start gap-4">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="text-3xl font-bold h-auto py-1 px-2 w-auto min-w-[300px]"
                autoFocus
                disabled={updateAppNameMutation.isPending}
              />
              <Button size="icon" onClick={handleSaveName} disabled={updateAppNameMutation.isPending}>
                {updateAppNameMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              </Button>
              <Button size="icon" variant="ghost" onClick={() => { setIsEditingName(false); setTempName(appName); }} disabled={updateAppNameMutation.isPending}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="group flex items-center gap-3 cursor-pointer" onClick={() => setIsEditingName(true)}>
              <h1 className="text-3xl font-bold tracking-tight border-b border-transparent group-hover:border-dashed group-hover:border-muted-foreground/50">{appName}</h1>
              <Pencil className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
          {status === AppStatus.REVIEW ? (
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 mt-2">In Review</Badge>
          ) : (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 mt-2">Live</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground max-w-md">
          This name appears on consent screens exactly as set in your developer app. Changing it here will not update existing connections.
        </p>
      </div>

      {/* Live Preview */}
      <div className="w-full lg:w-[400px]">
        <Collapsible open={isPreviewOpen} onOpenChange={setIsPreviewOpen} className="space-y-2">
          <div className="flex items-center justify-end">
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                {isPreviewOpen ? "Hide Preview" : "Show Live Preview"}
                <ChevronsUpDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <Card className="bg-muted/30 border-dashed overflow-hidden">
              <div className="p-3 border-b bg-muted/50 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Live Preview</span>
                <Select value={previewPlatformId} onValueChange={setPreviewPlatformId}>
                  <SelectTrigger className="h-7 w-[120px] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4 bg-background/50">
                {previewPlatform && (
                  <div className={`h-16 w-16 rounded-xl flex items-center justify-center bg-background border shadow-sm`}>
                    <Image
                      src={getPlatformIcon(previewPlatform.icon, theme)}
                      alt={previewPlatform.name}
                      width={32}
                      height={32}
                      className="h-8 w-8 object-contain"
                      unoptimized
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <p className="font-medium text-lg leading-tight">
                    <span className="font-bold">{appName}</span> wants to access your {previewPlatform?.name} account
                  </p>
                  <p className="text-xs text-muted-foreground">This is what your clients see — no Palactix branding.</p>
                </div>
                <div className="w-full space-y-2 pt-2 opacity-50 pointer-events-none">
                  <Button className="w-full" size="sm">Allow Access</Button>
                  <Button variant="ghost" className="w-full" size="sm">Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
