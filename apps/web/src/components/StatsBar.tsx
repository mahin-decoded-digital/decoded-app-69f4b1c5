import { useMemo } from 'react';
import { Database, CheckCircle, Clock, XCircle, Hash } from 'lucide-react';
import type { Record } from '@/types';

interface StatsBarProps {
  records: Record[];
}

export function StatsBar({ records }: StatsBarProps) {
  const stats = useMemo(() => {
    const total = records.length;
    const active = records.filter((r) => r.status === 'active').length;
    const pending = records.filter((r) => r.status === 'pending').length;
    const inactive = records.filter((r) => r.status === 'inactive').length;
    const totalQty = records.reduce((sum, r) => sum + r.quantity, 0);
    return { total, active, pending, inactive, totalQty };
  }, [records]);

  const items = [
    {
      label: 'Total Records',
      value: stats.total,
      icon: Database,
      color: 'var(--brand-violet)',
      bg: 'rgba(124,58,237,0.1)',
    },
    {
      label: 'Active',
      value: stats.active,
      icon: CheckCircle,
      color: 'var(--brand-emerald)',
      bg: 'rgba(5,150,105,0.1)',
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'var(--brand-amber)',
      bg: 'rgba(217,119,6,0.1)',
    },
    {
      label: 'Inactive',
      value: stats.inactive,
      icon: XCircle,
      color: '#94a3b8',
      bg: 'rgba(148,163,184,0.1)',
    },
    {
      label: 'Total Qty',
      value: stats.totalQty.toLocaleString(),
      icon: Hash,
      color: 'var(--brand-blue)',
      bg: 'rgba(37,99,235,0.1)',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {items.map((item) => (
        <div
          key={item.label}
          className="brand-card flex items-center gap-3 px-4 py-3"
        >
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
            style={{ background: item.bg }}
          >
            <item.icon className="h-4 w-4" style={{ color: item.color }} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground truncate">{item.label}</p>
            <p
              className="text-lg font-800 leading-tight"
              style={{ fontWeight: 800, color: item.color }}
            >
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
