import { Router } from 'express';
import jobController from '../controllers/job.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// 所有路由都需要认证
router.use(authenticate);

/**
 * @route   GET /api/jobs
 * @desc    获取所有任务
 * @access  Private
 */
router.get('/', jobController.getAllJobs);

/**
 * @route   GET /api/jobs/:jobName
 * @desc    获取单个任务详情
 * @access  Private
 */
router.get('/:jobName', jobController.getJob);

/**
 * @route   POST /api/jobs
 * @desc    创建新任务
 * @access  Private (Admin only)
 */
router.post('/', authorize('admin'), jobController.createJob);

/**
 * @route   DELETE /api/jobs/:jobName
 * @desc    删除任务
 * @access  Private (Admin only)
 */
router.delete('/:jobName', authorize('admin'), jobController.deleteJob);

/**
 * @route   POST /api/jobs/:jobName/build
 * @desc    触发构建
 * @access  Private
 */
router.post('/:jobName/build', jobController.triggerBuild);

/**
 * @route   GET /api/jobs/:jobName/builds
 * @desc    获取构建历史
 * @access  Private
 */
router.get('/:jobName/builds', jobController.getBuildHistory);

/**
 * @route   GET /api/jobs/:jobName/builds/:buildNumber
 * @desc    获取构建详情
 * @access  Private
 */
router.get('/:jobName/builds/:buildNumber', jobController.getBuildDetails);

/**
 * @route   GET /api/jobs/:jobName/builds/:buildNumber/log
 * @desc    获取构建日志
 * @access  Private
 */
router.get('/:jobName/builds/:buildNumber/log', jobController.getBuildLog);

/**
 * @route   POST /api/jobs/:jobName/builds/:buildNumber/stop
 * @desc    停止构建
 * @access  Private
 */
router.post('/:jobName/builds/:buildNumber/stop', jobController.stopBuild);

export default router;
