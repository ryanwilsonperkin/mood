import { route } from './lib/router';
import { NavBar } from './components/NavBar';
import { CalendarView } from './pages/CalendarView';
import { TodayView } from './pages/TodayView';
import { EditView } from './pages/EditView';
import { SettingsView } from './pages/SettingsView';

export function App() {
  const { path, params } = route.value;

  let page;
  switch (path) {
    case '/today':
      page = <TodayView />;
      break;
    case '/edit':
      page = <EditView date={params.date} />;
      break;
    case '/settings':
      page = <SettingsView />;
      break;
    default:
      page = <CalendarView />;
  }

  return (
    <div class="app-shell">
      <main class="app-main">{page}</main>
      <NavBar />
    </div>
  );
}
