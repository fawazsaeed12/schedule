'use client';

import React, { useState, useMemo } from 'react';
import { useSchedule } from '@/context/ScheduleContext';
import { ChevronDown, ChevronUp, BookOpen, CheckCircle, XCircle, Clock, TrendingUp, Award, AlertTriangle, ArrowUpDown, BarChart3 } from 'lucide-react';
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
    <div className="glass-card overflow-hidden border-white/5 hover:border-white/10 transition-all duration-300 group">
      <div 
        className="p-5 flex items-center justify-between cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center border transition-transform duration-500 group-hover:scale-110", 
            attendancePercent >= 75 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : 
            attendancePercent >= 50 ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : 
            "bg-rose-500/10 border-rose-500/20 text-rose-400"
          )}>
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg tracking-tight">{subject.name}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 flex items-center gap-1">
                 {subject.expected} Expected
              </span>
              <div className="w-1 h-1 rounded-full bg-white/10" />
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest",
                attendancePercent >= 75 ? "text-emerald-400" : attendancePercent >= 50 ? "text-amber-400" : "text-rose-400"
              )}>
                {attendancePercent}% Participation
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           {attendancePercent < 75 && attendancePercent > 0 && <AlertTriangle className="w-4 h-4 text-amber-500/40" />}
           {isExpanded ? <ChevronUp className="text-white/20" /> : <ChevronDown className="text-white/20" />}
        </div>
      </div>

      <div className="px-5 pb-5">
         <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${attendancePercent}%` }} 
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full", 
                attendancePercent >= 75 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" : 
                attendancePercent >= 50 ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]" : 
                "bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]"
              )} 
            />
         </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            className="border-t border-white/5 bg-white/[0.01]"
          >
            <div className="p-4 sm:p-6 flex flex-col sm:grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-emerald-400/40" />
                  Successfully Marked
                </p>
                <p className="text-2xl sm:text-3xl font-black text-white">{subject.completed}</p>
                <p className="text-[10px] text-white/10">Classes you attended.</p>
              </div>
              <div className="space-y-1 sm:text-right">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 flex items-center sm:justify-end gap-2">
                  <XCircle className="w-3 h-3 text-rose-400/40" />
                  Cancelled by Admin
                </p>
                <p className="text-2xl sm:text-3xl font-black text-white">{subject.cancelled}</p>
                <p className="text-[10px] text-white/10">Classes declared as cancelled.</p>
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
  const [sortBy, setSortBy] = useState<'name' | 'attendance'>('attendance');

  const sortedStats = useMemo(() => {
    return [...stats].sort((a, b) => {
      if (sortBy === 'attendance') {
        const aPercent = a.expected > 0 ? a.completed / a.expected : 0;
        const bPercent = b.expected > 0 ? b.completed / b.expected : 0;
        return bPercent - aPercent;
      }
      return a.name.localeCompare(b.name);
    });
  }, [stats, sortBy]);

  const topSubject = useMemo(() => {
    if (stats.length === 0) return null;
    return [...stats].sort((a, b) => {
      const aP = a.expected > 0 ? a.completed / a.expected : 0;
      const bP = b.expected > 0 ? b.completed / b.expected : 0;
      return bP - aP;
    })[0];
  }, [stats]);

  if (!isLoaded) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      <span className="text-white/20 font-bold uppercase tracking-widest text-xs">Crunching Attendance...</span>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 md:space-y-10 pb-20 px-2 sm:px-4">
      {/* Header & Quick stats */}
      <section className="flex flex-col md:flex-row gap-6 pt-4">
         <div className="flex-1 origin-left">
            <div className="flex items-center gap-3 text-primary mb-1 md:mb-2">
               <BarChart3 className="w-4 h-4 md:w-5 md:h-5 fill-primary/20" />
               <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">Analytics</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Academic Pulse</h2>
            <p className="text-white/40 mt-1 md:mt-2 text-sm md:text-lg">Statistical analysis of your semester journey.</p>
         </div>

         <AnimatePresence>
          {topSubject && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card px-4 sm:px-6 py-3 sm:py-4 border-emerald-500/20 bg-emerald-500/[0.02] flex items-center gap-3 sm:gap-4 w-fit"
            >
               <div className="p-2 sm:p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6" />
               </div>
               <div>
                  <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-white/30">Top Record</p>
                  <p className="text-xs sm:text-sm font-bold text-white truncate max-w-[120px] sm:max-w-[150px]">{topSubject.name}</p>
               </div>
            </motion.div>
          )}
         </AnimatePresence>
      </section>

      {/* Controls & Sorting */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
         <div className="flex items-center gap-6">
            <button 
              onClick={() => setSortBy('attendance')}
              className={cn(
                "text-[11px] font-black uppercase tracking-widest transition-colors flex items-center gap-2",
                sortBy === 'attendance' ? "text-primary" : "text-white/20 hover:text-white/40"
              )}
            >
               <TrendingUp className="w-3.5 h-3.5" />
               By Participation
            </button>
            <button 
              onClick={() => setSortBy('name')}
              className={cn(
                "text-[11px] font-black uppercase tracking-widest transition-colors flex items-center gap-2",
                sortBy === 'name' ? "text-primary" : "text-white/20 hover:text-white/40"
              )}
            >
               <BookOpen className="w-3.5 h-3.5" />
               Alphabetical
            </button>
         </div>
         <ArrowUpDown className="w-4 h-4 text-white/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedStats.length > 0 ? (
          sortedStats.map((s) => (
            <motion.div 
              key={s.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <SubjectStatsCard subject={s} />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-24 text-center glass-card border-dashed bg-white/[0.01]">
            <TrendingUp className="w-16 h-16 text-white/5 mx-auto mb-6" />
            <p className="text-white/20 font-medium italic">No attendance data captured in this cycle.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectStats;
