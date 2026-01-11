import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { logger } from '../../utils/logger';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Register a new regular user
   */
  registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password, name, phone } = req.body;

      if (!email || !password || !name) {
        res.status(400).json({
          success: false,
          message: 'Email, password, and name are required'
        });
        return;
      }

      const result = await this.userService.registerUser({
        email,
        password,
        name,
        phone,
        role: 'user'
      });

      logger.info(`User registered: ${email}`);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error: any) {
      logger.error('User registration error:', error);
      
      if (error.message === 'User already exists') {
        res.status(409).json({
          success: false,
          message: error.message
        });
        return;
      }

      next(error);
    }
  };

  /**
   * Register a new doctor
   */
  registerDoctor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        email,
        password,
        name,
        phone,
        specialization,
        licenseNumber,
        yearsOfExperience,
        qualifications,
        clinicAddress,
        consultationFee,
        availableDays,
        availableTimeSlots,
        bio
      } = req.body;

      // Validate required fields
      if (!email || !password || !name || !specialization || !licenseNumber || 
          yearsOfExperience === undefined || !qualifications || !consultationFee) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields for doctor registration'
        });
        return;
      }

      const result = await this.userService.registerDoctor({
        email,
        password,
        name,
        phone,
        role: 'doctor'
      }, {
        specialization,
        licenseNumber,
        yearsOfExperience,
        qualifications,
        clinicAddress,
        consultationFee,
        availableDays,
        availableTimeSlots,
        bio
      });

      logger.info(`Doctor registered: ${email}`);

      res.status(201).json({
        success: true,
        message: 'Doctor registered successfully. Pending verification.',
        data: result
      });
    } catch (error: any) {
      logger.error('Doctor registration error:', error);
      
      if (error.message === 'User already exists' || error.message === 'License number already registered') {
        res.status(409).json({
          success: false,
          message: error.message
        });
        return;
      }

      next(error);
    }
  };

  /**
   * Get user profile by ID
   */
  getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id || (req as any).user.id;

      const user = await this.userService.getUserById(userId);

      res.status(200).json({
        success: true,
        data: { user }
      });
    } catch (error: any) {
      logger.error('Get user profile error:', error);
      
      if (error.message === 'User not found') {
        res.status(404).json({
          success: false,
          message: error.message
        });
        return;
      }

      next(error);
    }
  };

  /**
   * Update user profile
   */
  updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const updateData = req.body;

      // Don't allow updating sensitive fields
      delete updateData.password;
      delete updateData.email;
      delete updateData.role;

      const user = await this.userService.updateUser(userId, updateData);

      logger.info(`User profile updated: ${userId}`);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: { user }
      });
    } catch (error: any) {
      logger.error('Update profile error:', error);
      next(error);
    }
  };

  /**
   * Get all doctors with filters
   */
  getDoctors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { specialization, isVerified, page = 1, limit = 10 } = req.query;

      const filters: any = {};
      if (specialization) filters.specialization = specialization;
      if (isVerified !== undefined) filters.isVerified = isVerified === 'true';

      const result = await this.userService.getDoctors(
        filters,
        Number(page),
        Number(limit)
      );

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      logger.error('Get doctors error:', error);
      next(error);
    }
  };

  /**
   * Get doctor details with user info
   */
  getDoctorDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const doctorId = req.params.id;

      const doctor = await this.userService.getDoctorDetails(doctorId);

      res.status(200).json({
        success: true,
        data: { doctor }
      });
    } catch (error: any) {
      logger.error('Get doctor details error:', error);
      
      if (error.message === 'Doctor not found') {
        res.status(404).json({
          success: false,
          message: error.message
        });
        return;
      }

      next(error);
    }
  };

  /**
   * Update doctor profile
   */
  updateDoctorProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const updateData = req.body;

      // Don't allow updating verification status
      delete updateData.isVerified;

      const doctor = await this.userService.updateDoctorProfile(userId, updateData);

      logger.info(`Doctor profile updated: ${userId}`);

      res.status(200).json({
        success: true,
        message: 'Doctor profile updated successfully',
        data: { doctor }
      });
    } catch (error: any) {
      logger.error('Update doctor profile error:', error);
      next(error);
    }
  };

  /**
   * Delete user account
   */
  deleteAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;

      await this.userService.deleteUser(userId);

      logger.info(`User account deleted: ${userId}`);

      res.status(200).json({
        success: true,
        message: 'Account deleted successfully'
      });
    } catch (error: any) {
      logger.error('Delete account error:', error);
      next(error);
    }
  };
}