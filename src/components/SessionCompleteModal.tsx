import React, { useState } from 'react';
import { X } from 'lucide-react';
import { calculateSessionXp, MODE_LABELS } from '../data/studyStore';
import { FocusMood, Subject, TimerMode } from '../types/study';
import { SparkleDoodle } from './CuteStickers';
import { IllustratedAsset } from './IllustratedAsset';

const EMBLEM_IMG = '/src/assets/images/badge_scholar_crown_1795446191110.jpg';

interface SessionCompleteModalProps {
  isOpen: boolean;
  durationMinutes: number;
  mode: TimerMode;
  subject: Subject | undefined;
  defaultTaskTitle: string;
  onSave: (payload: { mood: FocusMood; note: string; taskTitle: string; startBreakAfter: boolean }) => void;
  onDiscard: () => void;
}

const MOOD_OPTIONS: { id: FocusMood; label: string; desc: string }[] = [
  { id: 'great', label: 'Sangat Fokus', desc: 'Pikiran jernih, minim distraksi' },
  { id: 'good', label: 'Cukup Stabil', desc: 'Ritme terjaga dengan baik' },
  { id: 'tired', label: 'Mulai Lelah', desc: 'Butuh jeda sebelum lanjut' },
];

export const SessionCompleteModal: React.FC<SessionCompleteModalProps> = ({
  isOpen,
  durationMinutes,
  mode,
  subject,
  defaultTaskTitle,
  onSave,
  onDiscard,
}) => {
  const [mood, setMood] = useState<FocusMood>('great');
  const [taskTitle, setTaskTitle] = useState(defaultTaskTitle);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const estimatedXp = calculateSessionXp(durationMinutes, mood, mode);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-complete-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs"
    >
      <div className="w-full max-w-lg kawaii-card rounded-3xl p-6 sm:p-7 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[var(--vibe-border)] shrink-0 bg-[var(--vibe-card-alt)]">
              <IllustratedAsset
                src={EMBLEM_IMG}
                alt="Lencana buku terbuka dengan pita emas"
                titleFallback="Sesi Selesai"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2
                  id="session-complete-title"
                  className="font-display text-xl font-bold text-slate-900 dark:text-white"
                >
                  Kerja Bagus! Sesi Tuntas
                </h2>
                <SparkleDoodle className="w-5 h-5" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5 tabular-nums">
                {subject?.name || 'Belajar Umum'} · {MODE_LABELS[mode]} · {durationMinutes} menit ·{' '}
                <span className="font-bold text-[var(--vibe-accent-text)]">
                  +{estimatedXp} XP
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onDiscard}
            aria-label="Tutup dialog"
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="complete-task-title"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            Topik yang Dipelajari
          </label>
          <input
            id="complete-task-title"
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Contoh: Merangkum Bab 4 Biologi Sel"
            className="w-full px-3.5 py-2.5 text-sm bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--vibe-accent)]"
          />
        </div>

        <div className="space-y-2">
          <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Kualitas Fokusmu
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {MOOD_OPTIONS.map((opt) => {
              const active = mood === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMood(opt.id)}
                  className={`p-3 rounded-2xl border text-left transition-colors ${
                    active
                      ? 'border-[var(--vibe-accent)] bg-[var(--vibe-accent-soft)]'
                      : 'border-[var(--vibe-border)] bg-[var(--vibe-card-alt)]/50 hover:bg-[var(--vibe-card-alt)]'
                  }`}
                >
                  <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                    {opt.label}
                  </span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="complete-reflection-note"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            Catatan Refleksi Singkat (Opsional)
          </label>
          <textarea
            id="complete-reflection-note"
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Apa satu hal penting yang baru kamu pahami?"
            className="w-full px-3.5 py-2.5 text-sm bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--vibe-accent)] resize-none"
          />
        </div>

        <div className="pt-3 border-t border-[var(--vibe-border)] flex flex-wrap items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={() =>
              onSave({
                mood,
                note: note.trim(),
                taskTitle: taskTitle.trim() || subject?.name || 'Sesi Belajar',
                startBreakAfter: false,
              })
            }
            className="px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)] hover:opacity-90 rounded-2xl transition-colors"
          >
            Simpan Saja
          </button>
          <button
            type="button"
            onClick={() =>
              onSave({
                mood,
                note: note.trim(),
                taskTitle: taskTitle.trim() || subject?.name || 'Sesi Belajar',
                startBreakAfter: true,
              })
            }
            className="px-5 py-2.5 text-sm font-semibold rounded-2xl kawaii-btn-primary"
          >
            Klaim +{estimatedXp} XP &amp; Istirahat
          </button>
        </div>
      </div>
    </div>
  );
};
