import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  speciality: String,
  degree: String,
  experience: Number,
  certifications: [String],
  fees: Number,
  available: Boolean,
  slots: [String]
},{timestamps:true});

export const DoctorModel = mongoose.model('Doctor', DoctorSchema);
