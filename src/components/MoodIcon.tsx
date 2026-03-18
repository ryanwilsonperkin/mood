import type { Mood } from '../lib/types';
import { MOOD_COLORS, MOOD_LABELS } from '../lib/types';

interface Props {
  mood: Mood;
  size?: number;
}

interface EmptyProps {
  size?: number;
}

export function MoodIcon({ mood, size = 40 }: Props) {
  const color = MOOD_COLORS[mood];

  // All icons share the same face circle
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={mood}
    >
      <title>{MOOD_LABELS[mood]}</title>
      <circle cx="24" cy="24" r="22" fill={color} opacity="0.15" />
      <circle cx="24" cy="24" r="22" stroke={color} stroke-width="2" />
      {renderEyes(mood, color)}
      {renderMouth(mood, color)}
    </svg>
  );
}

export function EmptyMoodIcon({ size = 40 }: EmptyProps) {
  const color = '#8e8e93';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="No entry"
    >
      <title>No entry</title>
      <circle cx="24" cy="24" r="22" fill={color} opacity="0.08" />
      <circle cx="24" cy="24" r="22" stroke={color} stroke-width="2" opacity="0.7" />
    </svg>
  );
}

function renderEyes(mood: Mood, color: string) {
  if (mood === 'awful') {
    // X eyes
    return (
      <>
        <g stroke={color} stroke-width="2" stroke-linecap="round">
          <line x1="14" y1="16" x2="20" y2="22" />
          <line x1="20" y1="16" x2="14" y2="22" />
          <line x1="28" y1="16" x2="34" y2="22" />
          <line x1="34" y1="16" x2="28" y2="22" />
        </g>
      </>
    );
  }
  if (mood === 'excellent') {
    // Happy squint eyes (arcs)
    return (
      <g stroke={color} stroke-width="2" stroke-linecap="round" fill="none">
        <path d="M13 19 Q17 15 21 19" />
        <path d="M27 19 Q31 15 35 19" />
      </g>
    );
  }
  // Default dot eyes
  return (
    <>
      <circle cx="17" cy="19" r="2.5" fill={color} />
      <circle cx="31" cy="19" r="2.5" fill={color} />
    </>
  );
}

function renderMouth(mood: Mood, color: string) {
  switch (mood) {
    case 'excellent':
      return (
        <path
          d="M14 30 Q24 40 34 30"
          stroke={color}
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
        />
      );
    case 'good':
      return (
        <path
          d="M16 31 Q24 37 32 31"
          stroke={color}
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
        />
      );
    case 'neutral':
      return (
        <line
          x1="16"
          y1="32"
          x2="32"
          y2="32"
          stroke={color}
          stroke-width="2"
          stroke-linecap="round"
        />
      );
    case 'bad':
      return (
        <path
          d="M16 35 Q24 29 32 35"
          stroke={color}
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
        />
      );
    case 'awful':
      return (
        <path
          d="M14 37 Q24 28 34 37"
          stroke={color}
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
        />
      );
  }
}
