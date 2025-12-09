import { create } from 'zustand';
import { User } from '@/types';
import { authApi } from '@/api/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: authApi.getStoredUser(),
  isAuthenticated: authApi.isAuthenticated(),
  isLoading: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  logout: () => {
    authApi.logout();
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  checkAuth: () => {
    const user = authApi.getStoredUser();
    const isAuthenticated = authApi.isAuthenticated();
    set({
      user,
      isAuthenticated,
    });
  },
}));

// WebSocket 连接状态
interface SocketState {
  connected: boolean;
  setConnected: (connected: boolean) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  connected: false,
  setConnected: (connected) => set({ connected }),
}));
