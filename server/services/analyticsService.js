import Fund from '../models/Fund.js';
import Expense from '../models/Expense.js';
import Event from '../models/Event.js';
import Gallery from '../models/Gallery.js';
import Audio from '../models/Audio.js';
import LadduBid from '../models/LadduBid.js';
import LuckyDip from '../models/LuckyDip.js';

export const getDashboardAnalytics = async () => {
  const [
    fundsResult,
    expensesResult,
    expensesByCategory,
    totalEvents,
    totalPhotos,
    totalAudio,
    recentDonations,
    recentExpenses,
    upcomingEvents,
    ladduBids,
    luckyDipResult
  ] = await Promise.all([
    Fund.aggregate([{ $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }]),
    Expense.aggregate([{ $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }]),
    Expense.aggregate([{ $group: { _id: '$category', total: { $sum: '$amount' } } }, { $sort: { total: -1 } }]),
    Event.countDocuments(),
    Gallery.countDocuments(),
    Audio.countDocuments(),
    Fund.find().sort({ date: -1 }).limit(5),
    Expense.find().sort({ date: -1 }).limit(5),
    Event.find({ date: { $gte: new Date() } }).sort({ date: 1 }).limit(5),
    LadduBid.find().sort({ amount: -1 }).limit(1),
    LuckyDip.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }])
  ]);

  const totalFunds = fundsResult.length > 0 ? fundsResult[0].total : 0;
  const fundsCount = fundsResult.length > 0 ? fundsResult[0].count : 0;
  const totalExpenses = expensesResult.length > 0 ? expensesResult[0].total : 0;
  const expensesCount = expensesResult.length > 0 ? expensesResult[0].count : 0;
  const remainingBalance = totalFunds - totalExpenses;
  const highestLadduBid = ladduBids.length > 0 ? ladduBids[0].amount : 0;
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
