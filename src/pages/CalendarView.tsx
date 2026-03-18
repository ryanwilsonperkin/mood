import { getAllEntries } from '../lib/store';
import { lastNDays, formatDisplayDate, today } from '../lib/dates';
import { MoodIcon } from '../components/MoodIcon';
import { navigate } from '../lib/router';
import type { MoodEntry } from '../lib/types';

export function CalendarView() {
  const entries = getAllEntries();
  const entryMap = new Map<string, MoodEntry>();
  for (const e of entries) {
    entryMap.set(e.date, e);
  }

  const days = lastNDays(30);
  const todayStr = today();

  return (
    <div class="page">
      <h1>Your Mood</h1>
      <p class="subtitle">Last 30 days</p>
      <div class="calendar-list">
        {days.map((date) => {
          const entry = entryMap.get(date);
          const isToday = date === todayStr;
          return (
            <button
              key={date}
              class={`calendar-entry ${entry ? 'has-mood' : 'empty'} ${isToday ? 'today' : ''}`}
              onClick={() => {
                if (isToday) {
                  navigate('/today');
                } else {
                  navigate(`/edit/${date}`);
                }
              }}
            >
              <div class="entry-date">
                {isToday ? (
                  <span class="today-badge">Today</span>
                ) : null}
                <span>{formatDisplayDate(date)}</span>
              </div>
              <div class="entry-content">
                {entry ? (
                  <>
                    <MoodIcon mood={entry.mood} size={32} />
                    <span class={`entry-text ${entry.text ? '' : 'placeholder'}`}>
                      {entry.text || 'No note recorded'}
                    </span>
                  </>
                ) : (
                  <span class="entry-empty">No entry</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
