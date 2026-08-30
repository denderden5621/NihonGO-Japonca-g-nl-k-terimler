import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  RotateCw, 
  Check, 
  X, 
  Volume2, 
  Mic, 
  ChevronRight, 
  ChevronLeft, 
  Award, 
  ArrowLeft,
  Flame,
  CheckCircle2,
  RefreshCw,
  Layers,
  HelpCircle
} from 'lucide-react';
import { PhraseItem, CategoryId } from '../types';
import { LOCATION_CATEGORIES } from '../data/categories';
import { PHRASES_DATA } from '../data/phrases';
import { playJapaneseAudio } from '../utils/audio';

interface PracticeViewProps {
  onOpenPronunciationModal: (phrase: PhraseItem) => void;
  onGoBackToPlaces: () => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  onOpenPronunciationModal,
  onGoBackToPlaces,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [mode, setMode] = useState<'flashcards' | 'quiz'>('flashcards');

  // Flashcard State
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Filter phrases based on selected category
  const activePhrases = useMemo(() => {
    if (selectedCategory === 'all') {
      return PHRASES_DATA;
    }
    return PHRASES_DATA.filter((p) => p.categoryId === selectedCategory);
  }, [selectedCategory]);

  // Current Card
  const currentPhrase = activePhrases[currentCardIndex % activePhrases.length] || PHRASES_DATA[0];

  // Quiz Current Question and Options
  const currentQuizPhrase = activePhrases[quizIndex % activePhrases.length] || PHRASES_DATA[0];

  // Generate 4 multiple-choice options for current quiz question
  const quizOptions = useMemo(() => {
    if (!currentQuizPhrase) return [];
    const correct = currentQuizPhrase.turkish;
    const others = PHRASES_DATA.filter((p) => p.id !== currentQuizPhrase.id)
      .map((p) => p.turkish)
      .filter((val, idx, self) => self.indexOf(val) === idx)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const all = [correct, ...others].sort(() => 0.5 - Math.random());
    return all;
  }, [currentQuizPhrase, quizIndex]);

  const handleNextCard = () => {
    setIsCardFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % activePhrases.length);
  };

  const handlePrevCard = () => {
    setIsCardFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + activePhrases.length) % activePhrases.length);
  };

  const handleOptionSelect = (option: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(option);
    setIsAnswerSubmitted(true);

    if (option === currentQuizPhrase.turkish) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    if (quizIndex + 1 >= Math.min(activePhrases.length, 10)) {
      setQuizCompleted(true);
    } else {
      setQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    }
  };

  const handleRestartQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner & Header */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-gray-100 shadow-sm space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={onGoBackToPlaces}
              className="text-xs font-black uppercase tracking-wider text-gray-400 hover:text-[#1A1A1A] flex items-center gap-1.5 mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Mekan İfadelerine Dön</span>
            </button>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-black px-3 py-1 rounded-full bg-red-50 text-[#E63946] border border-red-100 tracking-wider">
                プラクティス (PRACTICE & QUIZ)
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#1A1A1A] tracking-tight">
              PRATİK YAP & KENDİNİ TEST ET
            </h1>
            <p className="text-xs sm:text-sm font-medium text-gray-500 mt-1 max-w-2xl">
              Bilgi kartlarıyla Japonca ifadeleri pekiştirin veya mini testlerle Japonya seyahatinize hazır olup olmadığınızı ölçün.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 p-1.5 bg-gray-100 rounded-2xl shrink-0 self-start sm:self-auto">
            <button
              onClick={() => {
                setMode('flashcards');
                setIsCardFlipped(false);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                mode === 'flashcards'
                  ? 'bg-white text-[#1A1A1A] shadow-sm'
                  : 'text-gray-500 hover:text-[#1A1A1A]'
              }`}
            >
              <Layers className="w-4 h-4 text-[#E63946]" />
              <span>Bilgi Kartları</span>
            </button>
            <button
              onClick={() => {
                setMode('quiz');
                handleRestartQuiz();
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                mode === 'quiz'
                  ? 'bg-white text-[#1A1A1A] shadow-sm'
                  : 'text-gray-500 hover:text-[#1A1A1A]'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-[#E63946]" />
              <span>Çoktan Seçmeli Test</span>
            </button>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="pt-3 border-t border-gray-100 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentCardIndex(0);
              handleRestartQuiz();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#1A1A1A] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tüm Mekanlar ({PHRASES_DATA.length})
          </button>
          {LOCATION_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentCardIndex(0);
                handleRestartQuiz();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#E63946] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* MODE 1: FLASHCARDS INTERACTIVE DECK */}
      {mode === 'flashcards' && (
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Progress and Counter */}
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
              KART {(currentCardIndex % activePhrases.length) + 1} / {activePhrases.length}
            </span>
            <span className="text-xs font-bold text-gray-500">
              Kartın üzerine tıklayarak çevirebilirsiniz
            </span>
          </div>

          {/* Interactive Flip Card */}
          <div
            onClick={() => setIsCardFlipped(!isCardFlipped)}
            className="cursor-pointer min-h-[300px] sm:min-h-[340px] p-8 rounded-[36px] bg-white border border-gray-100 shadow-xl hover:border-red-200 transition-all flex flex-col justify-between text-center relative overflow-hidden group select-none"
          >
            
            {/* Top Indicator */}
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-red-50 text-[#E63946] border border-red-100">
                {currentPhrase.situation}
              </span>
              <span className="text-xs font-bold text-gray-400 flex items-center gap-1 group-hover:text-gray-700 transition-colors">
                <RotateCw className="w-3.5 h-3.5" />
                <span>{isCardFlipped ? 'Japonca Göster' : 'Türkçe Anlamı Göster'}</span>
              </span>
            </div>

            {/* Middle Content (Front: Japanese & Romaji | Back: Turkish & Meaning) */}
            <div className="py-6 space-y-4">
              {!isCardFlipped ? (
                <>
                  <div className="text-3xl sm:text-5xl font-black text-[#1A1A1A] font-['Noto_Sans_JP'] tracking-wide">
                    {currentPhrase.japanese}
                  </div>
                  <div className="text-lg sm:text-xl font-black text-[#E63946]">
                    {currentPhrase.romaji}
                  </div>
                  <p className="text-xs font-medium text-gray-400">
                    Okunuş: {currentPhrase.turkishPronunciation}
                  </p>
                </>
              ) : (
                <div className="space-y-3 animate-in zoom-in-95 duration-150">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest block">
                    TÜRKÇE ANLAMI:
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-[#1A1A1A]">
                    "{currentPhrase.turkish}"
                  </div>
                  {currentPhrase.culturalNotes && (
                    <p className="text-xs text-gray-500 font-medium max-w-md mx-auto pt-2 border-t border-gray-100">
                      💡 {currentPhrase.culturalNotes}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 w-full" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => playJapaneseAudio(currentPhrase.japanese)}
                className="px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-[#1A1A1A] text-xs font-black flex items-center gap-1.5 transition-colors border border-gray-200"
              >
                <Volume2 className="w-4 h-4 text-[#E63946]" />
                <span>Dinle</span>
              </button>

              <button
                onClick={() => onOpenPronunciationModal(currentPhrase)}
                className="px-4 py-2 rounded-xl bg-[#E63946] hover:bg-red-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-red-200 transition-all active:scale-95"
              >
                <Mic className="w-4 h-4" />
                <span>Telaffuzumu Test Et</span>
              </button>
            </div>

          </div>

          {/* Previous / Next Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePrevCard}
              className="px-6 py-3 rounded-2xl bg-white hover:bg-gray-50 text-[#1A1A1A] border border-gray-200 shadow-sm text-xs font-black flex items-center gap-2 transition-all active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Önceki Kart</span>
            </button>
            <button
              onClick={handleNextCard}
              className="px-8 py-3 rounded-2xl bg-[#1A1A1A] hover:bg-black text-white shadow-lg shadow-black/10 text-xs font-black flex items-center gap-2 transition-all active:scale-95"
            >
              <span>Sonraki Kart</span>
              <ChevronRight className="w-4 h-4 text-[#E63946]" />
            </button>
          </div>

        </div>
      )}

      {/* MODE 2: MULTIPLE CHOICE QUIZ */}
      {mode === 'quiz' && (
        <div className="max-w-2xl mx-auto space-y-6">
          
          {!quizCompleted ? (
            <div className="p-8 rounded-[36px] bg-white border border-gray-100 shadow-xl space-y-6">
              
              {/* Question Header & Score */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">
                    SORU {quizIndex + 1} / {Math.min(activePhrases.length, 10)}
                  </span>
                  <p className="text-xs font-bold text-gray-600 mt-0.5">
                    Bu Japonca cümlenin Türkçe karşılığı nedir?
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-100 text-[#E63946] text-xs font-black">
                  Skor: {quizScore} / {quizIndex + (isAnswerSubmitted ? 1 : 0)}
                </div>
              </div>

              {/* Japanese Prompt Box */}
              <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 text-center space-y-2">
                <div className="text-3xl sm:text-4xl font-black text-[#1A1A1A] font-['Noto_Sans_JP'] tracking-wide">
                  {currentQuizPhrase.japanese}
                </div>
                <div className="text-base font-black text-[#E63946]">
                  {currentQuizPhrase.romaji}
                </div>
                <button
                  onClick={() => playJapaneseAudio(currentQuizPhrase.japanese)}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-2xs"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#E63946]" />
                  <span>Sesli Dinle</span>
                </button>
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-3">
                {quizOptions.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const isCorrect = option === currentQuizPhrase.turkish;

                  let buttonStyle = 'bg-gray-50 border-gray-200 hover:bg-gray-100/80 text-[#1A1A1A]';
                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      buttonStyle = 'bg-emerald-50 border-emerald-300 text-emerald-950 font-black';
                    } else if (isSelected && !isCorrect) {
                      buttonStyle = 'bg-rose-50 border-rose-300 text-rose-950';
                    } else {
                      buttonStyle = 'bg-gray-50 border-gray-200 opacity-60 text-gray-500';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerSubmitted}
                      onClick={() => handleOptionSelect(option)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-bold flex items-center justify-between transition-all ${buttonStyle}`}
                    >
                      <span>{option}</span>
                      {isAnswerSubmitted && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isAnswerSubmitted && isSelected && !isCorrect && (
                        <X className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Next Question Button */}
              {isAnswerSubmitted && (
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between animate-in fade-in">
                  <p className="text-xs font-bold text-gray-500">
                    {selectedOption === currentQuizPhrase.turkish
                      ? '🎉 Harika! Doğru cevap.'
                      : `Doğru cevap: "${currentQuizPhrase.turkish}"`}
                  </p>
                  <button
                    onClick={handleNextQuizQuestion}
                    className="px-6 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-black text-white text-xs font-black flex items-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <span>{quizIndex + 1 >= Math.min(activePhrases.length, 10) ? 'Sonucu Gör' : 'Sonraki Soru'}</span>
                    <ChevronRight className="w-4 h-4 text-[#E63946]" />
                  </button>
                </div>
              )}

            </div>
          ) : (
            /* Quiz Completed Score Card */
            <div className="p-8 sm:p-10 rounded-[36px] bg-white border border-gray-100 shadow-xl text-center space-y-6 animate-in zoom-in-95">
              <div className="w-20 h-20 rounded-[28px] bg-red-50 border border-red-100 text-[#E63946] flex items-center justify-center mx-auto shadow-sm">
                <Award className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                  TEST TAMAMLANDI
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A1A]">
                  Tebrikler! Testi Bitirdiniz
                </h2>
                <p className="text-sm font-medium text-gray-500">
                  {Math.min(activePhrases.length, 10)} sorudan <span className="font-black text-[#E63946]">{quizScore} tanesine</span> doğru yanıt verdiniz.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 max-w-sm mx-auto text-xs font-bold text-gray-700">
                {quizScore >= 8 ? (
                  <p className="text-emerald-700 font-bold">🌸 Harika bir sonuç! Japonya'da kendinizi çok rahat ifade edeceksiniz.</p>
                ) : quizScore >= 5 ? (
                  <p className="text-amber-700 font-bold">👍 Güzel ilerliyorsunuz! Bilgi kartlarıyla biraz daha pratik yapabilirsiniz.</p>
                ) : (
                  <p className="text-red-700 font-bold">📖 Kartlara tekrar göz atarak pratik yapmaya devam edin.</p>
                )}
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleRestartQuiz}
                  className="px-6 py-3 rounded-2xl bg-[#1A1A1A] hover:bg-black text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-black/10 transition-all active:scale-95"
                >
                  <RefreshCw className="w-4 h-4 text-[#E63946]" />
                  <span>Testi Tekrar Başlat</span>
                </button>
                <button
                  onClick={() => setMode('flashcards')}
                  className="px-6 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-[#1A1A1A] text-xs font-black transition-colors"
                >
                  Kartlara Göz At
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
