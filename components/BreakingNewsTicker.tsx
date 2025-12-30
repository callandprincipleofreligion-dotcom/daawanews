
import React from 'react';
import { Megaphone, ChevronLeft } from 'lucide-react';
import { Announcement } from '../types';

interface BreakingNewsTickerProps {
  announcements: Announcement[];
}

export const BreakingNewsTicker: React.FC<BreakingNewsTickerProps> = ({ announcements }) => {
  const urgentNews = announcements.filter(a => a.type === 'urgent');

  if (urgentNews.length === 0) return null;

  return (
    <div className="bg-brand-black border-b border-brand-orange/20 relative overflow-hidden h-12 flex items-center">
      {/* Label Tag */}
      <div className="absolute right-0 top-0 bottom-0 z-20 bg-brand-orange text-brand-black px-4 flex items-center gap-2 shadow-[10px_0_20px_rgba(0,0,0,0.3)]">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-black opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-black"></span>
        </div>
        <span className="font-black text-sm whitespace-nowrap">عاجل</span>
      </div>

      {/* Ticker Content */}
      <div className="flex-grow overflow-hidden whitespace-nowrap flex items-center mr-24">
        <div className="animate-marquee flex items-center gap-12 text-brand-orange/90 font-bold text-sm">
          {urgentNews.map((news, idx) => (
            <div key={news.id} className="flex items-center gap-3">
              <span className="hover:text-white transition-colors cursor-default">{news.title}</span>
              {idx !== urgentNews.length - 1 && (
                <div className="w-1.5 h-1.5 bg-brand-orange/30 rounded-full"></div>
              )}
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {urgentNews.map((news) => (
            <div key={`${news.id}-clone`} className="flex items-center gap-3">
              <span className="hover:text-white transition-colors cursor-default">{news.title}</span>
              <div className="w-1.5 h-1.5 bg-brand-orange/30 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative element on the left */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-brand-black to-transparent z-10 pointer-events-none"></div>

      <style>{`
        /* Animation moving from Left to Right */
        @keyframes marquee-left-to-right {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-marquee {
          display: inline-flex;
          animation: marquee-left-to-right 35s linear infinite;
          width: max-content;
        }

        /* Ensuring RTL context doesn't break the specific request of left-to-right movement */
        [dir="rtl"] .animate-marquee {
           animation: marquee-left-to-right 35s linear infinite;
        }
      `}</style>
    </div>
  );
};
