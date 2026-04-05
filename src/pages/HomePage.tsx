import React from 'react';
import { useNavigate } from 'react-router';
import { ShieldAlert, Heart, BookOpen, Shield } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="p-6 flex flex-col h-full">
      <header className="mb-8 mt-4">
        <h1 className="text-3xl font-bold text-nafas-primary mb-2">مرحباً بك في نَفَس</h1>
        <p className="text-gray-600">نحن هنا معك. كيف يمكننا مساعدتك اليوم؟</p>
      </header>

      <div className="flex-1 flex flex-col gap-4">
        <button 
          onClick={() => navigate('/crisis')}
          className="bg-nafas-primary text-white p-8 rounded-3xl shadow-lg flex flex-col items-center justify-center gap-4 hover:bg-nafas-primary/90 transition-colors"
        >
          <ShieldAlert size={48} className="text-nafas-secondary" />
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-1">أحتاج إلى مساعدة الآن</h2>
            <p className="text-nafas-secondary/80 text-sm">اضغط هنا إذا كنت تشعر بالضيق الشديد</p>
          </div>
        </button>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <HomeCard 
            icon={<Shield size={32} />} 
            title="خطة الأمان" 
            onClick={() => navigate('/safety-plan')} 
            color="bg-blue-50 text-blue-700"
          />
          <HomeCard 
            icon={<Heart size={32} />} 
            title="صندوق الأمل" 
            onClick={() => navigate('/vault')} 
            color="bg-rose-50 text-rose-700"
          />
          <HomeCard 
            icon={<BookOpen size={32} />} 
            title="المكتبة" 
            onClick={() => navigate('/library')} 
            color="bg-emerald-50 text-emerald-700"
            className="col-span-2"
          />
        </div>
      </div>
    </div>
  );
}

function HomeCard({ icon, title, onClick, color, className = "" }: { icon: React.ReactNode, title: string, onClick: () => void, color: string, className?: string }) {
  return (
    <button 
      onClick={onClick}
      className={`p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-transform hover:scale-[1.02] ${color} ${className}`}
    >
      {icon}
      <span className="font-bold">{title}</span>
    </button>
  );
}
