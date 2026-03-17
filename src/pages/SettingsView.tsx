export function SettingsView() {
  return (
    <div class="page">
      <h1>Settings</h1>

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
