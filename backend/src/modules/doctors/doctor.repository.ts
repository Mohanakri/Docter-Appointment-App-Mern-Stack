export const DoctorRepo = {
  create: (data:any)=>DoctorModel.create(data),
  findById: (id:string)=>DoctorModel.findById(id)
};
