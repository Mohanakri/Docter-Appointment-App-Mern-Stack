import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { body } from 'express-validator';
import { validate } from '../../middleware/validation.middleware';

const router = Router();
const paymentController = new PaymentController();

router.post(
  '/',
  authenticate,
  [
    body('appointmentId').notEmpty().withMessage('Appointment ID is required'),
    body('amount').notEmpty().withMessage('Amount is required').isNumeric().withMessage('Amount must be a number'),
    body('paymentMethod').notEmpty().withMessage('Payment method is required').isIn(['card', 'upi', 'netbanking', 'wallet', 'cash']).withMessage('Invalid payment method'),
    validate,
  ],
  paymentController.createPayment.bind(paymentController)
);

router.get('/my-payments', authenticate, paymentController.getMyPayments.bind(paymentController));

router.get('/', authenticate, authorize('admin'), paymentController.getAllPayments.bind(paymentController));

router.get('/:id', authenticate, paymentController.getPaymentById.bind(paymentController));

router.put(
  '/:id/status',
  authenticate,
  authorize('admin'),
  [
    body('status').notEmpty().withMessage('Status is required').isIn(['pending', 'completed', 'failed', 'refunded']).withMessage('Invalid status'),
    validate,
  ],
  paymentController.updatePaymentStatus.bind(paymentController)
);

router.post('/:id/refund', authenticate, authorize('admin'), paymentController.processRefund.bind(paymentController));

export default router;