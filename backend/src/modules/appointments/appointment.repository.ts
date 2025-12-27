export const AppointmentRepo = {
  create:(d:any)=>AppointmentModel.create(d),
  findBySlot:(doc:string,slot:string)=>AppointmentModel.findOne({doctorId:doc,slot})
};
