import { format, isAfter, parseISO, startOfDay, addDays } from 'date-fns';
import { Timetable, AttendanceOverride, DayOverride, SubjectStats, DayOfWeek } from '../../types';
import { SEMESTER_START_DATE } from '../constants';

/**
 * Finds the correct timetable active for a specific date.
 */
export const getTimetableForDate = (date: Date, timetables: Timetable[]): Timetable | null => {
  if (timetables.length === 0) return null;
  
  // Sort by effectiveDate descending
  const sorted = [...timetables].sort((a, b) => 
    parseISO(b.effectiveDate).getTime() - parseISO(a.effectiveDate).getTime()
  );

  const targetDate = startOfDay(date);
  const active = sorted.find(t => !isAfter(parseISO(t.effectiveDate), targetDate));
  
  // If no "active" found, fallback to the earliest timetable in the list
  return active || sorted[sorted.length - 1];
};

/**
 * Normalizes a subject name by removing room numbers and parentheses.
 * e.g., "Islamic Studies (R126)" -> "Islamic Studies"
 * e.g., "Object Oriented Programming (Ms. Rizwana Yasmeen)" -> "Object Oriented Programming"
 */
export const getSimplifiedSubject = (name: string): string => {
  if (!name) return name;
  let simplified = name.split(' (')[0].trim();
  
  // Normalize common variations to ensure historical matching
  if (simplified === "Expository Writing") simplified = "Expository Writings";
  
  // Special case for labs
  if (simplified.includes(' Lab')) {
    return simplified.split(' Lab')[0].trim() + ' Lab';
  }
  return simplified;
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

  // Pre-process overrides for O(1) lookup: date_slotId_simplifiedSubject -> status
  const overrideMap = new Map<string, string>();
  overrides.forEach(o => {
    const simplified = getSimplifiedSubject(o.subject);
    overrideMap.set(`${o.date}_${o.time_slot_id}_${simplified}`, o.status);
  });

  // Pre-process holiday dates for O(1) lookup
  const holidaySet = new Set(dayOverrides.filter(o => o.is_holiday).map(o => o.date));

  let iter = start;
  while (!isAfter(iter, end)) {
    const dateStr = format(iter, 'yyyy-MM-dd');
    
    if (holidaySet.has(dateStr)) {
      iter = addDays(iter, 1);
      continue;
    }

    const dayName = format(iter, 'EEEE') as DayOfWeek;
    const tt = getTimetableForDate(iter, timetables);
    
    if (tt) {
      const timeSlots = tt.timeSlots;
      const daySchedule = (tt.schedule[dayName] as Record<string, string>) || {};
      
      // Group consecutive same-subject slots
      let currentSessionSubject: string | null = null;
      
      timeSlots.forEach((slot) => {
        const subjectName = daySchedule[slot.id];
        if (!subjectName) {
          currentSessionSubject = null;
          return;
        }

        const subjectBase = getSimplifiedSubject(subjectName);

        // If it's a new subject (not a continuation of the previous slot's lab/session)
        if (subjectBase !== currentSessionSubject) {
          currentSessionSubject = subjectBase;

          if (!stats[subjectBase]) {
            stats[subjectBase] = { name: subjectBase, expected: 0, completed: 0, cancelled: 0 };
          }

          const status = overrideMap.get(`${dateStr}_${slot.id}_${subjectBase}`) || 'pending';
          
          if (status !== 'holiday') {
            stats[subjectBase].expected++;
            if (status === 'done') {
              stats[subjectBase].completed++;
            } else if (status === 'cancelled') {
              stats[subjectBase].cancelled++;
            }
          }
        }
        // If it was the same subject as previous slot, we just continue (count as 1 session)
      });
    }

    iter = addDays(iter, 1);
  }

  return Object.values(stats);
};
