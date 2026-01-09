"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Check, ChevronRight, Copy, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useUpdateCredentialsMutation, useMyAgencyApp, useChannels, useVerifyPlatformCredentialsMutation } from "@/features/agency-app/api/agency-app.queries";
import { useWizardStore } from "@/features/agency-app/stores/wizard.store";
import { toast } from "sonner";
import { getPlatformIcon } from "@/lib/utils/platform-icons";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Channel } from "@/features/agency-app/types/agency-app.types";



export function Step3Credentials() {
  const { appId, setStep } = useWizardStore();
  const { data: myApp } = useMyAgencyApp();
  const { data: allChannels } = useChannels();
  const { mutate, isPending } = useUpdateCredentialsMutation();
  const { mutate: verifyMutate, isPending: isVerifying } = useVerifyPlatformCredentialsMutation();
  
  const { theme } = useTheme();
  
  const [credentials, setCredentials] = useState<Record<string, Record<string, string>>>({});
  const [verifying, setVerifying] = useState<string | null>(null);
  const [verified, setVerified] = useState<string[]>([]);

  // Update when myApp.channels or allChannels change
  useEffect(() => {
    if (myApp?.channels && allChannels) {
      // Populate credentials from existing data
      const creds: Record<string, Record<string, string>> = {};
      myApp.channels.forEach(appChannel => {
        const channel = allChannels.find(c => c.id === appChannel.channel_id);
        if (channel && (appChannel.client_id || appChannel.client_secret)) {
          creds[channel.id.toString()] = {
            client_id: appChannel.client_id || "",
            client_secret: appChannel.client_secret || ""
          };
        }
      });
      setTimeout(() => setCredentials(creds), 0);
    }
  }, [myApp?.channels, allChannels]);

  const handleCredentialChange = (platformId: string, field: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [platformId]: {
        ...(prev[platformId] || {}),
        [field]: value
      }
    }))
    setVerified(prev => prev.filter(id => id !== platformId));
  }

  const handleVerify = (platform: Channel) => {
    setVerifying(platform.id.toString());
    verifyMutate({
      platform: platform.slug,
      client_id: credentials[platform.id]?.client_id || "",
      client_secret: credentials[platform.id]?.client_secret || ""
    }, {
      onSuccess: (data) => {
        setVerifying(null)
        if (data.valid) {
          setVerified(prev => [...prev, platform.id.toString()])
          toast.success("Credentials verified")
        } else {
          toast.error("Invalid credentials, please check and try again.")
        }
      },
      onError: (error) => {
        setVerifying(null)
        toast.error(error.message || "Failed to verify credentials")
      }
    });
  }

  const prevStep = () => setStep(2);

  const handleStep3Submit = () => {
    if (!appId || !allChannels || !myApp?.channels) return;
    
    // Transform credentials map to array for API
    const payload = myApp.channels.map(appChannel => {
      const creds = credentials[appChannel.channel_id.toString()];
      return {
        platform_id: appChannel.channel_id,
        credentials: creds || { client_id: "", client_secret: "" }
      };
    }).filter(p => p.credentials.client_id || p.credentials.client_secret);

    mutate({ appId, payload: { credentials: payload } }, {
      onSuccess: () => {
        setStep(4)
        toast.success("Credentials saved")
      },
      onError: (err) => toast.error(err.message)
    })
  }

  const handleCopy = (platformSlug: string) => () => {
    const redirectUri = `https://api.palactix.com/channels/${platformSlug}/callback`;
    navigator.clipboard.writeText(redirectUri).then(() => {
      toast.success("Redirect URI copied to clipboard");
    }).catch(() => {
      toast.error("Failed to copy Redirect URI");
    });
  }


  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Add Platform Credentials</CardTitle>
          <CardDescription>Configure your app for each platform. We&apos;ve provided direct links to the developer portals.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full" defaultValue={myApp?.channels?.[0]?.channel_id.toString()}>
            {myApp?.channels?.map((appChannel) => {
              const channel = allChannels?.find(c => c.id === appChannel.channel_id);
              if (!channel) return null;
              
              const channelIdStr = channel.id.toString();
              const isVerified = verified.includes(channelIdStr);
              const iconUrl = getPlatformIcon(channel.icon, theme);
              
              return (
                <AccordionItem key={channelIdStr} value={channelIdStr}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      {iconUrl ? (
                        <Image 
                          width={20} 
                          height={20} 
                          src={iconUrl} 
                          alt={channel.name} 
                          className="h-5 w-5 object-contain" 
                          unoptimized
                        />
                      ) : (
                        <div className="h-5 w-5 bg-muted rounded-full" />
                      )}
                      <span>{channel.name}</span>
                      {isVerified && <Check className="h-4 w-4 text-green-500 ml-2" />}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4 px-1">
                    <div className="bg-muted/50 p-4 rounded-lg border space-y-3">
                      <div className="flex items-start gap-3">
                          <div className="bg-primary/10 p-2 rounded-full text-primary">
                              <ExternalLink className="h-4 w-4" />
                          </div>
                          <div>
                              <h4 className="font-medium">Create App on {channel.name}</h4>
                              <p className="text-sm text-muted-foreground mb-2">
                                  Go to the developer portal and create a new app with these settings.
                              </p>
                              <Button variant="outline" size="sm" className="gap-2" asChild>
                                  <Link href="#" target="_blank">Open {channel.name} Guide <ExternalLink className="h-3 w-3" /></Link>
                              </Button>
                          </div>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <div className="grid gap-2">
                          <Label>Redirect URI (Copy this)</Label>
                          <div className="flex gap-2">
                              <Input value={`https://api.palactix.com/channels/${channel.slug}/callback`} readOnly className="bg-muted" />
                              <Button variant="outline" size="icon" onClick={handleCopy(channel.slug)}><Copy className="h-4 w-4" /></Button>
                          </div>
                      </div>
                      <div className="grid gap-2">
                          <Label>App ID / Client Key</Label>
                          <Input 
                            placeholder={`Paste ${channel.name} App ID`} 
                            value={credentials[channelIdStr]?.client_id || ""}
                            name={`app_client_id_${channelIdStr}`}
                            autoComplete="new-password"
                            onChange={(e) => handleCredentialChange(channelIdStr, "client_id", e.target.value)}
                          />
                      </div>
                      <div className="grid gap-2">
                          <Label>App Secret</Label>
                          <Input 
                            type="password" 
                            placeholder={`Paste ${channel.name} App Secret`} 
                            name={`app_client_secret_${channelIdStr}`}
                            autoComplete="new-password"
                            value={credentials[channelIdStr]?.client_secret || ""}
                            onChange={(e) => handleCredentialChange(channelIdStr, "client_secret", e.target.value)}
                          />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button 
                          onClick={() => handleVerify(channel)} 
                          disabled={isVerified || verifying === channelIdStr}
                          className={isVerified ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                          {verifying === channelIdStr ? (
                              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Validating...</>
                          ) : isVerified ? (
                              <><Check className="mr-2 h-4 w-4" /> Verified</>
                          ) : (
                              "Validate Credentials"
                          )}
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={prevStep}>Back</Button>
          <Button onClick={handleStep3Submit} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Next Step <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
