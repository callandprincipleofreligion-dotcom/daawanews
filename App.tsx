
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Bell, Menu, Newspaper, BookOpen, MessageSquare, Globe, Megaphone, ChevronDown, Github, Twitter, Facebook, ExternalLink, Filter, X, Calendar as CalendarIcon, User as UserIcon, Tag as TagIcon, RotateCcw, ArrowRight, Settings, LayoutDashboard, Lock, LogIn, Moon, Sun, Download } from 'lucide-react';
import { Article, Category } from './types';
import { ARTICLES as INITIAL_ARTICLES, ANNOUNCEMENTS } from './data/mockData';
import { ArticleCard } from './components/ArticleCard';
import { ArticleModal } from './components/ArticleModal';
import { AdminPanel } from './components/AdminPanel';
import { BreakingNewsTicker } from './components/BreakingNewsTicker';

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
    installApp: 'تثبيت التطبيق'
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
    installApp: 'Install App'
  }
};

const Logo = () => (
  <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-50">
    <img 
      src="https://lh3.googleusercontent.com/d/1z9GZZd2TThWBhGfuxQlh96A1BXdlihSj" 
      alt="شعار صحيفة دعوة" 
      className="w-full h-full object-contain"
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
    // Initial random values for demo
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
  };

  const [selectedAuthor, setSelectedAuthor] = useState<string>(lang === 'ar' ? 'الكل' : 'All');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // PWA Install Logic
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    });
    window.addEventListener('appinstalled', () => {
      setShowInstallBtn(false);
      setDeferredPrompt(null);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowInstallBtn(false);
    setDeferredPrompt(null);
  };

  const handleAddArticle = (newArticle: Article) => setArticles(prev => [newArticle, ...prev]);
  const handleUpdateArticle = (updated: Article) => setArticles(prev => prev.map(a => a.id === updated.id ? updated : a));
  const handleDeleteArticle = (id: string) => setArticles(prev => prev.filter(a => a.id !== id));

  const allAuthors = useMemo(() => [lang === 'ar' ? 'الكل' : 'All', ...Array.from(new Set(articles.map(a => a.author)))], [articles, lang]);

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesCategory = selectedCategory === 'الكل' || selectedCategory === 'All' || article.category === selectedCategory;
      const matchesSearch = article.title.includes(searchQuery) || article.excerpt.includes(searchQuery) || article.content.includes(searchQuery);
      const matchesAuthor = selectedAuthor === 'الكل' || selectedAuthor === 'All' || article.author === selectedAuthor;
      const articleDate = new Date(article.date).getTime();
      const start = startDate ? new Date(startDate).getTime() : -Infinity;
      const end = endDate ? new Date(endDate).getTime() : Infinity;
      const matchesDate = articleDate >= start && articleDate <= end;
      const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => article.tags.includes(tag));
      return matchesCategory && matchesSearch && matchesAuthor && matchesDate && matchesTags;
    });
  }, [articles, selectedCategory, searchQuery, selectedAuthor, startDate, endDate, selectedTags]);

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail === 'admin@daawa.ly' && loginPassword === 'daawa2024') {
      setIsAdminLoggedIn(true);
      setIsLoginModalOpen(false);
      setIsAdminOpen(true);
      setLoginError('');
    } else {
      setLoginError(lang === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password');
    }
  };

  const resetFilters = () => {
    setSelectedAuthor(lang === 'ar' ? 'الكل' : 'All');
    setStartDate('');
    setEndDate('');
    setSelectedTags([]);
    setSearchQuery('');
    setSelectedCategory(lang === 'ar' ? 'الكل' : 'All');
  };

  const hasActiveFilters = (selectedAuthor !== 'الكل' && selectedAuthor !== 'All') || startDate || endDate || selectedTags.length > 0;

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 selection:bg-amber-100 ${lang === 'en' ? 'font-sans' : ''} ${isDarkMode ? 'bg-[#333333]' : 'bg-[#fcfcfc]'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Utility Bar */}
      <div className={`py-2 px-4 text-xs z-[50] relative transition-colors ${isDarkMode ? 'bg-brand-dark text-slate-400' : 'bg-brand-black text-slate-300'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-4">
            <span className="hidden sm:inline">{t.utilityTag}</span>
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse bg-brand-orange`}></span>
              {t.liveTag}
            </span>
          </div>
          <div className="flex gap-4 items-center">
            {showInstallBtn && (
              <button 
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 bg-brand-orange text-brand-black px-2 py-0.5 rounded font-black animate-bounce"
              >
                <Download size={12} />
                {t.installApp}
              </button>
            )}
            <button 
              onClick={toggleDarkMode}
              className={`flex items-center gap-1.5 font-bold transition-colors ${isDarkMode ? 'text-brand-orange hover:text-white' : 'hover:text-brand-orange'}`}
              title={isDarkMode ? t.lightMode : t.darkMode}
            >
              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
              <span className="hidden xs:inline">{isDarkMode ? t.lightMode : t.darkMode}</span>
            </button>
            <div className="w-[1px] h-3 bg-slate-700 mx-1"></div>
            <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="hover:text-brand-orange transition-colors font-bold">
              {lang === 'ar' ? 'English' : 'العربية'}
            </button>
            <button onClick={handleAdminAccess} className="flex items-center gap-1.5 text-brand-orange font-bold hover:text-white transition-colors">
              {isAdminLoggedIn ? <LayoutDashboard size={14} /> : <Lock size={14} />}
              {t.adminPanel}
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Header */}
      <div className="sticky top-0 z-40">
        <header className={`border-b shadow-sm transition-colors duration-500 ${isDarkMode ? 'bg-brand-orange' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20 lg:h-28">
              
              <div className="flex items-center gap-2 md:gap-6">
                <button 
                  onClick={() => setIsMobileMenuOpen(true)}
                  className={`lg:hidden p-2 rounded-lg transition-colors ${isDarkMode ? 'text-brand-black hover:bg-brand-black/10' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Menu size={28} />
                </button>
                <div className="flex items-center gap-2 md:gap-4">
                  <Logo />
                  <div className="flex flex-col">
                    <span className={`text-2xl md:text-4xl font-black leading-tight tracking-tight transition-colors ${isDarkMode ? 'text-brand-black' : 'text-brand-black'}`}>
                      {lang === 'ar' ? <>صحيفة <span className={`${isDarkMode ? 'text-white' : 'text-brand-orange'}`}>دعوة</span></> : <><span className={`${isDarkMode ? 'text-white' : 'text-brand-orange'}`}>Daawa</span> News</>}
                    </span>
                    <span className={`hidden sm:block text-[10px] md:text-xs font-bold opacity-80 transition-colors ${isDarkMode ? 'text-brand-black/70' : 'text-slate-500'}`}>{t.subtitle}</span>
                  </div>
                </div>
              </div>

              {/* Desktop Search */}
              <div className="hidden lg:flex flex-1 max-w-lg mx-12">
                <div className="relative w-full">
                  <input 
                    type="text" 
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full border-2 border-transparent focus:bg-white rounded-2xl py-3 pr-12 pl-4 transition-all outline-none font-medium ${isDarkMode ? 'bg-brand-black/10 focus:border-brand-black text-brand-black placeholder-brand-black/50' : 'bg-slate-100 focus:border-brand-orange text-brand-black'}`}
                  />
                  <Search className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 transition-colors ${isDarkMode ? 'text-brand-black/60' : 'text-slate-400'}`} size={20} />
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-4">
                <button onClick={() => setIsFiltersOpen(true)} className={`p-3 rounded-2xl transition-all relative ${isDarkMode ? (hasActiveFilters ? 'bg-brand-black text-brand-orange' : 'bg-brand-black/10 text-brand-black hover:bg-brand-black/20') : (hasActiveFilters ? 'bg-brand-orange text-brand-black' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}`}>
                  <Filter size={24} />
                  {hasActiveFilters && <span className={`absolute -top-1 -right-1 w-4 h-4 border-2 rounded-full text-[8px] flex items-center justify-center font-bold ${isDarkMode ? 'bg-white border-brand-orange text-brand-orange' : 'bg-brand-black border-white text-white'}`}>!</span>}
                </button>
                <button className={`hidden md:flex p-3 rounded-2xl relative transition-colors ${isDarkMode ? 'bg-brand-black/10 text-brand-black hover:bg-brand-black/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  <Bell size={24} />
                  <span className={`absolute top-3 right-3 w-2 h-2 rounded-full ${isDarkMode ? 'bg-brand-black' : 'bg-brand-orange'}`}></span>
                </button>
                <div className={`hidden sm:block h-10 w-[2px] mx-1 transition-colors ${isDarkMode ? 'bg-brand-black/20' : 'bg-slate-100'}`}></div>
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center overflow-hidden shadow-sm border-2 ${isDarkMode ? 'bg-brand-black border-brand-black text-brand-orange' : 'bg-brand-black border-brand-orange text-brand-orange'}`}>
                  <UserIcon size={24} />
                </div>
              </div>
            </div>
          </div>

          <nav className={`hidden lg:block border-t transition-colors ${isDarkMode ? 'bg-brand-orange border-brand-black/10' : 'bg-slate-50/50'}`}>
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center gap-10 py-4 overflow-x-auto no-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name as any)}
                    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap text-sm font-black ${selectedCategory === cat.name ? (isDarkMode ? 'bg-brand-black text-brand-orange shadow-lg' : 'bg-brand-black text-brand-orange shadow-xl shadow-slate-200') : (isDarkMode ? 'text-brand-black hover:text-white' : 'text-slate-600 hover:text-brand-orange')}`}
                  >
                    {cat.icon}
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </header>
        <BreakingNewsTicker announcements={ANNOUNCEMENTS} />
      </div>

      <main className="flex-grow overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className={`text-3xl font-black flex items-center gap-4 transition-colors ${isDarkMode ? 'text-white' : 'text-brand-black'}`}>
                  <div className={`w-2 h-10 rounded-full shadow-lg ${isDarkMode ? 'bg-brand-orange shadow-brand-orange/20' : 'bg-brand-orange shadow-amber-200'}`}></div>
                  {selectedCategory === 'الكل' || selectedCategory === 'All' ? t.latestTitles : selectedCategory}
                </h2>
                <div className="flex items-center gap-3">
                   {hasActiveFilters && (
                    <button onClick={resetFilters} className={`text-xs font-black px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md transition-colors ${isDarkMode ? 'bg-brand-orange text-brand-black' : 'bg-brand-black text-brand-orange'}`}>
                      <RotateCcw size={14} />
                      {t.resetFilters}
                    </button>
                  )}
                  <div className={`text-xs font-bold px-4 py-2 rounded-xl shadow-sm border transition-colors ${isDarkMode ? 'bg-brand-dark/50 text-slate-400 border-slate-700' : 'bg-white text-slate-400 border-slate-100'}`}>
                    {filteredArticles.length} {t.countLabel}
                  </div>
                </div>
              </div>

              {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <div className={`rounded-[40px] p-20 text-center border-4 border-dashed shadow-sm transition-colors ${isDarkMode ? 'bg-brand-dark/20 border-slate-700' : 'bg-white border-slate-100'}`}>
                  <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-12 transition-colors ${isDarkMode ? 'bg-brand-orange/20 text-brand-orange' : 'bg-amber-50 text-brand-orange'}`}>
                    <Search size={48} />
                  </div>
                  <h3 className={`text-3xl font-black mb-4 transition-colors ${isDarkMode ? 'text-white' : 'text-brand-black'}`}>{t.noResults}</h3>
                  <button onClick={resetFilters} className={`px-12 py-4 rounded-2xl font-black hover:scale-105 transition-all shadow-2xl ${isDarkMode ? 'bg-brand-orange text-brand-black' : 'bg-brand-black text-brand-orange'}`}>
                    {t.browseArchive}
                  </button>
                </div>
              )}
            </div>

            <aside className="lg:col-span-4 space-y-10">
              {/* Announcements Section */}
              <section className={`rounded-[40px] shadow-xl border overflow-hidden transition-colors ${isDarkMode ? 'bg-[#444444] border-slate-700' : 'bg-white border-slate-50 shadow-slate-100'}`}>
                <div className={`p-6 flex items-center gap-4 transition-colors ${isDarkMode ? 'bg-brand-orange text-brand-black' : 'bg-brand-black text-white'}`}>
                  <div className={`p-3 rounded-2xl transition-colors ${isDarkMode ? 'bg-brand-black text-brand-orange' : 'bg-brand-orange text-brand-black'}`}><Megaphone size={24} /></div>
                  <h3 className="font-black text-xl">{t.announcements}</h3>
                </div>
                <div className="p-2">
                  {ANNOUNCEMENTS.map((ann) => (
                    <div key={ann.id} className={`p-5 rounded-3xl transition-all cursor-pointer group flex gap-4 ${isDarkMode ? 'hover:bg-brand-orange/10' : 'hover:bg-slate-50'}`}>
                      <div className={`flex-shrink-0 w-1 rounded-full transition-colors ${isDarkMode ? 'bg-slate-700 group-hover:bg-brand-orange' : 'bg-slate-100 group-hover:bg-brand-orange'}`}></div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter transition-colors ${isDarkMode ? 'text-slate-500 bg-brand-black/20' : 'text-slate-400 bg-slate-50'}`}>{ann.date}</span>
                          {ann.type === 'urgent' && <span className={`text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse transition-colors ${isDarkMode ? 'bg-red-900/40 text-red-400' : 'bg-red-100 text-red-600'}`}>{t.urgentTag}</span>}
                        </div>
                        <h4 className={`text-sm font-bold leading-relaxed transition-colors ${isDarkMode ? 'text-slate-200 group-hover:text-brand-orange' : 'text-brand-black group-hover:text-brand-orange'}`}>{ann.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Research Hub Section */}
              <section className={`rounded-[40px] p-8 shadow-2xl relative overflow-hidden group transition-all duration-500 ${isDarkMode ? 'bg-brand-dark shadow-none border border-brand-orange/20' : 'bg-brand-orange shadow-amber-200'}`}>
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl transition-colors ${isDarkMode ? 'bg-brand-orange text-brand-black' : 'bg-brand-black text-brand-orange'}`}><BookOpen size={32} /></div>
                  <h3 className={`text-3xl font-black mb-4 leading-tight transition-colors ${isDarkMode ? 'text-white' : 'text-brand-black'}`}>{t.researchHub}</h3>
                  <button className={`w-full py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-3 shadow-xl hover:translate-y-[-4px] transition-all ${isDarkMode ? 'bg-brand-orange text-brand-black' : 'bg-brand-black text-brand-orange'}`}>
                    {t.browseHub}
                    <ArrowRight size={24} className={lang === 'ar' ? 'rotate-0' : 'rotate-180'} />
                  </button>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>

      {/* Login & Modals */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-black/95 backdrop-blur-md">
          <div className={`w-full max-w-md rounded-[40px] p-8 md:p-10 border transition-colors ${isDarkMode ? 'bg-[#444444] border-slate-700' : 'bg-white border-slate-100'}`}>
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-orange rounded-xl text-brand-black"><Lock size={24} /></div>
                <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-brand-black'}`}>{t.loginTitle}</h2>
              </div>
              <button onClick={() => setIsLoginModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full"><X size={24} /></button>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className={`text-sm font-black ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t.emailLabel}</label>
                <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className={`w-full border-2 border-transparent rounded-2xl py-4 px-6 outline-none transition-all font-bold ${isDarkMode ? 'bg-brand-black/20 text-white' : 'bg-slate-50 text-brand-black'}`} />
              </div>
              <div className="space-y-2">
                <label className={`text-sm font-black ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t.passLabel}</label>
                <input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className={`w-full border-2 border-transparent rounded-2xl py-4 px-6 outline-none transition-all font-bold ${isDarkMode ? 'bg-brand-black/20 text-white' : 'bg-slate-50 text-brand-black'}`} />
              </div>
              <button type="submit" className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all ${isDarkMode ? 'bg-brand-orange text-brand-black' : 'bg-brand-black text-brand-orange'}`}>{t.loginBtn}</button>
            </form>
          </div>
        </div>
      )}

      {isAdminOpen && <AdminPanel articles={articles} onAdd={handleAddArticle} onUpdate={handleUpdateArticle} onDelete={handleDeleteArticle} onClose={() => setIsAdminOpen(false)} />}
      <ArticleModal article={activeArticle} onClose={() => setActiveArticle(null)} />
    </div>
  );
};

export default App;
