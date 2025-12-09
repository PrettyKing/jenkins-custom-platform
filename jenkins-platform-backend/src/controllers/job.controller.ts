import { Request, Response } from 'express';
import jenkinsService from '../services/jenkins.service';
import { ApiResponse, JobConfig } from '../types';

class JobController {
  /**
   * 获取所有任务
   */
  async getAllJobs(req: Request, res: Response): Promise<void> {
    try {
      const jobs = await jenkinsService.getAllJobs();
      
      const response: ApiResponse = {
        success: true,
        data: jobs,
      };
      
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch jobs',
      };
      res.status(500).json(response);
    }
  }

  /**
   * 获取单个任务详情
   */
  async getJob(req: Request, res: Response): Promise<void> {
    try {
      const { jobName } = req.params;
      const job = await jenkinsService.getJob(jobName);
      
      const response: ApiResponse = {
        success: true,
        data: job,
      };
      
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch job',
      };
      res.status(500).json(response);
    }
  }

  /**
   * 创建任务
   */
  async createJob(req: Request, res: Response): Promise<void> {
    try {
      const jobConfig: JobConfig = req.body;
      
      // 验证必填字段
      if (!jobConfig.name) {
        const response: ApiResponse = {
          success: false,
          error: 'Job name is required',
        };
        res.status(400).json(response);
        return;
      }

      await jenkinsService.createJob(jobConfig);
      
      const response: ApiResponse = {
        success: true,
        message: `Job ${jobConfig.name} created successfully`,
      };
      
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create job',
      };
      res.status(500).json(response);
    }
  }

  /**
   * 删除任务
   */
  async deleteJob(req: Request, res: Response): Promise<void> {
    try {
      const { jobName } = req.params;
      await jenkinsService.deleteJob(jobName);
      
      const response: ApiResponse = {
        success: true,
        message: `Job ${jobName} deleted successfully`,
      };
      
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete job',
      };
      res.status(500).json(response);
    }
  }

  /**
   * 触发构建
   */
  async triggerBuild(req: Request, res: Response): Promise<void> {
    try {
      const { jobName } = req.params;
      const parameters = req.body;

      await jenkinsService.triggerBuild(jobName, parameters);
      
      const response: ApiResponse = {
        success: true,
        message: `Build triggered for ${jobName}`,
      };
      
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to trigger build',
      };
      res.status(500).json(response);
    }
  }

  /**
   * 获取构建历史
   */
  async getBuildHistory(req: Request, res: Response): Promise<void> {
    try {
      const { jobName } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;

      const builds = await jenkinsService.getBuildHistory(jobName, limit);
      
      const response: ApiResponse = {
        success: true,
        data: builds,
      };
      
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch build history',
      };
      res.status(500).json(response);
    }
  }

  /**
   * 获取构建详情
   */
  async getBuildDetails(req: Request, res: Response): Promise<void> {
    try {
      const { jobName, buildNumber } = req.params;
      const build = await jenkinsService.getBuildDetails(
        jobName,
        parseInt(buildNumber)
      );
      
      const response: ApiResponse = {
        success: true,
        data: build,
      };
      
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch build details',
      };
      res.status(500).json(response);
    }
  }

  /**
   * 获取构建日志
   */
  async getBuildLog(req: Request, res: Response): Promise<void> {
    try {
      const { jobName, buildNumber } = req.params;
      const log = await jenkinsService.getBuildLog(
        jobName,
        parseInt(buildNumber)
      );
      
      const response: ApiResponse = {
        success: true,
        data: { log },
      };
      
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch build log',
      };
      res.status(500).json(response);
    }
  }

  /**
   * 停止构建
   */
  async stopBuild(req: Request, res: Response): Promise<void> {
    try {
      const { jobName, buildNumber } = req.params;
      await jenkinsService.stopBuild(jobName, parseInt(buildNumber));
      
      const response: ApiResponse = {
        success: true,
        message: `Build ${buildNumber} stopped`,
      };
      
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to stop build',
      };
      res.status(500).json(response);
    }
  }
}

export default new JobController();
