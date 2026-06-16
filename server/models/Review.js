import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  technician: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: null },
  reply: { type: String, default: null },
  replyAt: { type: Date, default: null },
  isVisible: { type: Boolean, default: true },
}, { timestamps: true });

reviewSchema.index({ technician: 1 });
reviewSchema.index({ user: 1 });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
