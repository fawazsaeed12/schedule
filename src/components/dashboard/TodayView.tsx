'use client';

import React, { useMemo } from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { useSchedule } from '@/context/ScheduleContext';
import { getTimetableForDate, getSimplifiedSubject } from '@/lib/utils/scheduleLogic';
import { Clock, CheckCircle, XCircle, ShieldCheck, Calendar, Zap, Layout, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DayOfWeek } from '@/types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GroupedLecture {
  subject: string;
  slots: { id: string, start: string, end: string }[];
  status: string;
}

const TodayView: React.FC = () => {
  const { timetables, overrides, dayOverrides, isAdmin, upsertOverride, toggleDayHoliday, isLoaded } = useSchedule();
  
  const now = useMemo(() => new Date(), []);
  
  // Find the next active day (neither holiday nor empty)
  const displayDate = useMemo(() => {
    for (let i = 0; i < 7; i++) {
      const testDate = addDays(now, i);
      const testDateStr = format(testDate, 'yyyy-MM-dd');
      const testDayName = format(testDate, 'EEEE') as DayOfWeek;
      
      const isHoliday = dayOverrides.find(o => o.date === testDateStr)?.is_holiday;
      const testTimetable = getTimetableForDate(testDate, timetables);
      const schedule = testTimetable?.schedule[testDayName] || {};
      const hasClasses = Object.values(schedule).some(v => v !== undefined && v !== '');

      if (!isHoliday && hasClasses) return testDate;
    }
    return now;
  }, [now, dayOverrides, timetables]);

  const dateStr = format(displayDate, 'yyyy-MM-dd');
  const dayName = format(displayDate, 'EEEE') as DayOfWeek;
  const isToday = isSameDay(displayDate, now);

  const currentTimetable = useMemo(() => getTimetableForDate(displayDate, timetables), [displayDate, timetables]);
  const dayOverride = dayOverrides.find(o => o.date === dateStr);
  const isHoliday = dayOverride?.is_holiday;

  const schedule: Record<string, string> = currentTimetable?.schedule[dayName] || {};
  const timeSlots = currentTimetable?.timeSlots || [];

  // SMART GROUPING: Group consecutive slots of the same subject
  const groupedLectures = useMemo(() => {
    const groups: GroupedLecture[] = [];
    let currentGroup: GroupedLecture | null = null;

    timeSlots.forEach(slot => {
      const subject = schedule[slot.id];
      if (!subject) {
        currentGroup = null;
        return;
      }

      const simplified = getSimplifiedSubject(subject);
      
      if (currentGroup && getSimplifiedSubject(currentGroup.subject) === simplified) {
        currentGroup.slots.push(slot);
      } else {
        const override = overrides.find(o => 
          o.date === dateStr && 
          o.time_slot_id === slot.id && 
          getSimplifiedSubject(o.subject) === simplified
        );
        
        currentGroup = {
          subject,
          slots: [slot],
          status: override?.status || 'pending'
        };
        groups.push(currentGroup);
      }
    });

    return groups;
  }, [schedule, timeSlots, overrides, dateStr]);

  const doneCount = useMemo(() => {
    return groupedLectures.filter(l => l.status === 'done').length;
  }, [groupedLectures]);

  if (!isLoaded) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      <span className="text-white/20 font-bold uppercase tracking-widest text-xs">Syncing Daily View...</span>
    </div>
  );

  const handleStatusToggle = async (session: GroupedLecture) => {
    if (!isAdmin) return;
    
    let nextStatus: 'pending' | 'done' | 'cancelled' | 'holiday' = 'pending';
    if (!session.status || session.status === 'pending') nextStatus = 'done';
    else if (session.status === 'done') nextStatus = 'cancelled';
    else if (session.status === 'cancelled') nextStatus = 'holiday';
    
    // Update ALL slots in the session
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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'done': return 'bg-emerald-500/[0.03] border-emerald-500/20 text-emerald-400';
      case 'cancelled': return 'bg-rose-500/[0.03] border-rose-500/20 text-rose-400';
      case 'holiday': return 'bg-blue-500/[0.03] border-blue-500/20 text-blue-400';
      default: return 'bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/[0.05] hover:border-white/10';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Dynamic Greeting & Summary */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-2 sm:px-0">
        <div className="origin-left">
           <div className="flex items-center gap-3 text-primary mb-1 md:mb-2">
              <Zap className="w-4 h-4 md:w-5 md:h-5 fill-primary/20" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">Live Overview</span>
           </div>
           <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
             {isToday ? "Today" : "Up Next"}
           </h2>
           <p className="text-white/30 mt-1 md:mt-2 font-medium flex items-center gap-2 text-xs md:text-base">
             <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
             {format(displayDate, 'EEEE, MMM do')}
           </p>
        </div>

        <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
           {!isHoliday && groupedLectures.length > 0 && (
             <div className="glass-card flex-1 md:flex-none px-4 md:px-8 py-3 md:py-4 border-primary/20 bg-primary/5 flex flex-col items-center justify-center">
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-primary/60 mb-0.5 md:mb-1">Progress</span>
                <span className="text-lg md:text-2xl font-black text-white">{doneCount} <span className="text-white/20">/</span> {groupedLectures.length}</span>
             </div>
           )}

           {isAdmin && (
             <button 
               onClick={() => toggleDayHoliday(dateStr)}
               className={cn(
                 "h-[52px] md:h-[68px] flex-1 md:flex-none px-4 md:px-6 rounded-2xl flex flex-row md:flex-col items-center justify-center gap-2 md:gap-1 transition-all border font-bold uppercase tracking-widest text-[8px] md:text-[9px]",
                 isHoliday ? "bg-rose-500 text-white border-rose-400 shadow-xl shadow-rose-500/20" : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white"
               )}
             >
               <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4" />
               {isHoliday ? "Holiday Set" : "Mark Holiday"}
             </button>
           )}
        </div>
      </section>

      {isHoliday ? (
        <div className="glass-card p-20 flex flex-col items-center justify-center text-center bg-blue-500/[0.02] border-blue-500/10">
          <div className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 animate-pulse">
            <ShieldCheck className="w-12 h-12 text-blue-400 opacity-60" />
          </div>
          <h3 className="text-3xl font-black text-white tracking-tight">University Closure</h3>
          <p className="text-white/30 max-w-sm mt-3 text-lg">No lectures scheduled for today. Enjoy your day off!</p>
        </div>
      ) : groupedLectures.length === 0 ? (
        <div className="glass-card p-20 flex flex-col items-center justify-center text-center">
          <Layout className="w-16 h-16 text-white/5 mb-6" />
          <h3 className="text-2xl font-bold text-white/40 italic">Nothing on the radar...</h3>
          <p className="text-white/20 mt-2">Check the history tab for future schedules.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupedLectures.map((lecture, idx) => {
            const firstSlot = lecture.slots[0];
            const lastSlot = lecture.slots[lecture.slots.length - 1];

            return (
              <motion.div
                key={`${dateStr}-${lecture.subject}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={isAdmin ? { y: -4 } : {}}
                onClick={() => handleStatusToggle(lecture)}
                className={cn(
                  "p-6 rounded-3xl glass-card border flex flex-col justify-between min-h-[160px] transition-all duration-300 group", 
                  getStatusColor(lecture.status), 
                  isAdmin && "cursor-pointer active:scale-[0.98]"
                )}
              >
                <div className="flex justify-between items-start">
                   <div className="flex flex-col">
                     <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        {firstSlot.start} — {lastSlot.end}
                        {lecture.slots.length > 1 && (
                          <span className="bg-white/10 px-1.5 py-0.5 rounded ml-1 tracking-normal font-bold">
                            {lecture.slots.length}H Session
                          </span>
                        )}
                     </div>
                     <h3 className="text-xl font-black text-white leading-tight tracking-tight mt-1 truncate max-w-[200px]">{lecture.subject}</h3>
                   </div>
                   <div className={cn(
                     "w-10 h-10 rounded-2xl flex items-center justify-center bg-black/20",
                     lecture.status === 'done' && "text-emerald-400",
                     lecture.status === 'cancelled' && "text-rose-400"
                   )}>
                      {lecture.status === 'done' ? <CheckCircle className="w-5 h-5" /> : lecture.status === 'cancelled' ? <XCircle className="w-5 h-5" /> : <Clock className="w-5 h-5 opacity-20" />}
                   </div>
                </div>

                <div className="mt-auto pt-6 flex items-center justify-between">
                   <span className="text-[9px] font-black uppercase tracking-widest opacity-30">{currentTimetable?.name}</span>
                   {isAdmin && (
                     <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-primary/60 text-[9px] font-bold">
                        Toggle <ChevronRight className="w-3 h-3" />
                     </div>
                   )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TodayView;
