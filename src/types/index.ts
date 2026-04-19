export type ClassStatus = 'pending' | 'done' | 'cancelled' | 'holiday';

export interface TimeSlot {
  id: string;
  start: string; // e.g., "08:00 AM"
  end: string;   // e.g., "09:00 AM"
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface Timetable {
  id: string;
  name: string;
  effectiveDate: string; // ISO date string
  timeSlots: TimeSlot[];
  schedule: Record<DayOfWeek, Record<string, string>>;
}

export interface AttendanceOverride {
  id?: string;
  date: string; // YYYY-MM-DD
  subject: string;
  time_slot_id: string;
  status: ClassStatus;
  created_at?: string;
}

export interface DayOverride {
  date: string; // YYYY-MM-DD
  is_holiday: boolean;
}

export interface SubjectStats {
  name: string;
  expected: number;
  completed: number;
  cancelled: number;
}
