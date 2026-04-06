import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { PhoneCall, MapPin, ArrowRight, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const hospitals = [
  {
    name: "مستشفى دريد حسين",
    location: "القبة - الجزائر العاصمة",
    address: "03 شارع لاغريس، القبة",
    phones: ["021234159", "021234165"],
    displayPhones: ["021.23.41.59", "021.23.41.65"]
  },
  {
    name: "المؤسسة الاستشفائية المتخصصة في الأمراض العقلية",
    location: "المعـذر - باتنة",
    address: "نهج نجاى عثمان، المعذر",
    phones: ["033275125"],
    displayPhones: ["033.27.51.25"]
  },
  {
    name: "مستشفى الأمراض العقلية",
    location: "الأبيار - الجزائر العاصمة",
    address: "78 شارع البشير الإبراهيمي",
    phones: ["021783513"],
    displayPhones: ["021.78.35.13"]
  },
  {
    name: "عيادة CGSA الخاصة للطب النفسي والإدمان",
    location: "حيدرة - الجزائر",
    address: "25 شارع دودو مختار",
    phones: ["023531382", "0557290042", "0559498494"],
    displayPhones: ["023.53.13.82", "05.57.29.00.42", "05.59.49.84.94"]
  },
  {
    name: "مستشفى القطار",
    location: "الجزائر العاصمة",
    address: "",
    phones: ["021620224"],
    displayPhones: ["021.62.02.24"]
  }
];

export default function Emergency() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [showHospitals, setShowHospitals] = useState(false);

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
    <div className="p-6 flex flex-col h-full bg-white relative">
      <AnimatePresence mode="wait">
        {!showHospitals ? (
          <motion.div 
            key="main"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 flex flex-col items-center justify-center text-center gap-8"
          >
            <button onClick={() => navigate(-1)} className="absolute top-0 right-0 p-2 text-nafas-primary">
              <ArrowRight size={24} />
            </button>

            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="w-48 h-48 rounded-full border-8 border-nafas-secondary flex items-center justify-center mt-8"
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
              <a href="tel:1022" className="bg-nafas-primary text-white p-6 rounded-2xl flex items-center justify-center gap-4 shadow-lg">
                <PhoneCall size={32} />
                <span className="text-xl font-bold">اتصل بخط المساعدة (1022)</span>
              </a>
              
              <button 
                onClick={() => setShowHospitals(true)}
                className="bg-white border-2 border-nafas-primary text-nafas-primary p-6 rounded-2xl flex items-center justify-center gap-4"
              >
                <Building2 size={32} />
                <span className="text-xl font-bold">مستشفيات الطوارئ النفسية</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="hospitals"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full"
          >
            <header className="flex items-center gap-4 mb-6">
              <button onClick={() => setShowHospitals(false)} className="text-nafas-primary bg-nafas-bg p-2 rounded-full">
                <ArrowRight size={24} />
              </button>
              <h1 className="text-xl font-bold text-nafas-primary">مستشفيات وعيادات الجزائر</h1>
            </header>

            <div className="flex-1 overflow-y-auto flex flex-col gap-4 pb-8">
              {hospitals.map((hospital, idx) => (
                <div key={idx} className="bg-nafas-bg p-5 rounded-2xl border border-nafas-secondary">
                  <h3 className="font-bold text-nafas-primary text-lg mb-1">{hospital.name}</h3>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <MapPin size={16} />
                    <span>{hospital.location}</span>
                  </div>
                  {hospital.address && (
                    <p className="text-gray-500 text-sm mb-4 pr-6">{hospital.address}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {hospital.phones.map((phone, pIdx) => (
                      <a 
                        key={pIdx} 
                        href={`tel:${phone}`}
                        className="bg-nafas-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold dir-ltr"
                      >
                        <PhoneCall size={16} />
                        {hospital.displayPhones[pIdx]}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
