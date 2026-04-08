import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Smile, Meh, Frown, Sparkles } from 'lucide-react';
import { db, DiaryEntry } from '../lib/db';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { getPersonalizedInsight } from '../services/aiService';
import { motion, AnimatePresence } from 'motion/react';

export default function Diary() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [mood, setMood] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [userName, setUserName] = useState<string>('');
  
  const [insight, setInsight] = useState<string | null>(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);

  useEffect(() => {
    db.getDiaryEntries().then(setEntries);
    db.getUserName().then(name => setUserName(name || 'صديقي'));
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
    setInsight(null);
  };

  const handleGenerateInsight = async () => {
    setIsGeneratingInsight(true);
    const newInsight = await getPersonalizedInsight(entries, userName);
    setInsight(newInsight);
    setIsGeneratingInsight(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="p-6 flex flex-col h-full bg-nafas-bg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <header className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="text-nafas-primary hover:bg-nafas-secondary/50 p-2 rounded-full transition-colors">
          <ArrowRight size={24} />
        </button>
        <h1 className="text-2xl font-extrabold text-nafas-primary tracking-tight">يومياتي</h1>
      </header>

      <motion.div variants={itemVariants} className="bg-white p-6 rounded-[2rem] shadow-sm border border-nafas-secondary/30 mb-6">
        <h2 className="font-bold text-lg mb-6 text-center text-nafas-primary">كيف كان يومك؟</h2>
        <div className="flex justify-center gap-6 mb-6">
          <MoodButton icon={<Frown size={40} strokeWidth={2.5} />} value={3} current={mood} onClick={() => setMood(3)} color="text-red-400" activeColor="bg-red-50 border-red-200" />
          <MoodButton icon={<Meh size={40} strokeWidth={2.5} />} value={6} current={mood} onClick={() => setMood(6)} color="text-yellow-400" activeColor="bg-yellow-50 border-yellow-200" />
          <MoodButton icon={<Smile size={40} strokeWidth={2.5} />} value={9} current={mood} onClick={() => setMood(9)} color="text-green-400" activeColor="bg-green-50 border-green-200" />
        </div>
        
        <AnimatePresence>
          {mood && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col gap-4 overflow-hidden"
            >
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="هل تود إضافة أي ملاحظات؟ (اختياري)"
                className="w-full bg-nafas-bg/50 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-nafas-primary/50 resize-none h-28 border border-nafas-secondary/50 transition-all"
              />
              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={saveEntry} 
                className="bg-nafas-primary text-white py-4 rounded-2xl font-bold w-full shadow-md hover:bg-nafas-primary/90 transition-colors"
              >
                حفظ
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* AI Insights Section */}
      <motion.div variants={itemVariants} className="bg-gradient-to-br from-nafas-secondary/40 to-nafas-secondary/10 p-6 rounded-[2rem] mb-8 border border-nafas-secondary/60 shadow-sm relative overflow-hidden">
        <div className="absolute -right-4 -top-4 text-nafas-primary/5">
          <Sparkles size={100} />
        </div>
        <div className="flex items-center gap-2 mb-4 text-nafas-primary relative z-10">
          <div className="bg-white p-2 rounded-full shadow-sm">
            <Sparkles size={20} className="text-nafas-primary" />
          </div>
          <h3 className="font-bold text-lg">نصيحة مخصصة لك</h3>
        </div>
        
        <div className="relative z-10">
          {insight ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-gray-700 text-sm leading-relaxed bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-white"
            >
              {insight}
            </motion.div>
          ) : (
            <motion.button 
              whileHover={{ scale: entries.length > 0 ? 1.02 : 1 }}
              whileTap={{ scale: entries.length > 0 ? 0.98 : 1 }}
              onClick={handleGenerateInsight}
              disabled={isGeneratingInsight || entries.length === 0}
              className="w-full bg-white text-nafas-primary py-4 rounded-2xl font-bold shadow-sm border border-white disabled:opacity-60 flex justify-center items-center gap-3 transition-all"
            >
              {isGeneratingInsight ? (
                <>
                  <div className="w-5 h-5 border-2 border-nafas-primary border-t-transparent rounded-full animate-spin"></div>
                  <span>نستلهم النصيحة...</span>
                </>
              ) : entries.length === 0 ? (
                "سجل يومياتك أولاً"
              ) : (
                "استلهم نصيحة بناءً على يومياتك"
              )}
            </motion.button>
          )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex-1 overflow-y-auto flex flex-col gap-4 pb-4">
        <h3 className="font-bold text-gray-500 mb-1 px-2">السجلات السابقة</h3>
        {entries.length === 0 && (
          <div className="text-center text-gray-400 py-8 bg-white/50 rounded-3xl border border-dashed border-gray-200">
            لا توجد سجلات بعد.
          </div>
        )}
        <AnimatePresence>
          {entries.map(entry => (
            <motion.div 
              key={entry.id} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-nafas-secondary/30 flex gap-4 items-start"
            >
              <div className={`p-3 rounded-2xl ${entry.mood >= 8 ? 'bg-green-50 text-green-500' : entry.mood >= 5 ? 'bg-yellow-50 text-yellow-500' : 'bg-red-50 text-red-500'}`}>
                {entry.mood >= 8 ? <Smile size={28} strokeWidth={2.5} /> : entry.mood >= 5 ? <Meh size={28} strokeWidth={2.5} /> : <Frown size={28} strokeWidth={2.5} />}
              </div>
              <div className="flex-1 pt-1">
                <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                  {format(new Date(entry.date), 'EEEE، d MMMM yyyy', { locale: ar })}
                </div>
                {entry.notes && <p className="text-sm text-gray-700 leading-relaxed">{entry.notes}</p>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function MoodButton({ icon, value, current, onClick, color, activeColor }: { icon: React.ReactNode, value: number, current: number | null, onClick: () => void, color: string, activeColor: string }) {
  const isSelected = current === value;
  return (
    <motion.button 
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`p-4 rounded-2xl transition-all border-2 ${isSelected ? `${activeColor} scale-110 shadow-sm` : 'border-transparent hover:bg-gray-50'} ${color}`}
    >
      {icon}
    </motion.button>
  );
}
