'use client';

import React from 'react';
import { useSchedule } from '@/context/ScheduleContext';
import { format, eachDayOfInterval, startOfDay, parseISO, isSameDay } from 'date-fns';
import { getTimetableForDate } from '@/lib/utils/scheduleLogic';
import { CheckCircle, XCircle, ShieldCheck, Clock, Calendar, ChevronRight, Filter } from 'lucide-react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DayOfWeek } from '@/types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const HistoryTimeline: React.FC = () => {
  const { timetables, overrides, dayOverrides, isAdmin, upsertOverride, toggleDayHoliday, isLoaded } = useSchedule();
  
  if (!isLoaded) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <span className="text-white/40 animate-pulse font-medium">Reconstructing Timeline...</span>
    </div>
  );

  const now = startOfDay(new Date());
  const startDate = parseISO('2026-02-17');
  const days = eachDayOfInterval({ start: startDate, end: now }).reverse();

  // Group by month
  const groupedDays = days.reduce((acc, date) => {
    const month = format(date, 'MMMM yyyy');
    if (!acc[month]) acc[month] = [];
    acc[month].push(date);
    return acc;
  }, {} as Record<string, Date[]>);

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
      case 'done': return { icon: <CheckCircle className="w-4 h-4 text-emerald-400" />, label: 'Done', color: 'text-emerald-400' };
      case 'cancelled': return { icon: <XCircle className="w-4 h-4 text-rose-400" />, label: 'Cancelled', color: 'text-rose-400' };
      case 'holiday': return { icon: <ShieldCheck className="w-4 h-4 text-blue-400" />, label: 'Holiday', color: 'text-blue-400' };
      default: return { icon: <Clock className="w-4 h-4 text-white/20" />, label: 'Pending', color: 'text-white/20' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Timeline</h2>
          <p className="text-white/40 mt-2 text-lg">Detailed history of every lecture and shift.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/20">
          <Filter className="w-4 h-4" />
          By Semester Progress
        </div>
      </header>

      {Object.entries(groupedDays).map(([month, monthDays]) => (
        <div key={month} className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
             <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/40 whitespace-nowrap">{month}</h3>
             <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
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
              const lectures = Object.entries(schedule).filter(([_, sub]) => !!sub);

              if (lectures.length === 0) return null;

              // Calculate Day Score
              const dayOverridesForDate = overrides.filter(o => o.date === dateStr);
              const doneCount = dayOverridesForDate.filter(o => o.status === 'done').length;
              const cancelCount = dayOverridesForDate.filter(o => o.status === 'cancelled').length;

              return (
                <div key={dateStr} className="relative group pl-10 md:pl-16">
                  {/* Timeline Node */}
                  <div className="absolute left-3 md:left-6 top-6 bottom-[-24px] w-px bg-white/5 group-last:hidden" />
                  <div className={cn(
                    "absolute left-0 md:left-3 top-5 w-6 h-6 rounded-full border-2 z-10 flex items-center justify-center transition-all duration-500",
                    isHoliday ? "border-blue-500/50 bg-blue-500/10" : "border-white/10 bg-background"
                  )}>
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      isHoliday ? "bg-blue-400" : isSameDay(date, new Date()) ? "bg-primary animate-ping" : "bg-white/20"
                    )} />
                  </div>

                  <div className={cn(
                    "glass-card p-5 md:p-7 border-white/5 group-hover:border-white/20 group-hover:shadow-2xl group-hover:shadow-white/[0.02] transition-all duration-300",
                    isHoliday && "bg-blue-500/[0.02] border-blue-500/10"
                  )}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <h4 className="text-xl font-bold text-white tracking-tight">{format(date, 'EEEE, MMM do')}</h4>
                           {isSameDay(date, new Date()) && (
                             <span className="bg-primary text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-full">Today</span>
                           )}
                        </div>
                        <div className="flex items-center gap-3 text-white/30 text-[11px] font-mono tracking-wider">
                           <span>{dateStr}</span>
                           <span className="w-1 h-1 rounded-full bg-white/20" />
                           <span className="uppercase text-[9px] tracking-[0.1em]">{tt?.name}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {isAdmin && (
                          <button 
                            onClick={() => toggleDayHoliday(dateStr)}
                            className={cn(
                              "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all",
                              isHoliday 
                                ? "bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/20" 
                                : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/20"
                            )}
                          >
                            <ShieldCheck className={cn("w-3.5 h-3.5", isHoliday && "animate-pulse")} />
                            {isHoliday ? 'Holiday Set' : 'Mark Holiday'}
                          </button>
                        )}
                        
                        {!isHoliday && lectures.length > 0 && (
                          <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                            <div className="flex -space-x-1">
                              {Array.from({ length: lectures.length }).map((_, i) => (
                                <div key={i} className={cn("w-2 h-2 rounded-full border border-background", i < doneCount ? "bg-emerald-400" : i < doneCount + cancelCount ? "bg-rose-400" : "bg-white/20")} />
                              ))}
                            </div>
                            <span className="text-[10px] font-mono text-white/40">{doneCount}/{lectures.length} Done</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {isHoliday ? (
                      <div className="py-12 flex flex-col items-center justify-center space-y-3 bg-blue-500/[0.03] rounded-2xl border border-dashed border-blue-500/10">
                        <ShieldCheck className="w-10 h-10 text-blue-500/20" />
                        <p className="text-blue-400/60 text-sm font-medium">This day was marked as a university holiday.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {slots.map((slot) => {
                          const subject = schedule[slot.id];
                          if (!subject) return null;

                          const override = overrides.find(o => o.date === dateStr && o.time_slot_id === slot.id);
                          const status = override?.status || 'pending';
                          const info = getStatusInfo(status);

                          return (
                            <div 
                              key={slot.id} 
                              onClick={() => handleStatusToggle(dateStr, subject, slot.id, status)}
                              className={cn(
                                "relative flex flex-col p-4 rounded-2xl bg-white/[0.02] border border-white/5 transition-all group/lect",
                                isAdmin ? "cursor-pointer hover:bg-white/[0.05] hover:border-white/10 active:scale-[0.98]" : "pointer-events-none"
                              )}
                            >
                               <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                     <div className={cn("w-1.5 h-1.5 rounded-full", info.color.replace('text-', 'bg-'))} />
                                     <span className={cn("text-[10px] font-black uppercase tracking-widest", info.color)}>{info.label}</span>
                                  </div>
                                  <span className="text-[10px] font-mono text-white/20">{slot.start}</span>
                               </div>
                               
                               <div className="flex items-start justify-between">
                                 <span className="text-sm font-semibold text-white/80 leading-tight group-hover/lect:text-white transition-colors">
                                   {subject}
                                 </span>
                                 {info.icon}
                               </div>

                               {isAdmin && (
                                 <div className="absolute top-2 right-2 opacity-0 group-hover/lect:opacity-100 transition-opacity">
                                    <ChevronRight className="w-3 h-3 text-white/20" />
                                 </div>
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
      ))}
    </div>
  );
};

export default HistoryTimeline;
