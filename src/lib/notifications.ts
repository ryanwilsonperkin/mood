import { getSettings } from './store';

export async function requestPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function getPermissionState(): NotificationPermission | 'unsupported' {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

export async function scheduleNotification(): Promise<void> {
  const settings = getSettings();
  if (!settings.notificationsEnabled) return;
  if (!('serviceWorker' in navigator)) return;

  const reg = await navigator.serviceWorker.ready;
  reg.active?.postMessage({
    type: 'SCHEDULE_NOTIFICATION',
    hour: settings.notificationHour,
    minute: settings.notificationMinute,
  });
}

export async function cancelNotification(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  const reg = await navigator.serviceWorker.ready;
  reg.active?.postMessage({ type: 'CANCEL_NOTIFICATION' });
}
