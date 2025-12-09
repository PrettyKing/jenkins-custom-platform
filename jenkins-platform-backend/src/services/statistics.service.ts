import jenkinsService from './jenkins.service';
import { BuildDetails } from '../types';

interface BuildStatistics {
  totalBuilds: number;
  successCount: number;
  failureCount: number;
  unstableCount: number;
  abortedCount: number;
  successRate: number;
  averageDuration: number;
}

interface JobStatistics {
  jobName: string;
  totalBuilds: number;
  successRate: number;
  averageDuration: number;
  lastBuildTime: number;
}

interface TimeSeriesData {
  date: string;
  successCount: number;
  failureCount: number;
  averageDuration: number;
}

interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

class StatisticsService {
  /**
   * 获取单个任务的统计信息
   */
  async getJobStatistics(jobName: string, limit: number = 30): Promise<BuildStatistics> {
    try {
      const builds = await jenkinsService.getBuildHistory(jobName, limit);
      
      return this.calculateBuildStatistics(builds);
    } catch (error) {
      throw new Error(`Failed to get job statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 获取所有任务的统计概览
   */
  async getAllJobsStatistics(): Promise<JobStatistics[]> {
    try {
      const jobs = await jenkinsService.getAllJobs();
      
      const statisticsPromises = jobs.map(async (job) => {
        try {
          const builds = await jenkinsService.getBuildHistory(job.name, 10);
          const stats = this.calculateBuildStatistics(builds);
          
          return {
            jobName: job.name,
            totalBuilds: stats.totalBuilds,
            successRate: stats.successRate,
            averageDuration: stats.averageDuration,
            lastBuildTime: job.lastBuild?.timestamp || 0,
          };
        } catch {
          return {
            jobName: job.name,
            totalBuilds: 0,
            successRate: 0,
            averageDuration: 0,
            lastBuildTime: 0,
          };
        }
      });

      return await Promise.all(statisticsPromises);
    } catch (error) {
      throw new Error(`Failed to get all jobs statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 获取时间序列数据（按天统计）
   */
  async getTimeSeriesData(jobName: string, days: number = 7): Promise<TimeSeriesData[]> {
    try {
      const builds = await jenkinsService.getBuildHistory(jobName, 100);
      
      // 按天分组
      const groupedByDay = this.groupBuildsByDay(builds, days);
      
      // 计算每天的统计
      return groupedByDay.map(dayBuilds => ({
        date: dayBuilds.date,
        successCount: dayBuilds.builds.filter(b => b.result === 'SUCCESS').length,
        failureCount: dayBuilds.builds.filter(b => b.result === 'FAILURE').length,
        averageDuration: this.calculateAverageDuration(dayBuilds.builds),
      }));
    } catch (error) {
      throw new Error(`Failed to get time series data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 获取构建状态分布
   */
  async getStatusDistribution(jobName: string, limit: number = 50): Promise<StatusDistribution[]> {
    try {
      const builds = await jenkinsService.getBuildHistory(jobName, limit);
      
      const statusCounts: Record<string, number> = {};
      builds.forEach(build => {
        const status = build.result || 'UNKNOWN';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      const total = builds.length;
      return Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
        percentage: Math.round((count / total) * 100),
      }));
    } catch (error) {
      throw new Error(`Failed to get status distribution: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 获取构建耗时趋势
   */
  async getBuildDurationTrend(jobName: string, limit: number = 20): Promise<Array<{buildNumber: number, duration: number}>> {
    try {
      const builds = await jenkinsService.getBuildHistory(jobName, limit);
      
      return builds.map(build => ({
        buildNumber: build.number,
        duration: Math.round(build.duration / 1000), // 转换为秒
      })).reverse(); // 按时间正序排列
    } catch (error) {
      throw new Error(`Failed to get build duration trend: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 计算构建统计信息
   */
  private calculateBuildStatistics(builds: BuildDetails[]): BuildStatistics {
    const totalBuilds = builds.length;
    const successCount = builds.filter(b => b.result === 'SUCCESS').length;
    const failureCount = builds.filter(b => b.result === 'FAILURE').length;
    const unstableCount = builds.filter(b => b.result === 'UNSTABLE').length;
    const abortedCount = builds.filter(b => b.result === 'ABORTED').length;
    
    const successRate = totalBuilds > 0 ? Math.round((successCount / totalBuilds) * 100) : 0;
    const averageDuration = this.calculateAverageDuration(builds);

    return {
      totalBuilds,
      successCount,
      failureCount,
      unstableCount,
      abortedCount,
      successRate,
      averageDuration,
    };
  }

  /**
   * 计算平均构建时长
   */
  private calculateAverageDuration(builds: BuildDetails[]): number {
    if (builds.length === 0) return 0;
    
    const totalDuration = builds.reduce((sum, build) => sum + build.duration, 0);
    return Math.round(totalDuration / builds.length / 1000); // 转换为秒
  }

  /**
   * 按天分组构建记录
   */
  private groupBuildsByDay(builds: BuildDetails[], days: number): Array<{date: string, builds: BuildDetails[]}> {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    const dayGroups: Array<{date: string, builds: BuildDetails[]}> = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const dayStart = now - (i * oneDayMs);
      const dayEnd = dayStart + oneDayMs;
      const date = new Date(dayStart).toISOString().split('T')[0];
      
      const dayBuilds = builds.filter(build => 
        build.timestamp >= dayStart && build.timestamp < dayEnd
      );
      
      dayGroups.push({ date, builds: dayBuilds });
    }
    
    return dayGroups;
  }

  /**
   * 获取仪表盘总览数据
   */
  async getDashboardOverview(): Promise<{
    totalJobs: number;
    totalBuilds: number;
    successRate: number;
    activeBuilds: number;
    recentFailures: number;
  }> {
    try {
      const jobs = await jenkinsService.getAllJobs();
      const totalJobs = jobs.length;
      
      // 计算正在构建的任务数
      const activeBuilds = jobs.filter(job => 
        job.lastBuild?.building === true
      ).length;

      // 获取所有任务的最近构建统计
      let totalBuilds = 0;
      let totalSuccess = 0;
      let recentFailures = 0;

      for (const job of jobs) {
        if (job.lastBuild) {
          totalBuilds++;
          if (job.lastBuild.result === 'SUCCESS') {
            totalSuccess++;
          } else if (job.lastBuild.result === 'FAILURE') {
            recentFailures++;
          }
        }
      }

      const successRate = totalBuilds > 0 ? Math.round((totalSuccess / totalBuilds) * 100) : 0;

      return {
        totalJobs,
        totalBuilds,
        successRate,
        activeBuilds,
        recentFailures,
      };
    } catch (error) {
      throw new Error(`Failed to get dashboard overview: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default new StatisticsService();
