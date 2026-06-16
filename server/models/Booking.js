import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  notes: { type: String, default: null },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  bookingNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  technician: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'confirmed', 'technician_on_way', 'in_progress', 'completed', 'cancelled', 'refunded', 'disputed'],
    default: 'pending',
  },
  bookingDate: { type: Date, required: true },
  bookingTime: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, required: true },
  description: { type: String, default: null },
  totalAmount: { type: Number, required: true, default: 0 },
  adminNotes: { type: String, default: null },
  cancelledBy: { type: String, enum: ['user', 'technician', 'admin', null], default: null },
  cancelReason: { type: String, default: null },
  completedAt: { type: Date, default: null },
  statusHistory: [statusHistorySchema],
}, { timestamps: true });

bookingSchema.index({ user: 1 });
bookingSchema.index({ technician: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ bookingDate: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
