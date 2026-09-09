import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlobalAudioPlayer from '../components/GlobalAudioPlayer';
import Footer from '../components/Footer';
import { LayoutDashboard, Calendar, IndianRupee, Image as ImageIcon, Music, MapPin, Menu, Video, Shield, User, Moon, Sun, Flower2, Trophy, Gift, UserCog, X, Globe } from 'lucide-react';

const AppShell = () => {
  const { isAdmin, isMainAdmin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);



  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Festival Info', path: '/festival', icon: <Flower2 size={20} /> },
    { name: 'Events Schedule', path: '/events', icon: <Calendar size={20} /> },
    { name: 'Donations & Funds', path: '/funds', icon: <IndianRupee size={20} /> },
    { name: 'Expenses', path: '/expenses', icon: <IndianRupee size={20} className="opacity-70" /> },
    { name: 'Photo Gallery', path: '/gallery', icon: <ImageIcon size={20} /> },
    { name: 'Audio Library', path: '/audio', icon: <Music size={20} /> },
    { name: 'Video Library', path: '/videos', icon: <Video size={20} /> },
    { name: 'Mandap Location', path: '/location', icon: <MapPin size={20} /> },
    { name: 'Laddu Auction', path: '/laddu-bid', icon: <Trophy size={20} /> },
    { name: 'Lucky Dip', path: '/lucky-dip', icon: <Gift size={20} /> },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Manage Admins', path: '/admin/users', icon: <UserCog size={20} /> });
  }

  const handlePortalSwitch = () => {
    if (isAdmin) {
      logout();
      navigate('/');
    } else {
      navigate('/admin/settings');
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden relative z-0">
      <div className="watermark-bg"></div>
      <div className="crazy-bg-orb-1"></div>
      <div className="crazy-bg-orb-2"></div>
      

      
      {/* Top Bar Header */}
      <header className="flex-none flex flex-col z-50 glass-header relative">
        {/* Tier 1: Top Row */}
        <div className="h-16 lg:h-20 flex items-center justify-between px-4 lg:px-8 border-b border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-3">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-saffron-400 to-divine-600 text-white dark:text-black flex items-center justify-center shadow-lg dark:shadow-[0_0_20px_rgba(249,115,22,0.8)]"
            >
               <Flower2 size={28} />
            </motion.div>
            <div>
              <span className="block text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-saffron-500 to-divine-600 dark:from-saffron-300 dark:via-divine-200 dark:to-white drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(249,115,22,0.5)] uppercase">LORD FEST</span>
              <span className="block text-[10px] text-saffron-600 dark:text-saffron-500 font-bold tracking-[0.3em] uppercase -mt-1">{isAdmin ? 'Admin Portal' : 'Public Portal'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-5">

            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-slate-600 hover:text-slate-900 dark:text-divine-200 dark:hover:text-white transition-colors hidden sm:block hover:scale-110">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="hidden sm:flex bg-slate-100 dark:bg-white/5 backdrop-blur-xl p-1 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.5)]">
               <button onClick={() => isAdmin && handlePortalSwitch()} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${!isAdmin ? 'bg-white dark:bg-black/60 text-saffron-600 dark:text-saffron-400 shadow-sm dark:shadow-[0_0_15px_rgba(249,115,22,0.3)] border border-saffron-500/30' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5'}`}>
                 <User size={16}/> Public
               </button>
               <button onClick={() => !isAdmin && handlePortalSwitch()} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${isAdmin ? 'bg-gradient-to-r from-saffron-400 to-divine-500 dark:from-saffron-500 dark:to-divine-500 text-white dark:text-black shadow-md dark:shadow-[0_0_20px_rgba(249,115,22,0.6)]' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5'}`}>
                 <Shield size={16}/> Admin
               </button>
            </div>
            {/* Mobile menu toggle */}
            <button className="lg:hidden p-2 text-saffron-600 dark:text-saffron-400" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
        
        {/* Tier 2: Horizontal Nav (Desktop) */}
        <div className="hidden lg:flex items-center overflow-x-auto px-4 lg:px-8 bg-slate-50/50 dark:bg-black/30 backdrop-blur-md [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border-b border-slate-200 dark:border-transparent">
          <nav className="flex items-center gap-2 h-16 w-max mx-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap relative overflow-hidden ${
                    isActive 
                      ? 'bg-saffron-50 dark:bg-white/10 text-saffron-600 dark:text-saffron-300 shadow-sm dark:shadow-[inset_0_0_20px_rgba(249,115,22,0.2)] border border-saffron-200 dark:border-saffron-500/50' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Mobile Dropdown Nav */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-black/95 backdrop-blur-3xl border-b border-saffron-500/30 shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 flex flex-col max-h-[75vh] overflow-y-auto"
            >
              <div className="flex sm:hidden p-4 border-b border-slate-200 dark:border-white/5 justify-between items-center bg-slate-50 dark:bg-white/5 gap-4">
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-saffron-600 dark:text-saffron-400 bg-white dark:bg-black/50 border border-slate-200 dark:border-transparent rounded-lg shadow-sm">
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

              </div>
              <div className="flex sm:hidden p-4 border-b border-slate-200 dark:border-white/5 justify-between items-center bg-white dark:bg-transparent gap-4">
                <div className="flex bg-slate-100 dark:bg-black/50 p-1 rounded-xl border border-slate-200 dark:border-white/10 w-full">
                   <button onClick={() => isAdmin && handlePortalSwitch()} className={`flex-1 items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 ${!isAdmin ? 'bg-white dark:bg-white/10 text-saffron-600 dark:text-saffron-400 border border-saffron-500/30 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}>Public</button>
                   <button onClick={() => !isAdmin && handlePortalSwitch()} className={`flex-1 items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 ${isAdmin ? 'bg-gradient-to-r from-saffron-400 to-divine-500 text-white dark:text-black shadow-md' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}>Admin</button>
                </div>
              </div>
              <nav className="flex flex-col p-4 gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                        isActive ? 'bg-saffron-50 dark:bg-gradient-to-r dark:from-saffron-500/20 dark:to-transparent text-saffron-600 dark:text-saffron-300 border-l-4 border-saffron-500' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                      }`
                    }
                  >
                    {item.icon}
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-8 bg-transparent">
        <div className="max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-200px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
          <Footer />
        </div>
      </main>

      <GlobalAudioPlayer />
    </div>
  );
};

export default AppShell;

