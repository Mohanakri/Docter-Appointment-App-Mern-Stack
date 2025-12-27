import cors from 'cors';
import helmet from 'helmet';
import express from 'express';

export const httpMiddlewares = [
  helmet(),
  cors(),
  express.json(),
  express.urlencoded({ extended: true })
];
