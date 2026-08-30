/**
 * Audio synthesis and speech utilities for Japanese language playback and recording
 */

// Japanese Text-to-Speech using browser SpeechSynthesis
export function playJapaneseAudio(text: string, rate: number = 0.95): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      resolve();
      return;
    }

    window.speechSynthesis.cancel(); // Stop any currently playing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = rate; // 0.8 to 1.0 for clear learning
    utterance.pitch = 1.0;

    // Pick a high quality Japanese voice if available
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(
      (v) => v.lang === 'ja-JP' || v.lang === 'ja_JP' || v.lang.startsWith('ja')
    );
    if (jaVoice) {
      utterance.voice = jaVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

// Convert audio blob to base64 string
export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = (reader.result as string).split(',')[1];
      resolve(base64data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Speech Recognition helper for Japanese speech-to-text with clean abort and restart support
export interface SpeechRecognizerController {
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export function createSpeechRecognizer(
  onResult: (transcript: string) => void,
  onError: (error: string) => void,
  onEnd: () => void
): SpeechRecognizerController | null {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return null;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let isStopped = false;

    recognition.onresult = (event: any) => {
      if (isStopped) return;
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        finalTranscript += event.results[i][0].transcript;
      }
      if (finalTranscript) {
        onResult(finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      if (isStopped) return;
      console.warn('Speech recognition error:', event.error);
      onError(event.error);
    };

    recognition.onend = () => {
      onEnd();
    };

    return {
      start: () => {
        isStopped = false;
        try {
          recognition.start();
        } catch (err) {
          console.warn('Speech recognition start error:', err);
        }
      },
      stop: () => {
        isStopped = true;
        try {
          recognition.stop();
        } catch (e) {
          // ignore
        }
      },
      abort: () => {
        isStopped = true;
        try {
          recognition.abort();
        } catch (e) {
          // ignore
        }
      },
    };
  } catch (err) {
    console.error('Speech recognition init error:', err);
    return null;
  }
}

