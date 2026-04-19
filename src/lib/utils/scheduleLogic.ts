import { format, isAfter, parseISO, startOfDay, addDays } from 'date-fns';
import { Timetable, AttendanceOverride, DayOverride, SubjectStats } from '../../types';
import { SEMESTER_START_DATE } from '../constants';

/**
 * Finds the correct timetable active for a specific date.
 */
export const getTimetableForDate = (date: Date, timetables: Timetable[]): Timetable | null => {
  if (timetables.length === 0) return null;
  const sorted = [...timetables].sort((a, b) => 
    parseISO(b.effectiveDate).getTime() - parseISO(a.effectiveDate).getTime()
  );

  const active = sorted.find(t => !isAfter(parseISO(t.effectiveDate), startOfDay(date)));
  return active || (timetables.length > 0 ? timetables[0] : null);
};

/**
 * Calculates statistics for all subjects.
 */
export const calculateAllStats = (
  timetables: Timetable[],
  overrides: AttendanceOverride[],
  dayOverrides: DayOverride[],
  currentDate: Date = new Date()
): SubjectStats[] => {
  const stats: Record<string, SubjectStats> = {};
  const start = parseISO(SEMESTER_START_DATE);
  const end = startOfDay(currentDate);

  let iter = start;
  while (!isAfter(iter, end)) {
    const dateStr = format(iter, 'yyyy-MM-dd');
    const dayName = format(iter, 'EEEE') as any;
    
    const dayOverride = dayOverrides.find(o => o.date === dateStr);
    if (dayOverride?.is_holiday) {
      iter = addDays(iter, 1);
      continue;
    }

    const tt = getTimetableForDate(iter, timetables);
    if (tt) {
      const daySchedule = tt.schedule[dayName] || {};
      
      Object.entries(daySchedule).forEach(([slotId, subject]) => {
        if (!subject) return;

        if (!stats[subject]) {
          stats[subject] = { name: subject, expected: 0, completed: 0, cancelled: 0 };
        }

        const override = overrides.find(o => o.date === dateStr && o.subject === subject && o.time_slot_id === slotId);
        
        if (override) {
          if (override.status === 'done') {
            stats[subject].expected++;
            stats[subject].completed++;
          } else if (override.status === 'cancelled') {
            stats[subject].expected++;
            stats[subject].cancelled++;
          }
        } else {
          stats[subject].expected++;
        }
      });
    }

    iter = addDays(iter, 1);
  }

  return Object.values(stats);
};
