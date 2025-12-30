
import React from 'react';
import { Megaphone, BookOpen, Globe, Search, Home } from 'lucide-react';
import { Category } from '../types';

interface MobileBottomNavProps {
  selectedCategory: string;
  onSelectCategory: (category: any) => void;
  onSearchClick: () => void;
  isDarkMode: boolean;
  lang: 'ar' | 'en';
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ 
  selectedCategory, 
  onSelectCategory, 
  onSearchClick,
  isDarkMode,
  lang
}) => {
  const navItems = [
    { id: 'الكل', label: lang === 'ar' ? 'الرئيسية' : 'Home', icon: Home, category: 'الكل' },
    { id: Category.NEWS, label: lang === 'ar' ? 'الأخبار' : 'News', icon: Megaphone, category: Category.NEWS },
    { id: Category.ARTICLES, label: lang === 'ar' ? 'المقالات' : 'Articles', icon: BookOpen, category: Category.ARTICLES },
    { id: Category.CULTURE, label: lang === 'ar' ? 'الثقافة' : 'Culture', icon: Globe, category: Category.CULTURE },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pointer-events-none">
      <nav className={`
        pointer-events-auto
        flex items-center justify-around h-16 
        rounded-2xl shadow-2xl border backdrop-blur-lg
        ${isDarkMode 
          ? 'bg-brand-dark/90 border-slate-700 text-slate-400' 
          : 'bg-white/90 border-slate-100 text-slate-500'}
      `}>
        {navItems.map((item) => {
          const isActive = selectedCategory === item.id || (item.id === 'الكل' && (selectedCategory === 'الكل' || selectedCategory === 'All'));
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onSelectCategory(item.category)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all relative ${
                isActive ? 'text-brand-orange' : 'hover:text-brand-orange/70'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-brand-orange/10 scale-110' : ''}`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-black mt-0.5 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-brand-orange rounded-b-full" />
              )}
            </button>
          );
        })}
        
        {/* Special Search Button */}
        <button
          onClick={onSearchClick}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
            isDarkMode ? 'hover:text-white' : 'hover:text-brand-black'
          }`}
        >
          <div className="p-1.5">
            <Search size={24} />
          </div>
          <span className="text-[10px] font-black mt-0.5 opacity-60">
            {lang === 'ar' ? 'بحث' : 'Search'}
          </span>
        </button>
      </nav>
    </div>
  );
};
