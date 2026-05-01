import { useMemo, useState } from 'react';
import {ChevronUp, ChevronDown, ChevronsDown, Edit, Trash, ChevronLeft, ChevronRight} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { Select } from '@/components/ui/select';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { useRecordStore } from '@/stores/recordStore';
import { toast } from 'sonner';
import type { Record, SortField, SortDirection } from '@/types';

interface DataTableProps {
  records: Record[];
  filteredRecords: Record[];
}

function StatusBadge({ status }: { status: Record['status'] }) {
  const cls =
    status === 'active'
      ? 'status-active'
      : status === 'pending'
      ? 'status-pending'
      : 'status-inactive';
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${cls}`}
      style={{ fontWeight: 600 }}
    >
      {label}
    </span>
  );
}

function SortIcon({
  field,
  sortField,
  sortDir,
}: {
  field: SortField;
  sortField: SortField;
  sortDir: SortDirection;
}) {
  if (field !== sortField) return <ChevronsDown className="sort-indicator h-3.5 w-3.5" />;
  return sortDir === 'asc' ? (
    <ChevronUp className="sort-indicator active h-3.5 w-3.5" />
  ) : (
    <ChevronDown className="sort-indicator active h-3.5 w-3.5" />
  );
}

export function DataTable({ filteredRecords }: DataTableProps) {
  const selectedIds = useRecordStore((s) => s.selectedIds);
  const sortConfig = useRecordStore((s) => s.sortConfig);
  const currentPage = useRecordStore((s) => s.currentPage);
  const pageSize = useRecordStore((s) => s.pageSize);
  const toggleSelected = useRecordStore((s) => s.toggleSelected);
  const selectAll = useRecordStore((s) => s.selectAll);
  const clearSelection = useRecordStore((s) => s.clearSelection);
  const setSortConfig = useRecordStore((s) => s.setSortConfig);
  const setCurrentPage = useRecordStore((s) => s.setCurrentPage);
  const setPageSize = useRecordStore((s) => s.setPageSize);
  const openForm = useRecordStore((s) => s.openForm);
  const deleteRecord = useRecordStore((s) => s.deleteRecord);

  const [deleteTarget, setDeleteTarget] = useState<Record | null>(null);

  const sorted = useMemo(() => {
    const { field, direction } = sortConfig;
    return [...filteredRecords].sort((a, b) => {
      let aVal: string | number = String(a[field]);
      let bVal: string | number = String(b[field]);
      if (field === 'quantity') {
        aVal = a.quantity;
        bVal = b.quantity;
      } else if (field === 'createdAt' || field === 'updatedAt') {
        aVal = new Date(a[field]).getTime();
        bVal = new Date(b[field]).getTime();
      } else {
        aVal = String(a[field]).toLowerCase();
        bVal = String(b[field]).toLowerCase();
      }
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredRecords, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * pageSize;
  const paginated = useMemo(
    () => sorted.slice(start, start + pageSize),
    [sorted, start, pageSize]
  );

  const pageIds = useMemo(() => paginated.map((r) => r.id), [paginated]);
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
  const somePageSelected = pageIds.some((id) => selectedIds.includes(id));

  const handleSort = (field: SortField) => {
    if (sortConfig.field === field) {
      setSortConfig({
        field,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setSortConfig({ field, direction: 'asc' });
    }
  };

  const handleSelectAllPage = () => {
    if (allPageSelected) {
      clearSelection();
    } else {
      selectAll(pageIds);
    }
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteRecord(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" deleted`);
      setDeleteTarget(null);
    }
  };

  const columns: { field: SortField; label: string; sortable: boolean }[] = [
    { field: 'name', label: 'Name', sortable: true },
    { field: 'category', label: 'Category', sortable: true },
    { field: 'quantity', label: 'Qty', sortable: true },
    { field: 'status', label: 'Status', sortable: true },
    { field: 'notes', label: 'Notes', sortable: false },
    { field: 'createdAt', label: 'Created', sortable: true },
  ];

  return (
    <div className="brand-card overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr
              style={{
                background: 'var(--brand-gradient-soft)',
                borderBottom: '1px solid var(--brand-border)',
              }}
            >
              <th className="w-10 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = somePageSelected && !allPageSelected;
                  }}
                  onChange={handleSelectAllPage}
                  className="h-4 w-4 cursor-pointer rounded"
                  style={{ accentColor: 'var(--brand-violet)' }}
                  aria-label="Select all on page"
                />
              </th>
              {columns.map((col) => (
                <th
                  key={col.field}
                  className={`px-4 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground ${
                    col.sortable ? 'table-header-cell' : ''
                  }`}
                  style={{ fontWeight: 700 }}
                  onClick={col.sortable ? () => handleSort(col.field) : undefined}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <SortIcon
                        field={col.field}
                        sortField={sortConfig.field}
                        sortDir={sortConfig.direction}
                      />
                    )}
                  </span>
                </th>
              ))}
              <th
                className="px-4 py-3 text-right text-xs uppercase tracking-wide text-muted-foreground"
                style={{ fontWeight: 700 }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-2xl"
                      style={{ background: 'var(--brand-gradient-soft)' }}
                    >
                      <span className="text-3xl">📋</span>
                    </div>
                    <p
                      className="text-base text-foreground"
                      style={{ fontWeight: 700 }}
                    >
                      No records match your search
                    </p>
                    <p className="max-w-xs text-sm text-muted-foreground">
                      Try a different keyword or clear the search to see all records.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((record, idx) => {
                const isSelected = selectedIds.includes(record.id);
                return (
                  <tr
                    key={record.id}
                    className={`border-b border-[var(--brand-border)] transition-colors hover:bg-muted/30 ${
                      isSelected ? 'row-selected' : ''
                    } ${idx % 2 === 0 ? '' : 'bg-muted/10'}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelected(record.id)}
                        className="h-4 w-4 cursor-pointer rounded"
                        style={{ accentColor: 'var(--brand-violet)' }}
                        aria-label={`Select ${record.name}`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-foreground" style={{ fontWeight: 600 }}>
                        {record.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center rounded-md px-2 py-0.5 text-xs"
                        style={{
                          fontWeight: 600,
                          background: 'rgba(37,99,235,0.1)',
                          color: 'var(--brand-blue)',
                          border: '1px solid rgba(37,99,235,0.2)',
                        }}
                      >
                        {record.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-sm"
                        style={{
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--brand-violet)',
                        }}
                      >
                        {record.quantity.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={record.status} />
                    </td>
                    <td className="max-w-[200px] px-4 py-3">
                      <span className="block truncate text-xs text-muted-foreground">
                        {record.notes || '—'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Tooltip content="Edit record" side="top">
                          <button
                            onClick={() => openForm(record)}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-[rgba(37,99,235,0.1)] hover:text-[var(--brand-blue)]"
                            aria-label="Edit"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                        </Tooltip>
                        <Tooltip content="Delete record" side="top">
                          <button
                            onClick={() => setDeleteTarget(record)}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-[rgba(225,29,72,0.1)] hover:text-[var(--brand-rose)]"
                            aria-label="Delete"
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--brand-border)] px-5 py-3"
        style={{ background: 'var(--brand-gradient-soft)' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {sorted.length === 0
              ? 'No records'
              : `Showing ${start + 1}–${Math.min(start + pageSize, sorted.length)} of ${sorted.length}`}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Per page:</span>
            <Select
              value={String(pageSize)}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="h-7 w-16 py-0 pl-2 text-xs"
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(1)}
            disabled={safePage === 1}
            className="h-7 px-2 text-xs"
          >
            First
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(safePage - 1)}
            disabled={safePage === 1}
            className="h-7 w-7"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <span className="min-w-[80px] text-center text-xs font-medium text-foreground">
            Page {safePage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(safePage + 1)}
            disabled={safePage === totalPages}
            className="h-7 w-7"
            aria-label="Next page"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={safePage === totalPages}
            className="h-7 px-2 text-xs"
          >
            Last
          </Button>
        </div>
      </div>

      <DeleteConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
        recordName={deleteTarget?.name}
      />
    </div>
  );
}
