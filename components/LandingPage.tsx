import React, { useState, useRef } from 'react';
import { Search, ArrowRight, Sparkles, Download, PlusSquare, Camera } from 'lucide-react';

interface LandingPageProps {
  onStart: (query: string) => void;
  onImageUpload: (file: File) => void;
  onInstall?: () => void;
  canInstall?: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onImageUpload, onInstall, canInstall }) => {
  const [query, setQuery] = useState('');
  const [bgLoaded, setBgLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bgImage = "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=1920";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(query);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-stone-100">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      
      {/* Background Image with sophisticated overlay */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10 transition-opacity duration-1000 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`} />
        <img 
          src={bgImage} 
          alt="Beautiful Garden Background" 
          className={`w-full h-full object-cover transition-all duration-2000 scale-105 ${bgLoaded ? 'opacity-100 scale-100' : 'opacity-0'}`}
          onLoad={() => setBgLoaded(true)}
        />
      </div>

      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 p-6 flex justify-between items-center animate-fade-in">
        <div className="flex items-center gap-2 text-white font-serif font-bold text-xl drop-shadow-md">
          <PlusSquare className="text-emerald-400" size={24} />
          <span>뭐심지?</span>
        </div>
        <div className="flex items-center gap-3">
          {canInstall && onInstall && (
            <button 
              onClick={onInstall}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full transition-all shadow-lg text-sm font-bold"
            >
              <Download size={16} />
              <span>앱 설치</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-20 w-full max-w-4xl px-6 flex flex-col items-center">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-100 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
            <Sparkles size={12} />
            <span>Smart Gardening Guide</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-serif text-white font-bold tracking-tight mb-6 drop-shadow-2xl">
            뭐 <span className="text-emerald-400 italic">심지?</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 font-medium max-w-lg mx-auto leading-relaxed drop-shadow-md">
            지금 당신의 정원에 가장 잘 어울리는<br/>
            아름다운 꽃들을 추천해 드립니다.
          </p>
        </div>

        <div className="w-full max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-[2.5rem] -m-1 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border-4 border-white/20">
              <Search className="absolute left-6 text-stone-400 w-6 h-6" />
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="심고 싶은 꽃이나 계절을 입력하세요" 
                className="w-full pl-16 pr-32 py-6 bg-transparent text-xl text-stone-900 placeholder:text-stone-400 focus:outline-none font-medium"
              />
              <div className="absolute right-3 flex items-center gap-2">
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-12 h-12 bg-stone-100 text-stone-600 rounded-full flex items-center justify-center hover:bg-stone-200 transition-all active:scale-95"
                  title="사진으로 꽃 찾기"
                >
                  <Camera size={20} />
                </button>
                <button 
                  type="submit"
                  className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
                  aria-label="검색"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </form>
          
          <div className="mt-8 flex flex-wrap gap-2 justify-center">
            {["3월 추천", "베란다 꽃", "수국", "튤립", "초보자용"].map((tag) => (
              <button 
                key={tag}
                onClick={() => onStart(tag)} 
                className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium backdrop-blur-md transition-all hover:-translate-y-0.5"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-12 left-0 right-0 text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold">
            Curated by AI Gardening Assistant
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
