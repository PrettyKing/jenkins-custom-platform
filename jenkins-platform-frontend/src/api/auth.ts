import apiClient from './client';
import { LoginCredentials, AuthResponse, User } from '@/types';

export const authApi = {
  /**
   * 用户登录
   */
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    if (response.success && response.data) {
      // 保存 token 和用户信息到本地存储
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  /**
   * 用户注册
   */
  register: async (userData: { username: string; email: string; password: string }) => {
    return apiClient.post<User>('/auth/register', userData);
  },

  /**
   * 获取当前用户信息
   */
  getCurrentUser: async () => {
    return apiClient.get<User>('/auth/me');
  },

  /**
   * 刷新 token
   */
  refreshToken: async () => {
    const response = await apiClient.post<{ token: string; expiresIn: string }>('/auth/refresh');
    if (response.success && response.data) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },

  /**
   * 登出
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * 检查是否已登录
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  /**
   * 获取存储的用户信息
   */
  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};
