import React from 'react';
import { Smartphone, MonitorPlay, Code2, QrCode, Sun, Moon, Maximize2 } from 'lucide-react';

export type AppView = 'survey' | 'dashboard' | 'code-guide';

interface HeaderProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onOpenQr: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  totalResponses: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onOpenQr,
  isDarkMode,
  onToggleDarkMode,
  totalResponses,
}) => {
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Single Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onViewChange('dashboard')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm shadow-teal-600/20 group-hover:bg-teal-700 transition-colors">
              TF
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-2">
                <span>TrainFeedback</span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/60">
                  Live
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                ระบบประเมินความพึงพอใจการอบรมสด
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links / Segmented View Switcher */}
        <nav className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          <button
            onClick={() => onViewChange('survey')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              currentView === 'survey'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>หน้าตอบ (มือถือ)</span>
          </button>

          <button
            onClick={() => onViewChange('dashboard')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              currentView === 'dashboard'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MonitorPlay className="w-3.5 h-3.5" />
            <span>Dashboard จอสด</span>
            {totalResponses > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 font-mono">
                {totalResponses}
              </span>
            )}
          </button>

          <button
            onClick={() => onViewChange('code-guide')}
            className={`hidden md:flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              currentView === 'code-guide'
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>โค้ด 2 ไฟล์ &amp; คู่มือ</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Quick Tools */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenQr}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white shadow-xs transition-all whitespace-nowrap"
            title="เปิด QR Code สำหรับผู้เข้าร่วมอบรมสแกน"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">สแกนตอบ</span>
          </button>

          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDarkMode ? 'เปลี่ยนเป็นธีมสว่าง' : 'เปลี่ยนเป็นธีมโปรเจกเตอร์/มืด'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleFullScreen}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:flex"
            title="โหมดเต็มหน้าจอสำหรับโปรเจกเตอร์"
            aria-label="Toggle fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
