import { Timetable, DayOfWeek } from '../types';

export const SEMESTER_START_DATE = '2026-02-17';
export const ADMIN_KEY_ENV_NAME = 'ADMIN_KEY';

export const DAYS: DayOfWeek[] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export const INITIAL_TIMETABLE_DATES = [
  '2026-02-17', '2026-02-18', '2026-02-22', '2026-03-01', '2026-03-07', '2026-03-24', '2026-03-29'
];

const createEmptyTimetable = (date: string, name: string): Timetable => ({
  id: crypto.randomUUID(),
  name,
  effectiveDate: date,
  timeSlots: [
    { id: '1', start: '08:00 AM', end: '09:00 AM' },
    { id: '2', start: '09:00 AM', end: '10:00 AM' },
    { id: '3', start: '10:00 AM', end: '11:00 AM' },
    { id: '4', start: '11:00 AM', end: '12:00 PM' },
    { id: '5', start: '12:00 PM', end: '01:00 PM' },
    { id: '6', start: '01:00 PM', end: '02:00 PM' },
    { id: '7', start: '02:00 PM', end: '03:00 PM' },
    { id: '8', start: '03:00 PM', end: '04:00 PM' },
  ],
  schedule: {
    Monday: { '1': 'Network Security', '2': 'Cryptography', '3': 'Digital Forensics' },
    Tuesday: { '1': 'Ethical Hacking', '2': 'Cyber Law', '3': 'Malware Analysis' },
    Wednesday: { '1': 'Network Security', '2': 'Cryptography', '3': 'Digital Forensics' },
    Thursday: { '1': 'Ethical Hacking', '2': 'Cyber Law', '3': 'Malware Analysis' },
    Friday: { '1': 'Network Security', '2': 'Capstone Project' },
    Saturday: {},
    Sunday: {},
  }
});

export const SEED_TIMETABLES: Timetable[] = [
  createEmptyTimetable('2026-02-17', 'Semester Start'),
];
