import { Router } from 'express';
import { authGuard } from '@/modules/auth';

export const appointmentRoutes = Router();
appointmentRoutes.post('/book', authGuard(['USER']), book);
