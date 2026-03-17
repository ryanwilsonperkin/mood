import { render } from 'preact';
import './index.css';
import { App } from './app';
import { scheduleNotification } from './lib/notifications';

render(<App />, document.getElementById('app')!);

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(() => {
    // Re-schedule notification on load (in case SW restarted)
    scheduleNotification();
  });
}
