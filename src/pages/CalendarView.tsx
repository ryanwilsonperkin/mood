import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { getAllEntries } from '../lib/store';
import { recentDays, formatDisplayDate, today } from '../lib/dates';
import { EmptyMoodIcon, MoodIcon } from '../components/MoodIcon';
import { navigate } from '../lib/router';
import type { MoodEntry } from '../lib/types';

const PAGE_SIZE = 30;

export function CalendarView() {
  const [visibleDays, setVisibleDays] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const entries = getAllEntries();
  const entryMap = useMemo(() => {
    const map = new Map<string, MoodEntry>();
    for (const entry of entries) {
      map.set(entry.date, entry);
    }
    return map;
  }, [entries]);

  const days = useMemo(() => recentDays(visibleDays), [visibleDays]);
  const todayStr = today();

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleDays((count) => count + PAGE_SIZE);
        }
      },
      { rootMargin: '200px 0px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <div class="page">
      <h1>Your Mood</h1>
      <p class="subtitle">Showing {visibleDays} days, loading more as you scroll</p>
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
                {isToday ? <span class="today-badge">Today</span> : null}
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
                  <>
                    <EmptyMoodIcon size={32} />
                    <span class="entry-empty">No entry</span>
                  </>
                )}
              </div>
            </button>
          );
        })}
        <div ref={sentinelRef} class="calendar-loader">
          Scroll for older days
        </div>
      </div>
    </div>
  );
}
