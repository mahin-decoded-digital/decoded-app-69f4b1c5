import type { Record } from '@/types';

function escapeCSV(val: string | number): string {
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function formatDate(d: Date): string {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return String(d);
  }
}

export function exportToCSV(records: Record[]): void {
  const headers = ['ID', 'Name', 'Category', 'Quantity', 'Status', 'Notes', 'Created At', 'Updated At'];
  const rows = records.map((r) => [
    r.id,
    r.name,
    r.category,
    r.quantity,
    r.status,
    r.notes,
    formatDate(r.createdAt),
    formatDate(r.updatedAt),
  ]);

  const csv = [headers, ...rows].map((row) => row.map(escapeCSV).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `quickbase-lite-export-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToExcel(records: Record[]): void {
  const headers = ['ID', 'Name', 'Category', 'Quantity', 'Status', 'Notes', 'Created At', 'Updated At'];
  const rows = records.map((r) => [
    r.id,
    r.name,
    r.category,
    r.quantity,
    r.status,
    r.notes,
    formatDate(r.createdAt),
    formatDate(r.updatedAt),
  ]);

  // Build a basic HTML table that Excel can open
  let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">';
  html += '<head><meta charset="UTF-8"></head><body><table>';
  html += '<tr>' + headers.map((h) => `<th><b>${h}</b></th>`).join('') + '</tr>';
  rows.forEach((row) => {
    html += '<tr>' + row.map((cell) => `<td>${String(cell).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>`).join('') + '</tr>';
  });
  html += '</table></body></html>';

  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `quickbase-lite-export-${new Date().toISOString().slice(0, 10)}.xls`;
  a.click();
  URL.revokeObjectURL(url);
}
