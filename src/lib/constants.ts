import { Timetable, DayOfWeek } from '../types';

export const SEMESTER_START_DATE = '2026-02-16';
export const ADMIN_KEY_ENV_NAME = 'ADMIN_KEY';

export const DAYS: DayOfWeek[] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export const INITIAL_TIMETABLE_DATES = [
  '2026-02-16', '2026-02-18', '2026-02-22', '2026-03-01', '2026-03-07', '2026-03-24', '2026-03-29', '2026-04-20'
];

const STANDARD_SLOTS = [
  { id: '1', start: '08:00 AM', end: '09:00 AM' },
  { id: '2', start: '09:00 AM', end: '10:00 AM' },
  { id: '3', start: '10:00 AM', end: '11:00 AM' },
  { id: '4', start: '11:00 AM', end: '12:00 PM' },
  { id: '5', start: '12:00 PM', end: '01:00 PM' },
  { id: '6', start: '01:00 PM', end: '02:00 PM' },
  { id: '7', start: '02:00 PM', end: '03:00 PM' },
  { id: '8', start: '03:00 PM', end: '04:00 PM' },
  { id: '9', start: '04:00 PM', end: '05:00 PM' },
  { id: '10', start: '05:00 PM', end: '06:00 PM' },
  { id: '11', start: '06:00 PM', end: '07:00 PM' },
  { id: '12', start: '07:00 PM', end: '08:00 PM' },
];

const RAMADAN_SLOTS = [
  { id: '1', start: '07:00 AM', end: '07:50 AM' },
  { id: '2', start: '07:50 AM', end: '08:40 AM' },
  { id: '3', start: '08:40 AM', end: '09:30 AM' },
  { id: '4', start: '09:30 AM', end: '10:20 AM' },
  { id: '5', start: '10:20 AM', end: '11:10 AM' },
  { id: '6', start: '11:10 AM', end: '12:00 PM' },
  { id: '7', start: '12:00 PM', end: '12:50 PM' },
  { id: '8', start: '12:50 PM', end: '01:40 PM' },
  { id: '9', start: '01:40 PM', end: '02:30 PM' },
];

export const SEED_TIMETABLES: Timetable[] = [
  // Phase 1 - Standard Hours (Feb 16)
  {
    id: 'p1-standard',
    name: 'Standard (Phase 1)',
    effectiveDate: '2026-02-16',
    timeSlots: STANDARD_SLOTS,
    schedule: {
      Monday: { '1': 'Islamic Studies (R126)', '2': 'Digital Logic Design (R107)', '3': 'Discrete Structures (R117)', '5': 'Object Oriented Programming (R123)' },
      Tuesday: { '2': 'Understanding of Holy Quran 2 (R127)', '3': 'Islamic Studies (R127)', '4': 'Discrete Structures (R210)', '8': 'Expository Writings (R127)' },
      Wednesday: { '1': 'Basic Mathematics-II (R105)', '2': 'Discrete Structures (R117)', '3': 'Expository Writings (R128)', '4': 'Object Oriented Programming (R128)', '8': 'Digital Logic Design Lab (R104)', '9': 'Digital Logic Design Lab (R104)' },
      Thursday: { '1': 'Expository Writings (R101)', '2': 'Professional Practices (R116)', '3': 'Basic Mathematics-II (R116)' },
      Friday: { '1': 'Basic Mathematics-II (R105)', '5': 'Object Oriented Programming Lab (R113)', '6': 'Object Oriented Programming Lab (R113)', '8': 'Professional Practices (R128)' },
      Saturday: {}, Sunday: {},
    }
  },
  // Phase 2a - Ramadan Start (Feb 18)
  {
    id: 'p2a-ramadan-v1',
    name: 'Ramadan (Phase 2a)',
    effectiveDate: '2026-02-18',
    timeSlots: RAMADAN_SLOTS,
    schedule: {
      Monday: { '1': 'Islamic Studies (R126)', '2': 'Digital Logic Design (R107)', '3': 'Discrete Structures (R117)', '5': 'Object Oriented Programming (R123)' },
      Tuesday: { '2': 'Understanding of Holy Quran 2 (R127)', '3': 'Islamic Studies (R127)', '4': 'Discrete Structures (R210)', '6': 'Object Oriented Programming (R210)', '8': 'Expository Writings (R127)' },
      Wednesday: { '1': 'Basic Mathematics-II (R105)', '2': 'Discrete Structures (R117)', '3': 'Expository Writings (R128)', '4': 'Object Oriented Programming (R128)', '8': 'Digital Logic Design Lab (R104)', '9': 'Digital Logic Design Lab (R104)' },
      Thursday: { '1': 'Expository Writings (R101)', '2': 'Professional Practices (R116)', '3': 'Basic Mathematics-II (R116)' },
      Friday: { '1': 'Basic Mathematics-II (R105)', '5': 'Object Oriented Programming Lab (R113)', '6': 'Object Oriented Programming Lab (R113)', '7': 'Digital Logic Design (R117)', '8': 'Professional Practices (R128)' },
      Saturday: {}, Sunday: {},
    }
  },
  // Phase 2b - Ramadan (Feb 22)
  {
    id: 'p2b-ramadan-v2',
    name: 'Ramadan (Phase 2b)',
    effectiveDate: '2026-02-22',
    timeSlots: RAMADAN_SLOTS,
    schedule: {
      Monday: { '1': 'Islamic Studies (R126)', '2': 'Digital Logic Design (R107)', '3': 'Discrete Structures (R117)', '5': 'Object Oriented Programming (R123)' },
      Tuesday: { '2': 'Understanding of Holy Quran 2 (R127)', '3': 'Islamic Studies (R127)', '4': 'Discrete Structures (R210)', '6': 'Object Oriented Programming (R210)', '8': 'Expository Writings (R127)' },
      Wednesday: { '1': 'Basic Mathematics-II (R105)', '2': 'Discrete Structures (R117)', '3': 'Expository Writings (R128)', '4': 'Object Oriented Programming (R128)', '8': 'Digital Logic Design Lab (R104)', '9': 'Digital Logic Design Lab (R104)' },
      Thursday: { '1': 'Expository Writings (R101)', '2': 'Professional Practices (R116)', '3': 'Basic Mathematics-II (R116)' },
      Friday: { '1': 'Basic Mathematics-II (R105)', '5': 'Object Oriented Programming Lab (R113)', '6': 'Object Oriented Programming Lab (R113)', '7': 'Digital Logic Design (R117)', '8': 'Professional Practices (R128)' },
      Saturday: {}, Sunday: {},
    }
  },
  // Phase 2c - Ramadan with Rizwana Update (Mar 1)
  {
    id: 'p2c-ramadan-v3',
    name: 'Ramadan (Rizwana Update)',
    effectiveDate: '2026-03-01',
    timeSlots: RAMADAN_SLOTS,
    schedule: {
      Monday: { '1': 'Islamic Studies (R126)', '2': 'Digital Logic Design (R107)', '3': 'Discrete Structures (R117)', '5': 'Object Oriented Programming (Ms. Rizwana Yasmeen)' },
      Tuesday: { '1': 'Islamic Studies (R127)', '2': 'Understanding of Holy Quran 2 (R127)', '4': 'Discrete Structures (R210)', '6': 'Object Oriented Programming (Ms. Rizwana Yasmeen)', '8': 'Expository Writings (R127)' },
      Wednesday: { '1': 'Basic Mathematics-II (R105)', '2': 'Discrete Structures (R117)', '3': 'Expository Writings (R128)', '4': 'Object Oriented Programming (Ms. Rizwana Yasmeen)', '8': 'Digital Logic Design Lab (R104)', '9': 'Digital Logic Design Lab (R104)' },
      Thursday: { '1': 'Expository Writings (R101)', '2': 'Professional Practices (R116)', '3': 'Basic Mathematics-II (R116)' },
      Friday: { '1': 'Basic Mathematics-II (R105)', '5': 'Object Oriented Programming Lab (R113)', '6': 'Object Oriented Programming Lab (R113)', '7': 'Digital Logic Design (R117)', '8': 'Professional Practices (R128)' },
      Saturday: {}, Sunday: {},
    }
  },
  // Phase 2d - Ramadan with Faculty A Update (Mar 7)
  {
    id: 'p2d-ramadan-v4',
    name: 'Ramadan (Faculty A Update)',
    effectiveDate: '2026-03-07',
    timeSlots: RAMADAN_SLOTS,
    schedule: {
      Monday: { '1': 'Islamic Studies (R126)', '2': 'Digital Logic Design (R107)', '3': 'Discrete Structures (R117)', '5': 'Object Oriented Programming (Faculty A)' },
      Tuesday: { '1': 'Islamic Studies (R127)', '2': 'Understanding of Holy Quran 2 (R127)', '4': 'Discrete Structures (R210)', '6': 'Object Oriented Programming (Faculty A) (R116)', '8': 'Expository Writings (R127)' },
      Wednesday: { '1': 'Basic Mathematics-II (R105)', '2': 'Discrete Structures (R117)', '3': 'Expository Writings (R128)', '4': 'Object Oriented Programming (Faculty A)', '8': 'Digital Logic Design Lab (R104)', '9': 'Digital Logic Design Lab (R104)' },
      Thursday: { '1': 'Expository Writings (R101)', '2': 'Professional Practices (R116)', '3': 'Basic Mathematics-II (R116)' },
      Friday: { '1': 'Basic Mathematics-II (R105)', '5': 'Object Oriented Programming Lab (R113)', '6': 'Object Oriented Programming Lab (R113)', '7': 'Digital Logic Design (R117)', '8': 'Professional Practices (R128)' },
      Saturday: {}, Sunday: {},
    }
  },
  // Phase 3 - Back to Standard Hours (Mar 24)
  {
    id: 'p3-standard-v2',
    name: 'Standard (Phase 3)',
    effectiveDate: '2026-03-24',
    timeSlots: STANDARD_SLOTS,
    schedule: {
      Monday: { '1': 'Islamic Studies (R126)', '2': 'Digital Logic Design (R107)', '3': 'Discrete Structures (R117)', '5': 'Object Oriented Programming (R123)' },
      Tuesday: { '1': 'Islamic Studies (R127)', '2': 'Understanding of Holy Quran 2 (R127)', '4': 'Discrete Structures (R210)', '5': 'Object Oriented Programming (R116)', '8': 'Expository Writings (R127)' },
      Wednesday: { '1': 'Basic Mathematics-II (R105)', '2': 'Discrete Structures (R117)', '3': 'Expository Writings (R128)', '4': 'Object Oriented Programming (R128)', '8': 'Digital Logic Design Lab (R104)', '9': 'Digital Logic Design Lab (R104)' },
      Thursday: { '1': 'Expository Writings (R101)', '2': 'Professional Practices (R116)', '3': 'Basic Mathematics-II (R116)' },
      Friday: { '1': 'Basic Mathematics-II (R105)', '5': 'Object Oriented Programming Lab (R113)', '6': 'Object Oriented Programming Lab (R113)', '7': 'Digital Logic Design (R117)', '8': 'Professional Practices (R128)' },
      Saturday: {}, Sunday: {},
    }
  },
  // Phase 4 - Final Standard (Mar 29)
  {
    id: 'p4-standard-final',
    name: 'Standard (Phase 4)',
    effectiveDate: '2026-03-29',
    timeSlots: STANDARD_SLOTS,
    schedule: {
      Monday: { '1': 'Islamic Studies (R126)', '2': 'Digital Logic Design (R107)', '3': 'Discrete Structures (R117)', '5': 'Object Oriented Programming (R123)' },
      Tuesday: { '1': 'Islamic Studies (R127)', '2': 'Understanding of Holy Quran 2 (R127)', '4': 'Discrete Structures (R210)', '5': 'Object Oriented Programming (R116)', '8': 'Expository Writings (R127)' },
      Wednesday: { '1': 'Basic Mathematics-II (R105)', '2': 'Discrete Structures (R117)', '3': 'Expository Writings (R128)', '4': 'Object Oriented Programming (R128)', '8': 'Digital Logic Design Lab (R104)', '9': 'Digital Logic Design Lab (R104)' },
      Thursday: { '1': 'Expository Writings (R101)', '2': 'Professional Practices (R116)', '3': 'Basic Mathematics-II (R116)' },
      Friday: { '1': 'Basic Mathematics-II (R105)', '5': 'Object Oriented Programming Lab (R113)', '6': 'Object Oriented Programming Lab (R113)', '7': 'Digital Logic Design (R117)', '8': 'Professional Practices (R128)' },
      Saturday: {}, Sunday: {},
    }
  },
  // Phase 5 - Spring-26 New Timetable (Apr 20)
  {
    id: 'p5-spring26',
    name: 'Standard (Phase 5 - Apr 20)',
    effectiveDate: '2026-04-20',
    timeSlots: STANDARD_SLOTS,
    schedule: {
      Monday: { 
        '1': 'Islamic Studies (R126)', 
        '2': 'Digital Logic Design (R107)', 
        '3': 'Discrete Structures (R117)', 
        '5': 'Object Oriented Programming (R123)' 
      },
      Tuesday: { 
        '1': 'Islamic Studies (R127)', 
        '2': 'Understanding of Holy Quran 2 (R127)', 
        '4': 'Discrete Structures (R210)', 
        '5': 'Object Oriented Programming (R116)', 
        '8': 'Expository Writings (R127)' 
      },
      Wednesday: { 
        '1': 'Basic Mathematics-II (R105)', 
        '2': 'Discrete Structures (R117)', 
        '3': 'Expository Writings (R128)', 
        '4': 'Object Oriented Programming (R128)', 
        '8': 'Digital Logic Design Lab (R104)', 
        '9': 'Digital Logic Design Lab (R104)',
        '10': 'Digital Logic Design Lab (R104)'
      },
      Thursday: { 
        '1': 'Expository Writings (R101)', 
        '2': 'Professional Practices (R116)', 
        '3': 'Basic Mathematics-II (R116)' 
      },
      Friday: { 
        '1': 'Basic Mathematics-II (R105)', 
        '5': 'Object Oriented Programming Lab (R113)', 
        '6': 'Object Oriented Programming Lab (R113)', 
        '7': 'Digital Logic Design (R117)', 
        '8': 'Professional Practices (R128)' 
      },
      Saturday: {}, Sunday: {},
    }
  },
];
