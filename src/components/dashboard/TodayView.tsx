'use client';

import React from 'react';
import { format } from 'date-fns';
import { useSchedule } from '@/context/ScheduleContext';
import { getTimetableForDate } from '@/lib/utils/scheduleLogic';
import { Clock, CheckCircle, XCircle, MinusCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TodayView: React.FC = () => {
  const { timetables, overrides, dayOverrides, isAdmin, upsertOverride, toggleDayHoliday, isLoaded } = useSchedule();
  
  if (!isLoaded) return <div className="animate-pulse flex items-center justify-center p-20">Loading schedule...</div>;

  const now = new Date();
  const dateStr = format(now, 'yyyy-MM-dd');
  const dayName = format(now, 'EEEE') as any;

  const currentTimetable = getTimetableForDate(now, timetables);
  const dayOverride = dayOverrides.find(o => o.date === dateStr);
  const isHoliday = dayOverride?.is_holiday;

  const schedule = currentTimetable?.schedule[dayName] || {};
  const timeSlots = currentTimetable?.timeSlots || [];

  const handleStatusToggle = (subject: string, slotId: string, currentStatus?: string) => {
    if (!isAdmin) return;
    
    let nextStatus: 'pending' | 'done' | 'cancelled' | 'holiday' = 'pending';
    if (!currentStatus || currentStatus === 'pending') nextStatus = 'done';
    else if (currentStatus === 'done') nextStatus = 'cancelled';
    else if (currentStatus === 'cancelled') nextStatus = 'holiday';
    
    upsertOverride({
      date: dateStr,
      subject,
      time_slot_id: slotId,
      status: nextStatus
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'done': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'cancelled': return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
      case 'holiday': return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      default: return 'bg-white/5 border-white/10 text-white/40';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Today</h2>
          <p className="text-white/40 mt-1">{format(now, 'EEEE, MMMM do')}</p>
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => toggleDayHoliday(dateStr)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-semibold transition-all border",
              isHoliday ? "bg-rose-500 text-white border-rose-400" : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
            )}
          >
            {isHoliday ? "Day is Holiday" : "Mark as Holiday"}
          </button>
        )}
      </div>

      {isHoliday ? (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
          <ShieldCheck className="w-16 h-16 text-blue-400 mb-4 opacity-50" />
          <h3 className="text-2xl font-bold text-white">University Closure</h3>
          <p className="text-white/40 max-w-xs mt-2">No lectures scheduled for today.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {timeSlots.map((slot) => {
            const subject = schedule[slot.id];
            if (!subject) return null;

            const override = overrides.find(o => o.date === dateStr && o.time_slot_id === slot.id);
            const status = override?.status || 'pending';

            return (
              <motion.div
                key={slot.id}
                whileHover={isAdmin ? { y: -4, scale: 1.02 } : {}}
                onClick={() => handleStatusToggle(subject, slot.id, status)}
                className={cn("p-5 rounded-2xl glass-card border group", getStatusColor(status), isAdmin && "cursor-pointer hover:border-primary/50")}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-black/20 rounded-lg"><Clock className="w-4 h-4" /></div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">{slot.start} - {slot.end}</p>
                  <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{subject}</h3>
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
