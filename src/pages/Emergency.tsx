import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { PhoneCall, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Emergency() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 flex flex-col h-full bg-white">
      <button onClick={() => navigate(-1)} className="self-start p-2 mb-4 text-nafas-primary">
        <ArrowRight size={24} />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center text-center gap-8">
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="w-48 h-48 rounded-full border-8 border-nafas-secondary flex items-center justify-center"
        >
          <div className="text-4xl font-bold text-nafas-primary font-mono">
            {formatTime(timeLeft)}
          </div>
        </motion.div>

        <div>
          <h1 className="text-2xl font-bold text-nafas-primary mb-2">أنت لست وحدك</h1>
          <p className="text-gray-600">ابق معي هنا. خذ نفساً عميقاً.</p>
        </div>

        <div className="w-full flex flex-col gap-4 mt-8">
          <a href="tel:997" className="bg-nafas-primary text-white p-6 rounded-2xl flex items-center justify-center gap-4 shadow-lg">
            <PhoneCall size={32} />
            <span className="text-xl font-bold">اتصل بخط المساعدة (997)</span>
          </a>
          
          <button className="bg-white border-2 border-nafas-primary text-nafas-primary p-6 rounded-2xl flex items-center justify-center gap-4">
            <MapPin size={32} />
            <span className="text-xl font-bold">أقرب طوارئ نفسية</span>
          </button>
        </div>
      </div>
    </div>
  );
}
