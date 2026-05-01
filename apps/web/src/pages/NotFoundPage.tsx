import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center text-center px-6"
      style={{ background: 'var(--brand-surface)' }}
    >
      <div
        className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl text-5xl"
        style={{ background: 'var(--brand-gradient-soft)', border: '2px dashed var(--brand-border)' }}
      >
        🔍
      </div>
      <h1
        className="text-6xl font-800 brand-gradient-text"
        style={{ fontWeight: 800 }}
      >
        404
      </h1>
      <p className="mt-3 text-xl font-700 text-foreground" style={{ fontWeight: 700 }}>
        This row doesn't exist
      </p>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        The page you're looking for isn't in the database. Head back to manage your records.
      </p>
      <button
        onClick={() => navigate('/')}
        className="btn-primary mt-6 flex items-center gap-2 px-5 py-2.5 text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Data Manager
      </button>
    </div>
  );
}
