import { useState } from 'preact/hooks';
import { formatDisplayDate } from '../lib/dates';
import { getEntry, saveEntry, deleteEntry } from '../lib/store';
import { MoodPicker } from '../components/MoodPicker';
import { navigate } from '../lib/router';
import type { Mood } from '../lib/types';

interface Props {
  date: string;
}

export function EditView({ date }: Props) {
  const existing = getEntry(date);

  const [mood, setMood] = useState<Mood | null>(existing?.mood ?? null);
  const [text, setText] = useState(existing?.text ?? '');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    if (!mood) return;
    saveEntry({ date, mood, text: text.trim() });
    setSaved(true);
    setTimeout(() => navigate('/'), 600);
  }

  function handleDelete() {
    if (confirm('Delete this entry?')) {
      deleteEntry(date);
      navigate('/');
    }
  }

  return (
    <div class="page">
      <div class="edit-header">
        <button class="btn-back" onClick={() => navigate('/')}>
          ← Back
        </button>
      </div>
      <h1>{existing ? 'Edit Entry' : 'Add Entry'}</h1>
      <p class="subtitle">{formatDisplayDate(date)}</p>

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

      <div class="button-row">
        <button
          class="btn-primary"
          onClick={handleSave}
          disabled={!mood || saved}
        >
          {saved ? '✓ Saved!' : existing ? 'Update' : 'Save'}
        </button>
        {existing ? (
          <button class="btn-danger" onClick={handleDelete}>
            Delete
          </button>
        ) : null}
      </div>
    </div>
  );
}
