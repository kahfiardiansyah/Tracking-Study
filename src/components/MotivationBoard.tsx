import React, { useState } from 'react';
import {
  Check,
  Pencil,
  Pin,
  PinOff,
  Plus,
  RotateCcw,
  Shuffle,
  Trash2,
  X,
} from 'lucide-react';
import { MotivationQuote, VibeTheme } from '../types/study';
import { HeartDoodle, SparkleDoodle, VibeMascotSticker, WashiTape } from './CuteStickers';

interface MotivationBoardProps {
  quotes: MotivationQuote[];
  activeQuoteId: string;
  vibe: VibeTheme;
  onSelectQuote: (id: string) => void;
  onShuffleQuote: () => void;
  onAddQuote: (text: string, author: string) => void;
  onUpdateQuote: (id: string, text: string, author: string) => void;
  onDeleteQuote: (id: string) => void;
  onTogglePin: (id: string) => void;
  onResetQuotes: () => void;
}

export const MotivationBoard: React.FC<MotivationBoardProps> = ({
  quotes,
  activeQuoteId,
  vibe,
  onSelectQuote,
  onShuffleQuote,
  onAddQuote,
  onUpdateQuote,
  onDeleteQuote,
  onTogglePin,
  onResetQuotes,
}) => {
  const [isEditingCurrent, setIsEditingCurrent] = useState(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [editText, setEditText] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [newText, setNewText] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

  const activeQuote =
    quotes.find((q) => q.id === activeQuoteId) || quotes[0];

  const startEditCurrent = () => {
    if (!activeQuote) return;
    setEditText(activeQuote.text);
    setEditAuthor(activeQuote.author);
    setIsEditingCurrent(true);
  };

  const handleSaveCurrentEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuote || !editText.trim()) return;
    onUpdateQuote(
      activeQuote.id,
      editText.trim(),
      editAuthor.trim() || 'Catatanku'
    );
    setIsEditingCurrent(false);
  };

  const handleCreateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    onAddQuote(newText.trim(), newAuthor.trim() || 'Motivasiku');
    setNewText('');
    setNewAuthor('');
  };

  return (
    <section
      aria-label="Papan Kata Motivasi"
      className="relative kawaii-card rounded-3xl p-5 sm:p-6 pt-7"
    >
      {/* Cute Washi Tape holding the sticky note */}
      <WashiTape className="absolute -top-3 left-8 -rotate-2" />
      <WashiTape className="hidden sm:block absolute -top-3 right-10 rotate-2" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="shrink-0 animate-kawaii-float">
            <VibeMascotSticker vibe={vibe} className="w-12 h-12 sm:w-14 sm:h-14" />
          </div>

          {isEditingCurrent && activeQuote ? (
            <form onSubmit={handleSaveCurrentEdit} className="flex-1 space-y-2.5">
              <textarea
                rows={2}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                aria-label="Ubah teks motivasi"
                className="w-full px-3.5 py-2 text-sm sm:text-base rounded-2xl bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--vibe-accent)] resize-none"
              />
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={editAuthor}
                  onChange={(e) => setEditAuthor(e.target.value)}
                  placeholder="Sumber / Nama"
                  aria-label="Sumber motivasi"
                  className="px-3 py-1.5 text-xs rounded-xl bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)] text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[var(--vibe-accent)]"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded-xl kawaii-btn-primary"
                >
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Simpan</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingCurrent(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:underline"
                >
                  Batal
                </button>
              </div>
            </form>
          ) : (
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--vibe-accent-text)]">
                <SparkleDoodle className="w-4 h-4" />
                <span>Pesan Semangat Hari Ini</span>
                {activeQuote?.pinned && (
                  <span className="text-slate-500 dark:text-slate-400 font-normal">
                    · Disematkan
                  </span>
                )}
              </div>

              <blockquote className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug text-balance">
                &ldquo;{activeQuote?.text || 'Ayo belajar dengan hati gembira!'}&rdquo;
              </blockquote>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <HeartDoodle className="w-3.5 h-3.5" />
                <span>{activeQuote?.author || 'Catatan Mochi'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action controls */}
        {!isEditingCurrent && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onShuffleQuote}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-[var(--vibe-card-alt)] hover:opacity-90 border border-[var(--vibe-border)] text-slate-800 dark:text-slate-100 transition-transform active:scale-95 min-h-[38px]"
              title="Ganti kata motivasi lain"
            >
              <Shuffle className="w-3.5 h-3.5 text-[var(--vibe-accent)]" aria-hidden="true" />
              <span>Acak</span>
            </button>

            {activeQuote && (
              <button
                type="button"
                onClick={() => onTogglePin(activeQuote.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors min-h-[38px] ${
                  activeQuote.pinned
                    ? 'bg-[var(--vibe-accent-soft)] border-[var(--vibe-accent)] text-[var(--vibe-accent-text)]'
                    : 'bg-[var(--vibe-card-alt)] border-[var(--vibe-border)] text-slate-700 dark:text-slate-200'
                }`}
                title={activeQuote.pinned ? 'Lepas sematan' : 'Sematkan kutipan ini'}
              >
                {activeQuote.pinned ? (
                  <PinOff className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <Pin className="w-3.5 h-3.5" aria-hidden="true" />
                )}
                <span>{activeQuote.pinned ? 'Tersemat' : 'Sematkan'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={startEditCurrent}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)] text-slate-700 dark:text-slate-200 hover:opacity-90 min-h-[38px]"
              title="Edit kata motivasi ini"
            >
              <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Edit</span>
            </button>

            <button
              type="button"
              onClick={() => setIsManagerOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl kawaii-btn-primary min-h-[38px]"
            >
              {isManagerOpen ? (
                <>
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Tutup Daftar</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Tambah &amp; Kelola ({quotes.length})</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Expandable Motivation Library & Creator */}
      {isManagerOpen && (
        <div className="mt-5 pt-5 border-t border-[var(--vibe-border)] space-y-5">
          <form onSubmit={handleCreateQuote} className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Tulis kata motivasi barumu di sini..."
              aria-label="Kata motivasi baru"
              className="md:col-span-7 px-3.5 py-2.5 text-sm rounded-xl bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--vibe-accent)]"
            />
            <input
              type="text"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              placeholder="Dari / Penulis (opsional)"
              aria-label="Penulis kata motivasi baru"
              className="md:col-span-3 px-3.5 py-2.5 text-sm rounded-xl bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--vibe-accent)]"
            />
            <button
              type="submit"
              disabled={!newText.trim()}
              className="md:col-span-2 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-xl kawaii-btn-primary disabled:opacity-40"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Tambah</span>
            </button>
          </form>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {quotes.map((q) => {
              const isSelected = q.id === activeQuote?.id;
              return (
                <div
                  key={q.id}
                  className={`flex items-start justify-between gap-3 p-3 rounded-2xl border transition-colors ${
                    isSelected
                      ? 'bg-[var(--vibe-accent-soft)] border-[var(--vibe-accent)]'
                      : 'bg-[var(--vibe-card-alt)]/60 border-[var(--vibe-border)]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectQuote(q.id)}
                    className="flex-1 min-w-0 text-left"
                  >
                    <p className="text-sm font-medium text-slate-900 dark:text-white leading-snug">
                      &ldquo;{q.text}&rdquo;
                    </p>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                      {q.author}
                      {q.pinned ? ' · Tersemat' : ''}
                      {isSelected ? ' · Sedang tampil' : ''}
                    </span>
                  </button>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectQuote(q.id);
                        setEditText(q.text);
                        setEditAuthor(q.author);
                        setIsEditingCurrent(true);
                        setIsManagerOpen(false);
                      }}
                      aria-label="Edit kutipan"
                      className="p-1.5 text-slate-500 hover:text-[var(--vibe-accent-text)] rounded-lg"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    {quotes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onDeleteQuote(q.id)}
                        aria-label="Hapus kutipan"
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onResetQuotes}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Pulihkan kutipan bawaan</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
