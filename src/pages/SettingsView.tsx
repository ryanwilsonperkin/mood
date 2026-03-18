import { useRef, useState } from 'preact/hooks';
import { exportEntriesCsv, exportFilename, parseEntriesCsv } from '../lib/csv';
import { getAllEntries, importEntries } from '../lib/store';

export function SettingsView() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleExport() {
    const csv = exportEntriesCsv(getAllEntries());
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = exportFilename();
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setError(null);
    setStatus('Exported your entries as CSV.');
  }

  async function handleImport(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const entries = parseEntriesCsv(text);
      const count = importEntries(entries);
      setError(null);
      setStatus(`Imported ${count} entr${count === 1 ? 'y' : 'ies'} from CSV.`);
    } catch (err) {
      setStatus(null);
      setError(err instanceof Error ? err.message : 'Failed to import CSV.');
    } finally {
      input.value = '';
    }
  }

  return (
    <div class="page">
      <h1>Settings</h1>

      <div class="settings-section">
        <h2>Import & Export</h2>
        <p class="settings-note">
          Export your mood history as CSV or import a CSV with the columns
          {' '}
          <code>"date"</code>, <code>"mood"</code>, and <code>"note"</code>.
        </p>
        <div class="button-row settings-actions">
          <button class="btn-secondary" onClick={handleExport}>
            Export CSV
          </button>
          <button class="btn-primary" onClick={() => fileInputRef.current?.click()}>
            Import CSV
          </button>
          <input
            ref={fileInputRef}
            class="file-input"
            type="file"
            accept=".csv,text/csv"
            onChange={handleImport}
          />
        </div>
        <p class="settings-note settings-detail">
          Import merges entries by date and replaces any existing entry for the same day.
        </p>
        {status ? <p class="settings-success">{status}</p> : null}
        {error ? <p class="settings-error">{error}</p> : null}
      </div>

      <div class="settings-section">
        <h2>Install & Offline</h2>
        <p class="settings-note">
          Mood is installable as a PWA and works offline after it has been opened once.
        </p>
        <ul class="settings-list">
          <li>On iPhone/iPad: Share → Add to Home Screen</li>
          <li>On Android Chrome: Install app from the browser menu</li>
          <li>On desktop Chrome/Edge: use the install icon in the address bar</li>
        </ul>
      </div>

      <div class="settings-section">
        <h2>About</h2>
        <p class="settings-note">
          Mood is a local-first mood tracker. All data stays on your device.
          No accounts, no cloud sync.
        </p>
      </div>
    </div>
  );
}
