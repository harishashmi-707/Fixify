import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: null },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' },
  adminReply: { type: String, default: null },
}, { timestamps: true });

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
export default ContactMessage;
