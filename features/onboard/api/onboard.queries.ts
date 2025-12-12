import { useQuery, useMutation } from "@tanstack/react-query";
import { getOnboardInfo, getChannelConnectUrl } from "./onboard.api";

export const onboardKeys = {
  all: ["onboard"] as const,
  info: (orgId: string) => [...onboardKeys.all, "info", orgId] as const,
};

export function useOnboardInfo(orgId: string | null) {
  return useQuery({
    queryKey: onboardKeys.info(orgId!),
    queryFn: () => getOnboardInfo(orgId!),
    enabled: !!orgId,
  });
}

export function useChannelConnectMutation() {
  return useMutation({
    mutationFn: (channelSlug: string) => getChannelConnectUrl(channelSlug),
  });
}
