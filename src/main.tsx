import { render } from 'preact';
import './index.css';
import { App } from './app';

render(<App />, document.getElementById('app')!);

if ('serviceWorker' in navigator) {
  const swUrl = `${import.meta.env.BASE_URL}sw.js`;
  navigator.serviceWorker.register(swUrl, { scope: import.meta.env.BASE_URL });
}
