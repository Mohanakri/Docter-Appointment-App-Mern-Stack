import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { body } from 'express-validator';
import { validate } from '../../middleware/validation.middleware';

const router = Router();
const authController = new AuthController();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').notEmpty().withMessage('Phone is required').matches(/^\+?[\d\s-()]+$/).withMessage('Invalid phone number'),
    body('role').optional().isIn(['patient', 'doctor', 'admin']).withMessage('Invalid role'),
    validate,
  ],
  authController.register.bind(authController)
);

router.post(
  '/login',
  [
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
  ],
  authController.login.bind(authController)
);

router.post('/refresh-token', authController.refreshToken.bind(authController));

router.post(
  '/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').notEmpty().withMessage('New password is required').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    validate,
  ],
  authController.changePassword.bind(authController)
);

router.post('/logout', authenticate, authController.logout.bind(authController));

export default router;