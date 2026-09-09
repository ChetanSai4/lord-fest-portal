import mongoose from 'mongoose';
import Location from './models/Location.js';

mongoose.connect('mongodb://127.0.0.1:54700/test').then(async () => {
  await Location.updateOne({}, { name: 'Sri Sivani College of Engineering', address: 'Sri Sivani College of Engineering, Chilakapalem' });
  console.log('Location updated');
  process.exit(0);
});
