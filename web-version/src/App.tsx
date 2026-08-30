import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Bot, 
  Bookmark, 
  BookOpen, 
  GraduationCap, 
  Search, 
  Info, 
  CheckCircle2, 
  MessageSquare, 
  Flame, 
  ChevronRight,
  ShieldCheck,
  Compass,
  ArrowRight
} from 'lucide-react';
import { CategoryId, PhraseItem, RecommendedResponse } from './types';
import { LOCATION_CATEGORIES } from './data/categories';
import { PHRASES_DATA } from './data/phrases';
import { getSavedBookmarks, toggleBookmark } from './utils/storage';

// Components
import { Navbar } from './components/Navbar';
import { CategorySelector } from './components/CategorySelector';
import { PhraseCard } from './components/PhraseCard';
import { PronunciationModal } from './components/PronunciationModal';
import { BigDisplayModal } from './components/BigDisplayModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { EtiquetteGuideModal } from './components/EtiquetteGuideModal';
import { PracticeModeModal } from './components/PracticeModeModal';
import { FavoritesView } from './components/FavoritesView';
import { PracticeView } from './components/PracticeView';
import { EtiquetteView } from './components/EtiquetteView';

export default function App() {
  // Navigation & Category States
  const [activeTab, setActiveTab] = useState<'places' | 'favorites' | 'practice' | 'etiquette'>('places');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('konbini');
  const [filterType, setFilterType] = useState<'all' | 'essential' | 'dialogue'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Storage States
  const [bookmarks, setBookmarks] = useState<string[]>(() => getSavedBookmarks());

  // Modal States
  const [pronunciationTarget, setPronunciationTarget] = useState<{
    phrase: PhraseItem | null;
    responseAlternative?: RecommendedResponse;
  }>({ phrase: null });
  const [isPronunciationModalOpen, setIsPronunciationModalOpen] = useState(false);

  const [bigDisplayTarget, setBigDisplayTarget] = useState<{
    phrase: PhraseItem | null;
    responseAlternative?: RecommendedResponse;
  }>({ phrase: null });
  const [isBigDisplayOpen, setIsBigDisplayOpen] = useState(false);

  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isEtiquetteModalOpen, setIsEtiquetteModalOpen] = useState(false);
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);

  // Bookmark Toggle Handler
  const handleToggleBookmark = (phraseId: string) => {
    const updated = toggleBookmark(phraseId);
    setBookmarks(updated);
  };

  // Modal Opener Handlers
  const handleOpenPronunciationModal = (phrase: PhraseItem, responseAlternative?: RecommendedResponse) => {
    setPronunciationTarget({ phrase, responseAlternative });
    setIsPronunciationModalOpen(true);
  };

  const handleOpenBigDisplay = (phrase: PhraseItem, responseAlternative?: RecommendedResponse) => {
    setBigDisplayTarget({ phrase, responseAlternative });
    setIsBigDisplayOpen(true);
  };

  // Phrase Counts Per Category Map
  const phraseCounts = useMemo(() => {
    const counts: Record<CategoryId, number> = {} as any;
    LOCATION_CATEGORIES.forEach((cat) => {
      counts[cat.id] = PHRASES_DATA.filter((p) => p.categoryId === cat.id).length;
    });
    return counts;
  }, []);

  // Filtered Phrases
  const filteredPhrases = useMemo(() => {
    let list = PHRASES_DATA;

    // Search Query (Turkish, Japanese, Romaji, Pronunciation, Situation)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return list.filter(
        (p) =>
          p.turkish.toLowerCase().includes(q) ||
          p.romaji.toLowerCase().includes(q) ||
          p.japanese.toLowerCase().includes(q) ||
          p.turkishPronunciation.toLowerCase().includes(q) ||
          p.situation.toLowerCase().includes(q) ||
          (p.culturalNotes && p.culturalNotes.toLowerCase().includes(q))
      );
    }

    // Filter by selected category when not searching
    list = list.filter((p) => p.categoryId === selectedCategory);

    // Sub-filters
    if (filterType === 'essential') {
      list = list.filter((p) => p.isEssential);
    } else if (filterType === 'dialogue') {
      list = list.filter((p) => p.type === 'dialogue');
    }

    return list;
  }, [selectedCategory, filterType, searchQuery]);

  // Bookmarked items list
  const bookmarkedPhrases = useMemo(() => {
    return PHRASES_DATA.filter((p) => bookmarks.includes(p.id));
  }, [bookmarks]);

  // Active Category Details
  const currentCategoryData = useMemo(() => {
    return LOCATION_CATEGORIES.find((c) => c.id === selectedCategory) || LOCATION_CATEGORIES[0];
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#1A1A1A] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        bookmarksCount={bookmarks.length}
        openAIAssistant={() => setIsAIAssistantOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 pb-28 md:pb-8 space-y-6">
        
        {/* VIEW 1: FAVORITES VIEW */}
        {activeTab === 'favorites' && (
          <FavoritesView
            bookmarkedPhrases={bookmarkedPhrases}
            onToggleBookmark={handleToggleBookmark}
            onOpenPronunciationModal={handleOpenPronunciationModal}
            onOpenBigDisplay={handleOpenBigDisplay}
            onGoBackToPlaces={() => setActiveTab('places')}
          />
        )}

        {/* VIEW 2: PRACTICE & QUIZ VIEW */}
        {activeTab === 'practice' && (
          <PracticeView
            onOpenPronunciationModal={handleOpenPronunciationModal}
            onGoBackToPlaces={() => setActiveTab('places')}
          />
        )}

        {/* VIEW 3: ETIQUETTE & MANNER GUIDE VIEW */}
        {activeTab === 'etiquette' && (
          <EtiquetteView
            onGoBackToPlaces={() => setActiveTab('places')}
          />
        )}

        {/* VIEW 4: PLACES / SEARCH DASHBOARD */}
        {activeTab === 'places' && (
          <div className="space-y-6">
            
            {/* If searching, show search status */}
            {searchQuery.trim() ? (
              <div className="p-5 rounded-[24px] bg-white border border-gray-100 shadow-sm flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                    Arama Sonuçları
                  </span>
                  <h2 className="text-xl font-black text-[#1A1A1A] tracking-tight">
                    "{searchQuery}" için {filteredPhrases.length} sonuç bulundu
                  </h2>
                </div>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-black text-[#1A1A1A] transition-colors"
                >
                  Aramayı Temizle
                </button>
              </div>
            ) : (
              /* Place Selection Category Grid */
              <CategorySelector
                selectedCategory={selectedCategory}
                onSelectCategory={(id) => {
                  setSelectedCategory(id);
                  setFilterType('all');
                }}
                phraseCounts={phraseCounts}
              />
            )}

            {/* Active Place Header & Travel Banner */}
            {!searchQuery.trim() && (
              <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-gray-100 shadow-sm space-y-5 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-black px-3 py-1 rounded-full bg-red-50 text-[#E63946] border border-red-100 tracking-wider">
                        {currentCategoryData.japaneseName}
                      </span>
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                        {filteredPhrases.length} İfade & Diyalog
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black text-[#1A1A1A] tracking-tight">
                      {currentCategoryData.name.toUpperCase()}
                    </h1>
                    <p className="text-xs sm:text-sm font-medium text-gray-500 mt-1 max-w-2xl">
                      {currentCategoryData.tagline} — {currentCategoryData.description}
                    </p>
                  </div>

                  {/* Practice & Etiquette Quick Triggers */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      id="practice-place-phrases-btn"
                      onClick={() => setIsPracticeModalOpen(true)}
                      className="px-5 py-3 rounded-2xl bg-[#1A1A1A] hover:bg-black text-white text-xs font-black shadow-lg shadow-black/10 flex items-center gap-2 transition-all active:scale-95"
                    >
                      <GraduationCap className="w-4 h-4 text-[#E63946]" />
                      <span>Bu Mekanı Test Et</span>
                    </button>
                    <button
                      onClick={() => setIsEtiquetteModalOpen(true)}
                      className="p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-[#1A1A1A] text-xs font-bold transition-colors"
                      title="Görgü Kurallarını Oku"
                    >
                      <BookOpen className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Important Etiquette Tip for this place */}
                {currentCategoryData.etiquetteTips && currentCategoryData.etiquetteTips.length > 0 && (
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs text-[#1A1A1A] flex items-start gap-3">
                    <Info className="w-4 h-4 text-[#E63946] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-black uppercase tracking-widest text-[10px] text-[#E63946] block">
                        Mekan İpucu & Adabı:
                      </span>
                      <p className="leading-relaxed font-medium text-gray-700">
                        {currentCategoryData.etiquetteTips[0]}
                      </p>
                    </div>
                  </div>
                )}

                {/* Filter Chips Bar */}
                <div className="pt-2 border-t border-gray-100 flex items-center gap-2 overflow-x-auto">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-colors ${
                      filterType === 'all'
                        ? 'bg-[#1A1A1A] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Tüm Cümleler ({phraseCounts[selectedCategory]})
                  </button>
                  <button
                    onClick={() => setFilterType('essential')}
                    className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      filterType === 'essential'
                        ? 'bg-[#E63946] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>En Sık Kullanılanlar</span>
                  </button>
                  <button
                    onClick={() => setFilterType('dialogue')}
                    className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      filterType === 'dialogue'
                        ? 'bg-[#1A1A1A] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Soru & Cevap Diyalogları</span>
                  </button>
                </div>
              </div>
            )}

            {/* Phrases Grid List */}
            {filteredPhrases.length === 0 ? (
              <div className="p-12 text-center rounded-[32px] bg-white border border-gray-100 space-y-4">
                <p className="text-base font-black text-[#1A1A1A]">
                  Aradığınız kriterde bir ifade bulunamadı.
                </p>
                <p className="text-xs font-medium text-gray-500">
                  Arama teriminizi değiştirebilir veya Yapay Zeka Asistanına doğrudan sorabilirsiniz.
                </p>
                <button
                  onClick={() => setIsAIAssistantOpen(true)}
                  className="px-5 py-2.5 bg-[#E63946] hover:bg-red-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-red-200 inline-flex items-center gap-2"
                >
                  <Bot className="w-4 h-4" />
                  <span>Yapay Zekaya Sor</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPhrases.map((phrase) => (
                  <PhraseCard
                    key={phrase.id}
                    phrase={phrase}
                    isBookmarked={bookmarks.includes(phrase.id)}
                    onToggleBookmark={handleToggleBookmark}
                    onOpenPronunciationModal={handleOpenPronunciationModal}
                    onOpenBigDisplay={handleOpenBigDisplay}
                  />
                ))}
              </div>
            )}

          </div>
        )}

      </main>

      {/* Persistent Bottom Assistant Quick Bar */}
      <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 py-3 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-red-50 border border-red-100 text-[#E63946] flex items-center justify-center font-black text-xs shrink-0">
              AI
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-black text-[#1A1A1A] tracking-tight">Japonya Gezi Asistanı & Canlı Rol Yapma</p>
              <p className="text-[11px] font-medium text-gray-500">Kasiyere veya garsona ne diyeceğinizi bilmiyorsanız hemen danışın</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="bottom-bar-etiquette-btn"
              onClick={() => setIsEtiquetteModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-[#1A1A1A] text-xs font-black transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-gray-700" />
              <span className="hidden md:inline">Görgü Kuralları</span>
            </button>

            <button
              id="bottom-bar-practice-btn"
              onClick={() => setIsPracticeModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#1A1A1A] hover:bg-black text-white text-xs font-black transition-colors flex items-center gap-1.5"
            >
              <GraduationCap className="w-4 h-4 text-[#E63946]" />
              <span>Pratik Yap</span>
            </button>

            <button
              id="bottom-bar-ai-btn"
              onClick={() => setIsAIAssistantOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-[#E63946] hover:bg-red-700 text-white text-xs font-black shadow-lg shadow-red-200 flex items-center gap-2 transition-all active:scale-95"
            >
              <Bot className="w-4 h-4" />
              <span>Yapay Zekaya Sor</span>
            </button>
          </div>

        </div>
      </div>

      {/* MODALS */}
      {/* 1. AI Pronunciation Evaluation Modal */}
      <PronunciationModal
        isOpen={isPronunciationModalOpen}
        onClose={() => setIsPronunciationModalOpen(false)}
        phrase={pronunciationTarget.phrase}
        responseAlternative={pronunciationTarget.responseAlternative}
      />

      {/* 2. Big Display Modal (Show phone to Japanese clerk/driver) */}
      <BigDisplayModal
        isOpen={isBigDisplayOpen}
        onClose={() => setIsBigDisplayOpen(false)}
        phrase={bigDisplayTarget.phrase}
        responseAlternative={bigDisplayTarget.responseAlternative}
      />

      {/* 3. AI Travel Assistant & Roleplay Modal */}
      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        currentPlaceName={currentCategoryData.name}
      />

      {/* 4. Japan Travel Etiquette Guide Modal */}
      <EtiquetteGuideModal
        isOpen={isEtiquetteModalOpen}
        onClose={() => setIsEtiquetteModalOpen(false)}
      />

      {/* 5. Practice & Quiz Flashcard Modal */}
      <PracticeModeModal
        isOpen={isPracticeModalOpen}
        onClose={() => setIsPracticeModalOpen(false)}
        phrases={filteredPhrases.length > 0 ? filteredPhrases : PHRASES_DATA}
        onOpenPronunciationTest={(phrase) => {
          setIsPracticeModalOpen(false);
          handleOpenPronunciationModal(phrase);
        }}
      />

    </div>
  );
}
