import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['booking', 'review', 'payment', 'system', 'message'], default: 'system' },
  link: { type: String, default: null },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

notificationSchema.index({ user: 1 });
notificationSchema.index({ isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
