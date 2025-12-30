
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Bell, Menu, Newspaper, BookOpen, MessageSquare, Globe, Megaphone, ChevronDown, Github, Twitter, Facebook, ExternalLink, Filter, X, Calendar as CalendarIcon, User as UserIcon, Tag as TagIcon, RotateCcw, ArrowRight, Settings, LayoutDashboard, Lock, LogIn, Moon, Sun, Download, Share2 } from 'lucide-react';
import { Article, Category } from './types';
import { ARTICLES as INITIAL_ARTICLES, ANNOUNCEMENTS } from './data/mockData';
import { ArticleCard } from './components/ArticleCard';
import { ArticleModal } from './components/ArticleModal';
import { AdminPanel } from './components/AdminPanel';
import { BreakingNewsTicker } from './components/BreakingNewsTicker';
import { MobileBottomNav } from './components/MobileBottomNav';

const translations = {
  ar: {
    siteTitle: 'صحيفة دعوة',
    subtitle: 'كلية الدعوة وأصول الدين - الجامعة الأسمرية الإسلامية',
    utilityTag: 'صحيفة دعوة | صوت الأكاديميين',
    liveTag: 'مباشر: العدد الجديد متاح الآن',
    adminPanel: 'لوحة المشرفين',
    searchPlaceholder: 'ابحث في أرشيف الصحيفة...',
    all: 'الكل',
    latestTitles: 'أحدث العناوين',
    resetFilters: 'إعادة ضبط',
    countLabel: 'مادة',
    noResults: 'لا يوجد تطابق لطلبك',
    browseArchive: 'استعراض كل الأرشيف',
    announcements: 'إعلانات هامة',
    urgentTag: 'هام جداً',
    allAnnouncements: 'كافة الإعلانات الأكاديمية',
    researchHub: 'مستودع الأبحاث الرقمي',
    browseHub: 'تصفح المستودع',
    footerDesc: 'المنصة الرقمية الرسمية لكلية الدعوة وأصول الدين. نسعى لتطوير الخطاب الأكاديمي الإسلامي وتعزيز التواصل المعرفي مع المجتمع.',
    sections: 'أقسامنا',
    aboutCollege: 'عن الكلية',
    address: 'زليتن - ليبيا، الجامعة الأسمرية الإسلامية، مبنى كلية الدعوة وأصول الدين',
    loginTitle: 'دخول المشرفين',
    emailLabel: 'البريد الإلكتروني',
    passLabel: 'كلمة المرور',
    loginBtn: 'تسجيل الدخول',
    darkMode: 'الوضع الليلي',
    lightMode: 'الوضع النهاري',
    installApp: 'تثبيت التطبيق',
    shareSite: 'مشاركة المنصة'
  },
  en: {
    siteTitle: 'Daawa News',
    subtitle: 'Faculty of Daawa and Theology - Asmarya Islamic University',
    utilityTag: 'Daawa Newspaper | The Academic Voice',
    liveTag: 'LIVE: New Issue Available Now',
    adminPanel: 'Admin Panel',
    searchPlaceholder: 'Search the newspaper archive...',
    all: 'All',
    latestTitles: 'Latest Headlines',
    resetFilters: 'Reset Filters',
    countLabel: 'Articles',
    noResults: 'No matches found',
    browseArchive: 'Browse all archive',
    announcements: 'Important Notices',
    urgentTag: 'URGENT',
    allAnnouncements: 'All Academic Notices',
    researchHub: 'Digital Research Hub',
    browseHub: 'Browse Hub',
    footerDesc: 'The official digital platform of the Faculty of Daawa and Theology. We aim to develop academic Islamic discourse and enhance knowledge communication with society.',
    sections: 'Our Sections',
    aboutCollege: 'About College',
    address: 'Zliten - Libya, Asmarya Islamic University, Daawa Faculty Building',
    loginTitle: 'Admin Login',
    emailLabel: 'Email Address',
    passLabel: 'Password',
    loginBtn: 'Login',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    installApp: 'Install App',
    shareSite: 'Share Platform'
  }
};

const Logo = () => (
  <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-50">
    <img 
      src="https://lh3.googleusercontent.com/d/1z9GZZd2TThWBhGfuxQlh96A1BXdlihSj" 
      alt="شعار صحيفة دعوة" 
      className="w-full h-full object-contain p-1"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
        const parent = e.currentTarget.parentElement;
        if (parent) parent.innerHTML = '<div class="text-brand-orange font-black text-2xl">D</div>';
      }}
    />
  </div>
);

const App: React.FC = () => {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang];

  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'الكل' | 'All'>('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  // Likes System with LocalStorage
  const [articleLikes, setArticleLikes] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('articleLikes');
    if (saved) return JSON.parse(saved);
    const initial: Record<string, number> = {};
    INITIAL_ARTICLES.forEach(a => initial[a.id] = Math.floor(Math.random() * 50) + 10);
    return initial;
  });

  const [userLikes, setUserLikes] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('userLikes');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('articleLikes', JSON.stringify(articleLikes));
  }, [articleLikes]);

  useEffect(() => {
    localStorage.setItem('userLikes', JSON.stringify(userLikes));
  }, [userLikes]);

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const alreadyLiked = userLikes[id];
    setUserLikes(prev => ({ ...prev, [id]: !alreadyLiked }));
    setArticleLikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + (alreadyLiked ? -1 : 1)
    }));
    // Haptic feedback if available
    if (window.navigator.vibrate) window.navigator.vibrate(50);
  };

  const [selectedAuthor, setSelectedAuthor] = useState<string>(lang === 'ar' ? 'الكل' : 'All');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // PWA Install Logic
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      setShowInstallBtn(false);
      setDeferredPrompt(null);
    });
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowInstallBtn(false);
    setDeferredPrompt(null);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t.siteTitle,
          text: t.subtitle,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    }
  };

  const handleAddArticle = (newArticle: Article) => setArticles(prev => [newArticle, ...prev]);
  const handleUpdateArticle = (updated: Article) => setArticles(prev => prev.map(a => a.id === updated.id ? updated : a));
  const handleDeleteArticle = (id: string) => setArticles(prev => prev.filter(a => a.id !== id));

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesCategory = selectedCategory === 'الكل' || selectedCategory === 'All' || article.category === selectedCategory;
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAuthor = selectedAuthor === 'الكل' || selectedAuthor === 'All' || article.author === selectedAuthor;
      const articleDate = new Date(article.date).getTime();
      const start = startDate ? new Date(startDate).getTime() : -Infinity;
      const end = endDate ? new Date(endDate).getTime() : Infinity;
      const matchesDate = articleDate >= start && articleDate <= end;
      return matchesCategory && matchesSearch && matchesAuthor && matchesDate;
    });
  }, [articles, selectedCategory, searchQuery, selectedAuthor, startDate, endDate]);

  const categories = [
    { name: lang === 'ar' ? 'الكل' : 'All', icon: <Newspaper size={18} /> },
    { name: Category.NEWS, icon: <Megaphone size={18} /> },
    { name: Category.ARTICLES, icon: <BookOpen size={18} /> },
    { name: Category.INTERVIEWS, icon: <MessageSquare size={18} /> },
    { name: Category.CULTURE, icon: <Globe size={18} /> },
  ];

  const handleAdminAccess = () => {
    if (isAdminLoggedIn) setIsAdminOpen(true);
    else setIsLoginModalOpen(true);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      localStorage.setItem('darkMode', String(!prev));
      return !prev;
    });
  };

  const resetFilters = () => {
    setSelectedAuthor(lang === 'ar' ? 'الكل' : 'All');
    setStartDate('');
    setEndDate('');
    setSelectedTags([]);
    setSearchQuery('');
    setSelectedCategory(lang === 'ar' ? 'الكل' : 'All');
  };

  const handleSearchClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 500);
  };

  const hasActiveFilters = (selectedAuthor !== 'الكل' && selectedAuthor !== 'All') || startDate || endDate;

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [lang, isDarkMode]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 selection:bg-amber-100 ${lang === 'en' ? 'font-sans' : ''} ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-[#fcfcfc]'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Top Utility Bar */}
      <div className={`py-2 px-4 text-[10px] md:text-xs z-[50] relative transition-colors ${isDarkMode ? 'bg-brand-dark text-slate-400 border-b border-slate-800' : 'bg-brand-black text-slate-300'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-4">
            <span className="hidden sm:inline font-bold">{t.utilityTag}</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse"></span>
              {t.liveTag}
            </span>
          </div>
          <div className="flex gap-3 items-center">
            {showInstallBtn && (
              <button onClick={handleInstallClick} className="flex items-center gap-1 bg-brand-orange text-brand-black px-2 py-0.5 rounded font-black hover:scale-105 transition-all">
                <Download size={10} /> {t.installApp}
              </button>
            )}
            <button onClick={toggleDarkMode} className="p-1 hover:text-brand-orange transition-colors">
              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="font-bold hover:text-brand-orange">
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>
            <button onClick={handleAdminAccess} className="text-brand-orange font-bold hover:text-white transition-colors">
              {isAdminLoggedIn ? <LayoutDashboard size={14} /> : <Lock size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-40">
        <header className={`border-b transition-all duration-500 ${isDarkMode ? 'bg-brand-dark/95 border-slate-800 backdrop-blur-md' : 'bg-white shadow-sm'}`}>
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 lg:py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Logo />
                <div className="flex flex-col">
                  <h1 className={`text-2xl md:text-4xl font-black transition-colors ${isDarkMode ? 'text-white' : 'text-brand-black'}`}>
                    صحيفة <span className="text-brand-orange">دعوة</span>
                  </h1>
                  <p className={`text-[10px] md:text-xs font-bold transition-colors hidden sm:block ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {t.subtitle}
                  </p>
                </div>
              </div>

              {/* Desktop Nav */}
              <div className="hidden lg:flex flex-1 max-w-xl mx-12">
                <div className="relative w-full">
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full border-2 border-transparent focus:bg-white rounded-2xl py-3 pr-12 pl-4 transition-all outline-none font-bold ${isDarkMode ? 'bg-brand-black/40 text-white placeholder-slate-600 focus:border-brand-orange' : 'bg-slate-100 text-brand-black focus:border-brand-orange'}`}
                  />
                  <Search className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} size={20} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={handleShare} className={`p-3 rounded-2xl transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-brand-orange hover:text-brand-black' : 'bg-slate-50 text-slate-600 hover:bg-brand-orange hover:text-white'}`}>
                  <Share2 size={24} />
                </button>
                <button onClick={() => setIsFiltersOpen(true)} className={`p-3 rounded-2xl relative transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                  <Filter size={24} />
                  {hasActiveFilters && <span className="absolute top-2 right-2 w-2 h-2 bg-brand-orange rounded-full"></span>}
                </button>
              </div>
            </div>
          </div>
        </header>
        <BreakingNewsTicker announcements={ANNOUNCEMENTS} />
      </div>

      <main className="flex-grow pb-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredArticles.map(article => (
                    <ArticleCard 
                      key={article.id} 
                      article={article} 
                      likesCount={articleLikes[article.id] || 0}
                      isLiked={!!userLikes[article.id]}
                      onLike={(e) => handleLike(e, article.id)}
                      onClick={setActiveArticle} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white dark:bg-slate-800/30 rounded-[40px] border-2 border-dashed dark:border-slate-700">
                  <Search size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-xl font-bold dark:text-slate-400">{t.noResults}</p>
                  <button onClick={resetFilters} className="mt-4 text-brand-orange font-black underline">{t.browseArchive}</button>
                </div>
              )}
            </div>

            <aside className="lg:col-span-4 space-y-8">
              {/* Sidebar content */}
              <section className={`rounded-[40px] overflow-hidden border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-100 shadow-sm'}`}>
                <div className="p-6 bg-brand-orange text-brand-black flex items-center gap-3">
                  <Megaphone size={24} />
                  <h3 className="font-black text-xl">{t.announcements}</h3>
                </div>
                <div className="p-2">
                  {ANNOUNCEMENTS.map(ann => (
                    <div key={ann.id} className="p-4 rounded-3xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex gap-4">
                      <div className={`w-1 h-12 rounded-full ${ann.type === 'urgent' ? 'bg-red-500' : 'bg-brand-orange'}`}></div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 mb-1">{ann.date}</p>
                        <h4 className="text-sm font-bold dark:text-white leading-relaxed">{ann.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>

      <MobileBottomNav 
        selectedCategory={selectedCategory} 
        onSelectCategory={setSelectedCategory} 
        onSearchClick={handleSearchClick}
        isDarkMode={isDarkMode}
        lang={lang}
      />

      <ArticleModal article={activeArticle} onClose={() => setActiveArticle(null)} />
      
      {isAdminOpen && (
        <AdminPanel 
          articles={articles} 
          onAdd={handleAddArticle} 
          onUpdate={handleUpdateArticle} 
          onDelete={handleDeleteArticle} 
          onClose={() => setIsAdminOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;
