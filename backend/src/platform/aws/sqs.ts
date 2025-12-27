import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

export const sqs = new SQSClient({ region: process.env.AWS_REGION });

export const pushJob = (queueUrl: string, payload: any) =>
  sqs.send(new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(payload)
  }));
