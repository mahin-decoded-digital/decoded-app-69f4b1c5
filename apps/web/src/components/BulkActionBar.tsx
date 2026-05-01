import { useState } from 'react';
import { Trash, X, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { useRecordStore } from '@/stores/recordStore';
import { toast } from 'sonner';

export function BulkActionBar() {
  const selectedIds = useRecordStore((s) => s.selectedIds);
  const clearSelection = useRecordStore((s) => s.clearSelection);
  const bulkDelete = useRecordStore((s) => s.bulkDelete);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (selectedIds.length === 0) return null;

  const handleBulkDelete = () => {
    setConfirmOpen(true);
  };

  const confirmBulkDelete = () => {
    const count = selectedIds.length;
    bulkDelete(selectedIds);
    toast.success(`${count} record${count > 1 ? 's' : ''} deleted`);
    setConfirmOpen(false);
  };

  return (
    <>
      <div
        className="flex items-center justify-between rounded-xl px-5 py-3 brand-pop"
        style={{ background: 'var(--brand-gradient)' }}
      >
        <div className="flex items-center gap-2.5">
          <CheckSquare className="h-5 w-5 text-primary-foreground opacity-80" />
          <span className="text-sm font-700 text-primary-foreground" style={{ fontWeight: 700 }}>
            {selectedIds.length} record{selectedIds.length > 1 ? 's' : ''} selected
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.3)] px-3 py-1.5 text-xs font-600 text-primary-foreground transition-colors hover:bg-[rgba(255,255,255,0.15)]"
            style={{ fontWeight: 600 }}
          >
            <Trash className="h-3.5 w-3.5" />
            Delete Selected
          </button>
          <button
            onClick={clearSelection}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-primary-foreground transition-colors hover:bg-[rgba(255,255,255,0.2)]"
            aria-label="Clear selection"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <DeleteConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={confirmBulkDelete}
        count={selectedIds.length}
      />
    </>
  );
}
