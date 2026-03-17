import type { Mood } from '../lib/types';
import { MOODS, MOOD_LABELS, MOOD_COLORS } from '../lib/types';
import { MoodIcon } from './MoodIcon';

interface Props {
  selected: Mood | null;
  onSelect: (mood: Mood) => void;
}

export function MoodPicker({ selected, onSelect }: Props) {
  return (
    <div class="mood-picker">
      {MOODS.map((mood) => (
        <button
          key={mood}
          type="button"
          class={`mood-option ${selected === mood ? 'selected' : ''}`}
          onClick={() => onSelect(mood)}
          style={selected === mood ? { borderColor: MOOD_COLORS[mood] } : undefined}
        >
          <MoodIcon mood={mood} size={48} />
          <span class="mood-label">{MOOD_LABELS[mood]}</span>
        </button>
      ))}
    </div>
  );
}
