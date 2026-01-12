import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRecentClients, trackClientAccess } from "../api/recent-clients.api";
import { TrackClientAccessPayload } from "../types/recent-clients.types";

export const recentClientsKeys = {
  all: ["recent-clients"] as const,
  list: () => [...recentClientsKeys.all, "list"] as const,
};

export function useRecentClients() {
  return useQuery({
    queryKey: recentClientsKeys.list(),
    queryFn: getRecentClients,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useTrackClientAccessMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TrackClientAccessPayload) => trackClientAccess(payload),
    onSuccess: () => {
      // Invalidate recent clients to refresh the list
      queryClient.invalidateQueries({ queryKey: recentClientsKeys.list() });
    },
  });
}
