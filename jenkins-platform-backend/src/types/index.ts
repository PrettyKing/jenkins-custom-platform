import { Request } from 'express';

// Jenkins 相关类型
export interface JenkinsJob {
  name: string;
  url: string;
  color: string;
  displayName?: string;
  description?: string;
  buildable: boolean;
  lastBuild?: BuildInfo;
  lastSuccessfulBuild?: BuildInfo;
  lastFailedBuild?: BuildInfo;
}

export interface BuildInfo {
  number: number;
  url: string;
  result: string;
  timestamp: number;
  duration: number;
  building: boolean;
}

export interface BuildDetails extends BuildInfo {
  fullDisplayName: string;
  description?: string;
  actions: any[];
  changeSet?: {
    items: ChangeItem[];
  };
}

export interface ChangeItem {
  author: {
    fullName: string;
  };
  msg: string;
  timestamp: number;
  commitId: string;
}

export interface JobConfig {
  name: string;
  description?: string;
  gitUrl?: string;
  branch?: string;
  script?: string;
}

// 认证相关类型
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthToken {
  token: string;
  expiresIn: string;
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// WebSocket 消息类型
export interface LogMessage {
  jobName: string;
  buildNumber: number;
  content: string;
  timestamp: number;
}

export interface BuildStatusUpdate {
  jobName: string;
  buildNumber: number;
  status: 'STARTED' | 'SUCCESS' | 'FAILURE' | 'ABORTED';
  timestamp: number;
}
