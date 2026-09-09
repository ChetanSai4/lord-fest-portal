import Festival from '../models/Festival.js';
import Location from '../models/Location.js';
import Fund from '../models/Fund.js';
import Expense from '../models/Expense.js';
import Event from '../models/Event.js';
import Video from '../models/Video.js';
import AdminUser from '../models/AdminUser.js';
import mongoose from 'mongoose';

export const autoSeed = async (force = false) => {
  try {
    // ALWAYS ensure the Main Admin exists regardless of other data
    await AdminUser.updateOne(
      { username: '7981418433' },
      { $set: { password: '1105', isMainAdmin: true, role: 'admin' } },
      { upsert: true }
    );

    await Location.updateOne({}, {
      $set: {
        name: 'Sri Sivani College of Engineering',
        address: 'Sri Sivani College of Engineering, Chilakapalem',
        latitude: 18.2436,
        longitude: 83.8234,
        landmark: 'Main Campus',
        directions: 'Follow the main highway towards Chilakapalem.'
      }
    }, { upsert: true });

    await Festival.updateOne({}, {
      $set: {
        contact: '7981418433',
        email: 'pethakamsettichetansai05@gmail.com',
        committeeMembers: [
          { name: 'P. Chetan Sai', role: 'President', phone: '7981418433' },
          { name: 'P. Chetan Sai', role: 'Treasurer', phone: '7981418433' },
          { name: 'Sai Gurunadh', role: 'Secretary', phone: '8688049088' }
        ]
      }
    });

    const count = await Festival.countDocuments();
    if (count > 0 && !force) {
      console.log('Database already has data. Skipping auto-seed.');
      return;
    }

    console.log('Clearing database and Auto-seeding initial data...');
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
       await collection.deleteMany({});
    }

    await AdminUser.create({
      username: '7981418433',
      password: '1105',
      isMainAdmin: true
    });
    
    await Festival.create({
      name: 'Sri Vinayaka Yuvajana Sangham Street Celebration',
      year: '2026',
      description: 'Grand 11-day celebration of Lord Ganesha featuring daily poojas, cultural activities, and Maha Annadanam.',
      organizer: 'Sri Vinayaka Yuvajana Sangham',
      contact: '7981418433',
      email: 'pethakamsettichetansai05@gmail.com',
      startDate: new Date('2026-09-05'),
      endDate: new Date('2026-09-15'),
      committeeMembers: [
        { name: 'P. Chetan Sai', role: 'President', phone: '7981418433' },
        { name: 'P. Chetan Sai', role: 'Treasurer', phone: '7981418433' },
        { name: 'Sai Gurunadh', role: 'Secretary', phone: '8688049088' }
      ]
    });

    await Location.deleteMany({});
    await Location.create({
      name: 'Sri Sivani College of Engineering',
      address: 'Sri Sivani College of Engineering, Chilakapalem',
      latitude: 18.2436,
      longitude: 83.8234,
      landmark: 'Main Campus',
      directions: 'Follow the main highway towards Chilakapalem.'
    });

    await Fund.insertMany([
      { contributorName: 'Anil Reddy', amount: 15000, paymentMode: 'UPI', purpose: 'General Fund' },
      { contributorName: 'Suresh Babu', amount: 5000, paymentMode: 'Cash', purpose: 'Annadanam' },
      { contributorName: 'Priya Desai', amount: 2500, paymentMode: 'Bank Transfer', purpose: 'Pooja Items' }
    ]);

    await Expense.insertMany([
      { title: 'Ganesha Idol', category: 'Idol & Pooja Items', amount: 12000, paidTo: 'Murthy Arts', paymentMode: 'UPI' },
      { title: 'Pandal Setup', category: 'Decoration & Mandapam', amount: 25000, paidTo: 'Sri Ram Tents', paymentMode: 'Bank Transfer' },
      { title: 'Sound System', category: 'Sound & Lighting', amount: 8000, paidTo: 'DJ Sounds', paymentMode: 'Cash' }
    ]);

    const events = [];
    for(let i = 1; i <= 11; i++) {
       let eventName = `Day ${i} Pooja`;
       let desc = `Daily evening harathi and special pooja for Day ${i}.`;
       let type = 'Pooja';
       let time = '06:30 PM';
       
       if (i === 1) { eventName = 'Maha Ganapati Pratishthapana'; desc = 'Installation of the idol with Vedic chants.'; type = 'Pooja'; time = '09:00 AM'; }
       if (i === 3) { eventName = 'Cultural Dance Night'; desc = 'Performances by local children.'; type = 'Cultural Program'; }
       if (i === 5) { eventName = 'Maha Annadanam'; desc = 'Free meals provided for all devotees.'; type = 'Annadanam'; time = '12:30 PM'; }
       if (i === 9) { eventName = 'Bhajan Sandhya'; desc = 'Devotional songs by local artists.'; type = 'Bhajan'; }
       if (i === 11) { eventName = 'Nimajjanam (Immersion)'; desc = 'Grand procession for idol immersion.'; type = 'Procession'; time = '04:00 PM'; }

       events.push({
         name: eventName,
         description: desc,
         date: new Date(`2026-09-${(4+i).toString().padStart(2, '0')}`),
         startTime: time,
         endTime: '09:00 PM',
         venue: i === 11 ? 'Hussain Sagar' : 'Main Pandal',
         eventType: type,
         status: i === 1 ? 'Completed' : 'Upcoming'
       });
    }
    await Event.insertMany(events);

    await Video.insertMany([
      { title: 'Day 1: Idol Installation Highlights', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'Glimpses of the grand setup and pooja.' },
      { title: 'Preparation and Pandal Making', url: 'https://www.youtube.com/embed/tgbNymZ7vqY', description: 'Behind the scenes of the celebration.' }
    ]);

    console.log('Auto-seeding completed successfully!');
  } catch (error) {
    console.error('Error in auto-seeding:', error);
  }
};
