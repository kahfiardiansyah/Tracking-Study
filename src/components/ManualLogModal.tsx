import React, { useState } from 'react';
import { X } from 'lucide-react';
import { SUBJECT_COLOR_MAP, toLocalDateKey } from '../data/studyStore';
import { FocusMood, Subject, SubjectColor } from '../types/study';

interface ManualLogModalProps {
  isOpen: boolean;
  initialMode: 'session' | 'subject';
  subjects: Subject[];
  defaultSubjectId: string;
  onClose: () => void;
  onAddManualSession: (payload: {
    subjectId: string;
    taskTitle: string;
    durationMinutes: number;
    dateKey: string;
    mood: FocusMood;
    note: string;
  }) => void;
  onAddSubject: (payload: {
    name: string;
    color: SubjectColor;
    weeklyTargetMinutes: number;
  }) => void;
}

const COLORS: SubjectColor[] = ['rose', 'emerald', 'indigo', 'amber', 'sky', 'teal'];

export const ManualLogModal: React.FC<ManualLogModalProps> = ({
  isOpen,
  initialMode,
  subjects,
  defaultSubjectId,
  onClose,
  onAddManualSession,
  onAddSubject,
}) => {
  const [modalTab, setModalTab] = useState<'session' | 'subject'>(initialMode);

  const [subjectId, setSubjectId] = useState(defaultSubjectId || subjects[0]?.id || '');
  const [taskTitle, setTaskTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [dateKey, setDateKey] = useState(toLocalDateKey(new Date()));
  const [mood, setMood] = useState<FocusMood>('good');
  const [note, setNote] = useState('');

  const [subName, setSubName] = useState('');
  const [subColor, setSubColor] = useState<SubjectColor>('rose');
  const [weeklyTargetHours, setWeeklyTargetHours] = useState(4);

  React.useEffect(() => {
    if (isOpen) {
      setModalTab(initialMode);
      setSubjectId(defaultSubjectId || subjects[0]?.id || '');
    }
  }, [isOpen, initialMode, defaultSubjectId, subjects]);

  if (!isOpen) return null;

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId || durationMinutes < 1) return;
    onAddManualSession({
      subjectId,
      taskTitle: taskTitle.trim() || 'Belajar Mandiri',
      durationMinutes: Math.max(1, Math.min(600, durationMinutes)),
      dateKey,
      mood,
      note: note.trim(),
    });
    setTaskTitle('');
    setNote('');
    onClose();
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) return;
    onAddSubject({
      name: subName.trim(),
      color: subColor,
      weeklyTargetMinutes: Math.max(30, Math.round(weeklyTargetHours * 60)),
    });
    setSubName('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="manual-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs"
    >
      <div className="w-full max-w-md kawaii-card rounded-3xl p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <h2
            id="manual-modal-title"
            className="font-display text-lg font-bold text-slate-900 dark:text-white"
          >
            {modalTab === 'session' ? 'Catat Sesi Belajar' : 'Tambah Mata Pelajaran'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1 p-1 bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)] rounded-2xl">
          <button
            type="button"
            onClick={() => setModalTab('session')}
            className={`py-2 text-xs font-semibold rounded-xl transition-colors ${
              modalTab === 'session'
                ? 'bg-[var(--vibe-card)] text-[var(--vibe-accent-text)] shadow-xs border border-[var(--vibe-border)]'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Catat Waktu Belajar
          </button>
          <button
            type="button"
            onClick={() => setModalTab('subject')}
            className={`py-2 text-xs font-semibold rounded-xl transition-colors ${
              modalTab === 'subject'
                ? 'bg-[var(--vibe-card)] text-[var(--vibe-accent-text)] shadow-xs border border-[var(--vibe-border)]'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Mata Pelajaran Baru
          </button>
        </div>

        {modalTab === 'session' ? (
          <form onSubmit={handleSaveSession} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="manual-subject"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Mata Pelajaran
              </label>
              <select
                id="manual-subject"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--vibe-accent)]"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="manual-topic"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Topik / Materi
              </label>
              <input
                id="manual-topic"
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Contoh: Membaca buku Sejarah Bab 2"
                className="w-full px-3.5 py-2.5 text-sm bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--vibe-accent)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="manual-duration"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Durasi (menit)
                </label>
                <input
                  id="manual-duration"
                  type="number"
                  min={1}
                  max={600}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full font-mono-nums px-3.5 py-2.5 text-sm bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--vibe-accent)]"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="manual-date"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Tanggal
                </label>
                <input
                  id="manual-date"
                  type="date"
                  value={dateKey}
                  onChange={(e) => setDateKey(e.target.value)}
                  className="w-full font-mono-nums px-3.5 py-2.5 text-sm bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--vibe-accent)]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="manual-mood"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Kualitas Fokus
              </label>
              <select
                id="manual-mood"
                value={mood}
                onChange={(e) => setMood(e.target.value as FocusMood)}
                className="w-full px-3.5 py-2.5 text-sm bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--vibe-accent)]"
              >
                <option value="great">Sangat Fokus</option>
                <option value="good">Cukup Stabil</option>
                <option value="tired">Mulai Lelah</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="manual-note"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Catatan (Opsional)
              </label>
              <textarea
                id="manual-note"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Tulis ringkasan singkat..."
                className="w-full px-3.5 py-2 text-sm bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--vibe-accent)] resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-[var(--vibe-card-alt)] rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-semibold rounded-xl kawaii-btn-primary"
              >
                Simpan Catatan
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSaveSubject} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="subject-name-input"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Nama Mata Pelajaran / Topik
              </label>
              <input
                id="subject-name-input"
                type="text"
                required
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                placeholder="Contoh: Persiapan UTBK / Bahasa Jepang"
                className="w-full px-3.5 py-2.5 text-sm bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--vibe-accent)]"
              />
            </div>

            <div className="space-y-2">
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Pilih Warna Tinta
              </span>
              <div className="grid grid-cols-3 gap-2">
                {COLORS.map((c) => {
                  const palette = SUBJECT_COLOR_MAP[c];
                  const active = subColor === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSubColor(c)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                        active
                          ? 'border-[var(--vibe-accent)] bg-[var(--vibe-accent-soft)] text-slate-900 dark:text-white'
                          : 'border-[var(--vibe-border)] bg-[var(--vibe-card-alt)]/50 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${palette.dot}`} />
                      <span>{palette.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="subject-weekly-target"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Target Mingguan:{' '}
                <span className="font-mono-nums text-[var(--vibe-accent-text)]">
                  {weeklyTargetHours} jam / minggu
                </span>
              </label>
              <input
                id="subject-weekly-target"
                type="range"
                min={1}
                max={20}
                step={0.5}
                value={weeklyTargetHours}
                onChange={(e) => setWeeklyTargetHours(parseFloat(e.target.value))}
                className="w-full accent-[var(--vibe-accent)] cursor-pointer"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-[var(--vibe-card-alt)] rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!subName.trim()}
                className="px-5 py-2 text-sm font-semibold rounded-xl kawaii-btn-primary disabled:opacity-40"
              >
                Tambah Mapel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
