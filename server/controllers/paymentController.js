import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import { ROLES } from '../config/constants.js';

// @desc    Create a payment record for a booking
// @route   POST /api/payments
// @access  Private
export const createPayment = async (req, res, next) => {
  try {
    const { booking: bookingId, amount, method } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const existing = await Payment.findOne({ booking: bookingId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Payment already exists for this booking' });
    }

    const payment = await Payment.create({
      booking: bookingId,
      amount: amount || booking.totalAmount,
      method: method || 'cash',
    });

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment(s) for a booking
// @route   GET /api/payments/booking/:bookingId
// @access  Private
export const getPaymentsByBooking = async (req, res, next) => {
  try {
    const payments = await Payment.find({ booking: req.params.bookingId })
      .populate('booking', 'bookingNumber totalAmount status');

    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
};

// @desc    Update payment status (admin)
// @route   PUT /api/payments/:id
// @access  Private/Admin
export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { status, transactionId } = req.body;

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    payment.status = status || payment.status;
    if (transactionId) payment.transactionId = transactionId;
    if (status === 'completed') payment.paidAt = Date.now();
    
    await payment.save();

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};
