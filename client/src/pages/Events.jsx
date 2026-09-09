import React, { useEffect, useState } from 'react';
import { getEvents } from '../services/api';
import { format } from 'date-fns';
import { Clock, MapPin, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Plus } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const { isAdmin } = useAuth();

  useEffect(() => {
    getEvents().then(res => setEvents(res.data.data));
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-200 tracking-tight">Festival Schedule</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">11-day synchronized event itinerary.</p>
        </div>
        {isAdmin && (
           <button className="btn-primary py-2.5 px-6">
             <Plus size={18} className="mr-2" /> Add Event
           </button>
        )}
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-12 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-saffron-100 before:via-saffron-300 before:to-saffron-100">
        {events.map((event) => (
          <div key={event._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 bg-saffron-500 text-white shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <Sparkles size={20} />
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] card p-6 hover:-translate-y-1 transition-transform duration-300 border-t-4 border-t-saffron-500">
              <div className="flex items-start justify-between mb-2">
                <div className="flex flex-col">
                  <span className="text-saffron-600 font-extrabold tracking-widest text-xs uppercase mb-1">
                    {format(new Date(event.date), 'MMM dd, yyyy')}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-200">{event.name}</h3>
                </div>
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-extrabold rounded-full border border-blue-200 dark:border-blue-800 shadow-sm">
                  {event.eventType}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 font-medium leading-relaxed">{event.description}</p>
              <div className="flex flex-wrap items-center gap-5 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-2"><Clock size={16} className="text-saffron-500"/> {event.startTime} - {event.endTime}</span>
                <span className="flex items-center gap-2"><MapPin size={16} className="text-emerald-500"/> {event.venue}</span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
