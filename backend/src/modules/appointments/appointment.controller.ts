export const book = async (req,res)=>{
  res.json(await AppointmentService.book(req.user.id, req.body));
};
