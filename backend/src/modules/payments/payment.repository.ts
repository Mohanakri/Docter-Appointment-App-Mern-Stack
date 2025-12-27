export const PaymentRepo = {
  create:(d:any)=>PaymentModel.create(d),
  markPaid:(id:string)=>PaymentModel.findByIdAndUpdate(id,{status:'PAID'})
};
