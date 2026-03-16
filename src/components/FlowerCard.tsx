import React, { useState } from 'react';
import { Flower } from '../types';
import { AlertCircle, Calendar, Info, Sprout, Loader2, Star } from 'lucide-react';

interface FlowerCardProps {
  flower: Flower;
}

const FlowerCard: React.FC<FlowerCardProps> = ({ flower }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const searchName = flower.englishName || flower.name;
  const imageUrl = `https://image.pollinations.ai/prompt/a%20clear%20and%20detailed%20close-up%20botanical%20photography%20of%20a%20real%20${encodeURIComponent(searchName)}%20flower,%20vibrant%20colors,%20natural%20outdoor%20garden%20setting,%20high%20resolution,%20sharp%20focus?width=800&height=600&nologo=true&seed=${encodeURIComponent(searchName)}`;

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-stone-100 group transition-all hover:shadow-xl hover:-translate-y-1">
      {/* Header */}
      <div className="p-8 pb-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-3xl font-bold font-serif text-stone-900 group-hover:text-emerald-800 transition-colors">{flower.name}</h3>
          <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">TOP {flower.rank}</div>
        </div>
        <p className="text-stone-500 font-medium flex items-center gap-2">
          <Calendar size={16} className="text-emerald-600"/> 
          <span className="text-emerald-900 font-bold">{flower.bloomingPeriod}</span> 개화
        </p>
      </div>

      {/* Image Section */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-50">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-50 z-10">
            <Loader2 className="w-10 h-10 text-emerald-200 animate-spin" />
          </div>
        )}
        <img 
          src={imageUrl} 
          alt={flower.name} 
          className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            setImageLoaded(true);
          }}
        />
      </div>
      
      {/* Content Section */}
      <div className="p-8 space-y-8">
        {/* Planting Period */}
        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0 shadow-sm">
            <Sprout size={20} className="text-emerald-600"/>
          </div>
          <div>
            <p className="text-[10px] text-emerald-600 uppercase font-black tracking-[0.2em] mb-1">묘종 시기</p>
            <p className="text-stone-800 font-medium text-lg">{flower.plantingPeriod}</p>
          </div>
        </div>
        
        {/* Characteristics */}
        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0 shadow-sm">
            <Info size={20} className="text-emerald-600"/>
          </div>
          <div>
            <p className="text-[10px] text-emerald-600 uppercase font-black tracking-[0.2em] mb-1">꽃의 특징</p>
            <p className="text-stone-700 leading-relaxed">{flower.characteristics}</p>
          </div>
        </div>
        
        {/* Caution */}
        <div className="bg-amber-50/50 p-6 rounded-3xl flex gap-4 items-start border border-amber-100/50">
          <AlertCircle size={22} className="text-amber-600 shrink-0 mt-0.5"/>
          <div>
            <p className="text-[10px] text-amber-700 uppercase font-black tracking-[0.2em] mb-1">주의사항</p>
            <p className="text-stone-800 leading-relaxed font-medium">{flower.caution}</p>
          </div>
        </div>

        {/* Related Varieties */}
        {flower.relatedFlowers && flower.relatedFlowers.length > 0 && (
          <div className="pt-4">
            <p className="text-[10px] text-stone-400 uppercase font-black tracking-[0.2em] mb-4 flex items-center gap-2">
              <Star size={12} className="text-amber-400 fill-amber-400"/> 관련 인기종 TOP 5 및 소개
            </p>
            <div className="space-y-3">
              {flower.relatedFlowers.slice(0, 5).map((variant, idx) => (
                <div 
                  key={idx} 
                  className="p-4 bg-stone-50 rounded-2xl border border-stone-100 hover:bg-emerald-50 hover:border-emerald-100 transition-all group/item"
                >
                  <p className="font-bold text-stone-900 group-hover/item:text-emerald-800 transition-colors mb-1">{variant.name}</p>
                  <p className="text-sm text-stone-600 leading-relaxed">{variant.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowerCard;
