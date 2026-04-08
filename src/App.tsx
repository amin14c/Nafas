import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Home, BookHeart, BookOpen, Shield } from 'lucide-react';
import { cn } from './lib/utils';
import { db } from './lib/db';

// Pages
import HomePage from './pages/HomePage';
import CrisisEntry from './pages/CrisisEntry';
import Grounding from './pages/Grounding';
import SafetyPlan from './pages/SafetyPlan';
import Emergency from './pages/Emergency';
import Vault from './pages/Vault';
import Diary from './pages/Diary';
import Library from './pages/Library';
import Onboarding from './pages/Onboarding';

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isCrisisMode = ['/crisis', '/grounding', '/emergency'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-nafas-bg shadow-xl overflow-hidden relative">
      <main className="flex-1 overflow-y-auto pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {!isCrisisMode && (
        <nav className="absolute bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-nafas-secondary/30 px-6 py-4 flex justify-between items-center z-50 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(26,60,94,0.05)] pb-safe">
          <NavItem icon={<Home size={24} strokeWidth={2.5} />} label="الرئيسية" path="/" active={location.pathname === '/'} onClick={() => navigate('/')} />
          <NavItem icon={<BookHeart size={24} strokeWidth={2.5} />} label="يومياتي" path="/diary" active={location.pathname === '/diary'} onClick={() => navigate('/diary')} />
          
          {/* Panic Button in Nav */}
          <div className="relative -top-10 flex items-center justify-center">
            <motion.div 
              animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="absolute w-14 h-14 bg-nafas-primary/40 rounded-full"
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              onClick={() => navigate('/crisis')}
              className="bg-nafas-primary text-white p-4 rounded-full shadow-xl shadow-nafas-primary/30 flex flex-col items-center justify-center h-16 w-16 border-[6px] border-nafas-bg relative z-10"
              aria-label="زر الطوارئ"
            >
              <ShieldAlert size={28} strokeWidth={2.5} />
            </motion.button>
          </div>

          <NavItem icon={<Shield size={24} strokeWidth={2.5} />} label="خطة الأمان" path="/safety-plan" active={location.pathname === '/safety-plan'} onClick={() => navigate('/safety-plan')} />
          <NavItem icon={<BookOpen size={24} strokeWidth={2.5} />} label="المكتبة" path="/library" active={location.pathname === '/library'} onClick={() => navigate('/library')} />
        </nav>
      )}
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, path: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1.5 transition-all duration-300",
        active ? "text-nafas-primary font-bold scale-110" : "text-gray-400 hover:text-nafas-primary/60"
      )}
    >
      {icon}
      <span className="text-[10px] tracking-wide">{label}</span>
    </button>
  );
}

export default function App() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    db.getUserName().then(name => {
      setUserName(name);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-nafas-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-nafas-secondary border-t-nafas-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!userName) {
    return <Onboarding onComplete={(name) => setUserName(name)} />;
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/crisis" element={<CrisisEntry />} />
          <Route path="/grounding" element={<Grounding />} />
          <Route path="/safety-plan" element={<SafetyPlan />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/library" element={<Library />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
