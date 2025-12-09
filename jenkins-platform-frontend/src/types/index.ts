// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 用户类型
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  expiresIn: string;
  user: User;
}

// Jenkins 任务类型
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

// 任务创建配置
export interface JobConfig {
  name: string;
  description?: string;
  gitUrl?: string;
  branch?: string;
  script?: string;
}

// 构建日志
export interface BuildLog {
  jobName: string;
  buildNumber: number;
  content: string;
  timestamp: number;
}

// 构建状态
export type BuildStatus = 'SUCCESS' | 'FAILURE' | 'UNSTABLE' | 'ABORTED' | 'NOT_BUILT' | 'BUILDING';

// 任务颜色到状态的映射
export const colorToStatus = (color: string): BuildStatus => {
  if (color.includes('anime')) return 'BUILDING';
  if (color.startsWith('blue')) return 'SUCCESS';
  if (color.startsWith('red')) return 'FAILURE';
  if (color.startsWith('yellow')) return 'UNSTABLE';
  if (color.startsWith('aborted')) return 'ABORTED';
  return 'NOT_BUILT';
};

// 获取状态颜色
export const getStatusColor = (status: BuildStatus): string => {
  const colorMap: Record<BuildStatus, string> = {
    SUCCESS: '#52c41a',
    FAILURE: '#ff4d4f',
    UNSTABLE: '#faad14',
    ABORTED: '#8c8c8c',
    NOT_BUILT: '#d9d9d9',
    BUILDING: '#1890ff',
  };
  return colorMap[status] || '#d9d9d9';
};

// 获取状态文本
export const getStatusText = (status: BuildStatus): string => {
  const textMap: Record<BuildStatus, string> = {
    SUCCESS: '成功',
    FAILURE: '失败',
    UNSTABLE: '不稳定',
    ABORTED: '已中止',
    NOT_BUILT: '未构建',
    BUILDING: '构建中',
  };
  return textMap[status] || '未知';
};
