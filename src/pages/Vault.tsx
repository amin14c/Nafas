import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Plus, Image as ImageIcon, Type } from 'lucide-react';
import { db, VaultItem } from '../lib/db';

export default function Vault() {
  const navigate = useNavigate();
  const [items, setItems] = useState<VaultItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newText, setNewText] = useState('');

  useEffect(() => {
    db.getVaultItems().then(setItems);
  }, []);

  const addTextItem = async () => {
    if (!newText.trim()) return;
    const newItem: VaultItem = {
      id: Date.now().toString(),
      type: 'text',
      content: newText.trim()
    };
    await db.saveVaultItem(newItem);
    setItems([...items, newItem]);
    setNewText('');
    setIsAdding(false);
  };

  return (
    <div className="p-6 flex flex-col h-full bg-nafas-bg">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-nafas-primary">
            <ArrowRight size={24} />
          </button>
          <h1 className="text-2xl font-bold text-nafas-primary">صندوق الأمل</h1>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-nafas-primary text-white p-2 rounded-full">
          <Plus size={24} />
        </button>
      </header>

      {isAdding && (
        <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex flex-col gap-4 border border-nafas-secondary">
          <textarea 
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="اكتب شيئاً يمنحك الأمل..."
            className="w-full bg-gray-50 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-nafas-primary resize-none h-32"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-500">إلغاء</button>
            <button onClick={addTextItem} className="px-4 py-2 bg-nafas-primary text-white rounded-lg font-bold">حفظ</button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-4 auto-rows-max">
        {items.length === 0 && !isAdding && (
          <div className="col-span-2 text-center text-gray-500 mt-12">
            صندوق الأمل فارغ. أضف أشياء تذكرك بأسباب الحياة.
          </div>
        )}
        {items.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center aspect-square">
            {item.type === 'text' && (
              <>
                <Type size={24} className="text-nafas-secondary mb-2" />
                <p className="text-sm line-clamp-4">{item.content}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
