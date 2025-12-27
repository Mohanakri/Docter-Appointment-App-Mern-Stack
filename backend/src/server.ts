import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

mongoose.connect(process.env.MONGO_URI!)
  .then(() => app.listen(4000, () => console.log("Backend running")))
  .catch(err => {
    console.error("DB Failed", err);
    process.exit(1);
  });
