import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, default: null },
  group: { type: String, default: 'general' },
}, { timestamps: true });

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;
