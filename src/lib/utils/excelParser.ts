import * as XLSX from 'xlsx';
import { Timetable, TimeSlot, DayOfWeek } from '@/types';
import { DAYS } from '@/lib/constants';

/**
 * Parses an Excel file into a Timetable model.
 */
export const parseExcelTimetable = async (file: File): Promise<Partial<Timetable>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const timeSlots: TimeSlot[] = [];
        const matrix: Record<DayOfWeek, Record<string, string>> = {
          Monday: {}, Tuesday: {}, Wednesday: {}, Thursday: {}, Friday: {}, Saturday: {}, Sunday: {}
        };

        let dayRowIndex = -1;
        let timeColIndex = -1;

        rows.forEach((row, rIdx) => {
          row.forEach((cell, cIdx) => {
            if (typeof cell === 'string') {
              const lowerCell = cell.toLowerCase();
              if (DAYS.some(d => lowerCell.includes(d.toLowerCase()))) {
                if (dayRowIndex === -1) dayRowIndex = rIdx;
              }
              if (/\d{1,2}:\d{2}/.test(lowerCell)) {
                if (timeColIndex === -1) timeColIndex = cIdx;
              }
            }
          });
        });

        if (dayRowIndex === -1 || timeColIndex === -1) {
          throw new Error('Could not identify Days or Time Slots in the Excel file.');
        }

        for (let r = dayRowIndex + 1; r < rows.length; r++) {
          const timeVal = rows[r][timeColIndex];
          if (timeVal && typeof timeVal === 'string' && /\d{1,2}:\d{2}/.test(timeVal)) {
            const [start, end] = timeVal.split(/[-—–\s]+/).filter(s => /\d/.test(s));
            const id = `slot-${r}`;
            timeSlots.push({ id, start: start || timeVal, end: end || '' });

            rows[dayRowIndex].forEach((dayCell, cIdx) => {
              if (cIdx === timeColIndex) return;
              const dayMatch = DAYS.find(d => dayCell?.toString().toLowerCase().includes(d.toLowerCase()));
              if (dayMatch) {
                const subject = rows[r][cIdx]?.toString().trim() || '';
                if (subject) matrix[dayMatch][id] = subject;
              }
            });
          }
        }

        resolve({ timeSlots, schedule: matrix });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};
