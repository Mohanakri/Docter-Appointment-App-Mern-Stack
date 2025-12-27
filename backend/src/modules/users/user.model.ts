import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,

  fullName: String,
  phone: String,
  avatar: String,
  address: Object,
  kycDocs: [String],
  isVerified: Boolean
},{timestamps:true});

export const UserModel = mongoose.model('User', UserSchema);
