import { Timetable, DayOfWeek } from '../types';

export const SEMESTER_START_DATE = '2026-02-16';
export const ADMIN_KEY_ENV_NAME = 'ADMIN_KEY';

export const DAYS: DayOfWeek[] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export const INITIAL_TIMETABLE_DATES = [
  '2026-02-17', '2026-02-18', '2026-02-22', '2026-03-01', '2026-03-07', '2026-03-24', '2026-03-29'
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
  { id: '10', start: '02:30 PM', end: '03:20 PM' },
  { id: '11', start: '03:20 PM', end: '04:10 PM' },
  { id: '12', start: '04:10 PM', end: '05:00 PM' },
];

export const SEED_TIMETABLES: Timetable[] = [
  // V1 - Initial Schedule (Feb 17)
  {
    id: 'v1-initial',
    name: 'Standard Schedule',
    effectiveDate: '2026-02-17',
    timeSlots: STANDARD_SLOTS,
    schedule: {
      Monday: { '1': 'Islamic Studies', '2': 'Digital Logic Design', '3': 'Discrete Structures', '5': 'Object Oriented Programming' },
      Tuesday: { '2': 'Understanding of Holy Quran 2', '3': 'Islamic Studies', '4': 'Discrete Structures', '6': 'Object Oriented Programming', '8': 'Expository Writings' },
      Wednesday: { '1': 'Basic Mathematics-II', '2': 'Discrete Structures', '3': 'Expository Writings', '4': 'Object Oriented Programming', '8': 'Digital Logic Design Lab', '9': 'Digital Logic Design Lab' },
      Thursday: { '1': 'Expository Writings', '2': 'Professional Practices', '3': 'Basic Mathematics-II' },
      Friday: { '1': 'Basic Mathematics-II', '5': 'Object Oriented Programming Lab', '6': 'Object Oriented Programming Lab', '7': 'Object Oriented Programming Lab', '8': 'Professional Practices' },
      Saturday: {},
      Sunday: {},
    }
  },
  // V2 - Ramadan Shift (Feb 18)
  {
    id: 'v2-ramadan',
    name: 'Ramadan Time Shift',
    effectiveDate: '2026-02-18',
    timeSlots: RAMADAN_SLOTS,
    schedule: {
      Monday: { '1': 'Islamic Studies', '2': 'Digital Logic Design', '3': 'Discrete Structures', '5': 'Object Oriented Programming' },
      Tuesday: { '2': 'Understanding of Holy Quran 2', '3': 'Islamic Studies', '4': 'Discrete Structures', '6': 'Object Oriented Programming', '8': 'Expository Writings' },
      Wednesday: { '1': 'Basic Mathematics-II', '2': 'Discrete Structures', '3': 'Expository Writings', '4': 'Object Oriented Programming', '8': 'Digital Logic Design Lab', '9': 'Digital Logic Design Lab' },
      Thursday: { '1': 'Expository Writings', '2': 'Professional Practices', '3': 'Basic Mathematics-II' },
      Friday: { '1': 'Basic Mathematics-II', '5': 'Object Oriented Programming Lab', '6': 'Object Oriented Programming Lab', '7': 'Object Oriented Programming Lab', '8': 'Professional Practices' },
      Saturday: {},
      Sunday: {},
    }
  },
  // V3 - Friday Adjustments (Feb 22)
  {
    id: 'v3-friday-fix',
    name: 'Friday Class Update',
    effectiveDate: '2026-02-22',
    timeSlots: RAMADAN_SLOTS,
    schedule: {
      Monday: { '1': 'Islamic Studies', '2': 'Digital Logic Design', '3': 'Discrete Structures', '5': 'Object Oriented Programming' },
      Tuesday: { '2': 'Understanding of Holy Quran 2', '3': 'Islamic Studies', '4': 'Discrete Structures', '6': 'Object Oriented Programming', '8': 'Expository Writings' },
      Wednesday: { '1': 'Basic Mathematics-II', '2': 'Discrete Structures', '3': 'Expository Writings', '4': 'Object Oriented Programming', '8': 'Digital Logic Design Lab', '9': 'Digital Logic Design Lab' },
      Thursday: { '1': 'Expository Writings', '2': 'Professional Practices', '3': 'Basic Mathematics-II' },
      Friday: { '1': 'Basic Mathematics-II', '5': 'Object Oriented Programming Lab', '6': 'Object Oriented Programming Lab', '7': 'Digital Logic Design', '8': 'Professional Practices' },
      Saturday: {},
      Sunday: {},
    }
  },
  // V4 - Teacher Update - Rizwana (Mar 1)
  {
    id: 'v4-teacher-rizwana',
    name: 'Teacher Update (Rizwana)',
    effectiveDate: '2026-03-01',
    timeSlots: RAMADAN_SLOTS,
    schedule: {
      Monday: { '1': 'Islamic Studies', '2': 'Digital Logic Design', '3': 'Discrete Structures', '5': 'Object Oriented Programming' },
      Tuesday: { '2': 'Understanding of Holy Quran 2', '3': 'Islamic Studies', '4': 'Discrete Structures', '6': 'Object Oriented Programming', '8': 'Expository Writings' },
      Wednesday: { '1': 'Basic Mathematics-II', '2': 'Discrete Structures', '3': 'Expository Writings', '4': 'Object Oriented Programming', '8': 'Digital Logic Design Lab', '9': 'Digital Logic Design Lab' },
      Thursday: { '1': 'Expository Writings', '2': 'Professional Practices', '3': 'Basic Mathematics-II' },
      Friday: { '1': 'Basic Mathematics-II', '5': 'Object Oriented Programming Lab', '6': 'Object Oriented Programming Lab', '7': 'Digital Logic Design', '8': 'Professional Practices' },
      Saturday: {},
      Sunday: {},
    }
  },
  // V5 - Teacher Update - Faculty A (Mar 7)
  {
    id: 'v5-teacher-faculty-a',
    name: 'Teacher Update (Faculty A)',
    effectiveDate: '2026-03-07',
    timeSlots: RAMADAN_SLOTS,
    schedule: {
      Monday: { '1': 'Islamic Studies', '2': 'Digital Logic Design', '3': 'Discrete Structures', '5': 'Object Oriented Programming' },
      Tuesday: { '2': 'Understanding of Holy Quran 2', '3': 'Islamic Studies', '4': 'Discrete Structures', '6': 'Object Oriented Programming', '8': 'Expository Writings' },
      Wednesday: { '1': 'Basic Mathematics-II', '2': 'Discrete Structures', '3': 'Expository Writings', '4': 'Object Oriented Programming', '8': 'Digital Logic Design Lab', '9': 'Digital Logic Design Lab' },
      Thursday: { '1': 'Expository Writings', '2': 'Professional Practices', '3': 'Basic Mathematics-II' },
      Friday: { '1': 'Basic Mathematics-II', '5': 'Object Oriented Programming Lab', '6': 'Object Oriented Programming Lab', '7': 'Digital Logic Design', '8': 'Professional Practices' },
      Saturday: {},
      Sunday: {},
    }
  },
  // V6 - March Update (Standard Time + Esha)
  {
    id: 'v6-march-esha',
    name: 'Teacher Update (Esha)',
    effectiveDate: '2026-03-24',
    timeSlots: STANDARD_SLOTS,
    schedule: {
      Monday: { '1': 'Islamic Studies', '2': 'Digital Logic Design', '3': 'Discrete Structures', '5': 'Object Oriented Programming' },
      Tuesday: { '1': 'Islamic Studies', '2': 'Understanding of Holy Quran 2', '4': 'Discrete Structures', '5': 'Object Oriented Programming', '8': 'Expository Writings' },
      Wednesday: { '1': 'Basic Mathematics-II', '2': 'Discrete Structures', '3': 'Expository Writings', '4': 'Object Oriented Programming', '8': 'Digital Logic Design Lab', '9': 'Digital Logic Design Lab' },
      Thursday: { '1': 'Expository Writings', '2': 'Professional Practices', '3': 'Basic Mathematics-II' },
      Friday: { '1': 'Basic Mathematics-II', '5': 'Object Oriented Programming Lab', '6': 'Object Oriented Programming Lab', '7': 'Digital Logic Design', '8': 'Professional Practices' },
      Saturday: {},
      Sunday: {},
    }
  },
  // V7 - Final Update (Sana Maqbool)
  {
    id: 'v7-final-sana',
    name: 'Final Schedule (Sana)',
    effectiveDate: '2026-03-29',
    timeSlots: STANDARD_SLOTS,
    schedule: {
      Monday: { '1': 'Islamic Studies', '2': 'Digital Logic Design', '3': 'Discrete Structures', '5': 'Object Oriented Programming' },
      Tuesday: { '1': 'Islamic Studies', '2': 'Understanding of Holy Quran 2', '4': 'Discrete Structures', '5': 'Object Oriented Programming', '8': 'Expository Writings' },
      Wednesday: { '1': 'Basic Mathematics-II', '2': 'Discrete Structures', '3': 'Expository Writings', '4': 'Object Oriented Programming', '8': 'Digital Logic Design Lab', '9': 'Digital Logic Design Lab' },
      Thursday: { '1': 'Expository Writings', '2': 'Professional Practices', '3': 'Basic Mathematics-II' },
      Friday: { '1': 'Basic Mathematics-II', '5': 'Object Oriented Programming Lab', '6': 'Object Oriented Programming Lab', '7': 'Digital Logic Design', '8': 'Professional Practices' },
      Saturday: {},
      Sunday: {},
    }
  },
];
