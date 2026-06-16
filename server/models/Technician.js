import mongoose from 'mongoose';

const technicianSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String, default: null },
  cnic: { type: String, default: null },
  skills: [{ type: String }],
  hourlyRate: { type: Number, default: 0 },
  experienceYears: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'suspended'], default: 'pending' },
  avgRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  totalJobs: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  serviceAreas: [{ type: String }],
  services: [{
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    customPrice: { type: Number, default: null },
  }],
  availableFrom: { type: String, default: '09:00' },
  availableTo: { type: String, default: '18:00' },
  workingDays: { type: [String], default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
}, { timestamps: true });

technicianSchema.index({ status: 1 });
technicianSchema.index({ avgRating: -1 });
technicianSchema.index({ user: 1 });

const Technician = mongoose.model('Technician', technicianSchema);
export default Technician;
