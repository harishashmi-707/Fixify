import mongoose from 'mongoose';

const adminLogSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  entityType: { type: String, default: null },
  entityId: { type: mongoose.Schema.Types.ObjectId, default: null },
  details: { type: String, default: null },
  ipAddress: { type: String, default: null },
  userAgent: { type: String, default: null },
}, { timestamps: true });

adminLogSchema.index({ admin: 1 });

const AdminLog = mongoose.model('AdminLog', adminLogSchema);
export default AdminLog;
