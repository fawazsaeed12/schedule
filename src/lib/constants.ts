import { Timetable, DayOfWeek } from '../types';

export const SEMESTER_START_DATE = '2026-02-16';
export const ADMIN_KEY_ENV_NAME = 'ADMIN_KEY';

export const DAYS: DayOfWeek[] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export const INITIAL_TIMETABLE_DATES = [
  '2026-02-16', '2026-02-18', '2026-03-01', '2026-03-07', '2026-03-24'
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
      Monday: { '1': 'ISL-101 (R126)', '2': 'CS-201 (R107)', '3': 'CS-202 (R117)', '5': 'CS-112 (R123)' },
      Tuesday: { '2': 'ISL-106 (R127)', '3': 'ISL-101 (R127)', '4': 'CS-202 (R210)', '8': 'ENG-108 (R127)' },
      Wednesday: { '1': 'MATH-106 (R105)', '2': 'CS-202 (R117)', '3': 'ENG-108 (R128)', '4': 'CS-112 (R128)', '8': 'EE-201 Lab (R104)', '9': 'EE-201 Lab (R104)' },
      Thursday: { '1': 'ENG-108 (R101)', '2': 'GEN-304 (R116)', '3': 'MATH-106 (R116)' },
      Friday: { '1': 'MATH-106 (R105)', '5': 'CS-112 Lab (R113)', '6': 'CS-112 Lab (R113)', '8': 'GEN-304 (R128)' },
      Saturday: {}, Sunday: {},
    }
  },
  // Phase 2 - Ramzan Shift (Feb 18)
  {
    id: 'p2-ramadan-v1',
    name: 'Ramadan (Phase 2)',
    effectiveDate: '2026-02-18',
    timeSlots: RAMADAN_SLOTS,
    schedule: {
      Monday: { '1': 'ISL-101', '2': 'CS-201', '3': 'CS-202', '5': 'CS-112' },
      Tuesday: { '2': 'ISL-106', '3': 'ISL-101', '4': 'CS-202', '6': 'CS-112', '8': 'ENG-108' },
      Wednesday: { '1': 'MATH-106', '2': 'CS-202', '3': 'ENG-108', '4': 'CS-112', '8': 'EE-201 Lab', '9': 'EE-201 Lab' },
      Thursday: { '1': 'ENG-108', '2': 'GEN-304', '3': 'MATH-106' },
      Friday: { '1': 'MATH-106', '5': 'CS-112 Lab', '6': 'CS-112 Lab', '7': 'CS-201', '8': 'GEN-304' },
      Saturday: {}, Sunday: {},
    }
  },
  // Phase 2 - Teacher Update - Rizwana (Mar 1)
  {
    id: 'p2-ramadan-v2',
    name: 'Ramadan (Rizwana Update)',
    effectiveDate: '2026-03-01',
    timeSlots: RAMADAN_SLOTS,
    schedule: {
      Monday: { '1': 'ISL-101', '2': 'CS-201', '3': 'CS-202', '5': 'CS-112 (Ms. Rizwana)' },
      Tuesday: { '2': 'ISL-106', '3': 'ISL-101', '4': 'CS-202', '6': 'CS-112 (Ms. Rizwana)', '8': 'ENG-108' },
      Wednesday: { '1': 'MATH-106', '2': 'CS-202', '3': 'ENG-108', '4': 'CS-112 (Ms. Rizwana)', '8': 'EE-201 Lab', '9': 'EE-201 Lab' },
      Thursday: { '1': 'ENG-108', '2': 'GEN-304', '3': 'MATH-106' },
      Friday: { '1': 'MATH-106', '5': 'CS-112 Lab', '6': 'CS-112 Lab', '7': 'CS-201', '8': 'GEN-304' },
      Saturday: {}, Sunday: {},
    }
  },
  // Phase 2 - Teacher Update - Faculty A (Mar 7)
  {
    id: 'p2-ramadan-v3',
    name: 'Ramadan (Faculty A Update)',
    effectiveDate: '2026-03-07',
    timeSlots: RAMADAN_SLOTS,
    schedule: {
      Monday: { '1': 'ISL-101', '2': 'CS-201', '3': 'CS-202', '5': 'CS-112 (Faculty A)' },
      Tuesday: { '2': 'ISL-106', '3': 'ISL-101', '4': 'CS-202', '6': 'CS-112 (Faculty A)', '8': 'ENG-108' },
      Wednesday: { '1': 'MATH-106', '2': 'CS-202', '3': 'ENG-108', '4': 'CS-112 (Faculty A)', '8': 'EE-201 Lab', '9': 'EE-201 Lab' },
      Thursday: { '1': 'ENG-108', '2': 'GEN-304', '3': 'MATH-106' },
      Friday: { '1': 'MATH-106', '5': 'CS-112 Lab', '6': 'CS-112 Lab', '7': 'CS-201', '8': 'GEN-304' },
      Saturday: {}, Sunday: {},
    }
  },
  // Phase 3 - Current Regular (Mar 24)
  {
    id: 'p3-current',
    name: 'Final Regular (Phase 3)',
    effectiveDate: '2026-03-24',
    timeSlots: STANDARD_SLOTS,
    schedule: {
      Monday: { '1': 'ISL-101 (R126)', '2': 'CS-201 (R107)', '3': 'CS-202 (R117)', '5': 'CS-112 (R123)' },
      Tuesday: { '1': 'ISL-101 (R127)', '2': 'ISL-106 (R127)', '4': 'CS-202 (R210)', '5': 'CS-112 (R116)', '8': 'ENG-108 (R127)' },
      Wednesday: { '1': 'MATH-106 (R105)', '2': 'CS-202 (R117)', '3': 'ENG-108 (R128)', '4': 'CS-112 (R128)', '8': 'EE-201 Lab (R104)', '9': 'EE-201 Lab (R104)' },
      Thursday: { '1': 'ENG-108 (R101)', '2': 'GEN-304 (R116)', '3': 'MATH-106 (R116)' },
      Friday: { '1': 'MATH-106 (R105)', '5': 'CS-112 Lab (R113)', '6': 'CS-112 Lab (R113)', '6-bis': 'CS-201 (R117)', '7': 'GEN-304 (R128)' },
      Saturday: {}, Sunday: {},
    }
  },
];
