import { GoogleGenAI } from '@google/genai';
import { DiaryEntry } from '../lib/db';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getPersonalizedInsight(entries: DiaryEntry[], userName: string): Promise<string> {
  if (!entries || entries.length === 0) {
    return "مرحباً بك. ابدأ بتسجيل يومياتك لنتمكن من تقديم نصائح مخصصة لك.";
  }

  // Take the last 5 entries to keep context relevant and prompt size manageable
  const recentEntries = entries.slice(0, 5).map(e => 
    `التاريخ: ${new Date(e.date).toLocaleDateString('ar-EG')}، المزاج (1-10): ${e.mood}، الملاحظات: ${e.notes || 'لا يوجد'}`
  ).join('\n');

  const prompt = `أنت مستشار نفسي افتراضي متعاطف وداعم في تطبيق للصحة النفسية يسمى "نَفَس".
اسم المستخدم: ${userName}

إليك أحدث إدخالات يوميات المستخدم:
${recentEntries}

بناءً على هذه الإدخالات، اكتب رسالة قصيرة جداً (حوالي 3-4 أسطر) باللغة العربية تتضمن:
1. تعاطفاً ودعماً للمستخدم بناءً على مزاجه الأخير.
2. نصيحة عملية واحدة بسيطة (Coping strategy) تناسب حالته.

تجنب التشخيص الطبي، وكن دافئاً ومطمئناً. لا تستخدم تنسيق Markdown معقد، فقط نص بسيط وواضح.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "لم نتمكن من توليد نصيحة في الوقت الحالي. تذكر أنك لست وحدك.";
  } catch (error) {
    console.error("Error generating AI insight:", error);
    return "عذراً، حدث خطأ أثناء محاولة استلهام النصيحة. يرجى المحاولة لاحقاً.";
  }
}
