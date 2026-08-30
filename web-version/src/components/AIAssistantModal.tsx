import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Bot, 
  Send, 
  Sparkles, 
  Volume2, 
  User, 
  ShoppingBag, 
  Utensils, 
  Train, 
  Compass,
  MessageSquareQuote,
  RotateCcw
} from 'lucide-react';
import { playJapaneseAudio } from '../utils/audio';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlaceName?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  currentPlaceName = 'Genel Seyahat',
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Konnichiwa! 🇯🇵 Ben sizin kişisel Japonya Seyahat ve Japonca Danışmanınızım.
Şu an **${currentPlaceName}** bağlamındayız. 
Herhangi bir durumda *"Burada ne söylemeliyim?"*, *"Garsona nasıl seslenirim?"*, *"Vejetaryen yemek nasıl isterim?"* gibi aklınıza gelen her şeyi Türkçe sorabilirsiniz. 
Ayrıca benimle canlı konbini veya restoran rol yapma (roleplay) pratiği yapabilirsiniz!`,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeScenario, setActiveScenario] = useState<'general' | 'konbini' | 'restaurant' | 'train'>('general');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const quickPrompts = [
    {
      label: '🍱 Konbini: Isıtma & Poşet',
      text: 'Konbini markette kasiyer bana soru sorduğunda nasıl cevap vermeliyim? Poşet istemediğimi ve yemeği ısıtmasını nasıl söylerim?',
    },
    {
      label: '🍜 Restoran: Domuz Eti & Su',
      text: 'Restoranda domuz eti yemediğimi ve ücretsiz su istediğimi nasıl en kibar şekilde söylerim?',
    },
    {
      label: '🚄 Tren: Shinkansen Bileti',
      text: 'İstasyonda Kyoto\'ya Shinkansen hızlı tren bileti ve rezerve koltuk nasıl istenir?',
    },
    {
      label: '🛍️ Tax-Free & Deneme',
      text: 'Mağazada Tax-Free vergisiz alışveriş ve kıyafeti deneme kabininde denemek istediğimi nasıl söylerim?',
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/travel-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          scenario: activeScenario,
          currentPlace: currentPlaceName,
        }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Cevap alınamadı, lütfen tekrar deneyin.',
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Bağlantı sırasında bir aksaklık oldu. Ancak temel olarak "Sumimasen" (Afedersiniz) ve "Kore o kudasai" (Bunu rica ediyorum) kalıplarını her yerde güvenle kullanabilirsiniz!',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtractAndPlaySpeech = (text: string) => {
    // Look for Japanese characters or play highlighted sentences
    const japaneseRegex = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]+/g;
    const matches = text.match(japaneseRegex);
    if (matches && matches.length > 0) {
      const phraseToPlay = matches.join(' ');
      playJapaneseAudio(phraseToPlay, 0.95);
    } else {
      playJapaneseAudio(text, 0.95);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `Sohbet sıfırlandı. 🇯🇵 Size Japonya seyahatinizde nasıl yardımcı olabilirim?`,
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        id="ai-assistant-modal"
        className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden flex flex-col h-[90vh] max-h-[750px]"
      >
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#1A1A1A] text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E63946] flex items-center justify-center text-white shadow-md shadow-red-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg tracking-tight">AI SEYAHAT DANIŞMANI</h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-500/20 text-rose-300 border border-rose-400/30 uppercase">
                  GEMINI AI
                </span>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Japonya geziniz için canlı Türkçe rehber
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetChat}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-xs font-black flex items-center gap-1"
              title="Sohbeti Sıfırla"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              id="close-ai-assistant-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Scenario Selector Bar */}
        <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
            Mod:
          </span>
          <button
            onClick={() => setActiveScenario('general')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-colors ${
              activeScenario === 'general'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            🌟 Genel Soru
          </button>
          <button
            onClick={() => setActiveScenario('konbini')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-colors ${
              activeScenario === 'konbini'
                ? 'bg-[#E63946] text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            🏪 Konbini Rolü
          </button>
          <button
            onClick={() => setActiveScenario('restaurant')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-colors ${
              activeScenario === 'restaurant'
                ? 'bg-[#E63946] text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            🍜 Restoran Rolü
          </button>
          <button
            onClick={() => setActiveScenario('train')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-colors ${
              activeScenario === 'train'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            🚄 Tren & Bilet
          </button>
        </div>

        {/* Message History */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-gray-50/50">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                    isUser
                      ? 'bg-[#1A1A1A] text-white'
                      : 'bg-[#E63946] text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div
                  className={`p-4 rounded-[22px] text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-2xs font-medium ${
                    isUser
                      ? 'bg-[#1A1A1A] text-white rounded-tr-none'
                      : 'bg-white text-[#1A1A1A] border border-gray-100 rounded-tl-none'
                  }`}
                >
                  <p>{msg.content}</p>

                  {/* Japanese voice speak button on assistant messages */}
                  {!isUser && (
                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleExtractAndPlaySpeech(msg.content)}
                        className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-[#E63946] font-black text-xs flex items-center gap-1.5 transition-colors"
                        title="Mesajdaki Japonca İfadeleri Seslendir"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Japonca Telaffuzu Oku</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 mr-auto max-w-[80%]">
              <div className="w-9 h-9 rounded-2xl bg-[#E63946] text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-gray-100 text-gray-500 text-xs font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E63946] animate-pulse" />
                <span>Yapay zeka yanıt hazırlıyor...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 overflow-x-auto flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Önerilenler:</span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.text)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-200/80 text-[#1A1A1A] text-xs font-black border border-gray-200 whitespace-nowrap transition-colors shrink-0"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2.5"
          >
            <input
              id="ai-assistant-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Bir soru sorun veya Japonca bir durum tarif edin..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-2xl bg-gray-50 hover:bg-gray-100/70 focus:bg-white text-sm font-semibold border border-gray-200 focus:border-[#E63946]/50 focus:outline-none focus:ring-4 focus:ring-red-50 transition-all placeholder:text-gray-400 placeholder:font-normal"
            />
            <button
              id="ai-assistant-send-btn"
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className={`p-3 rounded-2xl text-white font-bold flex items-center justify-center transition-all ${
                !inputValue.trim() || isLoading
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#1A1A1A] hover:bg-black shadow-lg shadow-black/10 active:scale-95'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
