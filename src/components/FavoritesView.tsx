import React from 'react';
import { Bookmark, Sparkles, Trash2, ArrowLeft, Volume2 } from 'lucide-react';
import { PhraseItem, RecommendedResponse } from '../types';
import { PhraseCard } from './PhraseCard';

interface FavoritesViewProps {
  bookmarkedPhrases: PhraseItem[];
  onToggleBookmark: (phraseId: string) => void;
  onOpenPronunciationModal: (phrase: PhraseItem, responseAlternative?: RecommendedResponse) => void;
  onOpenBigDisplay: (phrase: PhraseItem, responseAlternative?: RecommendedResponse) => void;
  onGoBackToPlaces: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  bookmarkedPhrases,
  onToggleBookmark,
  onOpenPronunciationModal,
  onOpenBigDisplay,
  onGoBackToPlaces,
}) => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200">
        <div>
          <button
            onClick={onGoBackToPlaces}
            className="text-xs font-black uppercase tracking-wider text-gray-500 hover:text-[#1A1A1A] flex items-center gap-1.5 mb-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Mekan Seçimine Dön</span>
          </button>
          <h2 className="text-xl sm:text-2xl font-black text-[#1A1A1A] tracking-tight flex items-center gap-2.5">
            <Bookmark className="w-6 h-6 text-[#E63946] fill-[#E63946]" />
            <span>FAVORİ İFADELERİM ({bookmarkedPhrases.length})</span>
          </h2>
          <p className="text-xs sm:text-sm font-medium text-gray-500">
            Japonya seyahatinizde en çok ihtiyaç duyacağınız hızlı erişim listeniz
          </p>
        </div>
      </div>

      {/* Empty State or Phrases List */}
      {bookmarkedPhrases.length === 0 ? (
        <div className="p-12 text-center rounded-[32px] bg-white border border-gray-100 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-[24px] bg-red-50 border border-red-100 text-[#E63946] flex items-center justify-center mx-auto shadow-xs">
            <Bookmark className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-[#1A1A1A]">
              Henüz Kaydedilmiş İfade Yok
            </h3>
            <p className="text-xs sm:text-sm font-medium text-gray-500 max-w-md mx-auto">
              Mekanlar veya Genel İfadeler sekmesindeki cümlelerin yanındaki kaydet butonuna tıklayarak favorilerinize ekleyebilirsiniz.
            </p>
          </div>
          <button
            onClick={onGoBackToPlaces}
            className="px-6 py-3 bg-[#1A1A1A] hover:bg-black text-white rounded-2xl text-xs font-black transition-colors inline-flex items-center gap-2 shadow-lg shadow-black/10"
          >
            <Sparkles className="w-4 h-4 text-[#E63946]" />
            <span>İfadelere Göz At</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookmarkedPhrases.map((phrase) => (
            <PhraseCard
              key={phrase.id}
              phrase={phrase}
              isBookmarked={true}
              onToggleBookmark={onToggleBookmark}
              onOpenPronunciationModal={onOpenPronunciationModal}
              onOpenBigDisplay={onOpenBigDisplay}
            />
          ))}
        </div>
      )}

    </div>
  );
};
