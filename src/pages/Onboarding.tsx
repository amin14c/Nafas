import React, { useState } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/db';

export default function Onboarding({ onComplete }: { onComplete: (name: string) => void }) {
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      await db.setUserName(name.trim());
      onComplete(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-nafas-bg flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full"
      >
        <div className="w-24 h-24 bg-nafas-secondary rounded-full mx-auto mb-8 flex items-center justify-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-nafas-primary">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-nafas-primary mb-4">أهلاً بك في نَفَس</h1>
        <p className="text-gray-600 mb-12">مساحتك الآمنة للهدوء والتنفس. كيف تحب أن نناديك؟</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسمك أو لقبك..."
            className="bg-white border-2 border-nafas-secondary rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-nafas-primary text-center shadow-sm"
            autoFocus
          />
          <button 
            type="submit"
            disabled={!name.trim()}
            className="bg-nafas-primary text-white py-4 rounded-2xl font-bold text-lg disabled:opacity-50 transition-opacity mt-4 shadow-lg"
          >
            البدء
          </button>
        </form>
      </motion.div>
    </div>
  );
}
