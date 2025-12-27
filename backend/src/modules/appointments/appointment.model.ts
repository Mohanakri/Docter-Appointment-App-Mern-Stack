import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  doctorId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  slot: String,
  status: { type:String, default:'BOOKED' },
  paid: Boolean
},{timestamps:true});

export const AppointmentModel = mongoose.model('Appointment', AppointmentSchema);
