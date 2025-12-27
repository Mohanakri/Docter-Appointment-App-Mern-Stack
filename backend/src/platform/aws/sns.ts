import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

export const sns = new SNSClient({ region: process.env.AWS_REGION });

export const notify = (topicArn: string, msg: string) =>
  sns.send(new PublishCommand({
    TopicArn: topicArn,
    Message: msg
  }));
