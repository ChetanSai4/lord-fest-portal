import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Festival from '../models/Festival.js';
import Location from '../models/Location.js';
import Fund from '../models/Fund.js';
import Expense from '../models/Expense.js';
import Event from '../models/Event.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await Festival.deleteMany();
    await Location.deleteMany();
    await Fund.deleteMany();
    await Expense.deleteMany();
    await Event.deleteMany();

    console.log('Seeding Festival info...');
    await Festival.create({
      name: 'Sri Vinayaka Yuvajana Sangham Street Celebration',
      year: '2026',
      description: 'Grand 11-day celebration of Lord Ganesha featuring daily poojas, bhajans, and Maha Annadanam.',
      organizer: 'Sri Vinayaka Yuvajana Sangham',
      contact: '+91 9876543210',
      email: 'contact@vinayakautsav.com',
      startDate: new Date('2026-09-05'),
      endDate: new Date('2026-09-15'),
      committeeMembers: [
        { name: 'Rahul Sharma', role: 'President', phone: '9876543210' },
        { name: 'Kiran Kumar', role: 'Treasurer', phone: '9876543211' }
      ]
    });

    console.log('Seeding Location info...');
    await Location.create({
      name: '14th Ward Street Pandal',
      address: 'Main Road, 14th Ward, Jubilee Hills, Hyderabad',
      latitude: 17.4326,
      longitude: 78.4071,
      landmark: 'Near Water Tank',
      directions: 'Take the left from the main junction.'
    });

    console.log('Seeding Funds...');
    await Fund.insertMany([
      { contributorName: 'Anil Reddy', amount: 15000, paymentMode: 'UPI', purpose: 'General Fund' },
      { contributorName: 'Suresh Babu', amount: 5000, paymentMode: 'Cash', purpose: 'Annadanam' },
      { contributorName: 'Priya Desai', amount: 2500, paymentMode: 'Bank Transfer', purpose: 'Pooja Items' }
    ]);

    console.log('Seeding Expenses...');
    await Expense.insertMany([
      { title: 'Ganesha Idol', category: 'Idol & Pooja Items', amount: 12000, paidTo: 'Murthy Arts', paymentMode: 'UPI' },
      { title: 'Pandal Setup', category: 'Decoration & Mandapam', amount: 25000, paidTo: 'Sri Ram Tents', paymentMode: 'Bank Transfer' },
      { title: 'Sound System', category: 'Sound & Lighting', amount: 8000, paidTo: 'DJ Sounds', paymentMode: 'Cash' }
    ]);

    console.log('Seeding Events...');
    await Event.insertMany([
      { name: 'Maha Ganapati Pratishthapana', description: 'Installation of the idol with Vedic chants.', date: new Date('2026-09-05'), startTime: '09:00 AM', endTime: '12:30 PM', venue: 'Main Pandal', eventType: 'Pooja', status: 'Completed' },
      { name: 'Evening Bhajan', description: 'Devotional songs by local artists.', date: new Date('2026-09-06'), startTime: '06:30 PM', endTime: '09:00 PM', venue: 'Main Pandal', eventType: 'Bhajan', status: 'Upcoming' },
      { name: 'Maha Annadanam', description: 'Free meals provided for all devotees.', date: new Date('2026-09-10'), startTime: '12:30 PM', endTime: '03:30 PM', venue: 'Street Corner Hall', eventType: 'Annadanam', status: 'Upcoming' }
    ]);

    console.log('Data seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
