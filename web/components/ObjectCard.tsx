'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ObjectItem, deleteObject } from '@/lib/api';

interface Props {
  obj: ObjectItem;
  onDeleted?: (id: string) => void;
  animIndex?: number;
}

export function ObjectCard({ obj, onDeleted, animIndex = 0 }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete "${obj.title}"?`)) return;
    setDeleting(true);
    try {
      await deleteObject(obj._id);
      onDeleted?.(obj._id);
    } catch {
      alert('Failed to delete');
      setDeleting(false);
    }
  };

  const date = new Date(obj.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      className="card-hover group relative bg-white border border-ink-100 overflow-hidden"
      style={{ animationDelay: `${animIndex * 0.06}s` }}
    >
      <Link href={`/objects/${obj._id}`} className="block">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-ink-50">
          {!imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={obj.imageUrl}
              alt={obj.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-ink-50">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-ink-300">
                <rect x="3" y="3" width="26" height="26" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="11" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M3 22l7-6 5 5 4-4 10 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-cream text-xs font-mono tracking-widest uppercase border border-cream/60 px-3 py-1.5">
              View Details
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base font-semibold leading-tight line-clamp-1 flex-1">
              {obj.title}
            </h3>
          </div>
          <p className="text-ink-400 text-sm mt-1 line-clamp-2 font-light leading-relaxed">
            {obj.description}
          </p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-ink-100">
            <span className="text-[10px] font-mono text-ink-300 uppercase tracking-widest">
              {date}
            </span>
            <span className="text-[10px] font-mono text-ink-200 uppercase tracking-widest">
              #{obj._id.slice(-6)}
            </span>
          </div>
        </div>
      </Link>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm border border-ink-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-600 disabled:opacity-50"
        title="Delete object"
      >
        {deleting ? (
          <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin block" />
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1.5 3h9M4.5 3V1.5h3V3M5 5.5v4M7 5.5v4M2.5 3l.5 7.5h6l.5-7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
    </div>
  );
}
