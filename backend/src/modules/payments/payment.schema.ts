export const CreatePaymentSchema = z.object({
  appointmentId: z.string(),
  amount: z.number()
});
