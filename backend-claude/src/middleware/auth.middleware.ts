import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import { AppError } from './error.middleware';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
  };
}

// Authenticate user using JWT token
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided. Authorization denied', 401);
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AppError('No token provided. Authorization denied', 401);
    }

    // Verify token
    const secret = process.env.JWT_SECRET || 'secret';

    const decoded = jwt.verify(token, secret) as {
      id: string;
      role: string;
      email: string;
    };

    // Attach user to request object
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    };

    logger.info(`User authenticated: ${decoded.email} (${decoded.role})`);
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token. Please login again', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError('Your token has expired. Please login again', 401));
    } else {
      next(error);
    }
  }
};

// Authorize user based on roles
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`Access denied for ${req.user.email} - Required roles: ${roles.join(', ')}`);
      return next(
        new AppError(
          `Access denied. This action requires one of these roles: ${roles.join(', ')}`,
          403
        )
      );
    }

    next();
  };
};