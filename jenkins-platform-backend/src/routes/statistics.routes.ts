import { Router } from 'express';
import statisticsController from '../controllers/statistics.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// 所有统计路由都需要认证
router.use(authenticate);

/**
 * @route   GET /api/statistics/dashboard
 * @desc    获取仪表盘概览数据
 * @access  Private
 */
router.get('/dashboard', statisticsController.getDashboardOverview);

/**
 * @route   GET /api/statistics/jobs
 * @desc    获取所有任务统计
 * @access  Private
 */
router.get('/jobs', statisticsController.getAllJobsStatistics);

/**
 * @route   GET /api/statistics/jobs/:jobName
 * @desc    获取单个任务统计信息
 * @access  Private
 */
router.get('/jobs/:jobName', statisticsController.getJobStatistics);

/**
 * @route   GET /api/statistics/jobs/:jobName/timeseries
 * @desc    获取时间序列数据
 * @access  Private
 */
router.get('/jobs/:jobName/timeseries', statisticsController.getTimeSeriesData);

/**
 * @route   GET /api/statistics/jobs/:jobName/status-distribution
 * @desc    获取构建状态分布
 * @access  Private
 */
router.get('/jobs/:jobName/status-distribution', statisticsController.getStatusDistribution);

/**
 * @route   GET /api/statistics/jobs/:jobName/duration-trend
 * @desc    获取构建耗时趋势
 * @access  Private
 */
router.get('/jobs/:jobName/duration-trend', statisticsController.getBuildDurationTrend);

export default router;
