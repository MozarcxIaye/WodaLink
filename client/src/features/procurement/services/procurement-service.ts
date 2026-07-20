import { apiClient } from '../../../api/client';
import type { DocumentRequest, DocumentType } from '../../../types';

export interface CreateRequestPayload {
  wardCode: string;
  documentType: DocumentType;
  poaUrl: string;
  escrowAmount: number;
}

export const procurementService = {
  create: async (payload: CreateRequestPayload) => {
    const response = await apiClient.post<DocumentRequest>('/procurement', payload);
    return response.data;
  },

  findAll: async () => {
    const response = await apiClient.get<DocumentRequest[]>('/procurement/requests');
    return response.data;
  },

  findOne: async (id: string) => {
    const response = await apiClient.get<DocumentRequest>(`/procurement/request/${id}`);
    return response.data;
  },

  assignRunner: async (id: string, runnerId: string) => {
    const response = await apiClient.patch<DocumentRequest>(`/procurement/request/${id}/assign`, { runnerId });
    return response.data;
  },

  uploadScan: async (id: string, scanUrl: string) => {
    const response = await apiClient.patch<DocumentRequest>(`/procurement/request/${id}/upload`, { scanUrl });
    return response.data;
  },

  cancel: async (id: string) => {
    const response = await apiClient.delete<DocumentRequest>(`/procurement/request/${id}`);
    return response.data;
  },

  getDashboard: async () => {
    const response = await apiClient.get('/procurement/dashboard');
    return response.data;
  },

  startProcessing: async (id: string) => {
    const response = await apiClient.patch<DocumentRequest>(`/procurement/request/${id}/start`);
    return response.data;
  },

  pay: async (id: string) => {
    const response = await apiClient.post<{ paymentUrl: string }>(`/procurement/request/${id}/pay`);
    return response.data;
  },

  verifyPayment: async (status: string, requestId: string, pidx: string) => {
    const response = await apiClient.get<{ message: string; requestId: string; isPaid: boolean }>(
      '/procurement/payment/verify',
      {
        params: {
          status,
          purchase_order_id: requestId,
          pidx,
        },
      },
    );
    return response.data;
  },

  getEscalations: async () => {
    const response = await apiClient.get<DocumentRequest[]>('/procurement/escalations');
    return response.data;
  },

  escalateRequest: async (id: string, adminNote?: string) => {
    const response = await apiClient.post<DocumentRequest>(`/procurement/request/${id}/escalate`, { adminNote });
    return response.data;
  },

  resolveEscalation: async (id: string, adminNote?: string) => {
    const response = await apiClient.post<DocumentRequest>(`/procurement/request/${id}/resolve-escalation`, { adminNote });
    return response.data;
  },
};
