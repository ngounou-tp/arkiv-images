'use client';

import Link from 'next/link';
import { useState } from 'react';

export function Header({ onAdd }: { onAdd?: () => void }) {
  return (
    <header className="border-b border-ink-100 bg-cream/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-ink rounded-sm flex items-center justify-center">
            <span className="text-cream text-xs font-mono font-bold tracking-widest">AK</span>
          </div>
          <div>
            <div className="font-display text-lg leading-none font-semibold tracking-tight">
              Arkiv
            </div>
            <div className="text-[10px] text-ink-400 font-mono tracking-widest uppercase leading-none mt-0.5">
              Collection Manager
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs font-mono text-ink-400">
            <span className="live-dot w-1.5 h-1.5 rounded-full bg-green-500 block" />
            Live
          </div>
          {onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-2 bg-ink text-cream px-4 py-2 text-sm font-medium hover:bg-ink-700 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              New Object
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
