import React, { useEffect, useState } from 'react';
import { getFestival } from '../services/api';
import { format } from 'date-fns';
import { Users, Calendar as CalendarIcon, Phone, Mail, Award, Sparkles } from 'lucide-react';

const Festival = () => {
  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFestival().then(res => {
      setFestival(res.data.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="animate-pulse space-y-6"><div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div></div>;
  if (!festival) return <div className="p-10 text-center text-slate-500 dark:text-slate-400 font-medium">No festival info found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative z-10">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-xl border border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-saffron-50 to-rose-50 dark:from-saffron-900/20 dark:to-rose-900/20 opacity-50"></div>
        <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-saffron-300/30 blur-[100px] rounded-full"></div>
        <div className="relative p-10 md:p-14 z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-full border-4 border-divine-300 p-1 shadow-[0_0_20px_rgba(223,179,108,0.5)] bg-obsidian-800 shrink-0 flex items-center justify-center overflow-hidden">
             <img src="/hero-backdrop.jpg" className="w-full h-full object-cover object-center" alt="Ganesha"/>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-sm text-slate-800 dark:text-slate-100">{festival.name} <span className="text-saffron-600 dark:text-saffron-400 bg-saffron-100 dark:bg-saffron-900/30 px-3 py-1 rounded-xl text-3xl">{festival.year}</span></h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl font-medium leading-relaxed">{festival.description}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
           <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-4 mb-5 flex items-center gap-3">
             <div className="p-2 bg-saffron-100 dark:bg-saffron-900/30 rounded-lg text-saffron-600 dark:text-saffron-400"><CalendarIcon size={22}/></div> Dates & Info
           </h3>
           <div className="space-y-4 text-slate-600 dark:text-slate-400">
             <p className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2"><strong className="text-slate-500 dark:text-slate-400">Start Date</strong> <span className="font-bold text-slate-800 dark:text-slate-200">{format(new Date(festival.startDate), 'PPP')}</span></p>
             <p className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2"><strong className="text-slate-500 dark:text-slate-400">End Date</strong> <span className="font-bold text-slate-800 dark:text-slate-200">{format(new Date(festival.endDate), 'PPP')}</span></p>
             <p className="flex justify-between"><strong className="text-slate-500 dark:text-slate-400">Organizer</strong> <span className="font-bold text-saffron-600 dark:text-saffron-400">{festival.organizer}</span></p>
           </div>
        </div>
        
        <div className="card p-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
           <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-4 mb-5 flex items-center gap-3">
             <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400"><Phone size={22}/></div> Contact Support
           </h3>
           <div className="space-y-4 text-slate-600 dark:text-slate-400">
             <a href={`tel:${festival.contact}`} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center"><Phone size={18} className="text-slate-500 dark:text-slate-400"/></div>
                <span className="font-mono text-lg font-bold tracking-wide text-slate-800 dark:text-slate-200">{festival.contact}</span>
             </a>
             <a href={`mailto:${festival.email}`} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center"><Mail size={18} className="text-slate-500 dark:text-slate-400"/></div>
                <span className="font-bold text-slate-800 dark:text-slate-200">{festival.email}</span>
             </a>
           </div>
        </div>
      </div>

      <div className="card p-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
         <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-4 mb-6 flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400"><Users size={22}/></div> Core Committee
         </h3>
         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {festival.committeeMembers?.map((member, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm hover:shadow-md">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-saffron-100 to-rose-100 dark:from-saffron-900/40 dark:to-rose-900/40 border border-saffron-200 dark:border-saffron-800 flex items-center justify-center shadow-inner relative">
                  <span className="text-xl font-black text-saffron-700 dark:text-saffron-400">{member.name.charAt(0)}</span>
                  {member.role === 'President' && <div className="absolute -top-2 -right-2 text-amber-500 drop-shadow-md bg-white dark:bg-slate-800 rounded-full p-0.5"><Award size={16} fill="currentColor"/></div>}
                </div>
                <div>
                  <p className="font-extrabold text-slate-800 dark:text-slate-200 text-base">{member.name}</p>
                  <p className="text-xs font-bold text-saffron-600 dark:text-saffron-400 uppercase tracking-widest mt-0.5 mb-1 bg-saffron-100 dark:bg-saffron-900/30 inline-block px-1.5 rounded">{member.role}</p>
                  <p className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">{member.phone}</p>
                </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Festival;
