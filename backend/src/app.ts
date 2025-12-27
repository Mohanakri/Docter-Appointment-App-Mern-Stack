import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { authRoutes } from './modules/auth/index.js';
import { userRoutes } from './modules/users/index.js';
import { doctorRoutes } from './modules/doctors/index.js';
import { appointmentRoutes } from './modules/appointments/index.js';
import { paymentRoutes } from './modules/payments/index.js';
import { errorHandler } from './platform/http/errorHandler.js';

const app = express();

/* Global HTTP Middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

/* Routes */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);

/* Error handler must be last */
app.use(errorHandler);

export default app;
