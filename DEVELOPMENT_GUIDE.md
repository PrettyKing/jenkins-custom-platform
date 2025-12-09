# Jenkins 自定义平台开发指南

## 📋 项目概述

基于 Jenkins 的二次开发平台,使用现代化技术栈重写 Jenkins Web 界面,提供更好的用户体验。

### 技术栈

**后端**
- Node.js + Express.js
- TypeScript
- Socket.IO (实时通信)
- JWT (身份认证)
- Axios (Jenkins API 调用)

**前端**
- React 18
- TypeScript
- Vite
- Ant Design
- React Query
- Zustand (状态管理)
- React Router

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- Jenkins >= 2.0.0
- npm 或 yarn

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/PrettyKing/jenkins-custom-platform.git
cd jenkins-custom-platform

# 2. 安装后端依赖
cd jenkins-platform-backend
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件,配置 Jenkins 连接信息

# 4. 启动后端服务
npm run dev

# 5. 安装前端依赖
cd ../jenkins-platform-frontend
npm install

# 6. 启动前端开发服务器
npm run dev
```

### 环境变量配置

在 `jenkins-platform-backend/.env` 中配置:

```env
# Jenkins 连接配置
JENKINS_URL=http://localhost:8080
JENKINS_USERNAME=admin
JENKINS_TOKEN=your_api_token

# JWT 配置
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# 服务器配置
PORT=3000
NODE_ENV=development

# CORS 配置
CORS_ORIGIN=http://localhost:5173
```

## 📁 项目结构

```
jenkins-platform/
├── jenkins-platform-backend/     # 后端服务
│   ├── src/
│   │   ├── app.ts               # Express 应用入口
│   │   ├── config/              # 配置文件
│   │   ├── controllers/         # 控制器层
│   │   ├── middleware/          # 中间件
│   │   ├── routes/              # 路由定义
│   │   ├── services/            # 业务逻辑层
│   │   └── types/               # TypeScript 类型定义
│   ├── package.json
│   └── tsconfig.json
│
└── jenkins-platform-frontend/    # 前端应用
    ├── src/
    │   ├── api/                 # API 封装
    │   ├── components/          # React 组件
    │   ├── pages/               # 页面组件
    │   ├── store/               # 状态管理
    │   ├── types/               # TypeScript 类型
    │   ├── App.tsx              # 应用主组件
    │   └── main.tsx             # 应用入口
    ├── package.json
    └── vite.config.ts
```

## 🔧 开发指南

### 后端 API

#### 认证接口

```typescript
POST /api/auth/login      - 用户登录
POST /api/auth/register   - 用户注册
GET  /api/auth/me         - 获取当前用户
POST /api/auth/refresh    - 刷新 Token
```

#### 任务接口

```typescript
GET    /api/jobs                              - 获取所有任务
GET    /api/jobs/:jobName                     - 获取任务详情
POST   /api/jobs                              - 创建任务
DELETE /api/jobs/:jobName                     - 删除任务
POST   /api/jobs/:jobName/build               - 触发构建
GET    /api/jobs/:jobName/builds              - 获取构建历史
GET    /api/jobs/:jobName/builds/:buildNumber - 获取构建详情
GET    /api/jobs/:jobName/builds/:buildNumber/log - 获取构建日志
POST   /api/jobs/:jobName/builds/:buildNumber/stop - 停止构建
```

### 前端开发

#### 状态管理

使用 Zustand 进行状态管理:

```typescript
import { useAuthStore } from '@/store'

// 在组件中使用
const { user, isAuthenticated, logout } = useAuthStore()
```

#### API 调用

```typescript
import { jobApi } from '@/api/jobs'

// 获取所有任务
const response = await jobApi.getAllJobs()

// 触发构建
await jobApi.triggerBuild('my-job', { param1: 'value' })
```

## 🔐 认证机制

1. 用户登录获取 JWT Token
2. Token 存储在 localStorage
3. 每次 API 请求自动附加 Token
4. Token 过期自动跳转登录页

## 📝 默认账号

```
管理员:
用户名: admin
密码: admin123

普通用户:
用户名: user
密码: user123
```

## 🧪 测试

```bash
# 后端测试
cd jenkins-platform-backend
npm test

# 前端测试
cd jenkins-platform-frontend
npm test
```

## 📦 生产部署

```bash
# 构建后端
cd jenkins-platform-backend
npm run build
npm start

# 构建前端
cd jenkins-platform-frontend
npm run build
# 将 dist 目录部署到 Web 服务器
```

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

MIT License

## 📧 联系方式

- GitHub: [@PrettyKing](https://github.com/PrettyKing)
- 项目地址: https://github.com/PrettyKing/jenkins-custom-platform
