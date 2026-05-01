import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  count?: number;
  recordName?: string;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  count,
  recordName,
}: DeleteConfirmDialogProps) {
  const isBulk = count !== undefined && count > 1;
  const label = isBulk
    ? `${count} records`
    : recordName
    ? `"${recordName}"`
    : 'this record';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(225,29,72,0.1)]">
            <AlertTriangle className="h-6 w-6 text-[var(--brand-rose)]" />
          </div>
          <DialogTitle className="text-lg font-700" style={{ fontWeight: 700 }}>
            Delete {isBulk ? `${count} records` : 'record'}?
          </DialogTitle>
          <DialogDescription>
            You are about to permanently delete {label}. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Delete {isBulk ? `${count} records` : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
