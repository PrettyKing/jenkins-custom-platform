import apiClient from './client';
import { JenkinsJob, BuildDetails, JobConfig } from '@/types';

export const jobApi = {
  /**
   * 获取所有任务
   */
  getAllJobs: async () => {
    return apiClient.get<JenkinsJob[]>('/jobs');
  },

  /**
   * 获取单个任务详情
   */
  getJob: async (jobName: string) => {
    return apiClient.get<JenkinsJob>(`/jobs/${jobName}`);
  },

  /**
   * 创建任务
   */
  createJob: async (config: JobConfig) => {
    return apiClient.post('/jobs', config);
  },

  /**
   * 删除任务
   */
  deleteJob: async (jobName: string) => {
    return apiClient.delete(`/jobs/${jobName}`);
  },

  /**
   * 触发构建
   */
  triggerBuild: async (jobName: string, parameters?: Record<string, any>) => {
    return apiClient.post(`/jobs/${jobName}/build`, parameters);
  },

  /**
   * 获取构建历史
   */
  getBuildHistory: async (jobName: string, limit: number = 10) => {
    return apiClient.get<BuildDetails[]>(`/jobs/${jobName}/builds`, { limit });
  },

  /**
   * 获取构建详情
   */
  getBuildDetails: async (jobName: string, buildNumber: number) => {
    return apiClient.get<BuildDetails>(`/jobs/${jobName}/builds/${buildNumber}`);
  },

  /**
   * 获取构建日志
   */
  getBuildLog: async (jobName: string, buildNumber: number) => {
    return apiClient.get<{ log: string }>(`/jobs/${jobName}/builds/${buildNumber}/log`);
  },

  /**
   * 停止构建
   */
  stopBuild: async (jobName: string, buildNumber: number) => {
    return apiClient.post(`/jobs/${jobName}/builds/${buildNumber}/stop`);
  },
};
