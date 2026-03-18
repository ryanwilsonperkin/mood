import { signal, effect } from '@preact/signals';

export interface Route {
  path: string;
  params: Record<string, string>;
}

function parseHash(): Route {
  const hash = window.location.hash.slice(1) || '/';
  const parts = hash.split('/').filter(Boolean);

  if (parts.length === 0) return { path: '/', params: {} };
  if (parts[0] === 'calendar') return { path: '/calendar', params: {} };
  if (parts[0] === 'today') return { path: '/today', params: {} };
  if (parts[0] === 'settings') return { path: '/settings', params: {} };
  if (parts[0] === 'edit' && parts[1]) return { path: '/edit', params: { date: parts[1] } };

  return { path: '/', params: {} };
}

export const route = signal<Route>(parseHash());

// Listen for hash changes
if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => {
    route.value = parseHash();
  });
}

export function navigate(path: string): void {
  window.location.hash = path;
}

// Re-export for convenience
export { effect };
