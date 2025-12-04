"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getChannels,
  getMyAgencyApp,
  createApp,
  updateAppName,
  updateAppPlatforms,
  updateAppCredentials,
  activateApp,
  sendAppToReview,
} from "./agency-app.api";
import type {
  CreateAppPayload,
  CreateAppResponse,
  UpdateAppNamePayload,
  UpdateAppNameResponse,
  UpdatePlatformsPayload,
  UpdatePlatformsResponse,
  UpdateCredentialsPayload,
  UpdateCredentialsResponse,
  ActivateAppResponse,
  ReviewAppResponse,
  ChannelListResponse,
  MyAgencyAppResponse,
} from "../types/agency-app.types";

export const agencyAppKeys = {
  all: ["agency-app"] as const,
  channels: ["agency-app", "channels"] as const,
  myApp: ["agency-app", "my-app"] as const,
};

export function useChannels() {
  return useQuery<ChannelListResponse, Error>({
    queryKey: agencyAppKeys.channels,
    queryFn: getChannels,
    staleTime: 1000 * 60 * 60, // 1 hour (channels rarely change)
  });
}

export function useMyAgencyApp() {
  return useQuery<MyAgencyAppResponse, Error>({
    queryKey: agencyAppKeys.myApp,
    queryFn: getMyAgencyApp,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 0
  });
}

export function useCreateAppMutation() {
  const queryClient = useQueryClient();
  return useMutation<CreateAppResponse, Error, CreateAppPayload>({
    mutationFn: createApp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agencyAppKeys.myApp });
    },
  });
}

export function useUpdateAppNameMutation() {
  const queryClient = useQueryClient();
  return useMutation<UpdateAppNameResponse, Error, { appId: string; payload: UpdateAppNamePayload }>({
    mutationFn: ({ appId, payload }) => updateAppName(appId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agencyAppKeys.myApp });
    },
  });
}

export function useUpdatePlatformsMutation() {
  const queryClient = useQueryClient();
  return useMutation<UpdatePlatformsResponse, Error, { appId: string; payload: UpdatePlatformsPayload }>({
    mutationFn: ({ appId, payload }) => updateAppPlatforms(appId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agencyAppKeys.myApp });
    },
  });
}

export function useUpdateCredentialsMutation() {
  const queryClient = useQueryClient();
  return useMutation<UpdateCredentialsResponse, Error, { appId: string; payload: UpdateCredentialsPayload }>({
    mutationFn: ({ appId, payload }) => updateAppCredentials(appId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agencyAppKeys.myApp });
    },
  });
}

export function useActivateAppMutation() {
  const queryClient = useQueryClient();
  return useMutation<ActivateAppResponse, Error, string>({
    mutationFn: activateApp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agencyAppKeys.myApp });
    },
  });
}

export function useSendAppToReviewMutation() {
  const queryClient = useQueryClient();
  return useMutation<ReviewAppResponse, Error, string>({
    mutationFn: sendAppToReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agencyAppKeys.myApp });
    },
  });
}