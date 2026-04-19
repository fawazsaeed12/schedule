'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Timetable, AttendanceOverride, DayOverride, SubjectStats } from '../types';
import { supabase } from '../lib/supabase/client';
import { calculateAllStats } from '../lib/utils/scheduleLogic';
import { SEED_TIMETABLES } from '../lib/constants';

interface ScheduleContextType {
  timetables: Timetable[];
  overrides: AttendanceOverride[];
  dayOverrides: DayOverride[];
  isAdmin: boolean;
  isLoaded: boolean;
  stats: SubjectStats[];
  toggleAdmin: (val: boolean) => void;
  updateTimetables: (newTimetables: Timetable[]) => Promise<void>;
  upsertOverride: (override: AttendanceOverride) => Promise<void>;
  toggleDayHoliday: (date: string) => Promise<void>;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timetables, setTimetables] = useState<Timetable[]>(SEED_TIMETABLES);
  const [overrides, setOverrides] = useState<AttendanceOverride[]>([]);
  const [dayOverrides, setDayOverrides] = useState<DayOverride[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initial Fetch & LocalStorage
  useEffect(() => {
    // Hydrate Admin State
    const storedAdmin = localStorage.getItem('uni_sync_admin') === 'true';
    if (storedAdmin) setIsAdmin(true);

    const fetchData = async () => {
      try {
        const [ttRes, attRes, dayRes] = await Promise.all([
          supabase.from('timetables').select('*').order('effectiveDate', { ascending: false }),
          supabase.from('attendance').select('*'),
          supabase.from('day_overrides').select('*')
        ]);

        if (ttRes.data && ttRes.data.length > 0) setTimetables(ttRes.data);
        if (attRes.data) setOverrides(attRes.data);
        if (dayRes.data) setDayOverrides(dayRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchData();
  }, []);

  // Derived stats
  const stats = useMemo(() => 
    calculateAllStats(timetables, overrides, dayOverrides),
    [timetables, overrides, dayOverrides]
  );

  const toggleAdmin = (val: boolean) => {
    setIsAdmin(val);
    localStorage.setItem('uni_sync_admin', val ? 'true' : 'false');
  };

  const updateTimetables = async (newTimetables: Timetable[]) => {
    // In a real app, we'd batch update or upsert to Supabase
    // For this prototype, we'll push the latest one
    const latest = newTimetables[newTimetables.length - 1];
    await supabase.from('timetables').upsert(latest);
    setTimetables(newTimetables);
  };

  const upsertOverride = async (override: AttendanceOverride) => {
    const { error } = await supabase.from('attendance').upsert(override, {
      onConflict: 'date,subject,time_slot_id'
    });
    
    if (!error) {
      setOverrides(prev => {
        const existing = prev.find(o => o.date === override.date && o.subject === override.subject && o.time_slot_id === override.time_slot_id);
        if (existing) return prev.map(o => (o === existing ? override : o));
        return [...prev, override];
      });
    }
  };

  const toggleDayHoliday = async (date: string) => {
    const existing = dayOverrides.find(o => o.date === date);
    const newStatus = existing ? !existing.is_holiday : true;
    
    const { error } = await supabase.from('day_overrides').upsert({ date, is_holiday: newStatus });
    
    if (!error) {
      setDayOverrides(prev => {
        if (existing) return prev.map(o => o.date === date ? { ...o, is_holiday: newStatus } : o);
        return [...prev, { date, is_holiday: true }];
      });
    }
  };

  return (
    <ScheduleContext.Provider value={{
      timetables,
      overrides,
      dayOverrides,
      isAdmin,
      isLoaded,
      stats,
      toggleAdmin,
      updateTimetables,
      upsertOverride,
      toggleDayHoliday
    }}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) throw new Error('useSchedule must be used within a ScheduleProvider');
  return context;
};
