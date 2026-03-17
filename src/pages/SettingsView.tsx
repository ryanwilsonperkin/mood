import { useState } from 'preact/hooks';
import { getSettings, saveSettings } from '../lib/store';
import {
  requestPermission,
  getPermissionState,
  scheduleNotification,
  cancelNotification,
} from '../lib/notifications';

export function SettingsView() {
  const [settings, setSettings] = useState(getSettings);
  const [permState, setPermState] = useState(getPermissionState);

  async function toggleNotifications() {
    if (!settings.notificationsEnabled) {
      const granted = await requestPermission();
      if (!granted) {
        setPermState(getPermissionState());
        return;
      }
      const next = { ...settings, notificationsEnabled: true };
      saveSettings(next);
      setSettings(next);
      setPermState('granted');
      await scheduleNotification();
    } else {
      const next = { ...settings, notificationsEnabled: false };
      saveSettings(next);
      setSettings(next);
      await cancelNotification();
    }
  }

  function handleTimeChange(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    const [h, m] = val.split(':').map(Number);
    const next = { ...settings, notificationHour: h, notificationMinute: m };
    saveSettings(next);
    setSettings(next);
    if (next.notificationsEnabled) {
      scheduleNotification();
    }
  }

  const timeValue = `${String(settings.notificationHour).padStart(2, '0')}:${String(settings.notificationMinute).padStart(2, '0')}`;

  return (
    <div class="page">
      <h1>Settings</h1>

      <div class="settings-section">
        <h2>Daily Reminder</h2>

        {permState === 'unsupported' ? (
          <p class="settings-note">Notifications are not supported in this browser.</p>
        ) : permState === 'denied' ? (
          <p class="settings-note">
            Notification permission was denied. Please enable it in your browser settings.
          </p>
        ) : (
          <>
            <label class="toggle-row">
              <span>Enable daily reminder</span>
              <input
                type="checkbox"
                checked={settings.notificationsEnabled}
                onChange={toggleNotifications}
              />
            </label>

            {settings.notificationsEnabled ? (
              <label class="time-row">
                <span>Reminder time</span>
                <input
                  type="time"
                  value={timeValue}
                  onChange={handleTimeChange}
                />
              </label>
            ) : null}
          </>
        )}
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
