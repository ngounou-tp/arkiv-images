'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchObjects, ObjectItem } from '@/lib/api';
import { useSocket } from '@/lib/useSocket';
import { Header } from '@/components/Header';
import { ObjectCard } from '@/components/ObjectCard';
import { CreateModal } from '@/components/CreateModal';
import { Toaster, useToasts } from '@/components/Toaster';

export default function HomePage() {
  const [objects, setObjects] = useState<ObjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const { toasts, addToast, removeToast } = useToasts();

  // Load objects
  useEffect(() => {
    fetchObjects()
      .then(setObjects)
      .catch(() => setError('Failed to load objects. Is the API running?'))
      .finally(() => setLoading(false));
  }, []);

  // Socket for real-time
  const handleObjectCreated = useCallback((obj: ObjectItem) => {
    setObjects((prev) => {
      if (prev.find((o) => o._id === obj._id)) return prev;
      return [obj, ...prev];
    });
    addToast(`"${obj.title}" was added`, 'success');
  }, []);

  const handleObjectDeleted = useCallback((id: string) => {
    setObjects((prev) => {
      const found = prev.find((o) => o._id === id);
      if (found) addToast(`"${found.title}" was removed`, 'info');
      return prev.filter((o) => o._id !== id);
    });
  }, []);

  useSocket({
    onObjectCreated: handleObjectCreated,
    onObjectDeleted: handleObjectDeleted,
  });

  const handleCreated = (obj: ObjectItem) => {
    setObjects((prev) => {
      if (prev.find((o) => o._id === obj._id)) return prev;
      return [obj, ...prev];
    });
    addToast(`"${obj.title}" created successfully`, 'success');
  };

  const handleDeleted = (id: string) => {
    setObjects((prev) => prev.filter((o) => o._id !== id));
  };

  return (
    <div className="grain min-h-screen">
      <Header onAdd={() => setModalOpen(true)} />

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Page title */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-mono text-ink-300 tracking-widest uppercase mb-2">
              — Collection
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight">
              Objects
            </h1>
          </div>
          {!loading && (
            <div className="text-right">
              <div className="font-display text-3xl font-bold text-ink-200">
                {String(objects.length).padStart(2, '0')}
              </div>
              <div className="text-[10px] font-mono text-ink-300 tracking-widest uppercase">
                {objects.length === 1 ? 'item' : 'items'}
              </div>
            </div>
          )}
        </div>

        {/* States */}
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-ink border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-ink-400 font-mono tracking-wider">Loading collection…</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 p-6 text-center">
            <p className="text-red-600 text-sm font-mono">{error}</p>
            <button
              onClick={() => { setError(''); setLoading(true); fetchObjects().then(setObjects).catch(() => setError('Still failing.')).finally(() => setLoading(false)); }}
              className="mt-3 text-xs text-red-500 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && objects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 border-2 border-dashed border-ink-200 flex items-center justify-center mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-ink-300">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 className="font-display text-xl font-semibold text-ink-600 mb-2">
              Collection is empty
            </h2>
            <p className="text-sm text-ink-400 mb-6 max-w-sm">
              Start building your collection by adding the first object.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 bg-ink text-cream px-5 py-2.5 text-sm font-medium hover:bg-ink-700 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Add First Object
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && objects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger">
            {objects.map((obj, i) => (
              <ObjectCard
                key={obj._id}
                obj={obj}
                onDeleted={handleDeleted}
                animIndex={i}
              />
            ))}
          </div>
        )}
      </main>

      {/* Decorative footer */}
      <footer className="max-w-6xl mx-auto px-6 py-8 mt-10 border-t border-ink-100">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-mono text-ink-300 tracking-widest uppercase">
            Arkiv — Collection Manager
          </p>
          <p className="text-[10px] font-mono text-ink-300 tracking-widest">
            Real-time via Socket.IO
          </p>
        </div>
      </footer>

      <CreateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
      />

      <Toaster toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
