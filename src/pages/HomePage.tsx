import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ShieldAlert, Heart, BookOpen, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../lib/db';

export default function HomePage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    db.getUserName().then(name => setUserName(name || ''));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="p-6 flex flex-col h-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.header variants={itemVariants} className="mb-8 mt-4">
        <h1 className="text-3xl font-extrabold text-nafas-primary mb-2 tracking-tight">
          مرحباً بك{userName ? ` يا ${userName}` : ''}
        </h1>
        <p className="text-gray-500 font-medium">نحن هنا معك. كيف يمكننا مساعدتك اليوم؟</p>
      </motion.header>

      <div className="flex-1 flex flex-col gap-5">
        <motion.button 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/crisis')}
          className="bg-nafas-primary text-white p-8 rounded-[2rem] shadow-xl shadow-nafas-primary/20 flex flex-col items-center justify-center gap-4 transition-colors relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <ShieldAlert size={56} className="text-nafas-secondary drop-shadow-md" />
          </motion.div>
          <div className="text-center z-10">
            <h2 className="text-2xl font-bold mb-2">أحتاج إلى مساعدة الآن</h2>
            <p className="text-nafas-secondary/90 text-sm font-medium">اضغط هنا إذا كنت تشعر بالضيق الشديد</p>
          </div>
        </motion.button>

        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mt-2">
          <HomeCard 
            icon={<Shield size={32} strokeWidth={2.5} />} 
            title="خطة الأمان" 
            onClick={() => navigate('/safety-plan')} 
            color="bg-blue-50 text-blue-700 border border-blue-100"
          />
          <HomeCard 
            icon={<Heart size={32} strokeWidth={2.5} />} 
            title="صندوق الأمل" 
            onClick={() => navigate('/vault')} 
            color="bg-rose-50 text-rose-700 border border-rose-100"
          />
          <HomeCard 
            icon={<BookOpen size={32} strokeWidth={2.5} />} 
            title="المكتبة" 
            onClick={() => navigate('/library')} 
            color="bg-emerald-50 text-emerald-700 border border-emerald-100"
            className="col-span-2"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

function HomeCard({ icon, title, onClick, color, className = "" }: { icon: React.ReactNode, title: string, onClick: () => void, color: string, className?: string }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`p-6 rounded-3xl flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-shadow ${color} ${className}`}
    >
      <div className="bg-white/50 p-3 rounded-2xl backdrop-blur-sm">
        {icon}
      </div>
      <span className="font-bold text-lg">{title}</span>
    </motion.button>
  );
}
