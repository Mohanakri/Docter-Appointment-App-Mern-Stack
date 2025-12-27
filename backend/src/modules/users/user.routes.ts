import { Router } from 'express';
import { authGuard } from '@/modules/auth';

export const userRoutes = Router();

userRoutes.get('/me', authGuard(), getProfile);
userRoutes.put('/me', authGuard(), updateProfile);
