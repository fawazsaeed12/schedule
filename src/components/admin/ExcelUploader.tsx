'use client';

import React, { useState } from 'react';
import { useSchedule } from '@/context/ScheduleContext';
import { parseExcelTimetable } from '@/lib/utils/excelParser';
import { Upload, FileText, Check, AlertCircle, Calendar } from 'lucide-react';
import { Timetable } from '@/types';
import { format } from 'date-fns';

const ExcelUploader: React.FC = () => {
  const { timetables, updateTimetables } = useSchedule();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Partial<Timetable> | null>(null);
  const [effectiveDate, setEffectiveDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setError(null);
    setIsParsing(true);

    try {
      const parsed = await parseExcelTimetable(selected);
      setPreview(parsed);
    } catch (err: any) {
      setError(err.message || 'Failed to parse file');
    } finally {
      setIsParsing(false);
    }
  };

  const handleConfirm = async () => {
    if (!preview) return;

    const newTimetable: Timetable = {
      id: crypto.randomUUID(),
      name: `Sync ${format(new Date(), 'MMM dd')}`,
      effectiveDate,
      timeSlots: preview.timeSlots || [],
      schedule: preview.schedule as any || {},
    };

    try {
      await updateTimetables([...timetables, newTimetable]);
      setFile(null);
      setPreview(null);
      alert('Timetable synced to Vercel/Supabase successfully!');
    } catch (err) {
      alert('Sync failed. Check database permissions.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">System Settings</h2>
        <p className="text-white/40 mt-1">Manage versioned schedules and administrative configurations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass-card p-8 border-dashed border-white/10 hover:border-primary/50 transition-colors relative">
            <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4"><Upload className="w-8 h-8 text-primary" /></div>
              <h3 className="text-xl font-bold text-white tracking-tight">{file ? file.name : "Drop Schedule File"}</h3>
              <p className="text-white/40 mt-2 text-sm font-medium opacity-60">Upload .xlsx to update the system timetable</p>
            </div>
          </div>

          {preview && (
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold"><Calendar className="w-5 h-5" /> Effective Date</div>
              <input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 outline-none" />
              <button onClick={handleConfirm} className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all flex items-center justify-center gap-2">
                <Check className="w-5 h-5" /> Push to Production
              </button>
            </div>
          )}
          {error && <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-start gap-3 text-rose-200 text-sm"><AlertCircle className="w-5 h-5 text-rose-400" /> {error}</div>}
        </div>

        <div className="glass-card p-6 overflow-hidden flex flex-col">
          <h4 className="font-bold text-white flex items-center gap-2 mb-4"><FileText className="w-5 h-5 text-primary" /> Data Preview</h4>
          <div className="flex-1 overflow-auto max-h-[400px]">
            {preview ? (
              <table className="w-full text-[11px] text-left border-collapse">
                 <thead className="sticky top-0 bg-black/60 backdrop-blur-sm z-20">
                   <tr className="border-b border-white/10">
                     <th className="py-2 pr-4 text-white/40 font-bold uppercase tracking-widest">Time</th>
                     <th className="py-2 pr-4 text-white/40 font-bold uppercase tracking-widest">Monday</th>
                     <th className="py-2 pr-4 text-white/40 font-bold uppercase tracking-widest">Tuesday</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {preview.timeSlots?.slice(0, 15).map((slot, i) => (
                     <tr key={i} className="hover:bg-white/[0.02]">
                       <td className="py-2 text-white/60 font-mono">{slot.start}</td>
                       <td className="py-2 text-white truncate max-w-[100px]">{preview.schedule?.Monday[slot.id] || '-'}</td>
                       <td className="py-2 text-white truncate max-w-[100px]">{preview.schedule?.Tuesday[slot.id] || '-'}</td>
                     </tr>
                   ))}
                 </tbody>
              </table>
            ) : <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-20"><FileText className="w-12 h-12 mb-4" /> <p className="font-medium tracking-widest uppercase text-[10px]">No File Parsed</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelUploader;
