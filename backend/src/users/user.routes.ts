import { Router } from 'express';
import { UserController } from './user.controller';
import { authMiddleware, roleMiddleware } from '../../middleware/auth.middleware';
import { rateLimitMiddleware } from '../../middleware/rateLimit.middleware';

const router = Router();
const userController = new UserController();

/**
 * @route   POST /api/users/register
 * @desc    Register a new regular user
 * @access  Public
 */
router.post(
  '/register',
  rateLimitMiddleware(5, 15 * 60 * 1000),
  userController.registerUser
);

/**
 * @route   POST /api/users/register-doctor
 * @desc    Register a new doctor
 * @access  Public
 */
router.post(
  '/register-doctor',
  rateLimitMiddleware(3, 15 * 60 * 1000),
  userController.registerDoctor
);

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
  '/profile',
  authMiddleware,
  userController.getUserProfile
);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Public
 */
router.get(
  '/:id',
  userController.getUserProfile
);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  '/profile',
  authMiddleware,
  rateLimitMiddleware(10, 60 * 60 * 1000),
  userController.updateProfile
);

/**
 * @route   GET /api/users/doctors
 * @desc    Get all doctors with filters
 * @access  Public
 */
router.get(
  '/doctors/list',
  userController.getDoctors
);

/**
 * @route   GET /api/users/doctors/:id
 * @desc    Get doctor details by ID
 * @access  Public
 */
router.get(
  '/doctors/:id',
  userController.getDoctorDetails
);

/**
 * @route   PUT /api/users/doctors/profile
 * @desc    Update doctor profile
 * @access  Private (Doctor only)
 */
router.put(
  '/doctors/profile',
  authMiddleware,
  roleMiddleware(['doctor']),
  rateLimitMiddleware(10, 60 * 60 * 1000),
  userController.updateDoctorProfile
);

/**
 * @route   DELETE /api/users/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete(
  '/account',
  authMiddleware,
  rateLimitMiddleware(2, 24 * 60 * 60 * 1000),
  userController.deleteAccount
);

export default router;