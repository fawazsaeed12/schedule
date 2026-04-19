'use client';

import React, { useState } from 'react';
import { Shield, Key, Lock, Unlock, LayoutDashboard, Database, History, Calculator } from 'lucide-react';
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
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'stats', label: 'Statistics', icon: Calculator },
    { id: 'history', label: 'History', icon: History },
    { id: 'admin', label: 'Settings', icon: Database, adminOnly: true },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-card mx-4 mt-4 px-6 py-4 flex items-center justify-between border-white/10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">UniSync</h1>
          <p className="text-[10px] text-primary uppercase font-bold tracking-[0.2em]">BSCYS 2A • Faisalabad</p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
        {tabs.map((tab) => (
          (!tab.adminOnly || isAdmin) && (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium",
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

      <div className="flex items-center gap-4">
        <form onSubmit={handleAdminToggle} className="relative group">
          <input
            type="password"
            placeholder={isAdmin ? "Logged In" : isVerifying ? "Verifying..." : "Admin Key"}
            disabled={isAdmin || isVerifying}
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all w-32 focus:w-48 disabled:opacity-50"
          />
          <Key className="absolute left-3 top-2.5 w-4 h-4 text-white/40 group-focus-within:text-primary transition-colors" />
          <button 
            type="submit"
            className="absolute right-3 top-2.5"
            disabled={isVerifying}
          >
            {isAdmin ? <Unlock className="w-4 h-4 text-primary" /> : <Lock className="w-4 h-4 text-white/20" />}
          </button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
