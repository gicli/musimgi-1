import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage.tsx';
import FlowerCard from './components/FlowerCard.tsx';
import { getFlowerRecommendations, identifyFlower } from './services/geminiService.ts';
import { ResponseData, ViewState } from './types.ts';
import { Loader2, RefreshCw, Leaf, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

  const handleStart = async (query: string = '') => {
    let formattedQuery = query.trim();
    if (/^\d{1,2}$/.test(formattedQuery)) {
      formattedQuery = `${formattedQuery}월`;
    }
    setView('LOADING');
    setError(null);
    setCurrentQuery(formattedQuery || '이달의');
    try {
      const data = await getFlowerRecommendations(formattedQuery);
      setResponseData(data);
      setView('RESULTS');
    } catch (err: any) {
      setError(err.message || "정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.");
      setView('ERROR');
    }
  };

  const handleImageUpload = async (file: File) => {
    setView('LOADING');
    setError(null);
    setCurrentQuery('사진 분석 결과');
    
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      
      const base64Data = await base64Promise;
      const data = await identifyFlower(base64Data, file.type);
      setResponseData(data);
      setView('RESULTS');
    } catch (err: any) {
      setError(err.message || "이미지 분석에 실패했습니다. 다른 사진으로 시도해 주세요.");
      setView('ERROR');
    }
  };

  const handleReset = () => {
    setView('LANDING');
    setResponseData(null);
    setCurrentQuery('');
  };

  const handleRetry = () => handleStart(currentQuery);

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans text-stone-900 selection:bg-emerald-200">
      <AnimatePresence mode="wait">
        {view === 'LANDING' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LandingPage 
              onStart={handleStart} 
              onImageUpload={handleImageUpload}
              onInstall={handleInstallClick}
              canInstall={!!deferredPrompt}
            />
          </motion.div>
        )}

        {view === 'LOADING' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-white"
          >
            <Loader2 className="w-16 h-16 text-emerald-600 animate-spin" />
            <h2 className="mt-8 text-2xl font-serif text-stone-800">정원의 보물을 찾고 있습니다...</h2>
            <p className="mt-2 text-stone-400">잠시만 기다려주세요 🌱</p>
          </motion.div>
        )}

        {view === 'ERROR' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen px-4 text-center"
          >
            <Leaf className="w-16 h-16 text-red-400 mb-6" />
            <h2 className="text-2xl font-bold mb-4 font-serif">{error}</h2>
            <button onClick={handleRetry} className="px-8 py-3 bg-stone-900 text-white rounded-full flex items-center gap-2 hover:bg-stone-800 transition-all shadow-lg">
              <RefreshCw size={18} /> 다시 시도하기
            </button>
            <button onClick={handleReset} className="mt-4 text-stone-500 hover:text-stone-800 underline underline-offset-4">메인으로 돌아가기</button>
          </motion.div>
        )}

        {view === 'RESULTS' && responseData && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen"
          >
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100 p-4">
              <div className="max-w-5xl mx-auto flex justify-between items-center">
                <button onClick={handleReset} className="flex items-center gap-2 font-serif font-bold text-xl text-emerald-800 hover:opacity-80 transition-opacity">
                  <Leaf className="text-emerald-600"/> 뭐 심지?
                </button>
                <button onClick={handleReset} className="p-2 text-stone-400 hover:text-stone-900 transition-colors">
                  <X size={28}/>
                </button>
              </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
              {responseData.type === 'list' ? (
                <>
                  <div className="text-center mb-16">
                    <span className="text-emerald-600 font-bold tracking-widest text-sm uppercase mb-2 block">Monthly Recommendations</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-stone-900">{currentQuery} 추천 꽃 TOP 10</h2>
                    <div className="w-24 h-1 bg-emerald-600 mx-auto mt-6 rounded-full"></div>
                  </div>
                  <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
                    {responseData.flowers.map((flower) => <FlowerCard key={`${flower.rank}-${flower.name}`} flower={flower} />)}
                  </div>
                </>
              ) : (
                <div className="max-w-3xl mx-auto">
                  <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-stone-100">
                    <div className="p-8 md:p-12 pb-0 text-center">
                      <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-2">{responseData.name} 가이드</h2>
                      <p className="text-stone-500 font-serif italic">전문 가드너가 알려주는 상세 관리법</p>
                    </div>
                    <div className="p-8 md:p-12 prose prose-stone max-w-none prose-headings:font-serif prose-headings:text-emerald-900 prose-strong:text-emerald-800 prose-li:marker:text-emerald-600 prose-img:rounded-2xl prose-img:shadow-md">
                      <ReactMarkdown
                        components={{
                          img: ({ node, ...props }) => (
                            <div className="my-8 first:mt-0">
                              <img 
                                {...props} 
                                referrerPolicy="no-referrer" 
                                className="w-full h-auto rounded-2xl shadow-md"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  // Remove the misleading picsum fallback
                                  target.style.display = 'none';
                                }}
                              />
                            </div>
                          )
                        }}
                      >
                        {responseData.content}
                      </ReactMarkdown>
                    </div>
                  </div>

                  <div className="mt-12 flex justify-center">
                    <button 
                      onClick={handleReset}
                      className="px-8 py-3 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
                    >
                      다른 식물 검색하기
                    </button>
                  </div>
                </div>
              )}

              <footer className="mt-20 text-center border-t border-stone-200 pt-12">
                <p className="text-stone-400 font-serif italic">“To plant a garden is to believe in tomorrow.”</p>
              </footer>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
