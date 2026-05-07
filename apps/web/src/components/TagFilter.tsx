import { useMemo } from 'react';
import { Tag, X } from 'lucide-react';
import { useRecordStore } from '@/stores/recordStore';

export function TagFilter() {
  const records = useRecordStore((s) => s.records);
  const activeTags = useRecordStore((s) => s.activeTags);
  const toggleActiveTag = useRecordStore((s) => s.toggleActiveTag);
  const setActiveTags = useRecordStore((s) => s.setActiveTags);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    records.forEach((r) => {
      (r.tags ?? []).forEach((t) => tagSet.add(t));
    });
    return Array.from(tagSet).sort();
  }, [records]);

  if (allTags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <Tag className="h-3.5 w-3.5" />
        Filter by tag:
      </div>

      {allTags.map((tag) => {
        const isActive = activeTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => toggleActiveTag(tag)}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-all"
            style={
              isActive
                ? {
                    background: 'var(--brand-violet)',
                    color: 'var(--brand-surface)',
                    border: '1px solid var(--brand-violet)',
                    boxShadow: '0 0 0 3px rgba(109,40,217,0.18)',
                  }
                : {
                    background: 'var(--brand-gradient-soft)',
                    color: 'var(--brand-violet)',
                    border: '1px solid rgba(109,40,217,0.25)',
                  }
            }
          >
            <Tag className="h-2.5 w-2.5" />
            {tag}
            {isActive && <X className="h-2.5 w-2.5 ml-0.5" />}
          </button>
        );
      })}

      {activeTags.length > 0 && (
        <button
          onClick={() => setActiveTags([])}
          className="text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}