export type CategoryId =
  | 'general'
  | 'konbini'
  | 'restaurant'
  | 'store'
  | 'train'
  | 'hotel'
  | 'cafe_izakaya'
  | 'taxi_directions'
  | 'sightseeing'
  | 'pharmacy_emergency';

export interface RecommendedResponse {
  id: string;
  japanese: string;
  romaji: string;
  turkish: string;
  turkishPronunciation: string;
  notes?: string;
}

export interface ClerkQuestion {
  japanese: string;
  romaji: string;
  turkish: string;
  turkishPronunciation: string;
  context?: string;
}

export interface PhraseItem {
  id: string;
  categoryId: CategoryId;
  situation: string; // e.g. "Kasiyerin Sorduğu Soru", "Sipariş Verirken", "Hesap İsteme"
  type: 'dialogue' | 'phrase' | 'question' | 'response';
  speaker?: 'clerk' | 'traveler' | 'both';
  isEssential?: boolean;
  
  // Primary Japanese text & readings
  japanese: string; // Kanji & Kana
  romaji: string; // Latin Alphabet
  turkish: string; // Turkish translation
  turkishPronunciation: string; // Turkish phonetic reading guide (e.g. "Arigato gozaymas")
  
  // Dialogue context if clerk asks something
  clerkQuestion?: ClerkQuestion;
  recommendedResponses?: RecommendedResponse[];
  
  // Cultural or situational travel tip
  culturalNotes?: string;
}

export interface LocationCategory {
  id: CategoryId;
  name: string;
  japaneseName: string;
  iconName: string;
  tagline: string;
  description: string;
  themeColor: {
    bg: string;
    text: string;
    border: string;
    badge: string;
    accent: string;
    gradient: string;
  };
  etiquetteTips: string[];
  phrasesCount?: number;
}

export interface PronunciationEvaluationResult {
  score: number; // 1-100
  rating: string; // 'Mükemmel' | 'Çok İyi' | 'İyi' | 'Geliştirilebilir' | 'Tekrar Deneyin'
  detectedText: string;
  summaryFeedback: string;
  phoneticTips: string[];
  turkishPhoneticGuide: string;
  encouragement: string;
}

export interface SavedBookmark {
  phraseId: string;
  savedAt: number;
}

export interface PracticeHistory {
  id: string;
  phraseId: string;
  japanese: string;
  score: number;
  rating: string;
  date: number;
}
