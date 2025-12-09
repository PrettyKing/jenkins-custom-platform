# Jenkins 定制化平台

基于 Jenkins 的二次开发平台,使用 React + Node.js 完全重写前端界面,提供现代化的用户体验。

## ✨ 特性

- 🎨 **现代化 UI**: 使用 React + Ant Design 构建的全新界面
- 🔐 **完整认证系统**: JWT 认证,支持用户管理和权限控制
- 📊 **实时监控**: WebSocket 实时推送构建日志和状态
- 🚀 **高性能**: 基于 TypeScript 开发,类型安全且易于维护
- 📱 **响应式设计**: 支持桌面端和移动端访问
- 🔌 **易于扩展**: 清晰的架构设计,便于添加新功能

## 🚀 快速开始

### 前置要求

- Node.js >= 18.0.0
- Jenkins >= 2.300
- npm 或 yarn

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/PrettyKing/jenkins-custom-platform.git
cd jenkins-custom-platform

# 2. 安装后端
cd jenkins-platform-backend
npm install
cp .env.example .env  # 编辑 .env 配置 Jenkins 连接信息
npm run dev

# 3. 安装前端 (新终端)
cd jenkins-platform-frontend
npm install
npm run dev
```

### 访问应用

- 前端: http://localhost:3000
- 后端 API: http://localhost:4000
- 默认账号: `admin` / `admin123`

## 📚 文档

- [完整开发指南](./DEVELOPMENT_GUIDE.md) - 15000+ 字详细教程
- [项目结构说明](./FILE_STRUCTURE.md)
- [项目总结](./PROJECT_SUMMARY.md)

## 🏗️ 技术栈

### 后端
- Node.js + TypeScript + Express
- JWT 认证
- Socket.IO WebSocket
- Winston 日志

### 前端
- React 18 + TypeScript + Vite
- Ant Design UI 组件库
- React Query 数据管理
- Zustand 状态管理

## 🎯 核心功能

### 已实现
- ✅ 用户认证和授权
- ✅ 任务列表查看
- ✅ 触发构建
- ✅ 构建历史查询
- ✅ 构建日志查看
- ✅ 任务创建和删除
- ✅ WebSocket 实时通信

### 待开发
- ⏳ Pipeline 可视化编辑器
- ⏳ 构建参数配置界面
- ⏳ 通知系统
- ⏳ 数据统计图表

## 📄 License

MIT License
