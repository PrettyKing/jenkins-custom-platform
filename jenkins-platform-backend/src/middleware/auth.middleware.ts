import { Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { AuthRequest, ApiResponse } from '../types';

/**
 * JWT 认证中间件
 */
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // 从 header 中获取 token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const response: ApiResponse = {
        success: false,
        error: 'No token provided',
      };
      res.status(401).json(response);
      return;
    }

    // 提取 token
    const token = authHeader.substring(7); // 移除 "Bearer " 前缀

    // 验证 token
    const user = authService.verifyToken(token);

    // 将用户信息附加到请求对象
    req.user = user;

    next();
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Invalid or expired token',
    };
    res.status(401).json(response);
  }
};

/**
 * 权限检查中间件
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        error: 'User not authenticated',
      };
      res.status(401).json(response);
      return;
    }

    if (!roles.includes(req.user.role)) {
      const response: ApiResponse = {
        success: false,
        error: 'Insufficient permissions',
      };
      res.status(403).json(response);
      return;
    }

    next();
  };
};

/**
 * 可选认证中间件（不强制要求登录）
 */
export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const user = authService.verifyToken(token);
      req.user = user;
    }

    next();
  } catch (error) {
    // 即使 token 无效，也继续执行（可选认证）
    next();
  }
};
