export type Mood = 'excellent' | 'good' | 'neutral' | 'bad' | 'awful';

export interface MoodEntry {
  date: string; // YYYY-MM-DD
  mood: Mood;
  text: string;
}

export interface Settings {
  notificationsEnabled: boolean;
  notificationHour: number; // 0-23
  notificationMinute: number; // 0-59
}

export const MOODS: Mood[] = ['excellent', 'good', 'neutral', 'bad', 'awful'];

export const MOOD_LABELS: Record<Mood, string> = {
  excellent: 'Excellent',
  good: 'Good',
  neutral: 'Neutral',
  bad: 'Bad',
  awful: 'Awful',
};

export const MOOD_COLORS: Record<Mood, string> = {
  excellent: '#22c55e',
  good: '#86efac',
  neutral: '#facc15',
  bad: '#fb923c',
  awful: '#ef4444',
};
