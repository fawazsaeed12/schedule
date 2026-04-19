'use client';

import React, { useState } from 'react';
import { Shield, Key, Lock, Unlock, LayoutDashboard, Database, History, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSchedule } from '@/context/ScheduleContext';
import { verifyAdminKey } from '@/lib/actions';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavProps> = ({ activeTab, setActiveTab }) => {
  const { isAdmin, toggleAdmin } = useSchedule();
  const [keyInput, setKeyInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleAdminToggle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdmin) {
      toggleAdmin(false);
      return;
    }

    setIsVerifying(true);
    const isValid = await verifyAdminKey(keyInput);
    setIsVerifying(false);

    if (isValid) {
      toggleAdmin(true);
      setKeyInput('');
    } else {
      alert('Invalid Admin Key');
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'stats', label: 'Stats', icon: Calculator },
    { id: 'history', label: 'History', icon: History },
    { id: 'admin', label: 'Setup', icon: Database, adminOnly: true },
  ];

  return (
    <>
      {/* Top Bar - Branding & Admin */}
      <nav className="sticky top-0 z-50 glass-card mx-2 sm:mx-4 mt-2 sm:mt-4 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-white/10 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div className="hidden min-[400px]:block">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-none">UniSync</h1>
            <p className="text-[8px] sm:text-[10px] text-primary uppercase font-bold tracking-[0.2em] mt-0.5">BSCYS 2A</p>
          </div>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
          {tabs.map((tab) => (
            (!tab.adminOnly || isAdmin) && (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium",
                  activeTab === tab.id 
                    ? "bg-primary text-black shadow-lg shadow-primary/25" 
                    : "hover:bg-white/10 text-white/60 hover:text-white"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          ))}
        </div>

        {/* Admin Input */}
        <div className="flex items-center gap-2">
          <form onSubmit={handleAdminToggle} className="relative group">
            <input
              type="password"
              placeholder={isAdmin ? "CR" : isVerifying ? "..." : "Key"}
              disabled={isAdmin || isVerifying}
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 pl-9 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all w-24 sm:w-32 focus:w-36 sm:focus:w-48 disabled:opacity-50 text-white"
            />
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 group-focus-within:text-primary transition-colors" />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              disabled={isVerifying}
            >
              {isAdmin ? <Unlock className="w-3.5 h-3.5 text-primary" /> : <Lock className="w-3.5 h-3.5 text-white/20" />}
            </button>
          </form>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/80 backdrop-blur-2xl border-t border-white/5 px-4 pb-6 pt-2">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {tabs.map((tab) => (
            (!tab.adminOnly || isAdmin) && (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center gap-1 min-w-[64px] relative"
              >
                <div className={cn(
                  "p-2 rounded-2xl transition-all duration-300",
                  activeTab === tab.id ? "bg-primary text-black scale-110 shadow-lg shadow-primary/20" : "text-white/40"
                )}>
                  <tab.icon className="w-5 h-5" />
                </div>
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-widest transition-all duration-300",
                  activeTab === tab.id ? "text-primary opacity-100" : "text-white/20 opacity-0"
                )}>
                  {tab.label}
                </span>
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="nav-glow"
                    className="absolute -top-1 w-8 h-1 bg-primary rounded-full blur-[4px]"
                  />
                )}
              </button>
            )
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;
