import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: null },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'technician', 'admin'], default: 'user' },
  avatar: { type: String, default: 'default-avatar.png' },
  address: { type: String, default: null },
  city: { type: String, default: null },
  isActive: { type: Boolean, default: true },
  emailVerifiedAt: { type: Date, default: null },
  verificationToken: { type: String, default: null },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },
  lastLogin: { type: Date, default: null },
}, { timestamps: true });

// Index
userSchema.index({ role: 1 });
userSchema.index({ city: 1 });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.verificationToken;
  delete obj.resetToken;
  delete obj.resetTokenExpiry;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
