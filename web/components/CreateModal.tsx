'use client';

import { useState, useRef, useCallback } from 'react';
import { createObject, ObjectItem } from '@/lib/api';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (obj: ObjectItem) => void;
}

export function CreateModal({ open, onClose, onCreated }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    setImage(file);
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleSubmit = async () => {
    if (!title.trim()) { setError('Title is required'); return; }
    if (!description.trim()) { setError('Description is required'); return; }
    if (!image) { setError('Image is required'); return; }

    setLoading(true);
    setError('');

    try {
      const fd = new FormData();
      fd.append('title', title.trim());
      fd.append('description', description.trim());
      fd.append('image', image);
      const obj = await createObject(fd);
      onCreated(obj);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create object');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setImage(null);
    setPreview(null);
    setError('');
    setLoading(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-cream border border-ink-200 shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100">
          <div>
            <h2 className="font-display text-xl font-semibold">New Object</h2>
            <p className="text-xs text-ink-400 font-mono mt-0.5 tracking-wider">ADD TO COLLECTION</p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center text-ink-400 hover:text-ink hover:bg-ink-100 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-[10px] font-mono text-ink-400 tracking-widest uppercase mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Object title…"
              className="w-full bg-white border border-ink-200 px-3 py-2.5 text-sm placeholder:text-ink-300 focus:outline-none focus:border-ink transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-mono text-ink-400 tracking-widest uppercase mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this object…"
              rows={3}
              className="w-full bg-white border border-ink-200 px-3 py-2.5 text-sm placeholder:text-ink-300 focus:outline-none focus:border-ink transition-colors resize-none"
            />
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-[10px] font-mono text-ink-400 tracking-widest uppercase mb-1.5">
              Image
            </label>

            {preview ? (
              <div className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-cover border border-ink-200"
                />
                <button
                  onClick={() => { setImage(null); setPreview(null); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-white/90 border border-ink-200 flex items-center justify-center text-ink-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
                <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-0.5 text-[10px] font-mono text-ink-500">
                  {image?.name}
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`
                  w-full h-36 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all
                  ${dragOver
                    ? 'border-ink bg-ink-50'
                    : 'border-ink-200 hover:border-ink-400 hover:bg-ink-50/50'}
                `}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-ink-300 mb-2">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M3 15l5-5 4 4 3-3 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs text-ink-400">
                  {dragOver ? 'Drop image here' : 'Click or drag an image'}
                </span>
                <span className="text-[10px] text-ink-300 mt-0.5 font-mono">JPG, PNG, WEBP, GIF</span>
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600 font-mono">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-ink-100 bg-white/30">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-sm text-ink-500 hover:text-ink transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-ink text-cream px-5 py-2 text-sm font-medium hover:bg-ink-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border border-cream border-t-transparent rounded-full animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Create Object
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
