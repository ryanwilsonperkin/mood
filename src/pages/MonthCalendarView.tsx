import { useMemo, useState } from 'preact/hooks';
import { getAllEntries } from '../lib/store';
import { formatDate, today } from '../lib/dates';
import { navigate } from '../lib/router';
import { MOOD_COLORS, MOOD_LABELS, type MoodEntry } from '../lib/types';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function MonthCalendarView() {
  const [monthDate, setMonthDate] = useState(() => startOfMonth(new Date()));
  const todayStr = today();

  const entries = getAllEntries();
  const entryMap = useMemo(() => {
    const map = new Map<string, MoodEntry>();
    for (const entry of entries) {
      map.set(entry.date, entry);
    }
    return map;
  }, [entries]);

  const cells = useMemo(() => buildMonthCells(monthDate), [monthDate]);

  return (
    <div class="page">
      <h1>Calendar</h1>

      <div class="month-header">
        <button
          class="month-nav-button"
          aria-label="Previous month"
          onClick={() => setMonthDate(addMonths(monthDate, -1))}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14 6l-6 6 6 6" />
          </svg>
        </button>
        <div class="month-title">{formatMonthLabel(monthDate)}</div>
        <button
          class="month-nav-button"
          aria-label="Next month"
          onClick={() => setMonthDate(addMonths(monthDate, 1))}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      <div class="month-grid" role="grid" aria-label={formatMonthLabel(monthDate)}>
        {WEEKDAYS.map((weekday) => (
          <div key={weekday} class="month-weekday" role="columnheader">
            {weekday}
          </div>
        ))}

        {cells.map((cell, index) => {
          if (!cell) {
            return <div key={`blank-${index}`} class="month-day month-day-empty" aria-hidden="true" />;
          }

          const entry = entryMap.get(cell.date);
          const isToday = cell.date === todayStr;
          const color = entry ? MOOD_COLORS[entry.mood] : undefined;
          const title = entry
            ? `${cell.date}: ${MOOD_LABELS[entry.mood]}${entry.text ? ` — ${entry.text}` : ''}`
            : `${cell.date}: No entry`;

          return (
            <button
              key={cell.date}
              class={`month-day ${entry ? 'has-entry' : ''} ${isToday ? 'today' : ''}`}
              style={color ? { backgroundColor: `${color}22`, borderColor: `${color}88` } : undefined}
              title={title}
              onClick={() => navigate(cell.date === todayStr ? '/today' : `/edit/${cell.date}`)}
            >
              <span class="month-day-number">{cell.day}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function formatMonthLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function buildMonthCells(monthDate: Date): Array<{ date: string; day: number } | null> {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<{ date: string; day: number } | null> = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      date: formatDate(new Date(year, month, day)),
      day,
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}
