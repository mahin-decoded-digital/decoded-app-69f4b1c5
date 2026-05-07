import { useState, useMemo, KeyboardEvent } from 'react';
import { X, Tag } from 'lucide-react';
import { useRecordStore } from '@/stores/recordStore';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export function TagInput({ value, onChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const records = useRecordStore((s) => s.records);

  // Collect all existing tags from records for suggestions
  const allExistingTags = useMemo(() => {
    const tagSet = new Set<string>();
    records.forEach((r) => {
      (r.tags ?? []).forEach((t) => tagSet.add(t));
    });
    return Array.from(tagSet).sort();
  }, [records]);

  const suggestions = useMemo(() => {
    const q = inputValue.trim().toLowerCase();
    if (!q) return allExistingTags.filter((t) => !value.includes(t));
    return allExistingTags.filter(
      (t) => t.toLowerCase().includes(q) && !value.includes(t)
    );
  }, [inputValue, allExistingTags, value]);

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase().replace(/\s+/g, '-');
    if (!tag || value.includes(tag)) return;
    onChange([...value, tag]);
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="space-y-2">
      {/* Tag pills */}
      <div
        className="flex min-h-[38px] flex-wrap items-center gap-1.5 rounded-lg border border-[var(--brand-border)] bg-background px-3 py-2 transition-colors focus-within:border-[var(--brand-violet)] focus-within:ring-2 focus-within:ring-[var(--brand-violet)]/20"
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs"
            style={{
              fontWeight: 600,
              background: 'rgba(109,40,217,0.12)',
              color: 'var(--brand-violet)',
              border: '1px solid rgba(109,40,217,0.25)',
            }}
          >
            <Tag className="h-2.5 w-2.5" />
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-0.5 rounded-sm opacity-70 hover:opacity-100"
              aria-label={`Remove tag ${tag}`}
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? 'Add tags (press Enter or comma)…' : ''}
          className="min-w-[120px] flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          className="rounded-lg border border-[var(--brand-border)] bg-background shadow-lg"
          style={{ background: 'var(--brand-surface-alt)' }}
        >
          <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Existing tags
          </div>
          <div className="flex flex-wrap gap-1.5 px-3 pb-3">
            {suggestions.map((tag) => (
              <button
                key={tag}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  addTag(tag);
                }}
                className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs transition-colors hover:opacity-80"
                style={{
                  fontWeight: 600,
                  background: 'var(--brand-gradient-soft)',
                  color: 'var(--brand-violet)',
                  border: '1px solid var(--brand-border)',
                }}
              >
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-[11px] text-muted-foreground">
        Type a tag name and press <kbd className="rounded border border-[var(--brand-border)] bg-muted px-1 py-0.5 text-[10px]">Enter</kbd> or <kbd className="rounded border border-[var(--brand-border)] bg-muted px-1 py-0.5 text-[10px]">,</kbd> to add
      </p>
    </div>
  );
}