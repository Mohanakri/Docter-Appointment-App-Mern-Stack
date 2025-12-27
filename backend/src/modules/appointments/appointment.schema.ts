import { z } from 'zod';

export const BookAppointmentSchema = z.object({
  doctorId: z.string(),
  slot: z.string()
});
