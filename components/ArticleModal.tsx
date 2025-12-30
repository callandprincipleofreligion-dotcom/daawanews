
import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { X, Calendar, User, Share2, Printer, Sparkles, Loader2, Bookmark } from 'lucide-react';
import { summarizeArticle } from '../services/geminiService';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    setSummary(null);
  }, [article]);

  if (!article) return null;

  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    const result = await summarizeArticle(article.title, article.content);
    setSummary(result);
    setLoadingSummary(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl max-h-[95vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 border border-slate-100">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white border-b flex justify-between items-center p-6 md:px-10">
          <div className="flex gap-4">
            <button className="p-3 bg-slate-50 text-slate-600 hover:bg-brand-orange hover:text-brand-black rounded-2xl transition-all shadow-sm" title="حفظ">
              <Bookmark size={20} />
            </button>
            <button onClick={() => window.print()} className="p-3 bg-slate-50 text-slate-600 hover:bg-brand-orange hover:text-brand-black rounded-2xl transition-all shadow-sm" title="طباعة">
              <Printer size={20} />
            </button>
            <button className="p-3 bg-slate-50 text-slate-600 hover:bg-brand-orange hover:text-brand-black rounded-2xl transition-all shadow-sm" title="مشاركة">
              <Share2 size={20} />
            </button>
          </div>
          <button 
            onClick={onClose}
            className="p-3 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all"
          >
            <X size={28} />
          </button>
        </div>

        <div className="overflow-y-auto p-8 md:p-12">
          {/* Article Meta */}
          <header className="mb-12">
            <div className="inline-block px-5 py-1.5 bg-brand-black text-brand-orange text-xs rounded-full mb-6 font-black tracking-widest uppercase">
              {article.category}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-brand-black mb-10 leading-[1.2]">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-10 text-slate-500 border-y py-8 border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-orange flex items-center justify-center text-brand-black shadow-lg">
                  <User size={32} />
                </div>
                <div>
                  <div className="text-lg font-black text-brand-black">{article.author}</div>
                  <div className="text-xs font-bold text-slate-400">كاتب أكاديمي معتمد</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold bg-slate-50 px-5 py-2.5 rounded-2xl">
                <Calendar size={18} className="text-brand-orange" />
                <span>نُشر في: {article.date}</span>
              </div>
            </div>
          </header>

          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-auto max-h-[500px] object-cover rounded-[40px] mb-12 shadow-2xl border-4 border-slate-50"
          />

          {/* AI Helper - Premium Look */}
          <div className="bg-brand-black rounded-[40px] p-8 md:p-12 mb-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-[-50px] left-[-50px] w-60 h-60 bg-brand-orange/10 rounded-full blur-[80px]"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6 text-brand-orange font-black text-xl">
                <Sparkles size={28} />
                <span>خدمة الملخص الذكي</span>
              </div>
              {summary ? (
                <div className="text-slate-300 text-lg leading-loose whitespace-pre-wrap font-medium">
                  {summary}
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <p className="text-slate-400 font-bold flex-grow text-center md:text-right">استخدم الذكاء الاصطناعي لاستخراج النقاط الجوهرية من هذا المحتوى الأكاديمي.</p>
                  <button 
                    onClick={handleGenerateSummary}
                    disabled={loadingSummary}
                    className="w-full md:w-auto flex items-center justify-center gap-3 bg-brand-orange text-brand-black px-10 py-5 rounded-2xl hover:scale-105 transition-all disabled:opacity-50 text-lg font-black shadow-xl shadow-amber-900/20"
                  >
                    {loadingSummary ? (
                      <>
                        <Loader2 size={24} className="animate-spin" />
                        جاري التحليل...
                      </>
                    ) : (
                      <>توليد ملخص أكاديمي</>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg prose-slate max-w-none text-brand-black leading-relaxed text-xl font-serif">
            {article.content}
            <div className="mt-12 p-8 bg-slate-50 rounded-3xl border-r-8 border-brand-orange italic text-slate-600 font-medium">
              هذا المحتوى مقدم من صحيفة دعوة الإلكترونية - كلية الدعوة وأصول الدين بالجامعة الأسمرية الإسلامية.
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-100 flex flex-wrap gap-3">
            {article.tags.map(tag => (
              <span key={tag} className="px-6 py-2 bg-slate-100 text-brand-black rounded-xl text-sm font-black hover:bg-brand-orange transition-all cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
