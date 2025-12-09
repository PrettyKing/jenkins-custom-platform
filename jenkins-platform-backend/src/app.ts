import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

// 导入路由
import authRoutes from './routes/auth.routes';
import jobRoutes from './routes/job.routes';

// 导入中间件
import { notFound, errorHandler } from './middleware/error.middleware';

// 导入服务
import jenkinsService from './services/jenkins.service';

// 加载环境变量
dotenv.config();

// 创建 Express 应用
const app: Application = express();
const httpServer = createServer(app);

// 创建 Socket.IO 服务器
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
});

// 中间件配置
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 健康检查
app.get('/health', async (req, res) => {
  try {
    const jenkinsHealthy = await jenkinsService.healthCheck();
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        api: 'healthy',
        jenkins: jenkinsHealthy ? 'healthy' : 'unhealthy',
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      services: {
        api: 'healthy',
        jenkins: 'unhealthy',
      },
    });
  }
});

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

// WebSocket 连接处理
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // 订阅构建日志
  socket.on('subscribe:build-log', async (data: { jobName: string; buildNumber: number }) => {
    console.log(`Client ${socket.id} subscribed to build log:`, data);
    
    try {
      // 获取完整日志
      const log = await jenkinsService.getBuildLog(data.jobName, data.buildNumber);
      socket.emit('build-log', {
        jobName: data.jobName,
        buildNumber: data.buildNumber,
        content: log,
        timestamp: Date.now(),
      });

      // 实际项目中，这里应该实现实时日志流
      // 可以使用轮询或 Jenkins 的 SSE 接口
    } catch (error) {
      socket.emit('error', {
        message: error instanceof Error ? error.message : 'Failed to fetch build log',
      });
    }
  });

  // 取消订阅
  socket.on('unsubscribe:build-log', (data: { jobName: string; buildNumber: number }) => {
    console.log(`Client ${socket.id} unsubscribed from build log:`, data);
  });

  // 断开连接
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// 404 处理
app.use(notFound);

// 错误处理
app.use(errorHandler);

// 启动服务器
const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Jenkins Platform Backend Server Started!            ║
║                                                           ║
║   📡 Server:    http://localhost:${PORT}                    ║
║   🔌 WebSocket: ws://localhost:${PORT}                      ║
║   📊 Health:    http://localhost:${PORT}/health            ║
║                                                           ║
║   Environment: ${process.env.NODE_ENV || 'development'}                            ║
║   Jenkins URL: ${process.env.JENKINS_URL || 'Not configured'}        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// 优雅退出
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;
