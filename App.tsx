import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import FlowerCard from './components/FlowerCard';
import { getFlowerRecommendations } from './services/geminiService';
import { Flower, ViewState } from './types';
import { Loader2, RefreshCw, Leaf, X, Download } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  
  // State to handle PWA install prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // Optionally, send analytics event with outcome of user choice
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setDeferredPrompt(null);
    } else {
      console.log('User dismissed the install prompt');
    }
  };

  const handleStart = async (query: string = '') => {
    let formattedQuery = query.trim();
    
    // If the input is just numbers (1 or 2 digits), treat it as a month (e.g., "7" -> "7월")
    if (/^\d{1,2}$/.test(formattedQuery)) {
      formattedQuery = `${formattedQuery}월`;
    }

    setView('LOADING');
    setError(null);
    setCurrentQuery(formattedQuery);

    try {
      const data = await getFlowerRecommendations(formattedQuery);
      setFlowers(data);
      setView('RESULTS');
    } catch (err) {
      console.error(err);
      setError("죄송합니다. 꽃 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.");
      setView('ERROR');
    }
  };

  const handleReset = () => {
    setView('LANDING');
    setFlowers([]);
    setCurrentQuery('');
  };

  const handleRetry = () => {
    handleStart(currentQuery);
  };

  // Helper to determine title
  const getTitle = () => {
    if (flowers.length === 1) {
      return `${flowers[0].name} 상세 정보`;
    }
    return currentQuery ? `${currentQuery} 추천 꽃 TOP 10` : '이달의 추천 꽃 TOP 10';
  };

  const getDescription = () => {
     if (flowers.length === 1) {
       return "검색하신 꽃에 대한 재배 정보와 인기 품종입니다.";
     }
     return "선택하신 시기와 환경에 가장 적합한 식물들을 엄선했습니다. \n카드를 눌러 상세 정보를 확인해보세요.";
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-emerald-200">
      {view === 'LANDING' && (
        <LandingPage 
          onStart={handleStart} 
          onInstall={handleInstallClick}
          canInstall={!!deferredPrompt}
        />
      )}

      {view === 'LOADING' && (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-300 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <Loader2 className="w-16 h-16 text-emerald-600 animate-spin relative z-10" />
          </div>
          <h2 className="mt-8 text-2xl font-serif text-stone-800">
            {currentQuery ? `"${currentQuery}"에 대한 정보` : '이번 달 추천 꽃'}를 찾고 있습니다...
          </h2>
          <p className="mt-2 text-stone-500">잠시만 기다려주세요.</p>
        </div>
      )}

      {view === 'ERROR' && (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <Leaf className="w-8 h-8 text-red-400 rotate-180" />
          </div>
          <h2 className="text-2xl font-bold text-stone-800 mb-2">문제가 발생했습니다</h2>
          <p className="text-stone-500 mb-8 max-w-md">{error}</p>
          <button 
            onClick={handleRetry}
            className="px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={18} /> 다시 시도하기
          </button>
        </div>
      )}

      {view === 'RESULTS' && (
        <div className="min-h-screen bg-stone-50">
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
            <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
              <div 
                className="flex items-center gap-2" 
              >
                <Leaf className="text-emerald-600" />
                <span className="font-serif text-xl font-bold">뭐 심지?</span>
              </div>
              
              <div className="flex items-center gap-4">
                {deferredPrompt && (
                  <button 
                    onClick={handleInstallClick}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-full"
                    title="앱 설치하기"
                  >
                    <Download size={16} /> <span className="hidden sm:inline">앱 설치</span>
                  </button>
                )}
                
                <button 
                  onClick={handleRetry}
                  className="text-sm font-medium text-stone-500 hover:text-emerald-600 transition-colors flex items-center gap-1"
                  title="결과 다시 생성"
                >
                  <RefreshCw size={16} /> <span className="hidden sm:inline">새로고침</span>
                </button>
                <div className="w-px h-4 bg-stone-300 mx-1"></div>
                <button 
                  onClick={handleReset}
                  className="p-2 -mr-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-all"
                  aria-label="종료하고 처음으로 돌아가기"
                  title="종료"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          </header>

          <main className="max-w-5xl mx-auto px-6 py-12">
            <div className="mb-12 text-center">
              <span className="text-emerald-600 font-semibold tracking-wider text-sm uppercase">Curated List</span>
              <h2 className="text-4xl font-serif text-stone-900 mt-3 mb-4">
                {getTitle()}
              </h2>
              <p className="text-stone-500 whitespace-pre-wrap">
                {getDescription()}
              </p>
            </div>

            <div className={`grid gap-8 animate-fade-in-up ${flowers.length === 1 ? 'grid-cols-1 max-w-xl mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
              {flowers.map((flower) => (
                <FlowerCard 
                  key={flower.rank} 
                  flower={flower} 
                  isSingleView={flowers.length === 1}
                />
              ))}
            </div>
            
            <div className="mt-16 text-center pb-8">
              <p className="text-stone-400 text-sm">
                * 추천 순위는 계절 적합성과 재배 난이도를 고려하여 AI가 선정했습니다.
              </p>
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default App;