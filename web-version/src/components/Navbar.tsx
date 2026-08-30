import React from 'react';
import { 
  Sparkles, 
  Bookmark, 
  BookOpen, 
  Bot, 
  HelpCircle,
  Search,
  Compass,
  GraduationCap
} from 'lucide-react';
import { CategoryId } from '../types';

interface NavbarProps {
  activeTab: 'places' | 'favorites' | 'practice' | 'etiquette';
  setActiveTab: (tab: 'places' | 'favorites' | 'practice' | 'etiquette') => void;
  selectedCategory: CategoryId;
  setSelectedCategory: (cat: CategoryId) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  bookmarksCount: number;
  openAIAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  bookmarksCount,
  openAIAssistant,
}) => {
  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#EEEEEE] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
            
            {/* Logo & Title */}
            <div 
              id="app-logo-button"
              onClick={() => {
                setActiveTab('places');
                setSelectedCategory('general');
              }}
              className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group shrink-0"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#E63946] flex items-center justify-center text-white shadow-lg shadow-red-100 group-hover:scale-105 transition-transform">
                <span className="font-black text-lg sm:text-xl tracking-wider font-['Noto_Sans_JP']">日</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-black text-xl sm:text-2xl tracking-tighter text-[#E63946]">NIHONGO</span>
                  <span className="text-[10px] sm:text-[11px] font-black px-1.5 sm:px-2 py-0.5 rounded-full bg-red-50 text-[#E63946] border border-red-100">TR</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden sm:block">Seyahat & Telaffuz Rehberi</p>
              </div>
            </div>

            {/* Desktop Search Bar */}
            <div className="flex-1 max-w-md mx-2 hidden md:block">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="global-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cümle, kelime veya durum ara... (Örn: hesap, poşet, su)"
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 hover:bg-gray-100/80 focus:bg-white text-sm font-semibold rounded-2xl border border-gray-100 focus:border-[#E63946]/40 focus:outline-none focus:ring-4 focus:ring-red-50 transition-all placeholder:text-gray-400 placeholder:font-normal"
                />
                {searchQuery && (
                  <button
                    id="clear-search-btn"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Desktop Navigation Tabs (Hidden on mobile, shown on md+) */}
            <div className="hidden md:flex items-center gap-2">
              
              {/* General Quick Button */}
              <button
                id="quick-general-btn"
                onClick={() => {
                  setActiveTab('places');
                  setSelectedCategory('general');
                }}
                className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'places' && selectedCategory === 'general'
                    ? 'bg-[#E63946] text-white shadow-lg shadow-red-100 scale-[1.02]'
                    : 'bg-red-50/80 hover:bg-red-100/80 text-[#E63946]'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Genel</span>
              </button>

              {/* Practice / Quiz Tab */}
              <button
                id="nav-practice-tab-btn"
                onClick={() => setActiveTab('practice')}
                className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'practice'
                    ? 'bg-[#1A1A1A] text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                }`}
                title="Pratik & Bilgi Kartları"
              >
                <GraduationCap className="w-4 h-4 text-[#E63946]" />
                <span>Pratik</span>
              </button>

              {/* Etiquette Guide Tab */}
              <button
                id="nav-etiquette-tab-btn"
                onClick={() => setActiveTab('etiquette')}
                className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'etiquette'
                    ? 'bg-[#1A1A1A] text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                }`}
                title="Japonya Görgü Kuralları"
              >
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Adap</span>
              </button>

              {/* Bookmarks Tab */}
              <button
                id="nav-bookmarks-tab-btn"
                onClick={() => setActiveTab('favorites')}
                className={`relative px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'favorites'
                    ? 'bg-[#1A1A1A] text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                }`}
                title="Kaydedilen İfadeler"
              >
                <Bookmark className="w-4 h-4 text-amber-500" />
                <span>Favoriler</span>
                {bookmarksCount > 0 && (
                  <span className="ml-1 bg-[#E63946] text-white text-[10px] font-black rounded-full px-1.5 py-0.5 leading-none">
                    {bookmarksCount}
                  </span>
                )}
              </button>

              {/* AI Assistant Button */}
              <button
                id="open-ai-assistant-btn"
                onClick={openAIAssistant}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-[#1A1A1A] hover:bg-black text-white shadow-lg shadow-black/10 flex items-center gap-2 transition-all active:scale-95 ml-1"
              >
                <Bot className="w-4 h-4 text-rose-400" />
                <span>AI Asistanı</span>
              </button>

            </div>

            {/* Mobile Top Actions (Compact & clean) */}
            <div className="flex md:hidden items-center gap-2">
              <button
                id="mobile-top-general-btn"
                onClick={() => {
                  setActiveTab('places');
                  setSelectedCategory('general');
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'places' && selectedCategory === 'general'
                    ? 'bg-[#E63946] text-white'
                    : 'bg-red-50 text-[#E63946]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Genel</span>
              </button>

              <button
                id="mobile-top-ai-btn"
                onClick={openAIAssistant}
                className="px-3 py-2 rounded-xl text-xs font-black bg-[#1A1A1A] text-white flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <Bot className="w-3.5 h-3.5 text-rose-400" />
                <span>AI</span>
              </button>
            </div>

          </div>

          {/* Mobile Search Input */}
          <div className="pb-3 md:hidden">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="mobile-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cümle veya durum ara... (Örn: hesap, su)"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 focus:bg-white text-xs sm:text-sm font-semibold rounded-xl border border-transparent focus:border-[#E63946]/40 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
              {searchQuery && (
                <button
                  id="mobile-clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 hover:text-gray-700 bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar (Dock) */}
      <nav 
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5"
        style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}
      >
        <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
          
          {/* 1. Places / Mekanlar */}
          <button
            id="mobile-nav-places-btn"
            onClick={() => setActiveTab('places')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
              activeTab === 'places'
                ? 'text-[#E63946] font-black'
                : 'text-gray-500 font-semibold hover:text-gray-900'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${activeTab === 'places' ? 'bg-red-50' : ''}`}>
              <Compass className={`w-5 h-5 ${activeTab === 'places' ? 'text-[#E63946]' : 'text-gray-500'}`} />
            </div>
            <span className="text-[10px] mt-0.5 leading-tight">Mekanlar</span>
          </button>

          {/* 2. Practice / Pratik */}
          <button
            id="mobile-nav-practice-btn"
            onClick={() => setActiveTab('practice')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
              activeTab === 'practice'
                ? 'text-[#E63946] font-black'
                : 'text-gray-500 font-semibold hover:text-gray-900'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${activeTab === 'practice' ? 'bg-red-50' : ''}`}>
              <GraduationCap className={`w-5 h-5 ${activeTab === 'practice' ? 'text-[#E63946]' : 'text-gray-500'}`} />
            </div>
            <span className="text-[10px] mt-0.5 leading-tight">Pratik</span>
          </button>

          {/* 3. Etiquette / Adap */}
          <button
            id="mobile-nav-etiquette-btn"
            onClick={() => setActiveTab('etiquette')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
              activeTab === 'etiquette'
                ? 'text-emerald-600 font-black'
                : 'text-gray-500 font-semibold hover:text-gray-900'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${activeTab === 'etiquette' ? 'bg-emerald-50' : ''}`}>
              <BookOpen className={`w-5 h-5 ${activeTab === 'etiquette' ? 'text-emerald-600' : 'text-gray-500'}`} />
            </div>
            <span className="text-[10px] mt-0.5 leading-tight">Adap</span>
          </button>

          {/* 4. Bookmarks / Favoriler */}
          <button
            id="mobile-nav-favorites-btn"
            onClick={() => setActiveTab('favorites')}
            className={`relative flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
              activeTab === 'favorites'
                ? 'text-amber-600 font-black'
                : 'text-gray-500 font-semibold hover:text-gray-900'
            }`}
          >
            <div className={`relative p-1 rounded-xl transition-all ${activeTab === 'favorites' ? 'bg-amber-50' : ''}`}>
              <Bookmark className={`w-5 h-5 ${activeTab === 'favorites' ? 'text-amber-600' : 'text-gray-500'}`} />
              {bookmarksCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E63946] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center leading-none shadow-2xs">
                  {bookmarksCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 leading-tight">Favoriler</span>
          </button>

          {/* 5. AI Assistant */}
          <button
            id="mobile-nav-ai-btn"
            onClick={openAIAssistant}
            className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-[#1A1A1A] font-semibold hover:text-black transition-all active:scale-95"
          >
            <div className="p-1 rounded-xl bg-gray-100">
              <Bot className="w-5 h-5 text-rose-500" />
            </div>
            <span className="text-[10px] mt-0.5 leading-tight font-bold">AI Koç</span>
          </button>

        </div>
      </nav>
    </>
  );
};
