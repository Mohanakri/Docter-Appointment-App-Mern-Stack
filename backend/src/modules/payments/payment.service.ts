export const PaymentService = {
  async create(uid:string, data:any){
    const p = await PaymentRepo.create({ ...data, userId:uid, status:'CREATED', gateway:'RAZORPAY' });
    return p;
  },

  async confirm(paymentId:string){
    await PaymentRepo.markPaid(paymentId);
    await pushJob(process.env.NOTIFY_QUEUE!, { type:'PAYMENT_CONFIRMED', paymentId });
  }
};
