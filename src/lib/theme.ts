/**
 * App theme handling. The chosen theme ('dark' | 'light' | 'system') is stored
 * inside the persisted settings object (see SettingsPage). Applying a theme sets
 * `data-theme` on <html> to the *resolved* value ('dark' | 'light'), which flips
 * the CSS custom properties declared in globals.css.
 */
export type ThemeChoice = 'dark' | 'light' | 'system';

const SETTINGS_KEY = 'ourframe:settings';
const SYSTEM_QUERY = '(prefers-color-scheme: dark)';

export function getStoredTheme(): ThemeChoice {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const theme = (JSON.parse(raw) as { theme?: unknown }).theme;
      if (theme === 'dark' || theme === 'light' || theme === 'system') return theme;
    }
  } catch {
    /* ignore malformed storage */
  }
  return 'dark';
}

export function resolveTheme(choice: ThemeChoice): 'dark' | 'light' {
  if (choice === 'system') {
    return window.matchMedia(SYSTEM_QUERY).matches ? 'dark' : 'light';
  }
  return choice;
}

export function applyTheme(choice: ThemeChoice): void {
  document.documentElement.setAttribute('data-theme', resolveTheme(choice));
}

/**
 * Applies the stored theme immediately and keeps it in sync with the OS when the
 * user picked "System". Returns a cleanup function for the system listener.
 */
export function initTheme(): () => void {
  applyTheme(getStoredTheme());
  const mq = window.matchMedia(SYSTEM_QUERY);
  const onChange = () => {
    if (getStoredTheme() === 'system') applyTheme('system');
  };
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}
