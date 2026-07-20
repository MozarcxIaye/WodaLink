import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import type { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    municipalityId?: string;
  }) => Promise<void>;
  verifyKyc: (documentType: string, documentUrl: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const response = await apiClient.get<User>('/identity/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout();
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const response = await apiClient.get<User>('/identity/me');
          setUser(response.data);
        } catch (error) {
          console.error('Session restore failed:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<{ accessToken: string; user: User; message: string }>('/identity/login', {
        email,
        password,
      });
      const jwt = response.data.accessToken;
      localStorage.setItem('token', jwt);
      setToken(jwt);
      setUser(response.data.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: {
    email: string;
    password: string; // RegisterUserDto uses password
    name: string;
    role: UserRole;
    municipalityId?: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<{ accessToken: string; message: string }>('/identity/register', payload);
      const jwt = response.data.accessToken;
      localStorage.setItem('token', jwt);
      setToken(jwt);
      // After register, let's fetch profile to populate the user state
      const meResponse = await apiClient.get<User>('/identity/me');
      setUser(meResponse.data);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyKyc = async (documentType: string, documentUrl: string) => {
    try {
      await apiClient.post('/identity/verify-kyc', {
        documentType,
        documentUrl,
      });
      await refreshUser();
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, verifyKyc, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
