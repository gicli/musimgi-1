import React, { useState } from 'react';
import { Flower } from '../types';
import { ChevronDown, ChevronUp, AlertCircle, Calendar, Info, Sprout, Image as ImageIcon, MousePointerClick } from 'lucide-react';

interface FlowerCardProps {
  flower: Flower;
  isSingleView?: boolean;
}

const FlowerCard: React.FC<FlowerCardProps> = ({ flower, isSingleView = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Use Pollinations AI for dynamic image generation based on the specific flower name.
  // We use the English name for better accuracy, fallback to Korean name.
  const searchName = flower.englishName || flower.name;
  // Construct a prompt that asks for a high-quality botanical photo
  const imageUrl = `https://image.pollinations.ai/prompt/close%20up%20photo%20of%20${encodeURIComponent(searchName)}%20flower%20blooming%20in%20a%20garden,%20natural%20sunlight,%20highly%20detailed,%20botanical%20photography,%208k?width=800&height=600&nologo=true&seed=${flower.rank + 100}`;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-stone-100">
      <div className="relative h-64 overflow-hidden group cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        
        {/* Loading Skeleton */}
        <div className={`absolute inset-0 bg-stone-200 animate-pulse flex items-center justify-center transition-opacity duration-500 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}>
           <ImageIcon className="text-stone-300 w-12 h-12" />
        </div>

        <img 
          src={imageUrl} 
          alt={flower.name} 
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {/* Badge Logic: Show Rank if list, Show Instruction if single view */}
        {!isSingleView ? (
          <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
            TOP {flower.rank}
          </div>
        ) : (
          !isExpanded && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center animate-pulse">
              <div className="bg-black/30 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                <MousePointerClick size={16} />
                <span className="text-sm font-medium">카드를 눌러 상세정보 보기</span>
              </div>
            </div>
          )
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90" />
        
        <div className="absolute bottom-4 left-4 text-white z-10">
          <h3 className="text-3xl font-bold font-serif mb-1">{flower.name}</h3>
          <p className="text-stone-200 text-xs italic opacity-80 mb-1">{flower.englishName}</p>
          <p className="text-stone-200 text-sm flex items-center gap-1">
            <Calendar size={14} /> 개화: {flower.bloomingPeriod}
          </p>
        </div>
        
        <button 
          className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-md p-2 rounded-full text-white transition-colors z-10"
        >
          {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>
      </div>
      
      <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 space-y-4 text-stone-700">
          
          <div className="flex items-start gap-3">
            <Sprout className="text-emerald-600 mt-1 shrink-0" size={20} />
            <div>
              <span className="block text-sm font-semibold text-emerald-800 uppercase tracking-wider">묘종/파종 시기</span>
              <p className="text-stone-800">{flower.plantingPeriod}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Info className="text-emerald-600 mt-1 shrink-0" size={20} />
            <div>
              <span className="block text-sm font-semibold text-emerald-800 uppercase tracking-wider">특징</span>
              <p className="text-stone-600 leading-relaxed">{flower.characteristics}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-amber-50 p-3 rounded-lg border border-amber-100">
            <AlertCircle className="text-amber-600 mt-1 shrink-0" size={20} />
            <div>
              <span className="block text-sm font-semibold text-amber-800 uppercase tracking-wider">주의사항</span>
              <p className="text-stone-600 text-sm">{flower.caution}</p>
            </div>
          </div>

          <div className="pt-2">
            <span className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">인기 품종 순위</span>
            <div className="flex flex-wrap gap-2">
              {flower.relatedFlowers.map((related, idx) => (
                <span key={idx} className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-default">
                  {idx + 1}. {related}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FlowerCard;