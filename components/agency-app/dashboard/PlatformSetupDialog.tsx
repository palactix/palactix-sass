"use client";

import { useState } from "react";
import { Check, ExternalLink, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import Image from "next/image";
import { getPlatformIcon } from "@/lib/utils/platform-icons";
import { Platform } from "@/types/platform";


interface PlatformSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  platforms: Platform[];
  initialPlatform?: Platform;
  onComplete: (id: string, appId: string) => void;
}

export function PlatformSetupDialog({
  open,
  onOpenChange,
  mode,
  platforms,
  initialPlatform,
  onComplete
}: PlatformSetupDialogProps) {
  const [step, setStep] = useState(mode === 'edit' ? 2 : 1);
  const [selectedPlatformId, setSelectedPlatformId] = useState<string | null>(initialPlatform?.id || null);
  const [appId, setAppId] = useState("");
  const [appSecret, setAppSecret] = useState("");
  const [verifying, setVerifying] = useState(false);
  const { theme } = useTheme();

  const selectedPlatform = platforms.find(p => p.id === selectedPlatformId);

  const handleNext = () => setStep(2);

  const handleVerify = () => {
    if (!selectedPlatform) return;
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      onComplete(selectedPlatform.id, appId || "123456789012345"); // Mock App ID if empty
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after transition
    setTimeout(() => {
      setStep(mode === 'edit' ? 2 : 1);
      if (mode === 'add') setSelectedPlatformId(null);
      setAppId("");
      setAppSecret("");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Platform' : `Change ${selectedPlatform?.name} Credentials`}</DialogTitle>
          <DialogDescription>
            {step === 1 ? "Choose a platform to connect." : "Enter your developer app credentials."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 1 && (
            <div className="grid gap-3">
              {platforms.map(platform => (
                <div
                  key={platform.id}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${selectedPlatformId === platform.id ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
                  onClick={() => setSelectedPlatformId(platform.id)}
                >
                  <div className={`p-2 rounded-full bg-background border`}>
                    <Image
                      src={getPlatformIcon(platform.icon, theme)}
                      alt={platform.name}
                      width={20}
                      height={20}
                      className="h-5 w-5 object-contain"
                      unoptimized
                    />
                  </div>
                  <span className="font-medium">{platform.name}</span>
                  {selectedPlatformId === platform.id && <Check className="ml-auto h-4 w-4 text-primary" />}
                </div>
              ))}
            </div>
          )}

          {step === 2 && selectedPlatform && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg border space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full text-primary">
                    <ExternalLink className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Create App on {selectedPlatform.name}</h4>
                    <Button variant="link" className="h-auto p-0 text-xs" asChild>
                      <a href="#" target="_blank">Open Developer Guide</a>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Redirect URI</Label>
                  <div className="flex gap-2">
                    <Input value="https://palactix.com/oauth/meta" readOnly className="bg-muted text-xs font-mono" />
                    <Button variant="outline" size="icon" className="h-9 w-9"><Copy className="h-4 w-4" /></Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">App ID / Client Key</Label>
                  <Input
                    placeholder={`Paste ${selectedPlatform.name} App ID`}
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">App Secret</Label>
                  <Input
                    type="password"
                    placeholder={`Paste ${selectedPlatform.name} App Secret`}
                    value={appSecret}
                    onChange={(e) => setAppSecret(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {step === 1 ? (
            <Button onClick={handleNext} disabled={!selectedPlatformId}>Next Step</Button>
          ) : (
            <div className="flex justify-between w-full">
              {mode === 'add' && <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>}
              <Button onClick={handleVerify} disabled={verifying} className="ml-auto">
                {verifying ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</> : "Verify & Connect"}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
