import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, BookOpen, Info, ShieldAlert, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Article = {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  content: React.ReactNode;
};

export default function Library() {
  const navigate = useNavigate();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const articles: Article[] = [
    {
      id: 'pain',
      title: "فهم الألم النفسي",
      desc: "لماذا نشعر أحياناً أننا لا نستطيع الاستمرار؟",
      icon: <BookOpen size={24} />,
      content: (
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>غالباً ما يكون التفكير في إنهاء الحياة ليس رغبة في الموت بحد ذاته، بل هو رغبة عميقة في إيقاف ألم نفسي يبدو وكأنه لا يُحتمل ولا ينتهي.</p>
          <h3 className="font-bold text-nafas-primary text-lg mt-6">لماذا يحدث هذا؟</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>الشعور بالعبء:</strong> قد يقنعك الاكتئاب بأنك تمثل عبئاً على من حولك، وهذا شعور كاذب يفرضه المرض.</li>
            <li><strong>العزلة:</strong> الشعور بأن لا أحد يفهمك أو ينتمي إليك.</li>
            <li><strong>الإنهاك:</strong> عندما تستمر المعاناة لفترة طويلة، يستنفد العقل طاقته في المقاومة.</li>
          </ul>
          <div className="bg-nafas-secondary/50 p-4 rounded-xl mt-6">
            <p className="font-bold text-nafas-primary">تذكر:</p>
            <p>الألم النفسي الشديد يشوه رؤيتنا للواقع ويخفي عنا الحلول الأخرى. تماماً كما تلتئم الجروح الجسدية، يمكن للألم النفسي أن يُعالج مع الوقت والدعم المناسب.</p>
          </div>
        </div>
      )
    },
    {
      id: 'myths',
      title: "خرافات وحقائق",
      desc: "تصحيح المفاهيم الخاطئة حول الصحة النفسية",
      icon: <Info size={24} />,
      content: (
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <div className="bg-red-50 p-4 rounded-xl border border-red-100">
            <h3 className="font-bold text-red-700 mb-2">خرافة: التحدث عن الانتحار يشجع عليه.</h3>
            <p className="text-gray-800"><strong className="text-green-700">حقيقة:</strong> التحدث بانفتاح وبدون إطلاق أحكام يمنح الشخص مساحة للتنفيس ويقلل من القلق، وهو غالباً الخطوة الأولى نحو طلب المساعدة.</p>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border border-red-100">
            <h3 className="font-bold text-red-700 mb-2">خرافة: من يتحدث عن الأمر لا يفعله.</h3>
            <p className="text-gray-800"><strong className="text-green-700">حقيقة:</strong> معظم الأشخاص الذين حاولوا إنهاء حياتهم أعطوا علامات تحذيرية أو تحدثوا عن يأسهم مسبقاً. يجب أخذ كل إشارة على محمل الجد.</p>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border border-red-100">
            <h3 className="font-bold text-red-700 mb-2">خرافة: من يقرر الانتحار لا يمكن إيقافه.</h3>
            <p className="text-gray-800"><strong className="text-green-700">حقيقة:</strong> الأزمات الانتحارية غالباً ما تكون مؤقتة جداً. التدخل في اللحظة المناسبة وتوفير الدعم يمكن أن ينقذ الحياة ويسمح للشخص بالتعافي.</p>
          </div>
        </div>
      )
    },
    {
      id: 'help-friend',
      title: "كيف تساعد صديقاً في أزمة",
      desc: "خطوات عملية لتقديم الدعم لمن تحب",
      icon: <ShieldAlert size={24} />,
      content: (
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>إذا كنت قلقاً على شخص تحبه، فإليك ما يمكنك فعله:</p>
          <ol className="list-decimal list-inside space-y-4 mt-4">
            <li className="bg-gray-50 p-4 rounded-xl">
              <strong className="text-nafas-primary block mb-1">1. اسأل مباشرة</strong>
              لا تخف من طرح السؤال المباشر: "هل تفكر في إيذاء نفسك؟". هذا لا يزرع الفكرة في رأسهم، بل يظهر لهم أنك مستعد للاستماع.
            </li>
            <li className="bg-gray-50 p-4 rounded-xl">
              <strong className="text-nafas-primary block mb-1">2. استمع بدون أحكام</strong>
              لا تقل "لديك الكثير لتعيش من أجله" أو "فكر في عائلتك". بدلاً من ذلك قل: "أنا هنا من أجلك، أخبرني بما تشعر".
            </li>
            <li className="bg-gray-50 p-4 rounded-xl">
              <strong className="text-nafas-primary block mb-1">3. حافظ على سلامتهم</strong>
              إذا كانوا في خطر فوري، لا تتركهم وحدهم. أبعد أي وسائل خطيرة من محيطهم.
            </li>
            <li className="bg-gray-50 p-4 rounded-xl">
              <strong className="text-nafas-primary block mb-1">4. ساعدهم في الوصول للدعم</strong>
              شجعهم على الاتصال بخط المساعدة أو التحدث مع مختص نفسي، وكن بجانبهم أثناء قيامهم بذلك.
            </li>
          </ol>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 flex flex-col h-full bg-white relative">
      <AnimatePresence mode="wait">
        {!selectedArticle ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full"
          >
            <header className="flex items-center gap-4 mb-8">
              <button onClick={() => navigate(-1)} className="text-nafas-primary">
                <ArrowRight size={24} />
              </button>
              <h1 className="text-2xl font-bold text-nafas-primary">المكتبة</h1>
            </header>

            <div className="flex-1 overflow-y-auto flex flex-col gap-4">
              {articles.map((article) => (
                <button 
                  key={article.id} 
                  onClick={() => setSelectedArticle(article)}
                  className="bg-nafas-bg p-6 rounded-2xl flex items-center gap-4 text-right hover:bg-nafas-secondary/50 transition-colors w-full"
                >
                  <div className="bg-white p-3 rounded-xl text-nafas-primary shadow-sm shrink-0">
                    {article.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{article.title}</h3>
                    <p className="text-gray-600 text-sm">{article.desc}</p>
                  </div>
                  <ChevronRight size={20} className="text-gray-400 shrink-0" />
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="article"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full"
          >
            <header className="flex items-center gap-4 mb-8">
              <button onClick={() => setSelectedArticle(null)} className="text-nafas-primary bg-nafas-bg p-2 rounded-full">
                <ArrowRight size={24} />
              </button>
              <h1 className="text-xl font-bold text-nafas-primary flex-1">{selectedArticle.title}</h1>
            </header>
            
            <div className="flex-1 overflow-y-auto pb-8">
              {selectedArticle.content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
