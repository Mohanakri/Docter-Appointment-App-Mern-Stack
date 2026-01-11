import jwt from 'jsonwebtoken';
import { User, IUser } from '../user/user.model';
import { logger } from '../../utils/logger';

interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: Date;
}

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this';
  private readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
  private readonly JWT_EXPIRES_IN = '15m';
  private readonly JWT_REFRESH_EXPIRES_IN = '7d';

  /**
   * Register a new user
   */
  async register(email: string, password: string, name: string, phone?: string) {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create user (password will be hashed by pre-save hook)
    const newUser = await User.create({
      email,
      password,
      name,
      phone,
      role: 'user'
    });

    // Generate tokens
    const token = this.generateAccessToken(newUser._id.toString(), newUser.email, newUser.role);
    const refreshToken = this.generateRefreshToken(newUser._id.toString());

    logger.info(`New user created: ${email}`);

    return {
      user: this.sanitizeUser(newUser),
      token,
      refreshToken
    };
  }

  /**
   * Login user
   */
  async login(email: string, password: string) {
    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const token = this.generateAccessToken(user._id.toString(), user.email, user.role);
    const refreshToken = this.generateRefreshToken(user._id.toString());

    return {
      user: this.sanitizeUser(user),
      token,
      refreshToken
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<UserResponse> {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }

    return this.sanitizeUser(user);
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token: string): { id: string; email: string; role: string } {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as { 
        id: string; 
        email: string;
        role: string;
      };
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, this.JWT_REFRESH_SECRET) as { id: string };
      
      const user = await this.getUserById(decoded.id);
      const newAccessToken = this.generateAccessToken(
        user.id,
        user.email,
        user.role
      );

      return {
        token: newAccessToken
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Change user password
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    logger.info(`Password changed for user: ${userId}`);
  }

  /**
   * Generate access token
   */
  private generateAccessToken(userId: string, email: string, role: string): string {
    return jwt.sign(
      { id: userId, email, role },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );
  }

  /**
   * Generate refresh token
   */
  private generateRefreshToken(userId: string): string {
    return jwt.sign(
      { id: userId },
      this.JWT_REFRESH_SECRET,
      { expiresIn: this.JWT_REFRESH_EXPIRES_IN }
    );
  }

  /**
   * Remove sensitive data from user object
   */
  private sanitizeUser(user: IUser): UserResponse {
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt
    };
  }
}