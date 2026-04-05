import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Wind, Eye, Ear, Hand, Droplets } from 'lucide-react';

type Step = 'intro' | 'breathe' | '54321';

export default function Grounding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('intro');

  return (
    <div className="p-6 flex flex-col h-full bg-nafas-secondary">
      <button onClick={() => navigate(-1)} className="self-start p-2 mb-4 text-nafas-primary">
        <ArrowRight size={24} />
      </button>

      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center gap-8"
          >
            <Wind size={64} className="text-nafas-primary" />
            <div>
              <h1 className="text-2xl font-bold text-nafas-primary mb-4">دعنا نأخذ لحظة للهدوء</h1>
              <p className="text-gray-600">اختر تمريناً للبدء</p>
            </div>
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <button onClick={() => setStep('breathe')} className="bg-nafas-primary text-white py-4 px-6 rounded-xl font-bold">
                تنفس الصندوق (4-4-4-4)
              </button>
              <button onClick={() => setStep('54321')} className="bg-white text-nafas-primary py-4 px-6 rounded-xl font-bold border border-nafas-primary/20">
                تمرين الحواس (5-4-3-2-1)
              </button>
            </div>
          </motion.div>
        )}

        {step === 'breathe' && <BoxBreathing onBack={() => setStep('intro')} />}
        {step === '54321' && <SensoryGrounding onBack={() => setStep('intro')} />}
      </AnimatePresence>
    </div>
  );
}

function BoxBreathing({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState(0);
  const phases = ['شهيق', 'احتفاظ', 'زفير', 'احتفاظ'];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div key="breathe" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-nafas-primary mb-12">{phases[phase]}</h2>
      
      <div className="relative w-64 h-64 flex items-center justify-center">
        <motion.div 
          className="absolute w-full h-full border-4 border-nafas-primary/20 rounded-3xl"
        />
        <motion.div 
          animate={{ 
            scale: phase === 0 ? 1 : phase === 1 ? 1 : phase === 2 ? 0.5 : 0.5,
            borderRadius: phase % 2 === 0 ? "24px" : "50%"
          }}
          transition={{ duration: 4, ease: "linear" }}
          className="w-full h-full bg-nafas-primary/20 rounded-3xl"
        />
      </div>
      
      <button onClick={onBack} className="mt-16 text-nafas-primary underline">العودة</button>
    </motion.div>
  );
}

function SensoryGrounding({ onBack }: { onBack: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    { count: 5, text: "أشياء يمكنك رؤيتها", icon: <Eye size={48} /> },
    { count: 4, text: "أشياء يمكنك لمسها", icon: <Hand size={48} /> },
    { count: 3, text: "أشياء يمكنك سماعها", icon: <Ear size={48} /> },
    { count: 2, text: "أشياء يمكنك شمها", icon: <Wind size={48} /> },
    { count: 1, text: "شيء يمكنك تذوقه", icon: <Droplets size={48} /> },
  ];

  return (
    <motion.div key="54321" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center text-center">
      <div className="text-nafas-primary mb-8">{steps[currentStep].icon}</div>
      <h2 className="text-4xl font-bold text-nafas-primary mb-4">{steps[currentStep].count}</h2>
      <p className="text-xl text-gray-700 mb-12">ابحث عن {steps[currentStep].count} {steps[currentStep].text}</p>
      
      <div className="flex gap-4">
        {currentStep > 0 && (
          <button onClick={() => setCurrentStep(c => c - 1)} className="px-6 py-3 rounded-xl border border-nafas-primary text-nafas-primary">السابق</button>
        )}
        {currentStep < steps.length - 1 ? (
          <button onClick={() => setCurrentStep(c => c + 1)} className="px-6 py-3 rounded-xl bg-nafas-primary text-white">التالي</button>
        ) : (
          <button onClick={onBack} className="px-6 py-3 rounded-xl bg-nafas-primary text-white">إنهاء</button>
        )}
      </div>
    </motion.div>
  );
}
