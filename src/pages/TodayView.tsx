import { useState } from 'preact/hooks';
import { today } from '../lib/dates';
import { getEntry, saveEntry } from '../lib/store';
import { MoodPicker } from '../components/MoodPicker';
import { navigate } from '../lib/router';
import type { Mood } from '../lib/types';

export function TodayView() {
  const todayStr = today();
  const existing = getEntry(todayStr);

  const [mood, setMood] = useState<Mood | null>(existing?.mood ?? null);
  const [text, setText] = useState(existing?.text ?? '');
  function handleSave() {
    if (!mood) return;
    saveEntry({ date: todayStr, mood, text: text.trim() });
    navigate('/');
  }

  return (
    <div class="page">
      <div class="edit-header">
        <button class="btn-back" onClick={() => navigate('/')}>
          ← Back
        </button>
      </div>
      <h1>{existing ? 'Update Today' : "How's your day?"}</h1>
      <p class="subtitle">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>

      <MoodPicker selected={mood} onSelect={setMood} />

      <div class="text-input-group">
        <label for="mood-text">Notes (optional)</label>
        <textarea
          id="mood-text"
          value={text}
          onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
          placeholder="What's on your mind?"
          rows={3}
        />
      </div>

      <button
        class="btn-primary"
        onClick={handleSave}
        disabled={!mood}
      >
        {existing ? 'Update' : 'Save'}
      </button>
    </div>
  );
}
