export function today(): string {
  return formatDate(new Date());
}

export function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatDisplayDate(s: string): string {
  const d = parseDate(s);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function recentDays(count: number, offset = 0): string[] {
  const dates: string[] = [];
  const d = new Date();
  d.setDate(d.getDate() - offset);

  for (let i = 0; i < count; i++) {
    dates.push(formatDate(d));
    d.setDate(d.getDate() - 1);
  }

  return dates;
}

/** Get array of date strings for the last N days */
export function lastNDays(n: number): string[] {
  return recentDays(n);
}
