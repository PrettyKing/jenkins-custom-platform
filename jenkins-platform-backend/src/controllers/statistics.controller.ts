import { Request, Response } from 'express';
import statisticsService from '../services/statistics.service';
import { ApiResponse } from '../types';

class StatisticsController {
  /**
   * 获取任务统计信息
   */
  async getJobStatistics(req: Request, res: Response): Promise<void> {
    try {
      const { jobName } = req.params;
      const limit = parseInt(req.query.limit as string) || 30;

      const statistics = await statisticsService.getJobStatistics(jobName, limit);

      const response: ApiResponse = {
        success: true,
        data: statistics,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get job statistics',
      };
      res.status(500).json(response);
    }
  }

  /**
   * 获取所有任务统计
   */
  async getAllJobsStatistics(req: Request, res: Response): Promise<void> {
    try {
      const statistics = await statisticsService.getAllJobsStatistics();

      const response: ApiResponse = {
        success: true,
        data: statistics,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get all jobs statistics',
      };
      res.status(500).json(response);
    }
  }

  /**
   * 获取时间序列数据
   */
  async getTimeSeriesData(req: Request, res: Response): Promise<void> {
    try {
      const { jobName } = req.params;
      const days = parseInt(req.query.days as string) || 7;

      const data = await statisticsService.getTimeSeriesData(jobName, days);

      const response: ApiResponse = {
        success: true,
        data,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get time series data',
      };
      res.status(500).json(response);
    }
  }

  /**
   * 获取构建状态分布
   */
  async getStatusDistribution(req: Request, res: Response): Promise<void> {
    try {
      const { jobName } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;

      const distribution = await statisticsService.getStatusDistribution(jobName, limit);

      const response: ApiResponse = {
        success: true,
        data: distribution,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get status distribution',
      };
      res.status(500).json(response);
    }
  }

  /**
   * 获取构建耗时趋势
   */
  async getBuildDurationTrend(req: Request, res: Response): Promise<void> {
    try {
      const { jobName } = req.params;
      const limit = parseInt(req.query.limit as string) || 20;

      const trend = await statisticsService.getBuildDurationTrend(jobName, limit);

      const response: ApiResponse = {
        success: true,
        data: trend,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get build duration trend',
      };
      res.status(500).json(response);
    }
  }

  /**
   * 获取仪表盘概览
   */
  async getDashboardOverview(req: Request, res: Response): Promise<void> {
    try {
      const overview = await statisticsService.getDashboardOverview();

      const response: ApiResponse = {
        success: true,
        data: overview,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get dashboard overview',
      };
      res.status(500).json(response);
    }
  }
}

export default new StatisticsController();
