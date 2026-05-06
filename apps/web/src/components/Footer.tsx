import { Database, Github } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-12"
      style={{
        background: 'var(--brand-surface-alt)',
        borderTop: '1px solid var(--brand-border)',
      }}
    >
      <div className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ background: 'var(--brand-gradient)' }}
            >
              <Database className="h-3.5 w-3.5" style={{ color: '#ffffff' }} />
            </div>
            <span className="text-sm font-semibold text-foreground">QuickBase Lite</span>
          </div>

          {/* Tagline */}
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            Your data stays in your browser — private, instant, and always yours.
          </p>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            © {year} QuickBase Lite
          </p>
        </div>
      </div>
    </footer>
  );
}