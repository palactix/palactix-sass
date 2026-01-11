import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '../api/dashboard.api';
import { useOrganizationStore } from '../stores/organization.store';

export function useDashboard() {
  const currentOrg = useOrganizationStore((state) => state.currentOrganization);

  return useQuery({
    queryKey: ['organization-dashboard', currentOrg?.slug],
    queryFn: () => {
      if (!currentOrg?.slug) throw new Error('No organization selected');
      return getDashboardData(currentOrg.slug);
    },
    enabled: !!currentOrg?.slug,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // refetch every 5 minutes
  });
}
