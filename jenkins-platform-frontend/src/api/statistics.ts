import apiClient from './client';

export interface BuildStatistics {
  totalBuilds: number;
  successCount: number;
  failureCount: number;
  unstableCount: number;
  abortedCount: number;
  successRate: number;
  averageDuration: number;
}

export interface JobStatistics {
  jobName: string;
  totalBuilds: number;
  successRate: number;
  averageDuration: number;
  lastBuildTime: number;
}

export interface TimeSeriesData {
  date: string;
  successCount: number;
  failureCount: number;
  averageDuration: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface DashboardOverview {
  totalJobs: number;
  totalBuilds: number;
  successRate: number;
  activeBuilds: number;
  recentFailures: number;
}

export const statisticsApi = {
  /**
   * 获取仪表盘概览
   */
  getDashboardOverview: async () => {
    return apiClient.get<DashboardOverview>('/statistics/dashboard');
  },

  /**
   * 获取所有任务统计
   */
  getAllJobsStatistics: async () => {
    return apiClient.get<JobStatistics[]>('/statistics/jobs');
  },

  /**
   * 获取单个任务统计
   */
  getJobStatistics: async (jobName: string, limit: number = 30) => {
    return apiClient.get<BuildStatistics>(`/statistics/jobs/${jobName}`, { limit });
  },

  /**
   * 获取时间序列数据
   */
  getTimeSeriesData: async (jobName: string, days: number = 7) => {
    return apiClient.get<TimeSeriesData[]>(`/statistics/jobs/${jobName}/timeseries`, { days });
  },

  /**
   * 获取构建状态分布
   */
  getStatusDistribution: async (jobName: string, limit: number = 50) => {
    return apiClient.get<StatusDistribution[]>(`/statistics/jobs/${jobName}/status-distribution`, { limit });
  },

  /**
   * 获取构建耗时趋势
   */
  getBuildDurationTrend: async (jobName: string, limit: number = 20) => {
    return apiClient.get<Array<{buildNumber: number, duration: number}>>(`/statistics/jobs/${jobName}/duration-trend`, { limit });
  },
};
