import User, { IUser } from './user.model';
import { AppError } from '../../middleware/error.middleware';
import logger from '../../utils/logger';

export class UserService {
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    try {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        throw new AppError('User with this email already exists', 400);
      }

      const user = await User.create(userData);
      logger.info(`User created: ${user.email}`);
      return user;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      logger.error('Error creating user:', error);
      throw new AppError('Failed to create user', 500);
    }
  }

  async getUserById(userId: string): Promise<IUser | null> {
    try {
      const user = await User.findById(userId).select('-password');
      return user;
    } catch (error) {
      logger.error('Error fetching user:', error);
      throw new AppError('Failed to fetch user', 500);
    }
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ email }).select('+password');
      return user;
    } catch (error) {
      logger.error('Error fetching user by email:', error);
      throw new AppError('Failed to fetch user', 500);
    }
  }

  async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    try {
      if (updateData.password) {
        delete updateData.password;
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        throw new AppError('User not found', 404);
      }

      logger.info(`User updated: ${user.email}`);
      return user;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      logger.error('Error updating user:', error);
      throw new AppError('Failed to update user', 500);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      const user = await User.findByIdAndDelete(userId);
      
      if (!user) {
        throw new AppError('User not found', 404);
      }

      logger.info(`User deleted: ${user.email}`);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      logger.error('Error deleting user:', error);
      throw new AppError('Failed to delete user', 500);
    }
  }

  async getAllDoctors(query: any): Promise<IUser[]> {
    try {
      const filter: any = { role: 'doctor', isActive: true };

      if (query.specialization) {
        filter.specialization = new RegExp(query.specialization, 'i');
      }

      const doctors = await User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 });

      return doctors;
    } catch (error) {
      logger.error('Error fetching doctors:', error);
      throw new AppError('Failed to fetch doctors', 500);
    }
  }

  async getAllPatients(): Promise<IUser[]> {
    try {
      const patients = await User.find({ role: 'patient' })
        .select('-password')
        .sort({ createdAt: -1 });

      return patients;
    } catch (error) {
      logger.error('Error fetching patients:', error);
      throw new AppError('Failed to fetch patients', 500);
    }
  }
}