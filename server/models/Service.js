import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, default: null },
  basePrice: { type: Number, required: true, default: 0 },
  image: { type: String, default: null },
  durationMinutes: { type: Number, default: 60 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

serviceSchema.index({ category: 1 });
serviceSchema.index({ slug: 1 });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
