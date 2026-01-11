import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { body } from 'express-validator';
import { validate } from '../../middleware/validation.middleware';

const router = Router();
const userController = new UserController();

router.get('/profile', authenticate, userController.getProfile.bind(userController));

router.put(
  '/profile',
  authenticate,
  [
    body('name').optional().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('phone').optional().matches(/^\+?[\d\s-()]+$/).withMessage('Invalid phone number'),
    body('dateOfBirth').optional().isISO8601().withMessage('Invalid date format'),
    body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
    validate,
  ],
  userController.updateProfile.bind(userController)
);

router.get('/doctors', authenticate, userController.getAllDoctors.bind(userController));

router.get('/patients', authenticate, authorize('admin', 'doctor'), userController.getAllPatients.bind(userController));

router.get('/:id', authenticate, authorize('admin'), userController.getUserById.bind(userController));

router.delete('/:id', authenticate, authorize('admin'), userController.deleteUser.bind(userController));

export default router;