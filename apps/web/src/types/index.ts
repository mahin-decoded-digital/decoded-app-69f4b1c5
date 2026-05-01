export interface Record {
  id: string;
  createdAt: Date;
  name: string;
  category: string;
  quantity: number;
  status: 'active' | 'inactive' | 'pending';
  notes: string;
  updatedAt: Date;
}

export type SortField = keyof Record;
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface RecordFormData {
  name: string;
  category: string;
  quantity: string;
  status: 'active' | 'inactive' | 'pending';
  notes: string;
}

export interface ValidationErrors {
  name?: string;
  category?: string;
  quantity?: string;
  status?: string;
  notes?: string;
}
