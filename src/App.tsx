import React, { useState, useEffect } from 'react';
import { Header, AppView } from './components/Header';
import { SurveyView } from './components/SurveyView';
import { DashboardView } from './components/DashboardView';
import { FirebaseGuideAndCodeModal } from './components/FirebaseGuideAndCodeModal';
import { QRCodeModal } from './components/QRCodeModal';
import {
  calculateStats,
  getStoredResponses,
  subscribeToResponses,
} from './services/storage';
import { SurveyResponse, EvaluationStats } from './types';

export default function App() {
  // Hash & URL query detection
  const getInitialView = (): AppView => {
    if (typeof window === 'undefined') return 'dashboard';
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    if (hash.includes('survey') || search.includes('view=survey')) {
      return 'survey';
    }
    if (hash.includes('code') || search.includes('view=code')) {
      return 'code-guide';
    }
    return 'dashboard';
  };

  const [currentView, setCurrentView] = useState<AppView>(getInitialView);
  const [responses, setResponses] = useState<SurveyResponse[]>(() => getStoredResponses());
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      localStorage.getItem('training_theme_mode') === 'dark' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  });

  // Calculate live stats
  const stats: EvaluationStats = calculateStats(responses);

  // Sync dark class on documentElement
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('training_theme_mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('training_theme_mode', 'light');
    }
  }, [isDarkMode]);

  // Subscribe to real-time updates across all browser tabs/windows
  useEffect(() => {
    const unsubscribe = subscribeToResponses((newResponses) => {
      setResponses([...newResponses]);
    });

    const handleHashChange = () => {
      setCurrentView(getInitialView());
    };
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      unsubscribe();
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleViewChange = (view: AppView) => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      window.location.hash = view;
    }
  };

  // URL that attendees scan to answer survey
  const getSurveyUrl = () => {
    if (typeof window === 'undefined') return 'https://example.com#survey';
    const base = window.location.origin + window.location.pathname;
    return `${base}#survey`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors selection:bg-teal-500 selection:text-white">
      {/* Top Header adhering to Top Bar Contract */}
      <Header
        currentView={currentView}
        onViewChange={handleViewChange}
        onOpenQr={() => setIsQrOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        totalResponses={responses.length}
      />

      {/* Main View Port */}
      <main className="flex-1 w-full">
        {currentView === 'survey' && (
          <SurveyView
            onSuccessSubmitted={() => {
              setResponses(getStoredResponses());
            }}
            onGoToDashboard={() => handleViewChange('dashboard')}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            stats={stats}
            responses={responses}
            onOpenQr={() => setIsQrOpen(true)}
            onGoToSurvey={() => handleViewChange('survey')}
          />
        )}

        {currentView === 'code-guide' && <FirebaseGuideAndCodeModal />}
      </main>

      {/* QR Code Modal for Projector */}
      <QRCodeModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        surveyUrl={getSurveyUrl()}
      />
    </div>
  );
}
