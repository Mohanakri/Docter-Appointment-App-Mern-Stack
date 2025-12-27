import { notify } from '@/platform/aws/sns';
import { sqs } from '@/platform/aws/sqs';
import { ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';

while (true) {
  const msgs = await sqs.send(new ReceiveMessageCommand({ QueueUrl: process.env.VERIFY_QUEUE! }));
  if (!msgs.Messages) continue;

  for (const m of msgs.Messages) {
    const { email, token } = JSON.parse(m.Body!);
    await notify(process.env.SNS_TOPIC!, `Verify: https://api.app.com/verify/${token}`);
    await sqs.send(new DeleteMessageCommand({ QueueUrl: process.env.VERIFY_QUEUE!, ReceiptHandle: m.ReceiptHandle! }));
  }
}
