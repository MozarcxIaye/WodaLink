import { apiClient } from '../../../api/client';
import type { DocumentRequest } from '../../../types';

export const marketplaceService = {
  updateAvailability: async (municipalityId: string) => {
    const response = await apiClient.patch('/marketplace/availability', { municipalityId });
    return response.data;
  },

  getOpenJobs: async (query?: { wardCode?: string; municipalityId?: string; showAll?: boolean }) => {
    const response = await apiClient.get<DocumentRequest[]>('/marketplace/jobs', { params: query });
    return response.data;
  },

  claimJob: async (id: string) => {
    const response = await apiClient.post<DocumentRequest>(`/marketplace/request/${id}/claim`);
    return response.data;
  },

  rejectJob: async (id: string) => {
    const response = await apiClient.delete<DocumentRequest>(`/marketplace/request/${id}/reject`);
    return response.data;
  },
};
