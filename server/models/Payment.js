import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['cash', 'jazzcash', 'easypaisa', 'bank_transfer', 'card'], default: 'cash' },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  transactionId: { type: String, default: null },
  paidAt: { type: Date, default: null },
}, { timestamps: true });

paymentSchema.index({ booking: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
