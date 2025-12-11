import { useQuery } from "@tanstack/react-query";
import { getOnboardInfo } from "./onboard.api";

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
