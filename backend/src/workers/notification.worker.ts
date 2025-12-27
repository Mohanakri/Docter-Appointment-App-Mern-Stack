import { sqs } from '@/platform/aws/sqs';
import { notify } from '@/platform/aws/sns';
import { ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';

while (true) {
  const msgs = await sqs.send(new ReceiveMessageCommand({ QueueUrl: process.env.NOTIFY_QUEUE! }));
  if (!msgs.Messages) continue;

  for (const m of msgs.Messages) {
    const job = JSON.parse(m.Body!);

    if (job.type === 'APPOINTMENT_BOOKED')
      await notify(process.env.SNS_TOPIC!, `Appointment booked: ${job.apptId}`);

    if (job.type === 'PAYMENT_CONFIRMED')
      await notify(process.env.SNS_TOPIC!, `Payment success: ${job.paymentId}`);

    await sqs.send(new DeleteMessageCommand({ QueueUrl: process.env.NOTIFY_QUEUE!, ReceiptHandle: m.ReceiptHandle! }));
  }
}
