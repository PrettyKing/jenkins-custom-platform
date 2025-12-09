import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { ApiResponse, LoginCredentials, AuthRequest } from '../types';

class AuthController {
  /**
   * 用户登录
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const credentials: LoginCredentials = req.body;

      // 验证必填字段
      if (!credentials.username || !credentials.password) {
        const response: ApiResponse = {
          success: false,
          error: 'Username and password are required',
        };
        res.status(400).json(response);
        return;
      }

      const result = await authService.login(credentials);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Login successful',
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
      res.status(401).json(response);
    }
  }

  /**
   * 用户注册
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;

      // 验证必填字段
      if (!username || !email || !password) {
        const response: ApiResponse = {
          success: false,
          error: 'Username, email, and password are required',
        };
        res.status(400).json(response);
        return;
      }

      const user = await authService.register({ username, email, password });

      const response: ApiResponse = {
        success: true,
        data: user,
        message: 'Registration successful',
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      };
      res.status(400).json(response);
    }
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        const response: ApiResponse = {
          success: false,
          error: 'User not authenticated',
        };
        res.status(401).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: req.user,
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user info',
      };
      res.status(500).json(response);
    }
  }

  /**
   * 刷新 token
   */
  async refreshToken(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        const response: ApiResponse = {
          success: false,
          error: 'User not authenticated',
        };
        res.status(401).json(response);
        return;
      }

      const token = authService.generateToken(req.user);

      const response: ApiResponse = {
        success: true,
        data: {
          token,
          expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        },
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to refresh token',
      };
      res.status(500).json(response);
    }
  }
}

export default new AuthController();
