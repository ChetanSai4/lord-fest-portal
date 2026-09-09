import Fund from '../models/Fund.js';
import Expense from '../models/Expense.js';
import Event from '../models/Event.js';
import Gallery from '../models/Gallery.js';
import Audio from '../models/Audio.js';
import LadduBid from '../models/LadduBid.js';
import LuckyDip from '../models/LuckyDip.js';

export const getDashboardAnalytics = async () => {
  // Aggregate total funds
  const fundsResult = await Fund.aggregate([
    { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
  ]);
  const totalFunds = fundsResult.length > 0 ? fundsResult[0].total : 0;
  const fundsCount = fundsResult.length > 0 ? fundsResult[0].count : 0;

  // Aggregate total expenses
  const expensesResult = await Expense.aggregate([
    { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
  ]);
  const totalExpenses = expensesResult.length > 0 ? expensesResult[0].total : 0;
  const expensesCount = expensesResult.length > 0 ? expensesResult[0].count : 0;

  // Remaining balance
  const remainingBalance = totalFunds - totalExpenses;

  // Expense by category
  const expensesByCategory = await Expense.aggregate([
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
    { $sort: { total: -1 } }
  ]);

  // Counts
  const totalEvents = await Event.countDocuments();
  const totalPhotos = await Gallery.countDocuments();
  const totalAudio = await Audio.countDocuments();

  // Recent Activity
  const recentDonations = await Fund.find().sort({ date: -1 }).limit(5);
  const recentExpenses = await Expense.find().sort({ date: -1 }).limit(5);
  const upcomingEvents = await Event.find({ date: { $gte: new Date() } }).sort({ date: 1 }).limit(5);

  const ladduBids = await LadduBid.find().sort({ amount: -1 }).limit(1);
  const highestLadduBid = ladduBids.length > 0 ? ladduBids[0].amount : 0;

  const luckyDipResult = await LuckyDip.aggregate([
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const totalLuckyDip = luckyDipResult.length > 0 ? luckyDipResult[0].total : 0;

  return {
    totalFunds,
    fundsCount,
    totalExpenses,
    expensesCount,
    remainingBalance,
    expensesByCategory,
    totalEvents,
    totalPhotos,
    totalAudio,
    highestLadduBid,
    totalLuckyDip,
    recentDonations,
    recentExpenses,
    upcomingEvents
  };
};
