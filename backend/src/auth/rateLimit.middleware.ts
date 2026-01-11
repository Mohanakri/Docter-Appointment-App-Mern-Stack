import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/**
 * Rate limiting middleware
 * @param maxRequests - Maximum number of requests allowed
 * @param windowMs - Time window in milliseconds
 */
export const rateLimitMiddleware = (maxRequests: number, windowMs: number) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Get client identifier (IP address or user ID if authenticated)
    const identifier = (req as any).user?.id || req.ip || req.connection.remoteAddress || 'unknown';
    const key = `${identifier}:${req.path}`;

    const now = Date.now();

    // Clean up expired entries
    if (store[key] && store[key].resetTime < now) {
      delete store[key];
    }

    // Initialize or update rate limit data
    if (!store[key]) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs
      };
      next();
      return;
    }

    // Check if limit exceeded
    if (store[key].count >= maxRequests) {
      const resetIn = Math.ceil((store[key].resetTime - now) / 1000);
      
      logger.warn(`Rate limit exceeded for ${identifier} on ${req.path}`);

      res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter: resetIn
      });
      return;
    }

    // Increment counter
    store[key].count++;
    next();
  };
};

/**
 * Clean up expired entries periodically
 */
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 60000); // Clean up every minute