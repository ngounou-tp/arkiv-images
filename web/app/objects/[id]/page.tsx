'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchObject, deleteObject, ObjectItem } from '@/lib/api';
import { Header } from '@/components/Header';

export default function ObjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [obj, setObj] = useState<ObjectItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchObject(id)
      .then(setObj)
      .catch(() => setError('Object not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!obj || !confirm(`Delete "${obj.title}"? This action cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteObject(id);
      router.push('/');
    } catch {
      alert('Failed to delete object');
      setDeleting(false);
    }
  };

  const formattedDate = obj
    ? new Date(obj.createdAt).toLocaleDateString('en-GB', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <div className="grain min-h-screen">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[11px] font-mono text-ink-400 mb-8 tracking-wider">
          <Link href="/" className="hover:text-ink transition-colors uppercase">Collection</Link>
          <span className="text-ink-200">/</span>
          <span className="text-ink uppercase">
            {loading ? '…' : obj?.title || 'Not Found'}
          </span>
        </nav>

        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-ink border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-32">
            <p className="font-display text-2xl font-semibold text-ink-400 mb-4">{error}</p>
            <Link href="/" className="text-sm text-ink underline hover:no-underline">
              Back to collection
            </Link>
          </div>
        )}

        {obj && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-scale-in">
            {/* Image column */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden bg-ink-50 border border-ink-100">
                {!imgError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={obj.imageUrl}
                    alt={obj.title}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-ink-200">
                      <rect x="4" y="4" width="40" height="40" rx="3" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="16" cy="18" r="4" stroke="currentColor" strokeWidth="2"/>
                      <path d="M4 34l12-10 8 8 6-6 14 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Image URL */}
              <div className="bg-white border border-ink-100 px-3 py-2 flex items-center gap-2 overflow-hidden">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-ink-300 flex-shrink-0">
                  <path d="M4 6l-1 1a2 2 0 11-2.83-2.83l2-2A2 2 0 015 2.83" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  <path d="M6 4l1-1a2 2 0 112.83 2.83l-2 2A2 2 0 017 7.17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <a
                  href={obj.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono text-ink-400 hover:text-ink transition-colors truncate"
                >
                  {obj.imageUrl}
                </a>
              </div>
            </div>

            {/* Content column */}
            <div className="flex flex-col">
              {/* ID badge */}
              <div className="inline-flex items-center gap-1.5 mb-4">
                <span className="text-[10px] font-mono text-ink-300 tracking-widest uppercase bg-ink-50 px-2 py-1 border border-ink-100">
                  #{obj._id.slice(-8).toUpperCase()}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-display text-4xl font-bold leading-tight mb-4">
                {obj.title}
              </h1>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-ink-100" />
                <div className="w-1.5 h-1.5 bg-amber rounded-full" />
                <div className="h-px flex-1 bg-ink-100" />
              </div>

              {/* Description */}
              <div className="flex-1">
                <p className="text-[10px] font-mono text-ink-400 tracking-widest uppercase mb-2">
                  Description
                </p>
                <p className="text-ink-600 leading-relaxed text-base font-light">
                  {obj.description}
                </p>
              </div>

              {/* Metadata */}
              <div className="mt-8 pt-6 border-t border-ink-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-ink-300 tracking-widest uppercase">Created</span>
                  <span className="text-sm text-ink-600 font-light">{formattedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-ink-300 tracking-widest uppercase">Object ID</span>
                  <span className="text-xs font-mono text-ink-400">{obj._id}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-8">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-4 py-2.5 border border-ink-200 text-sm text-ink-600 hover:border-ink hover:text-ink transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M8 2L3 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Back
                </Link>

                <a
                  href={obj.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 border border-ink-200 text-sm text-ink-600 hover:border-ink hover:text-ink transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 2H2v10h10V9M7 2h5v5M7 7l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  View Image
                </a>

                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 text-sm text-red-600 hover:bg-red-100 hover:border-red-400 transition-colors disabled:opacity-50 ml-auto"
                >
                  {deleting ? (
                    <span className="w-3.5 h-3.5 border border-red-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 4h10M5 4V2.5h4V4M5.5 6v5M8.5 6v5M3 4l.6 8h6.8L11 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
