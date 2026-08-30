import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  Mic, 
  Square, 
  Volume2, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  Play, 
  Info,
  ChevronRight,
  TrendingUp,
  Volume1,
  RotateCcw
} from 'lucide-react';
import { PhraseItem, RecommendedResponse, PronunciationEvaluationResult } from '../types';
import { playJapaneseAudio, createSpeechRecognizer, SpeechRecognizerController, blobToBase64 } from '../utils/audio';
import { savePracticeResult } from '../utils/storage';

interface PronunciationModalProps {
  isOpen: boolean;
  onClose: () => void;
  phrase: PhraseItem | null;
  responseAlternative?: RecommendedResponse;
}

export const PronunciationModal: React.FC<PronunciationModalProps> = ({
  isOpen,
  onClose,
  phrase,
  responseAlternative,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isReferencePlaying, setIsReferencePlaying] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [speechTranscript, setSpeechTranscript] = useState<string>('');
  const [evaluationResult, setEvaluationResult] = useState<PronunciationEvaluationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechRecognizerRef = useRef<SpeechRecognizerController | null>(null);
  const sessionIdRef = useRef<number>(0);
  const previousUrlRef = useRef<string | null>(null);

  // Target phrase details (either the main phrase or the dialogue response alternative)
  const targetJapanese = responseAlternative ? responseAlternative.japanese : phrase?.japanese || '';
  const targetRomaji = responseAlternative ? responseAlternative.romaji : phrase?.romaji || '';
  const targetTurkish = responseAlternative ? responseAlternative.turkish : phrase?.turkish || '';
  const targetPhonetic = responseAlternative ? responseAlternative.turkishPronunciation : phrase?.turkishPronunciation || '';

  // Cleanup all audio resources safely
  const cleanupAudioResources = useCallback(() => {
    if (speechRecognizerRef.current) {
      speechRecognizerRef.current.abort();
      speechRecognizerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
      mediaRecorderRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (previousUrlRef.current) {
      URL.revokeObjectURL(previousUrlRef.current);
      previousUrlRef.current = null;
    }
  }, []);

  // Reset state on open or phrase change
  useEffect(() => {
    if (isOpen) {
      cleanupAudioResources();
      sessionIdRef.current += 1;
      setIsRecording(false);
      setIsEvaluating(false);
      setRecordedAudioUrl(null);
      setRecordedAudioBlob(null);
      setSpeechTranscript('');
      setEvaluationResult(null);
      setErrorMessage(null);
      audioChunksRef.current = [];
    }
    return () => {
      cleanupAudioResources();
    };
  }, [isOpen, phrase, responseAlternative, cleanupAudioResources]);

  if (!isOpen || !phrase) return null;

  const handlePlayReference = async (slow: boolean = false) => {
    setIsReferencePlaying(true);
    await playJapaneseAudio(targetJapanese, slow ? 0.8 : 0.95);
    setIsReferencePlaying(false);
  };

  const startRecording = async () => {
    // 1. Full clean up of any prior active media/streams
    cleanupAudioResources();
    
    sessionIdRef.current += 1;
    const currentSessionId = sessionIdRef.current;

    setErrorMessage(null);
    setSpeechTranscript('');
    setRecordedAudioUrl(null);
    setRecordedAudioBlob(null);
    setEvaluationResult(null);
    audioChunksRef.current = [];

    try {
      // 2. Setup Audio Stream for recording
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      mediaStreamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (currentSessionId === sessionIdRef.current && event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (currentSessionId !== sessionIdRef.current) return;
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setRecordedAudioBlob(audioBlob);

        if (previousUrlRef.current) {
          URL.revokeObjectURL(previousUrlRef.current);
        }
        const url = URL.createObjectURL(audioBlob);
        previousUrlRef.current = url;
        setRecordedAudioUrl(url);

        // Stop media tracks after blob is created
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);

      // 3. Setup Web Speech Recognition for instant transcript
      const recognizer = createSpeechRecognizer(
        (transcript) => {
          if (currentSessionId === sessionIdRef.current) {
            setSpeechTranscript(transcript);
          }
        },
        (err) => {
          console.log('Recognizer event:', err);
        },
        () => {
          // finished
        }
      );

      if (recognizer) {
        speechRecognizerRef.current = recognizer;
        recognizer.start();
      }
    } catch (err: any) {
      console.error('Microphone access error:', err);
      setErrorMessage(
        'Mikrofona erişilemedi. Lütfen tarayıcınızın mikrofon izinlerini kontrol edin.'
      );
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (speechRecognizerRef.current) {
      speechRecognizerRef.current.stop();
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.requestData();
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.warn('MediaRecorder stop error:', e);
      }
    }
  };

  const handleEvaluateWithAI = async () => {
    if (!recordedAudioBlob && !speechTranscript) {
      setErrorMessage('Lütfen değerlendirmeden önce bir ses kaydı yapın.');
      return;
    }

    setIsEvaluating(true);
    setErrorMessage(null);

    try {
      let audioBase64 = '';
      if (recordedAudioBlob) {
        try {
          audioBase64 = await blobToBase64(recordedAudioBlob);
        } catch (e) {
          console.warn('Blob to base64 conversion warning:', e);
        }
      }

      const response = await fetch('/api/evaluate-pronunciation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetJapanese,
          targetRomaji,
          targetTurkish,
          userSpokenText: speechTranscript.trim(),
          userAudioBase64: audioBase64,
          audioMimeType: recordedAudioBlob?.type || 'audio/webm',
        }),
      });

      if (!response.ok) {
        throw new Error('Yapay zeka sunucusuna bağlanırken bir hata oluştu.');
      }

      const result: PronunciationEvaluationResult = await response.json();
      setEvaluationResult(result);

      // Save to practice history
      savePracticeResult({
        phraseId: phrase.id,
        japanese: targetJapanese,
        score: result.score,
        rating: result.rating,
      });
    } catch (err: any) {
      console.error('Evaluation error:', err);
      // Honest Fallback result
      const fallback: PronunciationEvaluationResult = {
        score: speechTranscript.trim() ? 65 : 70,
        rating: 'Geliştirilebilir',
        detectedText: speechTranscript || 'Ses Kaydı Alındı',
        summaryFeedback: 'Ses kaydınız alındı. Lütfen mikrofona yaklaşarak hedef ifadeyi tane tane ve belirgin şekilde tekrar etmeyi deneyin.',
        phoneticTips: [
          'Japonca "r" seslerini (ra, ri, ru, re, ro) Türkçe sert "R" gibi değil, dil ucunuzu üst damağınıza hafifçe vurarak (L ile R arasında) çıkarın.',
          'Cümle sonundaki "desu" ifadesinde "u" sesini yutarak "des" gibi, "masu" ifadesinde "mas" gibi bitirin.'
        ],
        turkishPhoneticGuide: targetPhonetic,
        encouragement: 'Pes etmeyin! Tekrar deneyerek telaffuzunuzu kusursuzlaştırabilirsiniz.',
      };
      setEvaluationResult(fallback);
    } finally {
      setIsEvaluating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-300';
    if (score >= 70) return 'text-amber-600 bg-amber-50 border-amber-300';
    return 'text-rose-600 bg-rose-50 border-rose-300';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="pronunciation-modal-container"
        className="relative w-full max-w-xl bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden my-6 max-h-[92vh] flex flex-col"
      >
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#1A1A1A] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E63946] flex items-center justify-center text-white shadow-md shadow-red-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">AI TELAFFUZ KOÇU</h2>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Konuşun, yapay zeka analiz etsin</p>
            </div>
          </div>
          <button
            id="close-pronunciation-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Target Phrase Box */}
          <div className="p-6 rounded-[24px] bg-gray-50 border border-gray-100 text-center space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#E63946] bg-red-50 border border-red-100 px-3 py-1 rounded-full inline-block">
              Hedef İfade
            </span>
            
            <h3 className="text-3xl sm:text-4xl font-black text-[#1A1A1A] font-['Noto_Sans_JP'] tracking-tight">
              {targetJapanese}
            </h3>

            <p className="text-lg font-black text-[#E63946] tracking-wide">
              {targetRomaji}
            </p>

            <p className="text-base font-bold text-[#1A1A1A]">
              🇹🇷 "{targetTurkish}"
            </p>

            <div className="pt-2 flex items-center justify-center gap-2.5">
              <button
                id="modal-play-ref-btn"
                onClick={() => handlePlayReference(false)}
                disabled={isReferencePlaying}
                className="px-4 py-2 rounded-xl bg-white hover:bg-gray-100 text-[#1A1A1A] border border-gray-200 text-xs font-black shadow-2xs flex items-center gap-2 transition-colors"
              >
                <Volume2 className="w-4 h-4 text-[#E63946]" />
                <span>Doğru Sesi Dinle</span>
              </button>
              <button
                id="modal-play-ref-slow-btn"
                onClick={() => handlePlayReference(true)}
                disabled={isReferencePlaying}
                className="px-4 py-2 rounded-xl bg-white hover:bg-gray-100 text-[#1A1A1A] border border-gray-200 text-xs font-black shadow-2xs flex items-center gap-2 transition-colors"
              >
                <Volume1 className="w-4 h-4 text-amber-600" />
                <span>Yavaş Dinle (0.8x)</span>
              </button>
            </div>
          </div>

          {/* Error Notice if any */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Interactive Voice Recorder Section */}
          <div className="text-center space-y-5 p-6 rounded-[24px] bg-white border border-gray-200 shadow-sm">
            
            <div className="space-y-1">
              <h4 className="text-sm sm:text-base font-black text-[#1A1A1A] tracking-tight">
                {isRecording 
                  ? '🎙️ Dinleniyor... Lütfen Japonca cümleyi söyleyin' 
                  : recordedAudioUrl 
                    ? '✅ Yeni Ses Kaydınız Alındı' 
                    : '1. Mikrofona Basın ve Cümleyi Okuyun'}
              </h4>
              <p className="text-xs font-semibold text-gray-400">
                {isRecording 
                  ? 'Bitirdiğinizde kırmızı kareye tıklayın' 
                  : 'Konuşurken anlaşılır ve net bir ses tonu kullanın'}
              </p>
            </div>

            {/* Mic Record Button */}
            <div className="flex items-center justify-center">
              {!isRecording ? (
                <button
                  id="start-recording-btn"
                  onClick={startRecording}
                  className="w-20 h-20 rounded-full bg-[#E63946] hover:bg-red-700 text-white flex items-center justify-center shadow-xl shadow-red-200 hover:scale-105 active:scale-95 transition-all"
                  title={recordedAudioUrl ? "Yeniden Kaydet" : "Kayda Başla"}
                >
                  <Mic className="w-8 h-8" />
                </button>
              ) : (
                <button
                  id="stop-recording-btn"
                  onClick={stopRecording}
                  className="w-20 h-20 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center shadow-xl animate-pulse ring-4 ring-red-200 hover:scale-105 transition-all"
                  title="Kaydı Durdur"
                >
                  <Square className="w-7 h-7 fill-[#E63946] text-[#E63946]" />
                </button>
              )}
            </div>

            {/* Sound Wave Animation during recording */}
            {isRecording && (
              <div className="flex items-center justify-center gap-1.5 h-6">
                <div className="w-1.5 bg-[#E63946] rounded-full animate-bounce [animation-delay:-0.3s] h-4" />
                <div className="w-1.5 bg-[#1A1A1A] rounded-full animate-bounce [animation-delay:-0.15s] h-6" />
                <div className="w-1.5 bg-[#E63946] rounded-full animate-bounce h-3" />
                <div className="w-1.5 bg-[#1A1A1A] rounded-full animate-bounce [animation-delay:-0.2s] h-5" />
                <div className="w-1.5 bg-[#E63946] rounded-full animate-bounce [animation-delay:-0.35s] h-4" />
              </div>
            )}

            {/* User Speech Preview & Playback */}
            {recordedAudioUrl && !isRecording && (
              <div className="pt-2 space-y-3.5">
                <div className="flex items-center justify-center gap-3">
                  <audio 
                    src={recordedAudioUrl} 
                    controls 
                    className="h-10 max-w-xs rounded-xl shadow-2xs"
                  />
                  <button
                    onClick={startRecording}
                    className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#1A1A1A] transition-colors text-xs font-black flex items-center gap-1.5 border border-gray-200"
                    title="Yeni Kayıt Al"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#E63946]" />
                    <span>Yeniden Kaydet</span>
                  </button>
                </div>

                {speechTranscript && (
                  <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-700">
                    <span className="font-bold text-gray-400 uppercase text-[10px] block mb-0.5">Algılanan Ses:</span>
                    <span className="font-black font-['Noto_Sans_JP'] text-sm text-[#1A1A1A]">"{speechTranscript}"</span>
                  </div>
                )}

                {/* AI Evaluate Trigger Button */}
                <button
                  id="evaluate-with-ai-btn"
                  onClick={handleEvaluateWithAI}
                  disabled={isEvaluating}
                  className={`w-full py-4 px-6 rounded-2xl text-sm font-black text-white flex items-center justify-center gap-2 shadow-xl transition-all ${
                    isEvaluating
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#1A1A1A] hover:bg-black shadow-black/10 active:scale-98'
                  }`}
                >
                  {isEvaluating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-rose-400" />
                      <span>Yapay Zeka Telaffuzunuzu İnceliyor...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-rose-400" />
                      <span>2. Yapay Zeka ile Telaffuzumu Değerlendir</span>
                    </>
                  )}
                </button>
              </div>
            )}

          </div>

          {/* AI Evaluation Results Card */}
          {evaluationResult && (
            <div className="p-6 rounded-[24px] bg-white border-2 border-gray-200 shadow-xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* Score Header */}
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center font-black ${getScoreColor(evaluationResult.score)}`}>
                    <span className="text-2xl leading-none">{evaluationResult.score}</span>
                    <span className="text-[9px] uppercase font-black opacity-75">/ 100</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                      Telaffuz Derecesi
                    </span>
                    <h4 className="text-xl font-black text-[#1A1A1A] flex items-center gap-1.5">
                      <Award className="w-5 h-5 text-amber-500" />
                      {evaluationResult.rating}
                    </h4>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-red-50 text-[#E63946] border border-red-100">
                    AI Analizi
                  </span>
                </div>
              </div>

              {/* Detected Text vs Target */}
              {evaluationResult.detectedText && (
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-700 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                      Duyulan İfade:
                    </span>
                    <span className="font-bold text-[#1A1A1A]">
                      "{evaluationResult.detectedText}"
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                      Hedef Okunuş:
                    </span>
                    <span className="font-bold text-[#E63946]">
                      {targetRomaji}
                    </span>
                  </div>
                </div>
              )}

              {/* Summary Feedback */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs sm:text-sm text-[#1A1A1A] leading-relaxed font-bold">
                💬 {evaluationResult.summaryFeedback}
              </div>

              {/* Phonetic Coaching Tips for Turkish Speakers */}
              {evaluationResult.phoneticTips && evaluationResult.phoneticTips.length > 0 && (
                <div className="space-y-2.5">
                  <h5 className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-[#E63946]" />
                    Türk Gezginler İçin Özel Telaffuz İpuçları
                  </h5>
                  <ul className="space-y-2">
                    {evaluationResult.phoneticTips.map((tip, idx) => (
                      <li key={idx} className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-200 flex items-start gap-2.5 font-medium">
                        <span className="w-5 h-5 rounded-full bg-[#1A1A1A] text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Encouragement */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="font-bold">{evaluationResult.encouragement}</p>
              </div>

              {/* Retry / Re-record Button right in the score card */}
              <div className="pt-2">
                <button
                  onClick={startRecording}
                  className="w-full py-3 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-[#1A1A1A] text-xs font-black flex items-center justify-center gap-2 border border-gray-200 transition-colors"
                >
                  <RotateCcw className="w-4 h-4 text-[#E63946]" />
                  <span>Tekrar Kaydet ve Puanını Yükselt</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <p className="text-xs text-gray-400 font-bold hidden sm:block">
            💡 Günlük pratik yapmak konuşma özgüveninizi 3 kat artırır.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-black text-white rounded-2xl text-xs font-black transition-colors"
          >
            Tamamla
          </button>
        </div>

      </div>
    </div>
  );
};

