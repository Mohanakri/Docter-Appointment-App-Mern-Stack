import { Router } from 'express';
import { authGuard } from '@/modules/auth';

export const doctorRoutes = Router();

doctorRoutes.post('/onboard', authGuard(['DOCTOR']), onboardDoctor);
doctorRoutes.get('/:id', getDoctor);
