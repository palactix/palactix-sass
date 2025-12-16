"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useChannelConnectMutation } from "@/features/onboard/api/onboard.queries";
import { Channel } from "@/features/agency-app/types/agency-app.types";
import { toast } from "sonner";

interface UseChannelConnectOptions {
  onSuccess?: (channel: Channel) => void;
  onError?: (error: Error) => void;
  redirectPath?: string;
}

export function useChannelConnect(options: UseChannelConnectOptions = {}) {
  const router = useRouter();
  const connectMutation = useChannelConnectMutation();
  const [connectingChannel, setConnectingChannel] = useState<string | null>(null);

  const {
    onSuccess,
    onError,
    redirectPath,
  } = options;

  // Listen for OAuth success message from popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "OAUTH_SUCCESS") {
        setConnectingChannel(null);
        toast.success("Account connected successfully!");

        // Call custom success callback
        if (onSuccess) {
          // We don't have the channel object here, so we'll pass null
          // The parent component can handle this as needed
          onSuccess(null as unknown as Channel);
        }

        // Redirect if specified
        if (redirectPath) {
          router.push(redirectPath);
        }
      } else if (event.data?.type === "OAUTH_ERROR") {
        setConnectingChannel(null);
        const errorMessage = event.data?.message || "Failed to connect account";
        toast.error(errorMessage);

        // Call custom error callback
        if (onError) {
          onError(new Error(errorMessage));
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router, onSuccess, onError, redirectPath]);

  const connectChannel = useCallback(async (channel: Channel) => {
    if (connectingChannel) return; // Prevent multiple clicks

    setConnectingChannel(channel.slug);

    try {
      const oauthUrl = await connectMutation.mutateAsync(channel.slug);

      // Open OAuth URL in a small popup window
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        oauthUrl.url,
        "oauth_popup",
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
      );

      // Check if popup was blocked
      if (!popup) {
        toast.error("Popup was blocked. Please allow popups for this site.");
        setConnectingChannel(null);
        return;
      }

      // Poll to check if popup was closed without completing
      const pollTimer = setInterval(() => {
        if (popup.closed) {
          clearInterval(pollTimer);
          setConnectingChannel(null);
        }
      }, 500);
    } catch (error) {
      toast.error("Failed to initiate connection. Please try again.");
      setConnectingChannel(null);

      // Call custom error callback
      if (onError) {
        onError(error as Error);
      }
    }
  }, [connectingChannel, connectMutation, onError]);

  return {
    connectChannel,
    connectingChannel,
    isConnecting: !!connectingChannel,
  };
}