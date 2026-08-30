import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  RotateCw, 
  Volume2, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Sparkles, 
  Shuffle, 
  BookOpen,
  Award
} from 'lucide-react';
import { PhraseItem } from '../types';
import { playJapaneseAudio } from '../utils/audio';

interface PracticeModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  phrases: PhraseItem[];
  onOpenPronunciationTest: (phrase: PhraseItem) => void;
}

export const PracticeModeModal: React.FC<PracticeModeModalProps> = ({
  isOpen,
  onClose,
  phrases,
  onOpenPronunciationTest,
}) => {
  const [practiceType, setPracticeType] = useState<'flashcard' | 'quiz'>('flashcard');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  if (!isOpen || phrases.length === 0) return null;

  const currentPhrase = phrases[currentIndex % phrases.length];

  const handlePlayAudio = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    playJapaneseAudio(currentPhrase.japanese, 0.95);
  };

  const handleNextCard = () => {
    setIsCardFlipped(false);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    if (currentIndex + 1 >= phrases.length) {
      if (practiceType === 'quiz') {
        setQuizFinished(true);
      } else {
        setCurrentIndex(0);
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Generate 4 options for quiz mode (1 correct + 3 random distractors)
  const getQuizOptions = () => {
    const correct = currentPhrase.turkish;
    const others = phrases
      .filter((p) => p.id !== currentPhrase.id)
      .map((p) => p.turkish);
    
    // Pick 3 random
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [correct, ...shuffledOthers].sort(() => 0.5 - Math.random());
    return {
      options,
      correctIndex: options.indexOf(correct),
    };
  };

  const currentQuizData = getQuizOptions();

  const handleSelectQuizOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
    setIsAnswerSubmitted(true);
    if (index === currentQuizData.correctIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setQuizScore(0);
    setQuizFinished(false);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setIsCardFlipped(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="practice-mode-modal"
        className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden my-6 flex flex-col min-h-[520px]"
      >
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#1A1A1A] text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E63946] flex items-center justify-center text-white shadow-md shadow-red-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg tracking-tight">PRATİK & ÖĞRENME MODU</h3>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Hafıza kartları ve testlerle pekiştirin</p>
            </div>
          </div>
          <button
            id="close-practice-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher: Flashcards vs Quiz */}
        <div className="px-6 pt-4 pb-3 border-b border-gray-100 flex items-center justify-between gap-3 bg-gray-50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setPracticeType('flashcard');
                restartQuiz();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                practiceType === 'flashcard'
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Hafıza Kartları</span>
            </button>
            <button
              onClick={() => {
                setPracticeType('quiz');
                restartQuiz();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                practiceType === 'quiz'
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Çoktan Seçmeli Test</span>
            </button>
          </div>

          <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
            {currentIndex + 1} / {phrases.length}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 flex flex-col justify-center">
          
          {/* FLASHCARD MODE */}
          {practiceType === 'flashcard' && (
            <div className="space-y-6">
              
              {/* Flip Card Container */}
              <div 
                id="flashcard-interactive"
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                className="cursor-pointer select-none rounded-[28px] p-8 border-2 border-dashed border-gray-200 bg-gray-50/50 hover:bg-white text-center min-h-[260px] flex flex-col items-center justify-center relative shadow-xs hover:shadow-lg transition-all group"
              >
                <span className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-wider text-[#E63946] bg-red-50 px-3 py-1 rounded-full border border-red-100 flex items-center gap-1.5">
                  <RotateCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300" />
                  {isCardFlipped ? 'Japonca Yüzünü Göster' : 'Türkçe Anlamı İçin Dokun'}
                </span>

                <div className="space-y-4">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest block">
                    {currentPhrase.situation}
                  </span>

                  {!isCardFlipped ? (
                    // Front side
                    <div className="space-y-3">
                      <h2 className="text-3xl sm:text-5xl font-black text-[#1A1A1A] font-['Noto_Sans_JP'] tracking-tight">
                        {currentPhrase.japanese}
                      </h2>
                      <p className="text-lg font-black text-[#E63946] tracking-wide">
                        {currentPhrase.romaji}
                      </p>
                      <button
                        onClick={handlePlayAudio}
                        className="px-4 py-2 rounded-xl bg-white hover:bg-gray-100 text-[#1A1A1A] border border-gray-200 text-xs font-black shadow-xs inline-flex items-center gap-2 mx-auto transition-colors"
                      >
                        <Volume2 className="w-4 h-4 text-[#E63946]" />
                        <span>Seslendir</span>
                      </button>
                    </div>
                  ) : (
                    // Back side
                    <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-0.5 rounded-full inline-block">
                        Türkçe Anlamı
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
                        {currentPhrase.turkish}
                      </h2>
                      <p className="text-sm font-bold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/80 inline-block font-mono">
                        Okunuşu: "{currentPhrase.turkishPronunciation}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => onOpenPronunciationTest(currentPhrase)}
                  className="px-4 py-3 rounded-2xl bg-red-50 hover:bg-red-100 text-[#E63946] text-xs font-black border border-red-100 flex items-center gap-2 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#E63946]" />
                  <span>Telaffuzumu Değerlendir</span>
                </button>

                <button
                  onClick={handleNextCard}
                  className="px-6 py-3 bg-[#1A1A1A] hover:bg-black text-white rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg shadow-black/10 transition-colors"
                >
                  <span>Sıradaki Kart</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* QUIZ MODE */}
          {practiceType === 'quiz' && (
            <div className="space-y-6">
              {!quizFinished ? (
                <div className="space-y-5">
                  
                  {/* Question Box */}
                  <div className="p-6 rounded-[24px] bg-gray-50 border border-gray-100 text-center space-y-2.5">
                    <span className="text-[10px] font-black text-[#E63946] uppercase tracking-widest block">
                      DURUM: {currentPhrase.situation}
                    </span>
                    <h3 className="text-2xl sm:text-4xl font-black text-[#1A1A1A] font-['Noto_Sans_JP'] tracking-tight">
                      {currentPhrase.japanese}
                    </h3>
                    <p className="text-sm font-black text-[#E63946] tracking-wide">
                      {currentPhrase.romaji}
                    </p>
                    <button
                      onClick={handlePlayAudio}
                      className="px-3.5 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-black text-[#1A1A1A] inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#E63946]" />
                      <span>Dinle</span>
                    </button>
                  </div>

                  <p className="text-xs font-black uppercase tracking-wider text-gray-400 text-center">
                    Bu ifadenin doğru Türkçe karşılığı hangisidir?
                  </p>

                  {/* 4 Choices */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentQuizData.options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === currentQuizData.correctIndex;

                      let btnStyle = 'bg-white hover:bg-gray-50 border-gray-200 text-[#1A1A1A]';
                      if (isAnswerSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-black ring-2 ring-emerald-200';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-red-50 border-red-500 text-red-950 font-black ring-2 ring-red-200';
                        } else {
                          btnStyle = 'bg-gray-100 border-gray-200 text-gray-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectQuizOption(idx)}
                          disabled={isAnswerSubmitted}
                          className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-bold transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isAnswerSubmitted && isCorrect && (
                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {isAnswerSubmitted && isSelected && !isCorrect && (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Continue Button */}
                  {isAnswerSubmitted && (
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleNextCard}
                        className="px-6 py-3 bg-[#1A1A1A] hover:bg-black text-white rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg shadow-black/10 transition-colors"
                      >
                        <span>Sıradaki Soru</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                </div>
              ) : (
                // Quiz Final Results Screen
                <div className="text-center space-y-4 py-8">
                  <div className="w-16 h-16 rounded-[24px] bg-red-50 border-2 border-red-200 text-[#E63946] flex items-center justify-center mx-auto shadow-md">
                    <Award className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-[#1A1A1A] tracking-tight">
                    TESTİ TAMAMLADINIZ! 🎊
                  </h3>
                  <p className="text-base font-bold text-gray-700">
                    Skorunuz: <span className="text-[#E63946] text-2xl font-black">{quizScore}</span> / {phrases.length}
                  </p>
                  <p className="text-xs font-medium text-gray-500 max-w-md mx-auto">
                    {quizScore >= phrases.length * 0.8
                      ? 'Harika! Japonya seyahatiniz için hazırsınız.'
                      : 'Güzel başlangıç! Tekrar ederek hafızanızı tazeleyin.'}
                  </p>
                  <button
                    onClick={restartQuiz}
                    className="px-6 py-3 bg-[#1A1A1A] hover:bg-black text-white rounded-2xl text-xs font-black"
                  >
                    Testi Tekrar Başlat
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <span className="text-xs text-gray-400 font-bold">
            💡 İpucu: Her gün 5 dakika pratik kalıcı öğrenme sağlar.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-[#1A1A1A] rounded-xl text-xs font-black transition-colors"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
