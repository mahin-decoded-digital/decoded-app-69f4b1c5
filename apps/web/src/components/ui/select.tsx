import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          'flex h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 pr-9 text-sm font-medium text-foreground transition-colors focus:border-[var(--brand-violet)] focus:outline-none focus:ring-2 focus:ring-[rgba(124,58,237,0.2)] disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

interface SelectOptionProps {
  value: string;
  children: React.ReactNode;
}

export function SelectOption({ value, children }: SelectOptionProps) {
  return <option value={value}>{children}</option>;
}
