import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Mic, 
  Maximize2, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare,
  Volume1
} from 'lucide-react';
import { PhraseItem, RecommendedResponse } from '../types';
import { playJapaneseAudio } from '../utils/audio';

interface PhraseCardProps {
  phrase: PhraseItem;
  isBookmarked: boolean;
  onToggleBookmark: (phraseId: string) => void;
  onOpenPronunciationModal: (phrase: PhraseItem, responseAlternative?: RecommendedResponse) => void;
  onOpenBigDisplay: (phrase: PhraseItem, responseAlternative?: RecommendedResponse) => void;
}

export const PhraseCard: React.FC<PhraseCardProps> = ({
  phrase,
  isBookmarked,
  onToggleBookmark,
  onOpenPronunciationModal,
  onOpenBigDisplay,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingResponseId, setPlayingResponseId] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.95);
  const [isDialogueExpanded, setIsDialogueExpanded] = useState(true);

  const handlePlayAudio = async (text: string, isResponse: boolean = false, responseId?: string) => {
    try {
      if (isResponse && responseId) {
        setPlayingResponseId(responseId);
      } else {
        setIsPlaying(true);
      }
      await playJapaneseAudio(text, playbackSpeed);
    } finally {
      setIsPlaying(false);
      setPlayingResponseId(null);
    }
  };

  return (
    <div 
      id={`phrase-card-${phrase.id}`}
      className="bg-white rounded-[28px] border border-[#EEEEEE] shadow-sm hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col justify-between"
    >
      {/* Card Header: Situation & Action Badges */}
      <div className="px-6 pt-5 pb-3.5 border-b border-gray-100 flex items-center justify-between gap-2 bg-gray-50/50">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-xl bg-gray-200/80 text-[#1A1A1A]">
            {phrase.situation}
          </span>
          {phrase.isEssential && (
            <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xl bg-red-50 text-[#E63946] border border-red-100 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#E63946]" />
              Sık Kullanılır
            </span>
          )}
          {phrase.type === 'dialogue' && (
            <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-slate-600" />
              Diyalog
            </span>
          )}
        </div>

        {/* Bookmark & Big Screen Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id={`big-display-btn-${phrase.id}`}
            onClick={() => onOpenBigDisplay(phrase)}
            title="Ekranda Büyük Göster (Kasiyere / Şoföre Göstermek İçin)"
            className="p-2 rounded-xl text-gray-400 hover:text-[#1A1A1A] hover:bg-gray-100 transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            id={`bookmark-btn-${phrase.id}`}
            onClick={() => onToggleBookmark(phrase.id)}
            title={isBookmarked ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
            className={`p-2 rounded-xl transition-colors ${
              isBookmarked
                ? 'text-[#E63946] bg-red-50 hover:bg-red-100'
                : 'text-gray-400 hover:text-[#1A1A1A] hover:bg-gray-100'
            }`}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 fill-[#E63946] text-[#E63946]" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 space-y-4">
        
        {/* Japanese Native Text (Kanji / Katakana / Hiragana) */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] font-['Noto_Sans_JP'] tracking-tight leading-snug">
              {phrase.japanese}
            </h3>

            {/* Quick Audio Play Button */}
            <button
              id={`play-audio-btn-${phrase.id}`}
              onClick={() => handlePlayAudio(phrase.japanese)}
              disabled={isPlaying}
              className={`p-3.5 rounded-2xl text-white font-medium flex items-center justify-center shrink-0 transition-all ${
                isPlaying
                  ? 'bg-[#E63946] animate-pulse ring-4 ring-red-100'
                  : 'bg-[#E63946] hover:bg-red-700 shadow-lg shadow-red-200 active:scale-95'
              }`}
              title="Japonca Sesli Telaffuzu Dinle"
            >
              {isPlaying ? <Volume1 className="w-5 h-5 animate-bounce" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Romaji (Latin Alphabet) */}
          <div className="mt-1.5 text-base font-bold text-[#E63946] tracking-wide">
            {phrase.romaji}
          </div>
        </div>

        {/* Turkish Meaning & Turkish Phonetic Reading Guide */}
        <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-2.5">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-0.5">
              Türkçe Anlamı
            </span>
            <p className="text-base sm:text-lg font-black text-[#1A1A1A] leading-snug tracking-tight">
              {phrase.turkish}
            </p>
          </div>

          <div className="pt-2 border-t border-gray-200/60">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-800/80 block mb-1">
              Türkçe Okunuş Rehberi
            </span>
            <p className="text-xs sm:text-sm font-bold text-amber-950 font-mono tracking-tight bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/70 inline-block">
              🗣️ "{phrase.turkishPronunciation}"
            </p>
          </div>
        </div>

        {/* Clerk Question & Recommended Responses Dialogue Section */}
        {phrase.recommendedResponses && phrase.recommendedResponses.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-gray-50/40 p-4 space-y-3">
            <div 
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => setIsDialogueExpanded(!isDialogueExpanded)}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E63946]" />
                <span className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider">
                  Verebileceğiniz Yanıtlar ({phrase.recommendedResponses.length})
                </span>
              </div>
              <button className="text-gray-500 hover:text-black text-xs font-bold flex items-center gap-0.5">
                {isDialogueExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {isDialogueExpanded && (
              <div className="space-y-2.5 pt-1">
                {phrase.recommendedResponses.map((resp) => {
                  const isRespPlaying = playingResponseId === resp.id;

                  return (
                    <div 
                      key={resp.id}
                      className="p-3.5 bg-white rounded-xl border border-gray-100 shadow-2xs hover:border-gray-300 transition-colors space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-black text-[#1A1A1A] font-['Noto_Sans_JP']">
                            {resp.japanese}
                          </p>
                          <p className="text-xs font-bold text-[#E63946]">
                            {resp.romaji}
                          </p>
                        </div>

                        {/* Action buttons for response */}
                        <div className="flex items-center gap-1">
                          <button
                            id={`play-resp-${resp.id}`}
                            onClick={() => handlePlayAudio(resp.japanese, true, resp.id)}
                            disabled={isRespPlaying}
                            className={`p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors ${
                              isRespPlaying ? 'bg-red-50 text-[#E63946] animate-pulse' : ''
                            }`}
                            title="Yanıtı Dinle"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <button
                            id={`practice-resp-${resp.id}`}
                            onClick={() => onOpenPronunciationModal(phrase, resp)}
                            className="p-2 rounded-xl text-[#1A1A1A] hover:bg-gray-100 transition-colors"
                            title="Bu Yanıtın Telaffuzunu Test Et"
                          >
                            <Mic className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1 pt-1.5 border-t border-gray-100">
                        <span className="font-bold text-[#1A1A1A]">
                          👉 {resp.turkish}
                        </span>
                        <span className="font-mono text-gray-500 text-[11px] font-semibold">
                          ({resp.turkishPronunciation})
                        </span>
                      </div>
                      {resp.notes && (
                        <p className="text-[11px] text-gray-500 font-medium italic">
                          💡 {resp.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Cultural / Etiquette Note */}
        {phrase.culturalNotes && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-900">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">
              <strong className="font-black text-amber-950">Gezgin İpucu:</strong> {phrase.culturalNotes}
            </p>
          </div>
        )}

      </div>

      {/* Card Footer: Speed control & AI Pronunciation Tester */}
      <div className="p-4 sm:p-5 bg-gray-50/80 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
        
        {/* Speed Selector */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-gray-400 font-bold uppercase text-[10px] hidden sm:inline">Hız:</span>
          <button
            onClick={() => setPlaybackSpeed(0.8)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-colors ${
              playbackSpeed === 0.8 
                ? 'bg-[#1A1A1A] text-white shadow-xs' 
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
            title="Yavaş Telaffuz (Öğrenme modu)"
          >
            0.8x Yavaş
          </button>
          <button
            onClick={() => setPlaybackSpeed(0.95)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-colors ${
              playbackSpeed === 0.95 
                ? 'bg-[#1A1A1A] text-white shadow-xs' 
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
            title="Normal Telaffuz"
          >
            1.0x Normal
          </button>
        </div>

        {/* AI Pronunciation Test Button */}
        <button
          id={`ai-test-btn-${phrase.id}`}
          onClick={() => onOpenPronunciationModal(phrase)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black bg-[#1A1A1A] hover:bg-black text-white shadow-lg shadow-black/10 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Mic className="w-4 h-4 text-rose-400" />
          <span>Telaffuzumu Değerlendir (AI)</span>
        </button>

      </div>
    </div>
  );
};
