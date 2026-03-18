import type { MoodEntry } from './types';

const ENTRIES_KEY = 'mood_entries';

function writeEntries(entries: MoodEntry[]): void {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(sorted));
}

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
  writeEntries(entries);
}

export function replaceAllEntries(entries: MoodEntry[]): void {
  writeEntries(entries);
}

export function importEntries(entries: MoodEntry[]): number {
  const merged = new Map(getAllEntries().map((entry) => [entry.date, entry]));
  for (const entry of entries) {
    merged.set(entry.date, entry);
  }
  const next = [...merged.values()];
  writeEntries(next);
  return entries.length;
}

export function deleteEntry(date: string): void {
  const entries = getAllEntries().filter((e) => e.date !== date);
  writeEntries(entries);
}
