import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, Sparkles, Download, HelpCircle, X, Share, MoreVertical, PlusSquare } from 'lucide-react';

interface LandingPageProps {
  onStart: (query: string) => void;
  onInstall?: () => void;
  canInstall?: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onInstall, canInstall }) => {
  const [query, setQuery] = useState('');
  const [bgLoaded, setBgLoaded] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // Pollinations AI URL for a consistent oil painting style background
  const bgImage = "https://image.pollinations.ai/prompt/oil%20painting%20style%20landscape%20of%20a%20mysterious%20and%20beautiful%20flower%20garden,%20claude%20monet%20style,%20impressionism,%20thick%20brush%20strokes,%20soft%20pastel%20colors,%20warm%20sunlight,%20masterpiece?width=1920&height=1080&nologo=true&seed=42";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(query);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-stone-900">
      
      {/* Background Image with Fade-in Effect */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 bg-black/40 z-10 transition-opacity duration-1000 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`} />
        <img 
          src={bgImage} 
          alt="Oil Painting Background" 
          className={`w-full h-full object-cover transition-all duration-2000 scale-105 ${bgLoaded ? 'opacity-100 scale-100' : 'opacity-0'}`}
          onLoad={() => setBgLoaded(true)}
        />
      </div>

      {/* Top Buttons: Install & Guide */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-3 animate-fade-in-up">
        <button 
          onClick={() => setShowGuide(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md transition-all shadow-lg text-sm font-medium border border-white/30"
        >
          <HelpCircle size={16} />
          <span>설치 방법</span>
        </button>

        {canInstall && onInstall && (
          <button 
            onClick={onInstall}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded-full backdrop-blur-md transition-all shadow-lg text-sm font-medium border border-emerald-400/30"
          >
            <Download size={16} />
            <span>앱 설치하기</span>
          </button>
        )}
      </div>

      {/* Installation Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
            <button 
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="text-center mb-6">
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">어린이 정원사를 위한 팁</span>
              <h3 className="text-2xl font-serif font-bold text-stone-800 mt-3">앱 설치하는 방법 📱</h3>
              <p className="text-stone-500 text-sm mt-2">
                이 앱은 앱스토어가 아니라 <br/>지금 보고 있는 화면에서 바로 설치할 수 있어요!
              </p>
            </div>

            <div className="space-y-4">
              {/* iPhone Guide */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-stone-800 text-sm">아이폰 (iPhone)</span>
                </div>
                <ol className="text-sm text-stone-600 space-y-2 list-decimal list-inside">
                  <li>사파리(Safari) 화면 아래의 <Share size={14} className="inline mx-1 text-blue-500"/> <strong>공유 버튼</strong>을 눌러주세요.</li>
                  <li>메뉴를 위로 올려서 <PlusSquare size={14} className="inline mx-1 text-stone-800"/> <strong>'홈 화면에 추가'</strong>를 찾아 눌러보세요.</li>
                </ol>
              </div>

              {/* Android Guide */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-stone-800 text-sm">갤럭시 / 안드로이드</span>
                </div>
                <ol className="text-sm text-stone-600 space-y-2 list-decimal list-inside">
                  <li>화면 오른쪽 위의 <MoreVertical size={14} className="inline mx-1 text-stone-800"/> <strong>점 3개 버튼</strong>을 눌러주세요.</li>
                  <li><strong>'앱 설치'</strong> 또는 <strong>'홈 화면에 추가'</strong> 버튼을 누르면 끝!</li>
                </ol>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button 
                onClick={() => setShowGuide(false)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors"
              >
                알겠어요! 🌱
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Card */}
      <div className="relative z-20 w-full max-w-3xl px-6">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl text-center animate-fade-in-up">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white/90 text-sm font-medium mb-6 backdrop-blur-sm">
            <Sparkles size={14} className="text-yellow-200" />
            <span className="tracking-wide">AI Gardening Assistant</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif text-white tracking-tight leading-tight mb-4 drop-shadow-lg">
            뭐 <span className="italic text-emerald-300">심지?</span>
          </h1>
          
          <p className="text-lg md:text-xl text-stone-200 font-light mb-10 leading-relaxed drop-shadow-md">
            당신의 정원에 예술을 심어보세요.<br/>
            계절별 추천 꽃부터 특정 식물 정보까지 찾아드립니다.
          </p>

          <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto relative group mb-8">
            <div className="relative flex items-center">
              <Search className="absolute left-5 text-white/60 w-5 h-5 group-focus-within:text-emerald-300 transition-colors" />
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="뭐 심지? 또는 수국, 튤립" 
                className="w-full pl-14 pr-14 py-4 bg-black/20 backdrop-blur-md border border-white/30 rounded-full text-lg text-white placeholder:text-white/50 focus:outline-none focus:bg-black/40 focus:border-emerald-400/50 transition-all shadow-inner"
              />
              <button 
                type="submit"
                className="absolute right-2 p-2.5 bg-white text-emerald-900 rounded-full hover:bg-emerald-300 transition-colors shadow-lg"
                aria-label="검색"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </form>
          
          <div className="flex flex-wrap gap-3 justify-center text-sm text-white/70">
            <button onClick={() => onStart("뭐 심지?")} className="hover:text-white hover:underline decoration-emerald-400 underline-offset-4 transition-all">#뭐_심지?</button>
            <span className="text-white/20">|</span>
            <button onClick={() => onStart("수국")} className="hover:text-white hover:underline decoration-emerald-400 underline-offset-4 transition-all">#수국</button>
            <span className="text-white/20">|</span>
            <button onClick={() => onStart("라벤더")} className="hover:text-white hover:underline decoration-emerald-400 underline-offset-4 transition-all">#라벤더</button>
            <span className="text-white/20">|</span>
            <button onClick={() => onStart("베란다 정원")} className="hover:text-white hover:underline decoration-emerald-400 underline-offset-4 transition-all">#베란다_정원</button>
          </div>
        </div>

        <footer className="mt-8 text-center text-white/40 text-xs font-light tracking-widest">
          DESIGNED FOR YOUR BEAUTIFUL GARDEN LIFE
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;