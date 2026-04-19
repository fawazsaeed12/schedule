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
      Monday: { '1': 'ISL-101', '2': 'CS-201', '3': 'CS-202', '5': 'CS-112' },
      Tuesday: { '2': 'ISL-106', '3': 'ISL-101', '4': 'CS-202', '6': 'CS-112', '8': 'ENG-108' },
      Wednesday: { '1': 'MATH-106', '2': 'CS-202', '3': 'ENG-108', '4': 'CS-112', '8': 'EE-201 Lab', '9': 'EE-201 Lab' },
      Thursday: { '1': 'ENG-108', '2': 'GEN-304', '3': 'MATH-106' },
      Friday: { '1': 'MATH-106', '5': 'CS-112 Lab', '6': 'CS-112 Lab', '7': 'CS-112 Lab', '8': 'GEN-304' },
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
      Monday: { '1': 'ISL-101', '2': 'CS-201', '3': 'CS-202', '5': 'CS-112' },
      Tuesday: { '2': 'ISL-106', '3': 'ISL-101', '4': 'CS-202', '6': 'CS-112', '8': 'ENG-108' },
      Wednesday: { '1': 'MATH-106', '2': 'CS-202', '3': 'ENG-108', '4': 'CS-112', '8': 'EE-201 Lab', '9': 'EE-201 Lab' },
      Thursday: { '1': 'ENG-108', '2': 'GEN-304', '3': 'MATH-106' },
      Friday: { '1': 'MATH-106', '5': 'CS-112 Lab', '6': 'CS-112 Lab', '7': 'CS-112 Lab', '8': 'GEN-304' },
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
      Monday: { '1': 'ISL-101', '2': 'CS-201', '3': 'CS-202', '5': 'CS-112' },
      Tuesday: { '2': 'ISL-106', '3': 'ISL-101', '4': 'CS-202', '6': 'CS-112', '8': 'ENG-108' },
      Wednesday: { '1': 'MATH-106', '2': 'CS-202', '3': 'ENG-108', '4': 'CS-112', '8': 'EE-201 Lab', '9': 'EE-201 Lab' },
      Thursday: { '1': 'ENG-108', '2': 'GEN-304', '3': 'MATH-106' },
      Friday: { '1': 'MATH-106', '5': 'CS-112 Lab', '6': 'CS-112 Lab', '7': 'CS-201', '8': 'GEN-304' },
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
      Monday: { '1': 'ISL-101', '2': 'CS-201', '3': 'CS-202', '5': 'CS-112' }, // CS-112 now with Ms. Rizwana
      Tuesday: { '2': 'ISL-106', '3': 'ISL-101', '4': 'CS-202', '6': 'CS-112', '8': 'ENG-108' },
      Wednesday: { '1': 'MATH-106', '2': 'CS-202', '3': 'ENG-108', '4': 'CS-112', '8': 'EE-201 Lab', '9': 'EE-201 Lab' },
      Thursday: { '1': 'ENG-108', '2': 'GEN-304', '3': 'MATH-106' },
      Friday: { '1': 'MATH-106', '5': 'CS-112 Lab', '6': 'CS-112 Lab', '7': 'CS-201', '8': 'GEN-304' },
      Saturday: {},
      Sunday: {},
    }
  },
  // V5 - Teacher Update - Faculty A (Mar 7, 24, 29)
  {
    id: 'v5-teacher-faculty-a',
    name: 'Teacher Update (Faculty A)',
    effectiveDate: '2026-03-07',
    timeSlots: RAMADAN_SLOTS,
    schedule: {
      Monday: { '1': 'ISL-101', '2': 'CS-201', '3': 'CS-202', '5': 'CS-112' },
      Tuesday: { '2': 'ISL-106', '3': 'ISL-101', '4': 'CS-202', '6': 'CS-112', '8': 'ENG-108' },
      Wednesday: { '1': 'MATH-106', '2': 'CS-202', '3': 'ENG-108', '4': 'CS-112', '8': 'EE-201 Lab', '9': 'EE-201 Lab' },
      Thursday: { '1': 'ENG-108', '2': 'GEN-304', '3': 'MATH-106' },
      Friday: { '1': 'MATH-106', '5': 'CS-112 Lab', '6': 'CS-112 Lab', '7': 'CS-201', '8': 'GEN-304' },
      Saturday: {},
      Sunday: {},
    }
  },
];
