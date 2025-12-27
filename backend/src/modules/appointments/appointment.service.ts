export const AppointmentService = {
  async book(uid:string, data:any){
    const exists = await AppointmentRepo.findBySlot(data.doctorId, data.slot);
    if(exists) throw new Error('Slot already booked');

    const appt = await AppointmentRepo.create({
      userId:uid,
      doctorId:data.doctorId,
      slot:data.slot,
      paid:false
    });

    await pushJob(process.env.NOTIFY_QUEUE!, { type:'APPOINTMENT_BOOKED', apptId: appt._id });
    return appt;
  }
};
