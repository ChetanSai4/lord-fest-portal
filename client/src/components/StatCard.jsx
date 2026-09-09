import React from 'react';

const StatCard = ({ title, value, icon, trend, trendValue, color = 'saffron' }) => {
  const colorMap = {
    saffron: 'bg-saffron-50 text-saffron-600',
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    maroon: 'bg-maroon-50 text-maroon-600',
    gold: 'bg-gold-50 text-gold-600'
  };

  return (
    <div className="card p-6 flex items-start justify-between relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-white/0 to-slate-100/50 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        
        {trend && (
          <div className="flex items-center gap-1 mt-2 text-xs">
            <span className={trend === 'up' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
              {trendValue}
            </span>
            <span className="text-slate-400">vs last month</span>
          </div>
        )}
      </div>
      
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
