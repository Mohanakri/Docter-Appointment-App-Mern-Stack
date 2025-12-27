import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  appointmentId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  status: String,
  gateway: String
},{timestamps:true});

export const PaymentModel = mongoose.model('Payment', PaymentSchema);
