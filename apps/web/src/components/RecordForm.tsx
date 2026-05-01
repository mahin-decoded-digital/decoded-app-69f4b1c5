import React, { useState, useEffect } from 'react';
import { X, Save, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { useRecordStore } from '@/stores/recordStore';
import { toast } from 'sonner';
import type { RecordFormData, ValidationErrors } from '@/types';

const CATEGORIES = [
  'Inventory',
  'Contacts',
  'Tasks',
  'Assets',
  'Projects',
  'Finance',
  'Other',
];

const EMPTY_FORM: RecordFormData = {
  name: '',
  category: 'Inventory',
  quantity: '',
  status: 'active',
  notes: '',
};

function validate(data: RecordFormData): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!data.name.trim()) {
    errors.name = 'Name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  if (!data.category.trim()) {
    errors.category = 'Category is required';
  }
  if (!data.quantity) {
    errors.quantity = 'Quantity is required';
  } else {
    const n = parseInt(data.quantity, 10);
    if (isNaN(n) || n < 0) errors.quantity = 'Must be a non-negative number';
    if (n > 999999) errors.quantity = 'Value too large';
  }
  return errors;
}

export function RecordForm() {
  const isFormOpen = useRecordStore((s) => s.isFormOpen);
  const editingRecord = useRecordStore((s) => s.editingRecord);
  const closeForm = useRecordStore((s) => s.closeForm);
  const addRecord = useRecordStore((s) => s.addRecord);
  const updateRecord = useRecordStore((s) => s.updateRecord);

  const [form, setForm] = useState<RecordFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (editingRecord) {
      setForm({
        name: editingRecord.name,
        category: editingRecord.category,
        quantity: String(editingRecord.quantity),
        status: editingRecord.status,
        notes: editingRecord.notes,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
    setTouched(new Set());
  }, [editingRecord, isFormOpen]);

  if (!isFormOpen) return null;

  const handleChange = (field: keyof RecordFormData, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (touched.has(field)) {
      const newErrors = validate(updated);
      setErrors(newErrors);
    }
  };

  const handleBlur = (field: keyof RecordFormData) => {
    const newTouched = new Set(touched);
    newTouched.add(field);
    setTouched(newTouched);
    const newErrors = validate(form);
    setErrors(newErrors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = new Set(['name', 'category', 'quantity', 'status', 'notes']);
    setTouched(allTouched);
    const newErrors = validate(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix the form errors before saving');
      return;
    }
    if (editingRecord) {
      updateRecord(editingRecord.id, form);
      toast.success('Record updated successfully');
    } else {
      addRecord(form);
      toast.success('Record created successfully');
    }
    closeForm();
  };

  const isEditing = !!editingRecord;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(15,15,35,0.55)', backdropFilter: 'blur(4px)' }}
        onClick={closeForm}
      />
      <div
        className="relative z-10 w-full max-w-lg brand-card brand-pop"
        style={{ background: 'var(--brand-surface-alt)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b border-[var(--brand-border)] px-6 py-4"
          style={{ background: 'var(--brand-gradient-soft)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg brand-gradient-bg"
            >
              {isEditing ? (
                <Save className="h-4 w-4 text-primary-foreground" />
              ) : (
                <Plus className="h-4 w-4 text-primary-foreground" />
              )}
            </div>
            <div>
              <h2 className="text-base font-700 text-foreground" style={{ fontWeight: 700 }}>
                {isEditing ? 'Edit Record' : 'New Record'}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isEditing ? 'Update the details below' : 'Fill in the details to create a record'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeForm}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-600" style={{ fontWeight: 600 }}>
              Name <span className="text-[var(--brand-rose)]">*</span>
            </Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="e.g. Blue Widget, John Doe, Task #1"
              className={errors.name && touched.has('name') ? 'border-[var(--brand-rose)]' : ''}
            />
            {errors.name && touched.has('name') && (
              <p className="text-xs text-[var(--brand-rose)] font-medium">{errors.name}</p>
            )}
          </div>

          {/* Category + Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-sm font-600" style={{ fontWeight: 600 }}>
                Category <span className="text-[var(--brand-rose)]">*</span>
              </Label>
              <Select
                id="category"
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
                onBlur={() => handleBlur('category')}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="quantity" className="text-sm font-600" style={{ fontWeight: 600 }}>
                Quantity <span className="text-[var(--brand-rose)]">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={form.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                onBlur={() => handleBlur('quantity')}
                placeholder="0"
                className={errors.quantity && touched.has('quantity') ? 'border-[var(--brand-rose)]' : ''}
              />
              {errors.quantity && touched.has('quantity') && (
                <p className="text-xs text-[var(--brand-rose)] font-medium">{errors.quantity}</p>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label htmlFor="status" className="text-sm font-600" style={{ fontWeight: 600 }}>
              Status
            </Label>
            <Select
              id="status"
              value={form.status}
              onChange={(e) => handleChange('status', e.target.value as RecordFormData['status'])}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-sm font-600" style={{ fontWeight: 600 }}>
              Notes
            </Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Optional notes or description..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--brand-border)]">
            <Button type="button" variant="outline" onClick={closeForm}>
              Cancel
            </Button>
            <button
              type="submit"
              className="btn-primary px-5 py-2 text-sm"
            >
              {isEditing ? 'Save Changes' : 'Create Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
