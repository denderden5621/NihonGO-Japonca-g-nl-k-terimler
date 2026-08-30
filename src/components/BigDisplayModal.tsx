import React, { useState } from 'react';
import { X, Volume2, Sparkles, Smartphone, Check } from 'lucide-react';
import { PhraseItem, RecommendedResponse } from '../types';
import { playJapaneseAudio } from '../utils/audio';

interface BigDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  phrase: PhraseItem | null;
  responseAlternative?: RecommendedResponse;
}

export const BigDisplayModal: React.FC<BigDisplayModalProps> = ({
  isOpen,
  onClose,
  phrase,
  responseAlternative,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen || !phrase) return null;

  const targetJapanese = responseAlternative ? responseAlternative.japanese : phrase.japanese;
  const targetRomaji = responseAlternative ? responseAlternative.romaji : phrase.romaji;
  const targetTurkish = responseAlternative ? responseAlternative.turkish : phrase.turkish;

  const handlePlayAudio = async () => {
    setIsPlaying(true);
    await playJapaneseAudio(targetJapanese, 0.95);
    setIsPlaying(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        id="big-display-modal-card"
        className="relative w-full max-w-2xl bg-white rounded-[36px] shadow-2xl border-4 border-[#1A1A1A] overflow-hidden flex flex-col justify-between min-h-[480px] p-6 sm:p-10"
      >
        
        {/* Top bar with helper info & close */}
        <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-red-50 text-[#E63946] border border-red-100 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              Görevliye Gösterim Ekranı
            </span>
          </div>
          <button
            id="close-big-display-btn"
            onClick={onClose}
            className="p-2 rounded-2xl bg-gray-100 text-[#1A1A1A] hover:bg-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Center: Massive Japanese text for clear readability */}
        <div className="my-auto text-center space-y-6 py-6">
          
          <div className="space-y-3">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest block">
              JAPONYA'DA GÖSTERİN (JAPANESE)
            </span>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#1A1A1A] font-['Noto_Sans_JP'] tracking-tight leading-tight">
              {targetJapanese}
            </h1>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 inline-block max-w-lg">
            <p className="text-xl sm:text-2xl font-black text-[#E63946] tracking-wide">
              {targetRomaji}
            </p>
            <p className="text-base font-bold text-[#1A1A1A] mt-1">
              🇹🇷 "{targetTurkish}"
            </p>
          </div>

        </div>

        {/* Bottom Audio speak action & close button */}
        <div className="pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-gray-400 text-center sm:text-left">
            Telefonunuzu çalışan veya şoföre doğrudan çevirip gösterebilirsiniz.
          </p>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              id="big-display-audio-btn"
              onClick={handlePlayAudio}
              disabled={isPlaying}
              className={`flex-1 sm:flex-none px-6 py-3.5 rounded-2xl text-sm font-black text-white shadow-xl flex items-center justify-center gap-2 transition-all ${
                isPlaying
                  ? 'bg-[#E63946] animate-pulse'
                  : 'bg-[#E63946] hover:bg-red-700 shadow-red-200 active:scale-95'
              }`}
            >
              <Volume2 className="w-5 h-5" />
              <span>Sesli Oku (Japonca)</span>
            </button>

            <button
              onClick={onClose}
              className="px-6 py-3.5 bg-[#1A1A1A] hover:bg-black text-white rounded-2xl text-sm font-black transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
