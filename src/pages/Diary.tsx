import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Smile, Meh, Frown } from 'lucide-react';
import { db, DiaryEntry } from '../lib/db';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function Diary() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [mood, setMood] = useState<number | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    db.getDiaryEntries().then(setEntries);
  }, []);

  const saveEntry = async () => {
    if (!mood) return;
    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood,
      ideationFrequency: 1, // Default for now
      copingStrategiesUsed: [],
      notes
    };
    await db.saveDiaryEntry(newEntry);
    setEntries([newEntry, ...entries]);
    setMood(null);
    setNotes('');
  };

  return (
    <div className="p-6 flex flex-col h-full bg-nafas-bg">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="text-nafas-primary">
          <ArrowRight size={24} />
        </button>
        <h1 className="text-2xl font-bold text-nafas-primary">يومياتي</h1>
      </header>

      <div className="bg-white p-6 rounded-3xl shadow-sm mb-8">
        <h2 className="font-bold text-lg mb-4 text-center">كيف كان يومك؟</h2>
        <div className="flex justify-center gap-6 mb-6">
          <MoodButton icon={<Frown size={40} />} value={3} current={mood} onClick={() => setMood(3)} color="text-red-400" />
          <MoodButton icon={<Meh size={40} />} value={6} current={mood} onClick={() => setMood(6)} color="text-yellow-400" />
          <MoodButton icon={<Smile size={40} />} value={9} current={mood} onClick={() => setMood(9)} color="text-green-400" />
        </div>
        
        {mood && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="هل تود إضافة أي ملاحظات؟ (اختياري)"
              className="w-full bg-gray-50 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-nafas-primary resize-none h-24"
            />
            <button onClick={saveEntry} className="bg-nafas-primary text-white py-3 rounded-xl font-bold w-full">
              حفظ
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-4">
        <h3 className="font-bold text-gray-500 mb-2">السجلات السابقة</h3>
        {entries.length === 0 && (
          <p className="text-center text-gray-400">لا توجد سجلات بعد.</p>
        )}
        {entries.map(entry => (
          <div key={entry.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center">
            <div className={`p-3 rounded-full ${entry.mood >= 8 ? 'bg-green-100 text-green-600' : entry.mood >= 5 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
              {entry.mood >= 8 ? <Smile size={24} /> : entry.mood >= 5 ? <Meh size={24} /> : <Frown size={24} />}
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-1">
                {format(new Date(entry.date), 'EEEE، d MMMM yyyy', { locale: ar })}
              </div>
              {entry.notes && <p className="text-sm">{entry.notes}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MoodButton({ icon, value, current, onClick, color }: { icon: React.ReactNode, value: number, current: number | null, onClick: () => void, color: string }) {
  const isSelected = current === value;
  return (
    <button 
      onClick={onClick}
      className={`p-4 rounded-full transition-all ${isSelected ? 'bg-gray-100 scale-110 shadow-inner' : 'hover:bg-gray-50 hover:scale-105'} ${color}`}
    >
      {icon}
    </button>
  );
}
