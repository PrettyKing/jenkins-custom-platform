import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

/**
 * 404 错误处理
 */
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const response: ApiResponse = {
    success: false,
    error: `Route not found: ${req.method} ${req.url}`,
  };
  res.status(404).json(response);
};

/**
 * 全局错误处理
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  const response: ApiResponse = {
    success: false,
    error: error.message || 'Internal server error',
  };

  res.status(500).json(response);
};

/**
 * 异步错误包装器
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
