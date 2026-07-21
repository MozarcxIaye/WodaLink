import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { procurementService } from '../services/procurement-service';
import type { CreateRequestPayload } from '../services/procurement-service';

export function useProcurementDashboard() {
  return useQuery({
    queryKey: ['procurement', 'dashboard'],
    queryFn: procurementService.getDashboard,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useRequests() {
  return useQuery({
    queryKey: ['procurement', 'requests'],
    queryFn: procurementService.findAll,
  });
}

export function useRequest(id: string) {
  return useQuery({
    queryKey: ['procurement', 'request', id],
    queryFn: () => procurementService.findOne(id),
    enabled: !!id,
  });
}

export function useCreateRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRequestPayload) => procurementService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procurement', 'requests'] });
      queryClient.invalidateQueries({ queryKey: ['procurement', 'dashboard'] });
    },
  });
}

export function useCancelRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => procurementService.cancel(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['procurement', 'requests'] });
      queryClient.invalidateQueries({ queryKey: ['procurement', 'dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['procurement', 'request', data._id] });
    },
  });
}

export function useStartProcessing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => procurementService.startProcessing(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['procurement', 'requests'] });
      queryClient.invalidateQueries({ queryKey: ['procurement', 'dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['procurement', 'request', data._id] });
    },
  });
}

export function useMarkDocumentReady() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => procurementService.markDocumentReady(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['procurement', 'requests'] });
      queryClient.invalidateQueries({ queryKey: ['procurement', 'dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['procurement', 'request', data._id] });
    },
  });
}

export function useUploadScan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, scanUrl }: { id: string; scanUrl: string }) =>
      procurementService.uploadScan(id, scanUrl),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['procurement', 'requests'] });
      queryClient.invalidateQueries({ queryKey: ['procurement', 'dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['procurement', 'request', data._id] });
    },
  });
}

export function usePayForRequest() {
  return useMutation({
    mutationFn: (id: string) => procurementService.pay(id),
  });
}

export function useEscalations() {
  return useQuery({
    queryKey: ['procurement', 'escalations'],
    queryFn: procurementService.getEscalations,
  });
}

export function useEscalateRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, adminNote }: { id: string; adminNote?: string }) => procurementService.escalateRequest(id, adminNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procurement', 'escalations'] });
      queryClient.invalidateQueries({ queryKey: ['procurement', 'requests'] });
    },
  });
}

export function useResolveEscalation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, adminNote }: { id: string; adminNote?: string }) => procurementService.resolveEscalation(id, adminNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procurement', 'escalations'] });
      queryClient.invalidateQueries({ queryKey: ['procurement', 'requests'] });
    },
  });
}
