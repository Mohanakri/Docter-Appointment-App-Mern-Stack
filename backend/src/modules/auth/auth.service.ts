import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { AuthRepository } from './auth.repository';
import { signToken } from './auth.tokens';

export const AuthService = {
  async register(data: any) {
    const exists = await AuthRepository.findByEmail(data.email);
    if (exists) throw new Error('Email already used');

    data.password = await bcrypt.hash(data.password, 10);
    const user = await AuthRepository.create(data);

    return signToken({ id: user._id, role: user.role });
  },

  async login(data: any) {
    const user = await AuthRepository.findByEmail(data.email);
    if (!user) throw new Error('Invalid credentials');

    const ok = await bcrypt.compare(data.password, user.password);
    if (!ok) throw new Error('Invalid credentials');

    return signToken({ id: user._id, role: user.role });
  }
};


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
