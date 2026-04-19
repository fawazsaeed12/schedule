'use client';

import React, { useState, useMemo } from 'react';
import { useSchedule } from '@/context/ScheduleContext';
import { format, eachDayOfInterval, startOfDay, parseISO, isSameDay } from 'date-fns';
import { getTimetableForDate } from '@/lib/utils/scheduleLogic';
import { CheckCircle, XCircle, ShieldCheck, Clock, Calendar, ChevronRight, Filter, Search, TrendingUp, BarChart3, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DayOfWeek } from '@/types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const HistoryTimeline: React.FC = () => {
  const { timetables, overrides, dayOverrides, isAdmin, upsertOverride, toggleDayHoliday, stats, isLoaded } = useSchedule();
  
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const now = startOfDay(new Date());
  const startDate = parseISO('2026-02-17');
  const allDays = useMemo(() => eachDayOfInterval({ start: startDate, end: now }).reverse(), [now, startDate]);

  // Derived unique subjects for filter
  const allSubjects = useMemo(() => {
    const subs = new Set<string>();
    timetables.forEach(t => {
      Object.values(t.schedule).forEach(day => {
        Object.values(day as Record<string, string>).forEach(sub => {
          if (sub) subs.add(sub);
        });
      });
    });
    return Array.from(subs).sort();
  }, [timetables]);

  const filteredDays = useMemo(() => {
    return allDays.filter(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayName = format(date, 'EEEE') as DayOfWeek;
      const tt = getTimetableForDate(date, timetables);
      const schedule: Record<string, string> = tt?.schedule[dayName] || {};
      const dayOverride = dayOverrides.find(o => o.date === dateStr);
      
      // If filtering by subject, check if subject exists on this day
      if (subjectFilter !== 'all') {
        const hasSubject = Object.values(schedule).includes(subjectFilter);
        if (!hasSubject) return false;
      }

      // If filtering by status
      if (statusFilter !== 'all') {
        if (statusFilter === 'holiday' && dayOverride?.is_holiday) return true;
        
        const daySlots = Object.entries(schedule).filter(([_, sub]) => !!sub);
        const hasStatus = daySlots.some(([slotId, _]) => {
           const ov = overrides.find(o => o.date === dateStr && o.time_slot_id === slotId);
           return (ov?.status || 'pending') === statusFilter;
        });
        if (!hasStatus) return false;
      }

      return true;
    });
  }, [allDays, subjectFilter, statusFilter, timetables, dayOverrides, overrides]);

  // Group by month
  const groupedDays = useMemo(() => {
    return filteredDays.reduce((acc, date) => {
      const month = format(date, 'MMMM yyyy');
      if (!acc[month]) acc[month] = [];
      acc[month].push(date);
      return acc;
    }, {} as Record<string, Date[]>);
  }, [filteredDays]);

  // Overall Stats
  const totalExpected = stats.reduce((acc, s) => acc + s.expected, 0);
  const totalCompleted = stats.reduce((acc, s) => acc + s.completed, 0);
  const attendanceRate = totalExpected > 0 ? Math.round((totalCompleted / totalExpected) * 100) : 0;
  const totalCancelled = stats.reduce((acc, s) => acc + s.cancelled, 0);

  if (!isLoaded) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <span className="text-white/40 animate-pulse font-medium">Loading History...</span>
    </div>
  );

  const handleStatusToggle = (date: string, subject: string, slotId: string, currentStatus?: string) => {
    if (!isAdmin) return;
    let nextStatus: 'pending' | 'done' | 'cancelled' | 'holiday' = 'pending';
    if (!currentStatus || currentStatus === 'pending') nextStatus = 'done';
    else if (currentStatus === 'done') nextStatus = 'cancelled';
    else if (currentStatus === 'cancelled') nextStatus = 'holiday';
    upsertOverride({ date, subject, time_slot_id: slotId, status: nextStatus });
  };

  const getStatusInfo = (status?: string) => {
    switch (status) {
      case 'done': return { icon: <CheckCircle className="w-4 h-4 text-emerald-400" />, label: 'Done', color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
      case 'cancelled': return { icon: <XCircle className="w-4 h-4 text-rose-400" />, label: 'Cancelled', color: 'text-rose-400', bg: 'bg-rose-400/10' };
      case 'holiday': return { icon: <ShieldCheck className="w-4 h-4 text-blue-400" />, label: 'Holiday', color: 'text-blue-400', bg: 'bg-blue-400/10' };
      default: return { icon: <Clock className="w-4 h-4 text-white/20" />, label: 'Pending', color: 'text-white/20', bg: 'bg-white/5' };
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32">
      {/* Semester Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6 bg-primary/[0.03] border-primary/10 overflow-hidden relative group">
          <TrendingUp className="absolute -right-4 -bottom-4 w-24 h-24 text-primary/5 group-hover:scale-110 transition-transform duration-700" />
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Attendance Rate</p>
          <div className="flex items-end gap-2">
            <h4 className="text-4xl font-black text-white">{attendanceRate}%</h4>
            <span className="text-emerald-400 text-xs font-bold mb-1.5 flex items-center gap-1">
               Progressing
            </span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${attendanceRate}%` }} />
          </div>
        </div>

        <div className="glass-card p-6 bg-emerald-500/[0.03] border-emerald-500/10">
          <BarChart3 className="absolute -right-4 -bottom-4 w-24 h-24 text-emerald-500/5" />
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Lectures Done</p>
          <h4 className="text-4xl font-black text-white">{totalCompleted} <span className="text-sm font-normal text-white/20 tracking-normal">/ {totalExpected}</span></h4>
          <p className="text-[10px] text-white/30 mt-2">Successful participation across subjects.</p>
        </div>

        <div className="glass-card p-6 bg-rose-500/[0.03] border-rose-500/10">
          <AlertCircle className="absolute -right-4 -bottom-4 w-24 h-24 text-rose-500/5" />
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Cancelled Slots</p>
          <h4 className="text-4xl font-black text-white">{totalCancelled}</h4>
          <p className="text-[10px] text-white/30 mt-2">Total missed classes from university updates.</p>
        </div>
      </section>

      {/* Filter Bar - Sticky */}
      <div className="sticky top-[84px] z-40">
        <div className="glass-card p-2 bg-background/80 backdrop-blur-xl border-white/5 shadow-2xl flex flex-col sm:flex-row items-center gap-2">
           <div className="relative flex-1 w-full sm:w-auto">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
             <select 
               value={subjectFilter}
               onChange={(e) => setSubjectFilter(e.target.value)}
               className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-white/80 focus:outline-none focus:border-primary/40 appearance-none hover:bg-white/[0.08] transition-all cursor-pointer"
             >
               <option value="all" className="bg-background text-white">All Subjects</option>
               {allSubjects.map(s => <option key={s} value={s} className="bg-background text-white">{s}</option>)}
             </select>
           </div>
           <div className="flex-1 w-full sm:w-auto">
             <select 
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value)}
               className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-sm text-white/80 focus:outline-none focus:border-primary/40 appearance-none hover:bg-white/[0.08] transition-all cursor-pointer"
             >
                <option value="all" className="bg-background text-white">All Statuses</option>
                <option value="done" className="bg-background text-white text-emerald-400 font-bold">Done</option>
                <option value="cancelled" className="bg-background text-white text-rose-400 font-bold">Cancelled</option>
                <option value="holiday" className="bg-background text-white text-blue-400 font-bold">Holiday</option>
                <option value="pending" className="bg-background text-white text-white/40">Pending</option>
             </select>
           </div>
           {(subjectFilter !== 'all' || statusFilter !== 'all') && (
             <button 
              onClick={() => { setSubjectFilter('all'); setStatusFilter('all'); }}
              className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors"
             >
               Clear Filters
             </button>
           )}
        </div>
      </div>

      {/* Timeline Content */}
      <div className="space-y-12">
        {Object.keys(groupedDays).length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-4">
             <div className="p-6 rounded-full bg-white/5 border border-white/5">
                <Search className="w-10 h-10 text-white/10" />
             </div>
             <div className="text-center">
                <h3 className="text-xl font-bold text-white">No records found</h3>
                <p className="text-white/30 text-sm mt-1">Adjust your filters to see more results.</p>
             </div>
          </div>
        ) : (
          Object.entries(groupedDays).map(([month, monthDays]) => (
            <div key={month} className="space-y-6">
              <div className="sticky top-[144px] z-30 pt-4 pb-2 bg-gradient-to-b from-background to-transparent">
                 <div className="flex items-center gap-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">{month}</h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                 </div>
              </div>

              <div className="space-y-6">
                {monthDays.map((date) => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  const dayName = format(date, 'EEEE') as DayOfWeek;
                  const dayOverride = dayOverrides.find(o => o.date === dateStr);
                  const isHoliday = dayOverride?.is_holiday;
                  
                  const tt = getTimetableForDate(date, timetables);
                  const schedule: Record<string, string> = tt?.schedule[dayName] || {};
                  const slots = tt?.timeSlots || [];
                  const lectures = Object.entries(schedule).filter(([_, sub]) => {
                    if (!sub) return false;
                    if (subjectFilter !== 'all' && sub !== subjectFilter) return false;
                    return true;
                  });

                  if (lectures.length === 0 && !isHoliday) return null;

                  const dayOverridesForDate = overrides.filter(o => o.date === dateStr);
                  const doneCount = dayOverridesForDate.filter(o => o.status === 'done').length;

                  return (
                    <div key={dateStr} className="relative group pl-10 md:pl-16">
                      <div className="absolute left-3 md:left-6 top-6 bottom-[-24px] w-px bg-white/5 group-last:hidden" />
                      <div className={cn(
                        "absolute left-0 md:left-3 top-5 w-6 h-6 rounded-full border-2 z-10 flex items-center justify-center transition-all duration-300",
                        isHoliday ? "border-blue-500/50 bg-blue-500/10" : "border-white/10 bg-background"
                      )}>
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          isHoliday ? "bg-blue-400" : isSameDay(date, new Date()) ? "bg-primary animate-ping" : "bg-white/10"
                        )} />
                      </div>

                      <div className={cn(
                        "glass-card p-5 md:p-6 border-white/5 transition-all duration-300",
                        isHoliday && "bg-blue-500/[0.02] border-blue-500/10"
                      )}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                          <div>
                            <div className="flex items-center gap-2">
                               <h4 className="text-lg font-bold text-white">{format(date, 'EEEE, MMM do')}</h4>
                               {isSameDay(date, new Date()) && <span className="bg-primary text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-full">Today</span>}
                            </div>
                            <p className="text-white/20 text-[11px] font-mono mt-0.5">{dateStr} • {tt?.name}</p>
                          </div>

                          <div className="flex items-center gap-3">
                            {isAdmin && (
                              <button 
                                onClick={() => toggleDayHoliday(dateStr)}
                                className={cn(
                                  "px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all",
                                  isHoliday ? "bg-blue-500 text-white border-blue-400" : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                                )}
                              >
                                {isHoliday ? 'Holiday Set' : 'Mark Holiday'}
                              </button>
                            )}
                            {!isHoliday && (
                              <div className="bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 flex items-center gap-2">
                                <span className="text-[10px] font-mono text-white/40">{doneCount}/{Object.values(schedule).filter(Boolean).length} Done</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {isHoliday ? (
                          <div className="py-8 flex flex-col items-center justify-center space-y-2 bg-blue-500/[0.03] rounded-2xl border border-dashed border-blue-500/10">
                            <ShieldCheck className="w-8 h-8 text-blue-500/10" />
                            <p className="text-blue-400/60 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap overflow-hidden">University Holiday</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {slots.map((slot) => {
                              const subject = schedule[slot.id];
                              if (!subject) return null;
                              if (subjectFilter !== 'all' && subject !== subjectFilter) return null;

                              const override = overrides.find(o => o.date === dateStr && o.time_slot_id === slot.id);
                              const status = override?.status || 'pending';
                              if (statusFilter !== 'all' && status !== statusFilter) return null;

                              const info = getStatusInfo(status);

                              return (
                                <div 
                                  key={slot.id} 
                                  onClick={() => handleStatusToggle(dateStr, subject, slot.id, status)}
                                  className={cn(
                                    "flex flex-col p-3 rounded-xl bg-white/[0.02] border border-white/5 transition-all",
                                    isAdmin ? "cursor-pointer hover:bg-white/[0.05] hover:border-white/10" : "pointer-events-none"
                                  )}
                                >
                                   <div className="flex items-center justify-between mb-2">
                                      <div className={cn("px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest", info.bg, info.color)}>
                                         {info.label}
                                      </div>
                                      <span className="text-[10px] font-mono text-white/20">{slot.start}</span>
                                   </div>
                                   <div className="flex items-center justify-between group/tt">
                                     <span className="text-sm font-medium text-white/70 truncate mr-2">{subject}</span>
                                     <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRight className="w-3 h-3 text-white/20" />
                                     </div>
                                   </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryTimeline;
