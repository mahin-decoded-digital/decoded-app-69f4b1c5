import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
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
  activeTags: string[];
}

interface RecordActions {
  fetchRecords: () => Promise<void>;
  addRecord: (data: RecordFormData) => void;
  updateRecord: (id: string, data: RecordFormData) => void;
  deleteRecord: (id: string) => void;
  bulkDelete: (ids: string[]) => void;
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
  setActiveTags: (tags: string[]) => void;
  toggleActiveTag: (tag: string) => void;
}

type RecordStore = RecordState & RecordActions;

let idCounter = 1;
function generateId(): string {
  return `rec_${Date.now()}_${idCounter++}`;
}

export const useRecordStore = create<RecordStore>()(
  persist(
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
      loaded: true,
      error: null,
      activeTags: [],

      fetchRecords: async () => {
        // Data is persisted locally — no network fetch needed.
        set({ loaded: true });
      },

      addRecord: (data: RecordFormData) => {
        const now = new Date();
        const newRecord: Record = {
          id: generateId(),
          createdAt: now,
          updatedAt: now,
          name: data.name.trim(),
          category: data.category.trim(),
          quantity: parseInt(data.quantity, 10),
          status: data.status,
          notes: data.notes.trim(),
          tags: data.tags ?? [],
        };
        set((state) => ({ records: [newRecord, ...state.records] }));
      },

      updateRecord: (id: string, data: RecordFormData) => {
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
                  tags: data.tags ?? [],
                  updatedAt: new Date(),
                }
              : r
          ),
        }));
      },

      deleteRecord: (id: string) => {
        const record = get().records.find((r) => r.id === id);
        set((state) => ({
          records: state.records.filter((r) => r.id !== id),
          selectedIds: state.selectedIds.filter((sid) => sid !== id),
        }));
        if (record) {
          toast.success(`"${record.name}" deleted`);
        }
      },

      bulkDelete: (ids: string[]) => {
        const idSet = new Set(ids);
        set((state) => ({
          records: state.records.filter((r) => !idSet.has(r.id)),
          selectedIds: [],
        }));
        toast.success(`${ids.length} record${ids.length !== 1 ? 's' : ''} deleted`);
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

      setActiveTags: (tags: string[]) => {
        set({ activeTags: tags, currentPage: 1 });
      },

      toggleActiveTag: (tag: string) => {
        const { activeTags } = get();
        if (activeTags.includes(tag)) {
          set({ activeTags: activeTags.filter((t) => t !== tag), currentPage: 1 });
        } else {
          set({ activeTags: [...activeTags, tag], currentPage: 1 });
        }
      },
    }),
    {
      name: 'quickbase-lite-records',
      partialize: (state) => ({
        records: state.records,
      }),
    }
  )
);