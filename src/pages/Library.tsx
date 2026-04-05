import { useNavigate } from 'react-router';
import { ArrowRight, BookOpen, Info, ShieldAlert } from 'lucide-react';

export default function Library() {
  const navigate = useNavigate();

  const articles = [
    {
      title: "فهم الألم النفسي",
      desc: "لماذا نشعر أحياناً أننا لا نستطيع الاستمرار؟",
      icon: <BookOpen size={24} />
    },
    {
      title: "خرافات وحقائق",
      desc: "تصحيح المفاهيم الخاطئة حول الصحة النفسية",
      icon: <Info size={24} />
    },
    {
      title: "كيف تساعد صديقاً في أزمة",
      desc: "خطوات عملية لتقديم الدعم لمن تحب",
      icon: <ShieldAlert size={24} />
    }
  ];

  return (
    <div className="p-6 flex flex-col h-full bg-white">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="text-nafas-primary">
          <ArrowRight size={24} />
        </button>
        <h1 className="text-2xl font-bold text-nafas-primary">المكتبة</h1>
      </header>

      <div className="flex-1 overflow-y-auto flex flex-col gap-4">
        {articles.map((article, idx) => (
          <button key={idx} className="bg-nafas-bg p-6 rounded-2xl flex items-start gap-4 text-right hover:bg-nafas-secondary/50 transition-colors">
            <div className="bg-white p-3 rounded-xl text-nafas-primary shadow-sm">
              {article.icon}
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">{article.title}</h3>
              <p className="text-gray-600 text-sm">{article.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
