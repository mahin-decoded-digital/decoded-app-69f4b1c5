import { create } from 'zustand';
import { toast } from 'sonner';
import { apiUrl } from '@/lib/api';
import type { Record, SortConfig, RecordFormData } from '@/types';

interface RecordState {
  records: Record[];
  selectedIds: string[];
  searchQuery: string;
  sortConfig: SortConfig;
  currentPage: number;
  pageSize: number;
  editingRecord: Record | null;
  isFormOpen: boolean;
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

interface RecordActions {
  fetchRecords: () => Promise<void>;
  addRecord: (data: RecordFormData) => Promise<void>;
  updateRecord: (id: string, data: RecordFormData) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
  setSelectedIds: (ids: string[]) => void;
  toggleSelected: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  setSearchQuery: (query: string) => void;
  setSortConfig: (config: SortConfig) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  openForm: (record?: Record) => void;
  closeForm: () => void;
}

type RecordStore = RecordState & RecordActions;

export const useRecordStore = create<RecordStore>()(
  (set, get) => ({
    records: [],
    selectedIds: [],
    searchQuery: '',
    sortConfig: { field: 'createdAt', direction: 'desc' },
    currentPage: 1,
    pageSize: 10,
    editingRecord: null,
    isFormOpen: false,
    loading: false,
    loaded: false,
    error: null,

    fetchRecords: async () => {
      if (get().loading || get().loaded) return;
      set({ loading: true, error: null });
      try {
        const res = await fetch(apiUrl('/api/records'));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const records = await res.json();
        set({ records, loading: false, loaded: true });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load records';
        set({ loading: false, error: message });
        toast.error(message);
      }
    },

    addRecord: async (data: RecordFormData) => {
      try {
        const res = await fetch(apiUrl('/api/records'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name.trim(),
            category: data.category.trim(),
            quantity: parseInt(data.quantity, 10),
            status: data.status,
            notes: data.notes.trim(),
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const newRecord = await res.json();
        set((state) => ({ records: [newRecord, ...state.records] }));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create record';
        set({ error: message });
        toast.error(message);
      }
    },

    updateRecord: async (id: string, data: RecordFormData) => {
      const previous = get().records;
      set((state) => ({
        records: state.records.map((r) =>
          r.id === id
            ? {
                ...r,
                name: data.name.trim(),
                category: data.category.trim(),
                quantity: parseInt(data.quantity, 10),
                status: data.status,
                notes: data.notes.trim(),
                updatedAt: new Date(),
              }
            : r
        ),
      }));
      try {
        const res = await fetch(apiUrl(`/api/records/${id}`), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name.trim(),
            category: data.category.trim(),
            quantity: parseInt(data.quantity, 10),
            status: data.status,
            notes: data.notes.trim(),
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const updatedRecord = await res.json();
        set((state) => ({
          records: state.records.map((r) => (r.id === id ? updatedRecord : r)),
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update record';
        set({ records: previous, error: message });
        toast.error(message);
      }
    },

    deleteRecord: async (id: string) => {
      const previous = get().records;
      const previousSelected = get().selectedIds;
      set((state) => ({
        records: state.records.filter((r) => r.id !== id),
        selectedIds: state.selectedIds.filter((sid) => sid !== id),
      }));
      try {
        const res = await fetch(apiUrl(`/api/records/${id}`), {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete record';
        set({ records: previous, selectedIds: previousSelected, error: message });
        toast.error(`Could not delete the record — restoring it`);
      }
    },

    bulkDelete: async (ids: string[]) => {
      const previous = get().records;
      const idSet = new Set(ids);
      set((state) => ({
        records: state.records.filter((r) => !idSet.has(r.id)),
        selectedIds: [],
      }));
      try {
        await Promise.all(
          ids.map(async (id) => {
            const res = await fetch(apiUrl(`/api/records/${id}`), {
              method: 'DELETE',
            });
            if (!res.ok) throw new Error(`HTTP ${res.status} for id ${id}`);
          })
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete records';
        set({ records: previous, error: message });
        toast.error(`Could not delete some records — restoring them`);
      }
    },

    setSelectedIds: (ids: string[]) => {
      set({ selectedIds: ids });
    },

    toggleSelected: (id: string) => {
      const { selectedIds } = get();
      if (selectedIds.includes(id)) {
        set({ selectedIds: selectedIds.filter((sid) => sid !== id) });
      } else {
        set({ selectedIds: [...selectedIds, id] });
      }
    },

    selectAll: (ids: string[]) => {
      set({ selectedIds: ids });
    },

    clearSelection: () => {
      set({ selectedIds: [] });
    },

    setSearchQuery: (query: string) => {
      set({ searchQuery: query, currentPage: 1 });
    },

    setSortConfig: (config: SortConfig) => {
      set({ sortConfig: config, currentPage: 1 });
    },

    setCurrentPage: (page: number) => {
      set({ currentPage: page });
    },

    setPageSize: (size: number) => {
      set({ pageSize: size, currentPage: 1 });
    },

    openForm: (record?: Record) => {
      set({ editingRecord: record ?? null, isFormOpen: true });
    },

    closeForm: () => {
      set({ editingRecord: null, isFormOpen: false });
    },
  })
);