import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
  message: { type: String, required: true },
  attachment: { type: String, default: null },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

messageSchema.index({ sender: 1 });
messageSchema.index({ receiver: 1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;
