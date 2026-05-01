import { Search, Plus, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRecordStore } from '@/stores/recordStore';
import { exportToCSV, exportToExcel } from '@/lib/export';
import { toast } from 'sonner';
import type { Record } from '@/types';

interface ToolbarProps {
  filteredRecords: Record[];
}

export function Toolbar({ filteredRecords }: ToolbarProps) {
  const searchQuery = useRecordStore((s) => s.searchQuery);
  const setSearchQuery = useRecordStore((s) => s.setSearchQuery);
  const openForm = useRecordStore((s) => s.openForm);

  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      toast.error('No records to export');
      return;
    }
    exportToCSV(filteredRecords);
    toast.success(`Exported ${filteredRecords.length} records to CSV`);
  };

  const handleExportExcel = () => {
    if (filteredRecords.length === 0) {
      toast.error('No records to export');
      return;
    }
    exportToExcel(filteredRecords);
    toast.success(`Exported ${filteredRecords.length} records to Excel`);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name, category, notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          className="gap-1.5 text-xs"
        >
          <Download className="h-3.5 w-3.5" />
          CSV
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportExcel}
          className="gap-1.5 text-xs"
        >
          <FileText className="h-3.5 w-3.5" />
          Excel
        </Button>
        <button
          onClick={() => openForm()}
          className="btn-primary flex items-center gap-1.5 px-4 py-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          New Record
        </button>
      </div>
    </div>
  );
}
