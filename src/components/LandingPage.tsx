import React, { useState } from 'react';
import { Search, ArrowRight, Sparkles, Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onStart: (query: string) => void;
  onInstall?: () => void;
  canInstall?: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onInstall, canInstall }) => {
  const [query, setQuery] = useState('');
  const [bgLoaded, setBgLoaded] = useState(false);

  // Enhanced Pollinations AI URL for a more vibrant and "beautiful" background
  const bgImage = "https://image.pollinations.ai/prompt/dreamy%20and%20ethereal%20oil%20painting%20of%20a%20lush%20flower%20garden,%20vibrant%20and%20rich%20colors,%20thick%20impasto%20texture,%20glowing%20sunlight,%20magical%20atmosphere,%20masterpiece?width=1920&height=1080&nologo=true&seed=88";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(query);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-stone-950 text-white">
      
      {/* Background Image with Fade-in and Scale Effect */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-10 transition-opacity duration-1000 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`} />
        <motion.img 
          src={bgImage} 
          alt="Beautiful Flower Garden" 
          className="w-full h-full object-cover"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ 
            scale: bgLoaded ? 1 : 1.1, 
            opacity: bgLoaded ? 1 : 0 
          }}
          transition={{ duration: 2, ease: "easeOut" }}
          onLoad={() => setBgLoaded(true)}
        />
      </div>

      {/* Floating Sparkles / Light Orbs for Atmosphere */}
      {bgLoaded && (
        <div className="absolute inset-0 z-5 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%",
                opacity: 0 
              }}
              animate={{ 
                y: [null, "-20%"],
                opacity: [0, 0.6, 0]
              }}
              transition={{ 
                duration: Math.random() * 5 + 5, 
                repeat: Infinity, 
                ease: "linear",
                delay: Math.random() * 5
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      )}

      {/* Top Buttons: Install */}
      <div className="absolute top-6 right-6 z-30 flex items-center gap-3">
        {canInstall && onInstall && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onInstall}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/80 hover:bg-emerald-500 text-white rounded-full backdrop-blur-xl transition-all shadow-lg text-sm font-medium border border-emerald-400/30"
          >
            <Download size={16} />
            <span>앱 설치하기</span>
          </motion.button>
        )}
      </div>

      {/* Main Content Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-20 w-full max-w-3xl px-6"
      >
        <div className="backdrop-blur-2xl bg-black/20 border border-white/20 rounded-[3rem] p-10 md:p-16 shadow-2xl text-center">
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-bold uppercase tracking-[0.2em] mb-8"
          >
            <Sparkles size={14} className="text-yellow-300" />
            <span>AI Gardening Assistant</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-serif text-white tracking-tight leading-tight mb-6 drop-shadow-2xl">
            뭐 <span className="italic text-emerald-300">심지?</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-stone-100 font-light mb-12 leading-relaxed drop-shadow-lg">
            당신의 정원에 예술을 심어보세요.<br/>
            <span className="text-white/70 text-lg">계절별 추천 꽃부터 특정 식물 정보까지 찾아드립니다.</span>
          </p>

          <div className="w-full max-w-lg mx-auto">
            <form onSubmit={handleSubmit} className="relative group">
              <div className="relative flex items-center">
                <Search className="absolute left-6 text-white/60 w-6 h-6 group-focus-within:text-emerald-300 transition-colors" />
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="8월에 뭐 심지? 또는 수국, 튤립" 
                  className="w-full pl-16 pr-16 py-5 bg-white/10 backdrop-blur-md border border-white/30 rounded-full text-xl text-white placeholder:text-white/40 focus:outline-none focus:bg-white/20 focus:border-emerald-400/50 transition-all shadow-2xl"
                />
                <button 
                  type="submit"
                  className="absolute right-3 p-3 bg-white text-emerald-900 rounded-full hover:bg-emerald-300 transition-all shadow-xl active:scale-95"
                  aria-label="검색"
                >
                  <ArrowRight size={24} />
                </button>
              </div>
            </form>
          </div>
          
          <div className="mt-10 flex flex-wrap gap-4 justify-center text-sm font-medium">
            <button onClick={() => onStart("지금 심기 좋은 꽃")} className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 transition-all">#지금_심기_좋은</button>
            <button onClick={() => onStart("수국")} className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 transition-all">#수국</button>
            <button onClick={() => onStart("라벤더")} className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 transition-all">#라벤더</button>
            <button onClick={() => onStart("베란다 정원")} className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 transition-all">#베란다_정원</button>
          </div>
        </div>

        <footer className="mt-12 text-center text-white/30 text-[10px] font-bold tracking-[0.3em] uppercase">
          Designed for your beautiful garden life
        </footer>
      </motion.div>
    </div>
  );
};

export default LandingPage;
