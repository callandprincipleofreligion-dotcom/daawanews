
import React from 'react';
import { Article } from '../types';
import { Calendar, User, ChevronLeft, Heart } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  likesCount: number;
  isLiked: boolean;
  onLike: (e: React.MouseEvent) => void;
  onClick: (article: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, likesCount, isLiked, onLike, onClick }) => {
  return (
    <div 
      className="group relative rounded-[40px] shadow-sm hover:shadow-2xl hover:translate-y-[-8px] transition-all duration-500 overflow-hidden cursor-pointer flex flex-col h-full border dark:bg-[#444444] dark:border-slate-700 dark:shadow-none bg-white border-slate-100"
      onClick={() => onClick(article)}
    >
      <div className="relative h-60 md:h-72 overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        
        {/* Category Badge */}
        <div className="absolute top-6 right-6 bg-brand-black text-brand-orange text-[10px] md:text-xs px-4 py-1.5 rounded-full font-black uppercase tracking-wider shadow-xl border border-brand-orange/20">
          {article.category}
        </div>

        {/* Like Button Overlay */}
        <button 
          onClick={onLike}
          className={`absolute top-6 left-6 p-3 rounded-2xl transition-all duration-300 flex items-center gap-2 shadow-lg backdrop-blur-md ${
            isLiked 
              ? 'bg-red-500 text-white' 
              : 'bg-white/90 text-slate-600 hover:text-red-500 hover:scale-110'
          }`}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "animate-bounce" : ""} />
          <span className="text-xs font-black">{likesCount}</span>
        </button>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
           <span className="text-white font-black flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
             فتح المقال بالكامل
             <ChevronLeft size={20} className="text-brand-orange" />
           </span>
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center gap-6 text-[10px] md:text-xs font-bold mb-5 border-b pb-4 dark:text-slate-400 dark:border-slate-700 text-slate-400 border-slate-50">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-brand-orange" />
            <span>{article.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <User size={14} className="text-brand-orange" />
            <span>{article.author}</span>
          </div>
        </div>
        
        <h3 className="text-xl md:text-2xl font-black mb-4 transition-colors line-clamp-2 leading-tight dark:text-white dark:group-hover:text-brand-orange text-brand-black group-hover:text-brand-orange">
          {article.title}
        </h3>
        
        <p className="text-sm md:text-base line-clamp-3 mb-8 leading-relaxed font-medium transition-colors dark:text-slate-300 text-slate-500">
          {article.excerpt}
        </p>
        
        <div className="mt-auto pt-6 flex items-center justify-between">
          <div className="flex gap-2">
            {article.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] font-black px-3 py-1 rounded-lg border transition-colors dark:bg-brand-black/20 dark:text-slate-400 dark:border-slate-700 bg-slate-50 text-slate-400 border-slate-100">
                #{tag}
              </span>
            ))}
          </div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all dark:bg-brand-black/20 dark:text-slate-200 dark:group-hover:bg-brand-orange dark:group-hover:text-brand-black bg-slate-100 text-brand-black group-hover:bg-brand-orange group-hover:text-brand-black">
            <ChevronLeft size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};
