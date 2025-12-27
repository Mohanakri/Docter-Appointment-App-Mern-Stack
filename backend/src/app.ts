import express from 'express';
import { httpMiddlewares } from '@/platform/http/middlewares';
import { errorHandler } from '@/platform/http/errorHandler';
import { authRoutes } from '@/modules/auth';
import { userRoutes } from '@/modules/users';
import { doctorRoutes } from '@/modules/doctors';
import { appointmentRoutes } from '@/modules/appointments';
import { paymentRoutes } from '@/modules/payments';

const app = express();
httpMiddlewares.forEach(m => app.use(m));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);

app.use(errorHandler);
export default app;
