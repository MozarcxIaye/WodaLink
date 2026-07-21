export type UserRole = 'expat' | 'runner' | 'admin';

export type RequestStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'DOCUMENT_READY' | 'COMPLETED' | 'CANCELLED';

export type DocumentType = 'BIRTH_CERTIFICATE' | 'MARRIAGE_CERTIFICATE' | 'POLICE_CLEARANCE' | 'OTHER';

export interface RunnerMetadata {
  municipalityId: string;
  rating: number;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  isVerified: boolean;
  runnerMetadata?: RunnerMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentRequest {
  _id: string;
  expatId: string | User;
  runnerId?: string | User;
  status: RequestStatus;
  wardCode: string;
  documentType: DocumentType;
  poaUrl: string;
  escrowAmount: number;
  scanUrl?: string;
  isPaid: boolean;
  isEscalated?: boolean;
  escalationLevel?: 'low' | 'medium' | 'high';
  escalationReason?: string;
  adminNote?: string;
  escalatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  activeCount?: number;
  completedTotal?: number;
  pendingApprovalCount?: number;
  activeProcessingCount?: number;
}

export interface RunnerDashboardData {
  summary: {
    activeCount: number;
    completedTotal: number;
  };
  activeJobs: DocumentRequest[];
  completedHistory: DocumentRequest[];
}

export interface ExpatDashboardData {
  summary: {
    pendingApprovalCount: number;
    activeProcessingCount: number;
  };
  openRequests: DocumentRequest[];
  history: DocumentRequest[];
}

export interface AuthResponse {
  accessToken: string;
  user?: User; // returned on login
  email?: string; // returned on register
  role?: UserRole; // returned on register
  message: string;
}
