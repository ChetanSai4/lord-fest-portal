import React, { useEffect, useState } from 'react';
import { getLocation } from '../services/api';
import { MapPin, Navigation, Map } from 'lucide-react';

const LocationPage = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getLocation().then(res => setLocation(res.data.data));
  }, []);

  if (!location) return null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto relative z-10">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">Mandap Location</h2>
        <p className="text-slate-500 text-sm mt-1 font-medium">Navigate to the grand celebration.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="card p-6 border-l-4 border-l-saffron-500">
            <h3 className="font-extrabold text-xl mb-4 text-slate-800 dark:text-slate-200">{location.name}</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                <MapPin size={20} className="text-saffron-500 shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">{location.address}</p>
              </div>
              <div className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                <Map size={20} className="text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1">Landmark</p>
                  <p className="font-medium">{location.landmark}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                <Navigation size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1">Directions</p>
                  <p className="font-medium text-sm">{location.directions}</p>
                </div>
              </div>
            </div>
          </div>
          
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`} 
            target="_blank" 
            rel="noreferrer"
            className="btn-primary w-full py-4 text-lg"
          >
            Open in Google Maps
          </a>
        </div>
        
        <div className="md:col-span-2 h-[500px] card overflow-hidden p-1">
          <iframe 
            src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&hl=es;z=14&output=embed`}
            width="100%" 
            height="100%" 
            style={{ border: 0, borderRadius: '0.75rem' }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps Location"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default LocationPage;
