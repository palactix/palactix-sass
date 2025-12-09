import { useQuery } from "@tanstack/react-query";
import { getRoles } from "./roles.api";

export const rolesKeys = {
  all: ["roles"] as const,
  list: () => [...rolesKeys.all, "list"] as const,
};

export function useRoles() {
  return useQuery({
    queryKey: rolesKeys.list(),
    queryFn: getRoles,
    staleTime: 5 * 60 * 1000, // 5 minutes - roles don't change often
  });
}
