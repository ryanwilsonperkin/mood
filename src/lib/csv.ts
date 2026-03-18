import { today } from './dates';
import { MOODS, type Mood, type MoodEntry } from './types';

const HEADER = ['date', 'mood', 'note'] as const;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function quote(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

export function exportEntriesCsv(entries: MoodEntry[]): string {
  const lines = [HEADER.map(quote).join(',')];

  for (const entry of [...entries].sort((a, b) => a.date.localeCompare(b.date))) {
    lines.push([
      quote(entry.date),
      quote(entry.mood),
      quote(entry.text),
    ].join(','));
  }

  return `${lines.join('\r\n')}\r\n`;
}

export function exportFilename(): string {
  return `mood-export-${today()}.csv`;
}

export function parseEntriesCsv(input: string): MoodEntry[] {
  const rows = parseCsv(input.replace(/^\uFEFF/, ''));
  if (rows.length === 0) {
    throw new Error('CSV file is empty.');
  }

  const [header, ...dataRows] = rows;
  const normalizedHeader = header.map((cell) => cell.trim().toLowerCase());

  if (
    normalizedHeader.length !== HEADER.length ||
    normalizedHeader.some((cell, index) => cell !== HEADER[index])
  ) {
    throw new Error('CSV header must be: "date","mood","note"');
  }

  const byDate = new Map<string, MoodEntry>();

  dataRows.forEach((row, index) => {
    if (row.length === 1 && row[0] === '') return;
    if (row.length !== HEADER.length) {
      throw new Error(`Row ${index + 2} must have exactly 3 columns.`);
    }

    const [date, moodRaw, note] = row;
    const mood = moodRaw as Mood;

    if (!DATE_RE.test(date)) {
      throw new Error(`Row ${index + 2} has an invalid date: ${date}`);
    }

    if (!MOODS.includes(mood)) {
      throw new Error(`Row ${index + 2} has an invalid mood: ${moodRaw}`);
    }

    byDate.set(date, { date, mood, text: note });
  });

  return [...byDate.values()].sort((a, b) => b.date.localeCompare(a.date));
}

function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    const next = input[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }

    if (ch === ',') {
      row.push(cell);
      cell = '';
      continue;
    }

    if (ch === '\n') {
      row.push(cell.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }

    cell += ch;
  }

  if (inQuotes) {
    throw new Error('CSV has an unterminated quoted field.');
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell.replace(/\r$/, ''));
    rows.push(row);
  }

  return rows;
}
