import { Database, Zap, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

export function Navbar() {
  const isDark = useThemeStore((s) => s.isDark);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  return (
    <header
      className="sticky top-0 z-40 border-b border-[var(--brand-border)]"
      style={{ background: 'var(--navbar-bg)', backdropFilter: 'blur(12px)' }}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
        {/* Brand mark */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl brand-gradient-bg"
            style={{ boxShadow: '0 2px 12px rgba(124,58,237,0.35)' }}
          >
            <Database className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-xl brand-gradient-text"
              style={{ fontWeight: 800, letterSpacing: '-0.02em' }}
            >
              QuickBase
            </span>
            <span
              className="rounded-md px-1.5 py-0.5 text-[10px]"
              style={{
                background: 'var(--brand-gradient)',
                color: '#ffffff',
                fontWeight: 700,
              }}
            >
              LITE
            </span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-[var(--brand-amber)]" />
            <span className="font-medium">No cloud, no account — all yours</span>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`theme-toggle${isDark ? ' active' : ''}`}
          >
            <span className="theme-toggle-thumb" />
            <span className="sr-only">{isDark ? 'Light mode' : 'Dark mode'}</span>
          </button>

          {/* Icon indicator */}
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--brand-border)] transition-colors"
            style={{ background: isDark ? 'rgba(124,58,237,0.18)' : 'rgba(124,58,237,0.07)' }}
            aria-hidden="true"
          >
            {isDark ? (
              <Moon className="h-4 w-4 text-[var(--brand-violet)]" />
            ) : (
              <Sun className="h-4 w-4 text-[var(--brand-amber)]" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}