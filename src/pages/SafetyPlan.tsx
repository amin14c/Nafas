import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Plus, Trash2, Phone } from 'lucide-react';
import { db, SafetyPlan as SafetyPlanType } from '../lib/db';

export default function SafetyPlan() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<SafetyPlanType | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    db.getSafetyPlan().then(setPlan);
  }, []);

  if (!plan) return <div className="p-6">جاري التحميل...</div>;

  const savePlan = async (newPlan: SafetyPlanType) => {
    setPlan(newPlan);
    await db.saveSafetyPlan(newPlan);
  };

  const tabs = [
    { title: "العلامات التحذيرية", key: "warningSigns" as keyof SafetyPlanType },
    { title: "استراتيجيات التكيف", key: "copingStrategies" as keyof SafetyPlanType },
    { title: "أشخاص للاتصال بهم", key: "trustedPeople" as keyof SafetyPlanType },
  ];

  return (
    <div className="p-6 flex flex-col h-full bg-white">
      <header className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="text-nafas-primary">
          <ArrowRight size={24} />
        </button>
        <h1 className="text-2xl font-bold text-nafas-primary">خطة الأمان</h1>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 hide-scrollbar">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              activeTab === idx ? 'bg-nafas-primary text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 0 && (
          <StringListEditor 
            items={plan.warningSigns} 
            onSave={(items) => savePlan({ ...plan, warningSigns: items })}
            placeholder="مثال: الرغبة في الانعزال، تسارع ضربات القلب..."
          />
        )}
        {activeTab === 1 && (
          <StringListEditor 
            items={plan.copingStrategies} 
            onSave={(items) => savePlan({ ...plan, copingStrategies: items })}
            placeholder="مثال: المشي، الاستماع للموسيقى، التنفس العميق..."
          />
        )}
        {activeTab === 2 && (
          <ContactListEditor 
            items={plan.trustedPeople} 
            onSave={(items) => savePlan({ ...plan, trustedPeople: items })}
          />
        )}
      </div>
    </div>
  );
}

function StringListEditor({ items, onSave, placeholder }: { items: string[], onSave: (items: string[]) => void, placeholder: string }) {
  const [newItem, setNewItem] = useState('');

  const add = () => {
    if (newItem.trim()) {
      onSave([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const remove = (idx: number) => {
    onSave(items.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <input 
          type="text" 
          value={newItem} 
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-nafas-primary"
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <button onClick={add} className="bg-nafas-primary text-white p-3 rounded-xl">
          <Plus size={24} />
        </button>
      </div>
      
      <ul className="flex flex-col gap-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex justify-between items-center bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
            <span>{item}</span>
            <button onClick={() => remove(idx)} className="text-red-400 p-2">
              <Trash2 size={20} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactListEditor({ items, onSave }: { items: {name: string, phone: string}[], onSave: (items: {name: string, phone: string}[]) => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const add = () => {
    if (name.trim() && phone.trim()) {
      onSave([...items, { name: name.trim(), phone: phone.trim() }]);
      setName('');
      setPhone('');
    }
  };

  const remove = (idx: number) => {
    onSave(items.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          placeholder="الاسم"
          className="bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-nafas-primary"
        />
        <input 
          type="tel" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)}
          placeholder="رقم الهاتف"
          className="bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-nafas-primary text-left"
          dir="ltr"
        />
        <button onClick={add} className="bg-nafas-primary text-white py-2 rounded-lg mt-2 font-bold">
          إضافة جهة اتصال
        </button>
      </div>
      
      <ul className="flex flex-col gap-3 mt-4">
        {items.map((item, idx) => (
          <li key={idx} className="flex justify-between items-center bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
            <div>
              <div className="font-bold">{item.name}</div>
              <div className="text-sm text-gray-500 dir-ltr text-left">{item.phone}</div>
            </div>
            <div className="flex gap-2">
              <a href={`tel:${item.phone}`} className="bg-green-100 text-green-700 p-3 rounded-full">
                <Phone size={20} />
              </a>
              <button onClick={() => remove(idx)} className="bg-red-50 text-red-500 p-3 rounded-full">
                <Trash2 size={20} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
