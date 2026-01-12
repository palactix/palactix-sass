import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { CLIENT_ROUTES } from '@/utils/constants/api-routes';
import { buildApiUrl } from '@/lib/utils/api-url';
import { Client } from '../types/client.types';

async function getClientById(clientId: string) {
  const url = buildApiUrl(CLIENT_ROUTES.DELETE, { userId: clientId });
  const res = await api.get<Client>(url);
  return res.data;
}

export function useCurrentClient(clientId: string | null) {
  return useQuery({
    queryKey: ['client', clientId],
    queryFn: () => getClientById(clientId!),
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
