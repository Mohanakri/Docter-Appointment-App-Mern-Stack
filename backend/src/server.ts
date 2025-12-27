import mongoose from 'mongoose';
import app from './app';

mongoose.connect(process.env.MONGO_URI!).then(()=>{
  app.listen(4000, ()=> console.log('Server running'));
});
