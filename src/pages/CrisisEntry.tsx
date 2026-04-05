import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function CrisisEntry() {
  const navigate = useNavigate();

  return (
    <div className="p-6 flex flex-col h-full bg-nafas-primary text-white">
      <button onClick={() => navigate(-1)} className="self-start p-2 mb-8 text-white/80 hover:text-white">
        <ArrowRight size={24} />
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-12 text-center"
        >
          كيف تشعر الآن؟
        </motion.h1>

        <div className="flex flex-col gap-4">
          <CrisisOption 
            title="أشعر بالضيق الشديد"
            subtitle="أحتاج إلى الهدوء والتركيز"
            onClick={() => navigate('/grounding')}
            delay={0.1}
          />
          <CrisisOption 
            title="أنا في أزمة"
            subtitle="أحتاج إلى خطة الأمان الخاصة بي"
            onClick={() => navigate('/safety-plan')}
            delay={0.2}
          />
          <CrisisOption 
            title="حالة طوارئ"
            subtitle="أحتاج إلى مساعدة فورية"
            onClick={() => navigate('/emergency')}
            delay={0.3}
            isEmergency
          />
        </div>
      </div>
    </div>
  );
}

function CrisisOption({ title, subtitle, onClick, delay, isEmergency = false }: { title: string, subtitle: string, onClick: () => void, delay: number, isEmergency?: boolean }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className={`p-6 rounded-2xl text-right transition-transform hover:scale-[1.02] ${
        isEmergency 
          ? 'bg-white text-nafas-primary border-2 border-transparent' 
          : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
      }`}
    >
      <h2 className="text-xl font-bold mb-1">{title}</h2>
      <p className={isEmergency ? 'text-nafas-primary/70' : 'text-white/70'}>{subtitle}</p>
    </motion.button>
  );
}
