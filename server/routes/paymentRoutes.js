import express from 'express';
import { createPayment, getPaymentsByBooking, updatePaymentStatus } from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/auth.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.post('/', protect, createPayment);
router.get('/booking/:bookingId', protect, getPaymentsByBooking);
router.put('/:id', protect, authorize(ROLES.ADMIN), updatePaymentStatus);

export default router;
