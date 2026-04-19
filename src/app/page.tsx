'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import TodayView from '@/components/dashboard/TodayView';
import SubjectStats from '@/components/stats/SubjectStats';
import HistoryTimeline from '@/components/history/HistoryTimeline';
import ExcelUploader from '@/components/admin/ExcelUploader';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <TodayView />;
      case 'stats': return <SubjectStats />;
      case 'history': return <HistoryTimeline />;
      case 'admin': return <ExcelUploader />;
      default: return <TodayView />;
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-20 selection:bg-primary/30 selection:text-primary">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-12 mb-20 origin-top">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, filter: 'blur(10px)', y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="hidden md:flex fixed bottom-8 left-1/2 -translate-x-1/2 items-center gap-4 bg-black/60 backdrop-blur-xl px-8 py-3.5 rounded-2xl border border-white/10 text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 shadow-2xl">
        <span className="text-primary/70">Sync Production</span>
        <span className="w-1 h-1 rounded-full bg-white/10" />
        <span className="hover:text-white/60 transition-colors pointer-events-none">Faisalabad Hub</span>
      </div>
    </div>
  );
}
