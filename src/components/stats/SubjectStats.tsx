'use client';

import React, { useState } from 'react';
import { useSchedule } from '@/context/ScheduleContext';
import { ChevronDown, ChevronUp, BookOpen, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SubjectStatsCard: React.FC<{ subject: any }> = ({ subject }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const attendancePercent = subject.expected > 0 ? Math.round((subject.completed / subject.expected) * 100) : 0;

  return (
    <div className="glass-card overflow-hidden border-white/5 hover:border-white/10 transition-colors">
      <div className="p-5 flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-4">
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border", attendancePercent >= 75 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : attendancePercent >= 50 ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400")}>
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{subject.name}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-white/40 flex items-center gap-1"><Clock className="w-3 h-3" />{subject.expected} Total</span>
              <span className="text-xs text-emerald-400 font-bold">{attendancePercent}% Attendance</span>
            </div>
          </div>
        </div>
        {isExpanded ? <ChevronUp className="text-white/20" /> : <ChevronDown className="text-white/20" />}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-white/5 bg-white/[0.02]">
            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/60 flex items-center gap-2"><CheckCircle className="w-3 h-3" />Expected (Done)</p>
                <p className="text-3xl font-bold font-mono text-white">{subject.completed}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400/60 flex items-center gap-2"><XCircle className="w-3 h-3" />Cancelled</p>
                <p className="text-3xl font-bold font-mono text-white">{subject.cancelled}</p>
              </div>
              <div className="col-span-2 mt-4">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${attendancePercent}%` }} className={cn("h-full rounded-full", attendancePercent >= 75 ? "bg-emerald-500" : attendancePercent >= 50 ? "bg-amber-500" : "bg-rose-500")} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SubjectStats: React.FC = () => {
  const { stats, isLoaded } = useSchedule();
  if (!isLoaded) return <div className="animate-pulse py-20 text-center">Crunching attendance data...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Academic Statistics</h2>
        <p className="text-white/40 mt-1">Calculation results from Feb 17, 2026 to today.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.length > 0 ? stats.map((s) => <SubjectStatsCard key={s.name} subject={s} />) : (
          <div className="col-span-full py-12 text-center glass-card border-dashed">
            <TrendingUp className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/40">No data available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectStats;
