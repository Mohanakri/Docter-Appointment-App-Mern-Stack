import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth/auth.service';
import { logger } from '../utils/logger';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'No token provided'
      });
      return;
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const authService = new AuthService();
    const decoded = authService.verifyAccessToken(token);

    // Attach user to request
    (req as any).user = decoded;

    next();
  } catch (error: any) {
    logger.error('Authentication error:', error);

    if (error.message === 'Invalid or expired token') {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

/**
 * Optional middleware - Check if user has specific role
 * Usage: router.get('/admin', authMiddleware, roleMiddleware(['admin']), handler)
 */
export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = (req as any).user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
      return;
    }

    next();
  };
};