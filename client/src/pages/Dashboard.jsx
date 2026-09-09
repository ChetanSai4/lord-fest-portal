import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboard } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { IndianRupee, Receipt, Wallet, Calendar as CalendarIcon, Image as ImageIcon, Music, Activity, TrendingUp, Gift, Award } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import LandingHero from '../components/LandingHero';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, trend, trendValue, color = 'saffron', onClick }) => {
  const colorMap = {
    saffron: 'bg-white dark:bg-obsidian-900 border-saffron-100 dark:border-divine-300/30 text-saffron-600 dark:text-divine-300',
    green: 'bg-white dark:bg-obsidian-900 border-emerald-100 dark:border-divine-300/30 text-emerald-600 dark:text-emerald-400',
    blue: 'bg-white dark:bg-obsidian-900 border-blue-100 dark:border-divine-300/30 text-blue-600 dark:text-blue-400',
    maroon: 'bg-white dark:bg-obsidian-900 border-rose-100 dark:border-divine-300/30 text-rose-600 dark:text-rose-400',
    gold: 'bg-white dark:bg-obsidian-900 border-amber-100 dark:border-divine-300/40 text-amber-600 dark:text-divine-200'
  };

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{ transformStyle: 'preserve-3d' }}
      className={`card p-6 flex items-start justify-between relative group border shadow-lg hover:shadow-2xl ${colorMap[color]} ${onClick ? 'cursor-pointer' : ''} transition-all duration-300`}
    >
      <div className={`absolute -right-6 -top-6 w-24 h-24 bg-current opacity-10 blur-2xl group-hover:scale-150 transition-transform duration-700 rounded-full`}></div>
      <div className="z-10 relative" style={{ transform: 'translateZ(20px)' }}>
        <p className="text-xs font-bold text-slate-500 dark:text-divine-400 mb-2 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-extrabold text-slate-800 dark:text-divine-100 tracking-tight">{value}</h3>
        
        {trend && (
          <div className="flex items-center gap-1.5 mt-3 text-xs font-bold">
            <span className={`flex items-center gap-0.5 ${trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              <TrendingUp size={14} className={trend === 'down' ? 'rotate-180' : ''}/>
              {trendValue}
            </span>
            <span className="text-slate-400">vs last month</span>
          </div>
        )}
      </div>
      
      <div style={{ transform: 'translateZ(30px)' }} className={`w-12 h-12 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm border border-slate-100 dark:border-slate-700 z-10 text-current`}>
        {icon}
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    getDashboard()
      .then(res => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        addToast('Failed to load dashboard data', 'error');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-36 bg-slate-200 dark:bg-slate-800 rounded-2xl border border-slate-300 dark:border-slate-700"></div>)}
      </div>
    </div>;
  }

  return (
    <div className="relative">
      <div className="-mt-8 -mx-4 sm:-mx-8 md:-mx-12 lg:-mx-16 xl:-mx-20 2xl:-mx-32 mb-12">
         <LandingHero />
      </div>

      <div className="space-y-8 relative z-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-divine-100 tracking-tight">System Metrics</h2>
          <p className="text-slate-500 dark:text-divine-400 mt-1 font-medium">Real-time financial and event overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
          title="Total Funds Collected" 
          value={formatCurrency(data?.totalFunds)} 
          icon={<IndianRupee size={24} />} 
          color="green" 
          trend="up"
          trendValue="+12%"
          onClick={() => navigate('/funds')}
        />
        <StatCard 
          title="Total Expenses" 
          value={formatCurrency(data?.totalExpenses)} 
          icon={<Receipt size={24} />} 
          color="maroon" 
          trend="up"
          trendValue="+5%"
          onClick={() => navigate('/expenses')}
        />
        <StatCard 
          title="Remaining Balance" 
          value={formatCurrency(data?.remainingBalance)} 
          icon={<Wallet size={24} />} 
          color="saffron" 
          onClick={() => navigate('/funds')}
        />
        <StatCard 
          title="Lucky Dip Collections" 
          value={formatCurrency(data?.totalLuckyDip)} 
          icon={<Gift size={24} />} 
          color="gold" 
          onClick={() => navigate('/lucky-dip')}
        />
        <StatCard 
          title="Laddu Highest Bid" 
          value={formatCurrency(data?.highestLadduBid)} 
          icon={<Award size={24} />} 
          color="saffron" 
          onClick={() => navigate('/laddu-auction')}
        />
        <StatCard 
          title="Events Scheduled" 
          value={data?.totalEvents} 
          icon={<CalendarIcon size={24} />} 
          color="blue" 
          onClick={() => navigate('/events')}
        />
        <StatCard 
          title="Media Gallery" 
          value={data?.totalPhotos} 
          icon={<ImageIcon size={24} />} 
          color="gold" 
          onClick={() => navigate('/gallery')}
        />
        <StatCard 
          title="Audio Library" 
          value={data?.totalAudio} 
          icon={<Music size={24} />} 
          color="saffron" 
          onClick={() => navigate('/audio')}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        <div className="card dark:bg-slate-900 border-none shadow-xl">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Activity size={18} className="text-emerald-500"/> 
              Recent Transactions (Inflow)
            </h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {data?.recentDonations?.map(d => (
              <div key={d._id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div>
                  <p className="font-bold text-slate-700 dark:text-slate-300">{d.contributorName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">{formatDate(d.date)} <span className="mx-2">•</span> <span className="text-saffron-600 dark:text-saffron-400 uppercase tracking-wider bg-saffron-100 dark:bg-saffron-900/30 px-2 py-0.5 rounded-md">{d.paymentMode}</span></p>
                </div>
                <div className="font-extrabold text-emerald-600 text-lg">+{formatCurrency(d.amount)}</div>
              </div>
            ))}
            {data?.recentDonations?.length === 0 && (
              <div className="px-6 py-10 text-center text-slate-400 font-medium">No inflows detected.</div>
            )}
          </div>
        </div>

        <div className="card dark:bg-slate-900 border-none shadow-xl">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Receipt size={18} className="text-rose-500"/> 
              Recent Disbursals (Outflow)
            </h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {data?.recentExpenses?.map(e => (
              <div key={e._id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div>
                  <p className="font-bold text-slate-700 dark:text-slate-300">{e.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">{formatDate(e.date)} <span className="mx-2">•</span> <span className="text-rose-600 dark:text-rose-400 uppercase tracking-wider bg-rose-100 dark:bg-rose-900/30 px-2 py-0.5 rounded-md">{e.category}</span></p>
                </div>
                <div className="font-extrabold text-rose-600 text-lg">-{formatCurrency(e.amount)}</div>
              </div>
            ))}
            {data?.recentExpenses?.length === 0 && (
              <div className="px-6 py-10 text-center text-slate-400 font-medium">No outflows detected.</div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
