import jwt from 'jsonwebtoken';
import User, { IUser } from '../user/user.model';
import { AppError } from '../../middleware/error.middleware';
import logger from '../../utils/logger';

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export class AuthService {
  private generateToken(payload: TokenPayload, expiresIn: string): string {
    const secret = process.env.JWT_SECRET || 'secret';
    return jwt.sign(payload, secret, { expiresIn });
  }

  private generateRefreshToken(payload: TokenPayload): string {
    const secret = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
    const expiresIn = process.env.JWT_REFRESH_EXPIRE || '30d';
    return jwt.sign(payload, secret, { expiresIn });
  }

  async register(userData: Partial<IUser>): Promise<{ user: IUser; token: string; refreshToken: string }> {
    try {
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        throw new AppError('User with this email already exists', 400);
      }

      const user = await User.create(userData);
      logger.info(`User registered: ${user.email}`);

      const userObj = user.toObject();
      delete userObj.password;

      const tokenPayload: TokenPayload = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      const token = this.generateToken(tokenPayload, process.env.JWT_EXPIRE || '7d');
      const refreshToken = this.generateRefreshToken(tokenPayload);

      return { user, token, refreshToken };
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      logger.error('Registration error:', error);
      throw new AppError(error.message || 'Registration failed', 500);
    }
  }

  async login(email: string, password: string): Promise<{ user: IUser; token: string; refreshToken: string }> {
    try {
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      if (!user.isActive) {
        throw new AppError('Account is deactivated', 403);
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401);
      }

      logger.info(`User logged in: ${user.email}`);

      const userObj = user.toObject();
      delete userObj.password;

      const tokenPayload: TokenPayload = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      const token = this.generateToken(tokenPayload, process.env.JWT_EXPIRE || '7d');
      const refreshToken = this.generateRefreshToken(tokenPayload);

      return { user, token, refreshToken };
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      logger.error('Login error:', error);
      throw new AppError('Login failed', 500);
    }
  }

  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    try {
      const secret = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
      const decoded = jwt.verify(refreshToken, secret) as TokenPayload;

      const user = await User.findById(decoded.id);

      if (!user || !user.isActive) {
        throw new AppError('Invalid refresh token', 401);
      }

      const tokenPayload: TokenPayload = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      const newToken = this.generateToken(tokenPayload, process.env.JWT_EXPIRE || '7d');
      const newRefreshToken = this.generateRefreshToken(tokenPayload);

      return { token: newToken, refreshToken: newRefreshToken };
    } catch (error: any) {
      logger.error('Token refresh error:', error);
      throw new AppError('Invalid refresh token', 401);
    }
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await User.findById(userId).select('+password');

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const isPasswordValid = await user.comparePassword(currentPassword);

      if (!isPasswordValid) {
        throw new AppError('Current password is incorrect', 400);
      }

      user.password = newPassword;
      await user.save();

      logger.info(`Password changed for user: ${user.email}`);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      logger.error('Change password error:', error);
      throw new AppError('Failed to change password', 500);
    }
  }
}