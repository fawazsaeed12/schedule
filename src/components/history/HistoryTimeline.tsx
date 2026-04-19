'use client';

import React from 'react';
import { useSchedule } from '@/context/ScheduleContext';
import { format, eachDayOfInterval, startOfDay, parseISO } from 'date-fns';
import { getTimetableForDate } from '@/lib/utils/scheduleLogic';
import { CheckCircle, XCircle, ShieldCheck, Clock, MinusCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const HistoryTimeline: React.FC = () => {
  const { timetables, overrides, dayOverrides, isAdmin, upsertOverride, isLoaded } = useSchedule();
  
  if (!isLoaded) return <div className="animate-pulse flex items-center justify-center p-20 text-white/40">Fetching historical records...</div>;

  const now = startOfDay(new Date());
  const startDate = parseISO('2026-02-17');
  const days = eachDayOfInterval({ start: startDate, end: now }).reverse();

  const handleStatusToggle = (date: string, subject: string, slotId: string, currentStatus?: string) => {
    if (!isAdmin) return;
    
    let nextStatus: 'pending' | 'done' | 'cancelled' | 'holiday' = 'pending';
    if (!currentStatus || currentStatus === 'pending') nextStatus = 'done';
    else if (currentStatus === 'done') nextStatus = 'cancelled';
    else if (currentStatus === 'cancelled') nextStatus = 'holiday';
    
    upsertOverride({ date, subject, time_slot_id: slotId, status: nextStatus });
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'done': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-rose-400" />;
      case 'holiday': return <ShieldCheck className="w-4 h-4 text-blue-400" />;
      default: return <MinusCircle className="w-4 h-4 text-white/20" />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Timeline</h2>
        <p className="text-white/40 mt-1">Reviewing and adjusting past records from the start of the semester.</p>
      </div>

      <div className="space-y-4">
        {days.map((date) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const dayName = format(date, 'EEEE') as any;
          const dayOverride = dayOverrides.find(o => o.date === dateStr);
          const isHoliday = dayOverride?.is_holiday;
          
          const tt = getTimetableForDate(date, timetables);
          const schedule = tt?.schedule[dayName] || {};
          const slots = tt?.timeSlots || [];
          const lectures = Object.entries(schedule).filter(([_, sub]) => !!sub);

          if (lectures.length === 0) return null;

          return (
            <div key={dateStr} className="relative pl-8 pb-8 last:pb-0 group">
              <div className="absolute left-[11px] top-2 bottom-0 w-0.5 bg-white/5 group-last:hidden" />
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full border-2 border-white/10 bg-background z-10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white/20" />
              </div>

              <div className="glass-card p-6 border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{format(date, 'EEEE, MMM do')}</h3>
                    <span className="text-xs text-white/40 font-mono tracking-tighter">{dateStr}</span>
                  </div>
                  {isHoliday && <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest leading-none">Holiday</span>}
                </div>

                {!isHoliday && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {slots.map((slot) => {
                      const subject = schedule[slot.id];
                      if (!subject) return null;

                      const override = overrides.find(o => o.date === dateStr && o.time_slot_id === slot.id);
                      const status = override?.status || 'pending';

                      return (
                        <div key={slot.id} onClick={() => handleStatusToggle(dateStr, subject, slot.id, status)} className={cn("flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 transition-all text-sm", isAdmin && "hover:border-primary/40 cursor-pointer hover:bg-white/[0.05]")}>
                          <div className="flex items-center gap-3">
                             <Clock className="w-3.5 h-3.5 text-white/40" />
                             <span className="font-medium text-white/60">{subject}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] text-white/10 font-mono tracking-tighter">{slot.start}</span>
                             {getStatusIcon(status)}
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
  );
};

export default HistoryTimeline;
