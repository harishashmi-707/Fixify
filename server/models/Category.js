import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  icon: { type: String, default: 'Wrench' },
  description: { type: String, default: null },
  image: { type: String, default: null },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

categorySchema.index({ sortOrder: 1 });

const Category = mongoose.model('Category', categorySchema);
export default Category;
