import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Home, BookHeart, BookOpen, Shield } from 'lucide-react';
import { cn } from './lib/utils';

// Pages
import HomePage from './pages/HomePage';
import CrisisEntry from './pages/CrisisEntry';
import Grounding from './pages/Grounding';
import SafetyPlan from './pages/SafetyPlan';
import Emergency from './pages/Emergency';
import Vault from './pages/Vault';
import Diary from './pages/Diary';
import Library from './pages/Library';

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
        <nav className="absolute bottom-0 w-full bg-white border-t border-nafas-secondary/50 px-6 py-3 flex justify-between items-center z-50 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <NavItem icon={<Home size={24} />} label="الرئيسية" path="/" active={location.pathname === '/'} onClick={() => navigate('/')} />
          <NavItem icon={<BookHeart size={24} />} label="يومياتي" path="/diary" active={location.pathname === '/diary'} onClick={() => navigate('/diary')} />
          
          {/* Panic Button in Nav */}
          <div className="relative -top-8">
            <button 
              onClick={() => navigate('/crisis')}
              className="bg-nafas-primary text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform flex flex-col items-center justify-center h-16 w-16 border-4 border-nafas-bg"
              aria-label="زر الطوارئ"
            >
              <ShieldAlert size={28} />
            </button>
          </div>

          <NavItem icon={<Shield size={24} />} label="خطة الأمان" path="/safety-plan" active={location.pathname === '/safety-plan'} onClick={() => navigate('/safety-plan')} />
          <NavItem icon={<BookOpen size={24} />} label="المكتبة" path="/library" active={location.pathname === '/library'} onClick={() => navigate('/library')} />
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
        "flex flex-col items-center gap-1 transition-colors",
        active ? "text-nafas-primary font-bold" : "text-gray-400 hover:text-nafas-primary/70"
      )}
    >
      {icon}
      <span className="text-[10px]">{label}</span>
    </button>
  );
}

export default function App() {
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
