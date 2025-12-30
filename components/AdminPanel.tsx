
import React, { useState } from 'react';
import { Article, Category } from '../types';
import { Plus, Edit2, Trash2, X, Save, AlertCircle } from 'lucide-react';

interface AdminPanelProps {
  articles: Article[];
  onAdd: (article: Article) => void;
  onUpdate: (article: Article) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ articles, onAdd, onUpdate, onDelete, onClose }) => {
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;

    if (editingArticle.id) {
      onUpdate(editingArticle as Article);
    } else {
      const newArticle: Article = {
        ...(editingArticle as Article),
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString().split('T')[0],
      };
      onAdd(newArticle);
    }
    setIsFormOpen(false);
    setEditingArticle(null);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-slate-200">
        <div className="p-6 bg-brand-black text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center text-brand-black">
              <Edit2 size={24} />
            </div>
            <h2 className="text-2xl font-bold">لوحة تحكم المشرفين</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 md:p-8">
          {!isFormOpen ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">إدارة المحتوى</h3>
                <button 
                  onClick={() => {
                    setEditingArticle({ 
                      title: '', excerpt: '', content: '', author: '', category: Category.NEWS, 
                      image: 'https://picsum.photos/800/450', tags: [] 
                    });
                    setIsFormOpen(true);
                  }}
                  className="bg-brand-orange text-brand-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-amber-400 transition-all shadow-lg shadow-amber-100"
                >
                  <Plus size={20} />
                  إضافة مادة جديدة
                </button>
              </div>

              <div className="grid gap-4">
                {articles.map(article => (
                  <div key={article.id} className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-100 group hover:border-brand-orange transition-all">
                    <div className="flex items-center gap-4">
                      <img src={article.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-brand-orange transition-colors">{article.title}</h4>
                        <p className="text-xs text-slate-500">{article.author} • {article.category} • {article.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setEditingArticle(article); setIsFormOpen(true); }}
                        className="p-3 text-brand-black hover:bg-brand-orange/10 rounded-xl transition-all"
                        title="تعديل"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(article.id)}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="حذف"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">عنوان الخبر / المقال</label>
                  <input 
                    required
                    value={editingArticle?.title || ''}
                    onChange={e => setEditingArticle({...editingArticle, title: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-orange outline-none transition-all"
                    placeholder="أدخل عنواناً جذاباً..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">القسم</label>
                  <select 
                    value={editingArticle?.category}
                    onChange={e => setEditingArticle({...editingArticle, category: e.target.value as Category})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-orange outline-none transition-all"
                  >
                    {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">الكاتب</label>
                  <input 
                    required
                    value={editingArticle?.author || ''}
                    onChange={e => setEditingArticle({...editingArticle, author: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-orange outline-none transition-all"
                    placeholder="اسم كاتب المادة..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">رابط الصورة (URL)</label>
                  <input 
                    value={editingArticle?.image || ''}
                    onChange={e => setEditingArticle({...editingArticle, image: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-orange outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">موجز (مختصر)</label>
                <textarea 
                  required
                  rows={2}
                  value={editingArticle?.excerpt || ''}
                  onChange={e => setEditingArticle({...editingArticle, excerpt: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-orange outline-none transition-all"
                  placeholder="وصف مختصر يظهر في البطاقة التعريفية..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">المحتوى الكامل</label>
                <textarea 
                  required
                  rows={8}
                  value={editingArticle?.content || ''}
                  onChange={e => setEditingArticle({...editingArticle, content: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-brand-orange outline-none transition-all"
                  placeholder="اكتب المحتوى الكامل هنا..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit"
                  className="bg-brand-black text-brand-orange px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-dark transition-all"
                >
                  <Save size={20} />
                  حفظ التغييرات
                </button>
                <button 
                  type="button"
                  onClick={() => { setIsFormOpen(false); setEditingArticle(null); }}
                  className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
