import type { MoodEntry, Settings } from './types';

const ENTRIES_KEY = 'mood_entries';
const SETTINGS_KEY = 'mood_settings';

export const DEFAULT_SETTINGS: Settings = {
  notificationsEnabled: false,
  notificationHour: 21,
  notificationMinute: 0,
};

// --- Entries ---

export function getAllEntries(): MoodEntry[] {
  try {
    const raw = localStorage.getItem(ENTRIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getEntry(date: string): MoodEntry | undefined {
  return getAllEntries().find((e) => e.date === date);
}

export function saveEntry(entry: MoodEntry): void {
  const entries = getAllEntries().filter((e) => e.date !== entry.date);
  entries.push(entry);
  entries.sort((a, b) => b.date.localeCompare(a.date));
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

export function deleteEntry(date: string): void {
  const entries = getAllEntries().filter((e) => e.date !== date);
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

// --- Settings ---

export function getSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
