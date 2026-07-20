import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceService } from '../services/marketplace-service';
import { useAuth } from '../../../providers/auth-provider';

export function useOpenJobs(query?: { wardCode?: string; municipalityId?: string; showAll?: boolean }) {
  return useQuery({
    queryKey: ['marketplace', 'open-jobs', query],
    queryFn: () => marketplaceService.getOpenJobs(query),
  });
}

export function useClaimJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => marketplaceService.claimJob(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['marketplace', 'open-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['procurement', 'dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['procurement', 'request', data._id] });
    },
  });
}

export function useRejectJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => marketplaceService.rejectJob(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['marketplace', 'open-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['procurement', 'dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['procurement', 'request', data._id] });
    },
  });
}

export function useUpdateAvailability() {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();

  return useMutation({
    mutationFn: (municipalityId: string) => marketplaceService.updateAvailability(municipalityId),
    onSuccess: async () => {
      await refreshUser();
      queryClient.invalidateQueries({ queryKey: ['marketplace', 'open-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['procurement', 'dashboard'] });
    },
  });
}
