'use client';

import React, { useState, useMemo } from 'react';
import { useSchedule } from '@/context/ScheduleContext';
import { format, eachDayOfInterval, startOfDay, parseISO, isSameDay } from 'date-fns';
import { getTimetableForDate, getSimplifiedSubject } from '@/lib/utils/scheduleLogic';
import { SEMESTER_START_DATE } from '@/lib/constants';
import { CheckCircle, XCircle, ShieldCheck, Clock, Calendar, ChevronRight, Filter, Search, TrendingUp, BarChart3, AlertCircle, Lock, Shield } from 'lucide-react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DayOfWeek } from '@/types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GroupedSession {
  subject: string;
  slots: { id: string, start: string, end: string }[];
  status: string;
}

const HistoryTimeline: React.FC = () => {
  const { timetables, overrides, dayOverrides, isAdmin, upsertOverride, toggleDayHoliday, stats, isLoaded } = useSchedule();
  
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const now = startOfDay(new Date());
  const startDate = parseISO(SEMESTER_START_DATE);
  const allDays = useMemo(() => eachDayOfInterval({ start: startDate, end: now }).reverse(), [now, startDate]);

  // Derived unique subjects for filter
  const allSubjects = useMemo(() => {
    const subs = new Set<string>();
    timetables.forEach(t => {
      Object.values(t.schedule).forEach(day => {
        Object.values(day as Record<string, string>).forEach(sub => {
          if (sub) subs.add(getSimplifiedSubject(sub));
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
      const ttSlots = tt?.timeSlots || [];

      // Group slots for filtering
      const sessions: GroupedSession[] = [];
      let currentSession: GroupedSession | null = null;
      
      ttSlots.forEach(slot => {
        const sub = schedule[slot.id];
        if (!sub) { currentSession = null; return; }
        
        const simplified = getSimplifiedSubject(sub);
        if (currentSession && getSimplifiedSubject(currentSession.subject) === simplified) {
          currentSession.slots.push(slot);
        } else {
          const ov = overrides.find(o => o.date === dateStr && o.time_slot_id === slot.id && getSimplifiedSubject(o.subject) === simplified);
          currentSession = {
            subject: sub,
            slots: [slot],
            status: ov?.status || 'pending'
          };
          sessions.push(currentSession);
        }
      });

      // Filter by subject
      const subjectMatchedSessions = sessions.filter(s => {
        if (subjectFilter === 'all') return true;
        return getSimplifiedSubject(s.subject) === subjectFilter;
      });

      if (subjectFilter !== 'all' && subjectMatchedSessions.length === 0) return false;

      // Filter by status
      if (statusFilter !== 'all') {
        const isDayHoliday = dayOverride?.is_holiday;
        if (statusFilter === 'holiday' && isDayHoliday) return true;
        if (isDayHoliday && statusFilter !== 'holiday') return false;

        const statusMatch = subjectMatchedSessions.some(s => s.status === statusFilter);
        if (!statusMatch) return false;
      }

      return subjectMatchedSessions.length > 0 || !!dayOverride?.is_holiday;
    });
  }, [allDays, timetables, overrides, dayOverrides, subjectFilter, statusFilter]);

  // Group by month
  const groupedDays = useMemo(() => {
    const groups: Record<string, Date[]> = {};
    filteredDays.forEach(date => {
      const month = format(date, 'MMMM yyyy');
      if (!groups[month]) groups[month] = [];
      groups[month].push(date);
    });
    return groups;
  }, [filteredDays]);

  const totalExpected = useMemo(() => stats.reduce((acc, s) => acc + s.expected, 0), [stats]);
  const totalCompleted = useMemo(() => stats.reduce((acc, s) => acc + s.completed, 0), [stats]);
  const totalCancelled = useMemo(() => stats.reduce((acc, s) => acc + s.cancelled, 0), [stats]);
  const avgAttendance = totalExpected > 0 ? (totalCompleted / totalExpected) * 100 : 0;

  if (!isLoaded) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <span className="text-white/40 animate-pulse font-medium">Loading History...</span>
    </div>
  );

  const handleStatusToggle = async (dateStr: string, session: GroupedSession) => {
    if (!isAdmin) return;
    
    let nextStatus: 'pending' | 'done' | 'cancelled' | 'holiday' = 'pending';
    if (!session.status || session.status === 'pending') nextStatus = 'done';
    else if (session.status === 'done') nextStatus = 'cancelled';
    else if (session.status === 'cancelled') nextStatus = 'holiday';

    const updates = session.slots.map(slot => 
      upsertOverride({
        date: dateStr,
        subject: session.subject,
        time_slot_id: slot.id,
        status: nextStatus
      })
    );
    await Promise.all(updates);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'done': return { label: 'Done', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
      case 'cancelled': return { label: 'Cancelled', color: 'text-rose-400', bg: 'bg-rose-500/10' };
      case 'holiday': return { label: 'Holiday', color: 'text-blue-400', bg: 'bg-blue-500/10' };
      default: return { label: 'Pending', color: 'text-white/20', bg: 'bg-white/5' };
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 px-2 sm:px-4">
      {/* Header & Stats Overview */}
      <section className="mb-8 md:mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-8 pt-4">
        <div>
           <div className="flex items-center gap-2 md:gap-3 text-primary mb-1 md:mb-2">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 fill-primary/20" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">Archives</span>
           </div>
           <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">History</h2>
           <p className="text-white/30 mt-1 md:mt-2 font-medium text-xs md:text-base">Tracking your semester journey from Day 1.</p>
        </div>

        <div className="flex bg-white/5 p-1 sm:p-2 rounded-2xl border border-white/5 backdrop-blur-3xl shadow-2xl w-full md:w-auto">
           <div className="flex-1 md:flex-none px-4 sm:px-6 py-2 border-r border-white/5 text-center">
              <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/30 mb-0.5">Sessions</p>
              <p className="text-lg sm:text-xl font-black text-white">{totalExpected}</p>
           </div>
           <div className="flex-1 md:flex-none px-4 sm:px-6 py-2 text-center">
              <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-primary mb-0.5">Rate</p>
              <p className="text-lg sm:text-xl font-black text-primary">{avgAttendance.toFixed(1)}%</p>
           </div>
        </div>
      </section>

      {/* Mini Stat Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-12 relative">
        <div className="glass-card p-4 md:p-6 bg-emerald-500/[0.03] border-emerald-500/10 overflow-hidden relative">
          <BarChart3 className="absolute -right-2 md:-right-4 -bottom-2 md:-bottom-4 w-16 md:w-24 h-16 md:h-24 text-emerald-500/5 rotate-12" />
          <p className="text-white/40 text-[9px] md:text-xs font-bold uppercase tracking-widest mb-1">Completed</p>
          <h4 className="text-2xl md:text-4xl font-black text-white">{totalCompleted}</h4>
        </div>
        <div className="glass-card p-4 md:p-6 bg-rose-500/[0.03] border-rose-500/10 relative overflow-hidden">
          <AlertCircle className="absolute -right-2 md:-right-4 -bottom-2 md:-bottom-4 w-16 md:w-24 h-16 md:h-24 text-rose-500/5" />
          <p className="text-white/40 text-[9px] md:text-xs font-bold uppercase tracking-widest mb-1">Cancelled</p>
          <h4 className="text-2xl md:text-4xl font-black text-white">{totalCancelled}</h4>
        </div>
        <div className="hidden lg:block glass-card p-6 bg-blue-500/[0.03] border-blue-500/10 relative overflow-hidden">
           <ShieldCheck className="absolute -right-4 -bottom-4 w-24 h-24 text-blue-500/5" />
           <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Total Expected</p>
           <h4 className="text-4xl font-black text-white">{totalExpected}</h4>
        </div>
      </section>

      {/* Filter Bar - Sticky */}
      <div className="sticky top-[80px] sm:top-[84px] z-40 mb-8 sm:mb-12">
        <div className="glass-card p-1.5 sm:p-2 bg-background/80 backdrop-blur-xl border-white/5 shadow-2xl flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2">
           <div className="relative flex-1 w-full sm:w-auto">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
              <select 
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white/80 focus:outline-none focus:border-primary/40 appearance-none hover:bg-white/[0.08] transition-all cursor-pointer"
              >
                <option value="all" className="bg-background text-white">All Subjects</option>
                {allSubjects.map(s => <option key={s} value={s} className="bg-background text-white">{s}</option>)}
              </select>
           </div>
           <div className="flex-1 w-full sm:w-auto">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-xs sm:text-sm text-white/80 focus:outline-none focus:border-primary/40 appearance-none hover:bg-white/[0.08] transition-all cursor-pointer"
              >
                 <option value="all" className="bg-background text-white">All Statuses</option>
                 <option value="done" className="bg-background text-white">Done</option>
                 <option value="cancelled" className="bg-background text-white">Cancelled</option>
                 <option value="holiday" className="bg-background text-white">Holiday</option>
                 <option value="pending" className="bg-background text-white">Pending</option>
              </select>
           </div>
           {(subjectFilter !== 'all' || statusFilter !== 'all') && (
             <button 
              onClick={() => { setSubjectFilter('all'); setStatusFilter('all'); }}
              className="px-4 py-1.5 md:py-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors"
             >
               Clear
             </button>
           )}
        </div>
      </div>

      {/* Timeline Content */}
      <div className="space-y-12">
        {Object.keys(groupedDays).length === 0 ? (
          <div className="py-24 md:py-32 flex flex-col items-center justify-center space-y-4">
             <div className="p-4 md:p-6 rounded-full bg-white/5 border border-white/5">
                <Search className="w-8 h-8 md:w-10 md:h-10 text-white/10" />
             </div>
             <div className="text-center px-4">
                <h3 className="text-lg md:text-xl font-bold text-white">No records found</h3>
                <p className="text-white/30 text-xs md:text-sm mt-1">Adjust your filters to see more results.</p>
             </div>
          </div>
        ) : (
          Object.entries(groupedDays).map(([month, monthDays]) => (
            <div key={month} className="space-y-6">
              <div className="sticky top-[138px] sm:top-[144px] z-30 pt-4 pb-2 bg-gradient-to-b from-background to-transparent">
                 <div className="flex items-center gap-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{month}</h3>
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
                  const allSlots = tt?.timeSlots || [];

                  // Group slots for display
                  const sessions: GroupedSession[] = [];
                  let currentSess: GroupedSession | null = null;
                  
                  allSlots.forEach(slot => {
                    const sub = schedule[slot.id];
                    if (!sub) { currentSess = null; return; }
                    
                    const simplified = getSimplifiedSubject(sub);
                    if (currentSess && getSimplifiedSubject(currentSess.subject) === simplified) {
                      currentSess.slots.push(slot);
                    } else {
                      const ov = overrides.find(o => o.date === dateStr && o.time_slot_id === slot.id && getSimplifiedSubject(o.subject) === simplified);
                      currentSess = {
                        subject: sub,
                        slots: [slot],
                        status: ov?.status || 'pending'
                      };
                      sessions.push(currentSess);
                    }
                  });

                  const visibleSessions = sessions.filter(s => {
                    if (subjectFilter !== 'all' && getSimplifiedSubject(s.subject) !== subjectFilter) return false;
                    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
                    return true;
                  });

                  if (!isHoliday && visibleSessions.length === 0) return null;
                  const doneCount = visibleSessions.filter(s => s.status === 'done').length;

                  return (
                    <div key={dateStr} className="relative group pl-8 md:pl-16">
                      <div className="absolute left-2.5 md:left-6 top-6 bottom-[-24px] w-px bg-white/5 group-last:hidden" />
                      <div className={cn(
                        "absolute left-0 md:left-3 top-5 w-5 h-5 md:w-6 md:h-6 rounded-full border-2 z-10 flex items-center justify-center transition-all duration-300",
                        isHoliday ? "border-blue-500/50 bg-blue-500/10" : "border-white/10 bg-background"
                      )}>
                        <div className={cn(
                          "w-1 md:w-1.5 h-1 md:h-1.5 rounded-full",
                          isHoliday ? "bg-blue-400" : isSameDay(date, new Date()) ? "bg-primary animate-ping" : "bg-white/10"
                        )} />
                      </div>

                      <div className={cn(
                        "glass-card p-4 md:p-6 border-white/5 transition-all duration-300",
                        isHoliday && "bg-blue-500/[0.02] border-blue-500/10"
                      )}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4 mb-4 md:mb-6">
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
                                <span className="text-[10px] font-mono text-white/40">{doneCount}/{visibleSessions.length} Sessions</span>
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
                            {visibleSessions.map((session, sIdx) => {
                              const firstSlot = session.slots[0];
                              const lastSlot = session.slots[session.slots.length - 1];
                              const info = getStatusInfo(session.status);

                              return (
                                <div 
                                  key={`${dateStr}-sess-${sIdx}`} 
                                  onClick={() => isAdmin && handleStatusToggle(dateStr, session)}
                                  className={cn(
                                    "flex flex-col p-3 rounded-xl bg-white/[0.02] border border-white/5 transition-all relative group/card",
                                    isAdmin ? "cursor-pointer hover:bg-white/[0.05] hover:border-white/10" : "opacity-80"
                                  )}
                                >
                                   <div className="flex items-center justify-between mb-2">
                                      <div className={cn("px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest", info.bg, info.color)}>
                                         {info.label}
                                      </div>
                                      <div className="flex items-center gap-2">
                                         {!isAdmin && <Lock className="w-3 h-3 text-white/10" />}
                                         <span className="text-[10px] font-mono text-white/20 whitespace-nowrap">
                                           {firstSlot.start.split(' ')[0]} - {lastSlot.end}
                                         </span>
                                      </div>
                                   </div>
                                   <div className="flex items-center justify-between group/tt">
                                     <span className="text-sm font-medium text-white/70 truncate mr-2">{session.subject}</span>
                                     <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        {isAdmin ? <ChevronRight className="w-3 h-3 text-white/20" /> : <Shield className="w-3 h-3 text-white/5" />}
                                     </div>
                                   </div>

                                   {session.slots.length > 1 && (
                                     <div className="mt-1 text-[8px] font-black uppercase tracking-widest text-white/10">
                                       {session.slots.length}H Continuous Session
                                     </div>
                                   )}

                                   {!isAdmin && (
                                     <div className="absolute inset-0 bg-transparent cursor-help" title="Enter Admin Key in Navbar to toggle status" />
                                   )}
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
