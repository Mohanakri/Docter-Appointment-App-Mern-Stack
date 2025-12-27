export const DoctorService = {
  onboard: (uid:string, data:any)=>DoctorRepo.create({...data,userId:uid}),
  get: (id:string)=>DoctorRepo.findById(id)
};
