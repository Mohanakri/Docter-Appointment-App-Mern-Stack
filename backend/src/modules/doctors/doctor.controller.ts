export const onboardDoctor = async (req,res)=>{
  res.json(await DoctorService.onboard(req.user.id, req.body));
};

export const getDoctor = async (req,res)=>{
  res.json(await DoctorService.get(req.params.id));
};
