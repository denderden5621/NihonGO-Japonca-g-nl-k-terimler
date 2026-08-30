import { PracticeHistory } from '../types';

const BOOKMARKS_KEY = 'japan_travel_bookmarks';
const HISTORY_KEY = 'japan_travel_practice_history';

export function getSavedBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleBookmark(phraseId: string): string[] {
  const current = getSavedBookmarks();
  const next = current.includes(phraseId)
    ? current.filter((id) => id !== phraseId)
    : [...current, phraseId];
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
  } catch (err) {
    console.error('Failed to save bookmark:', err);
  }
  return next;
}

export function getPracticeHistory(): PracticeHistory[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePracticeResult(result: Omit<PracticeHistory, 'id' | 'date'>): PracticeHistory[] {
  const current = getPracticeHistory();
  const newItem: PracticeHistory = {
    ...result,
    id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    date: Date.now(),
  };
  const updated = [newItem, ...current].slice(0, 30); // keep last 30
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save history:', err);
  }
  return updated;
}
