import { useMemo, useEffect } from 'react'
import { Navbar } from '@/components/Navbar';
import { StatsBar } from '@/components/StatsBar';
import { Toolbar } from '@/components/Toolbar';
import { BulkActionBar } from '@/components/BulkActionBar';
import { DataTable } from '@/components/DataTable';
import { RecordForm } from '@/components/RecordForm';
import { Footer } from '@/components/Footer';
import { useRecordStore } from '@/stores/recordStore';
import { Database, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const fetchRecords = useRecordStore((s) => s.fetchRecords);
  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const records = useRecordStore((s) => s.records);
  const searchQuery = useRecordStore((s) => s.searchQuery);
  const activeTags = useRecordStore((s) => s.activeTags);
  const openForm = useRecordStore((s) => s.openForm);

  const filteredRecords = useMemo(() => {
    let result = records;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.notes.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q) ||
          (r.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    }

    // Tag filter — record must have ALL active tags
    if (activeTags.length > 0) {
      result = result.filter((r) =>
        activeTags.every((tag) => (r.tags ?? []).includes(tag))
      );
    }

    return result;
  }, [records, searchQuery, activeTags]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--brand-surface)' }}>
      <Navbar />

      <main className="mx-auto w-full max-w-[1400px] flex-1 space-y-6 px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl tracking-tight" style={{ fontWeight: 800 }}>
              <span className="brand-gradient-text">Data Manager</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create, organize, and export records — stored privately in your browser.
            </p>
          </div>
          {records.length > 0 && (
            <div
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium"
              style={{
                background: 'var(--brand-gradient-soft)',
                border: '1px solid var(--brand-border)',
                color: 'var(--brand-violet)',
              }}
            >
              <Database className="h-4 w-4" />
              {records.length} record{records.length !== 1 ? 's' : ''} stored locally
            </div>
          )}
        </div>

        {/* Stats */}
        <StatsBar records={records} />

        {/* Toolbar (includes TagFilter) */}
        <Toolbar filteredRecords={filteredRecords} />

        {/* Bulk action bar */}
        <BulkActionBar />

        {/* Empty state for zero records */}
        {records.length === 0 ? (
          <div
            className="brand-card flex flex-col items-center justify-center py-24 text-center"
            style={{ background: 'var(--brand-surface-alt)' }}
          >
            <div
              className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl"
              style={{
                background: 'var(--brand-gradient-soft)',
                border: '2px dashed var(--brand-border)',
              }}
            >
              <span className="text-5xl">📊</span>
            </div>
            <h2 className="text-2xl text-foreground" style={{ fontWeight: 800 }}>
              Your ledger is empty — let's fill it
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Add your first record to start managing inventory, contacts, logs, or any
              structured data. No cloud account needed — everything saves instantly to your
              browser.
            </p>
            <button
              className="btn-primary mt-6 flex items-center gap-2 px-6 py-2.5 text-sm"
              onClick={() => openForm()}
            >
              Create Your First Record
              <ArrowRight className="h-4 w-4" />
            </button>
            <div className="mt-8 grid max-w-sm grid-cols-3 gap-6 text-center">
              {[
                { emoji: '📦', label: 'Inventory' },
                { emoji: '👤', label: 'Contacts' },
                { emoji: '📝', label: 'Task Logs' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-1">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <DataTable records={records} filteredRecords={filteredRecords} />
        )}
      </main>

      <Footer />
      <RecordForm />
    </div>
  );
}