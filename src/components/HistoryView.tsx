import React, { useMemo, useState } from 'react';
import { Download, Plus, RotateCcw, Search, Trash2 } from 'lucide-react';
import {
  formatMinutesHuman,
  MODE_LABELS,
  SUBJECT_COLOR_MAP,
} from '../data/studyStore';
import { FocusMood, StudyState, TimerMode } from '../types/study';
import { VibeMascotSticker, WashiTape } from './CuteStickers';

interface HistoryViewProps {
  state: StudyState;
  onOpenManualLog: () => void;
  onDeleteSession: (sessionId: string) => void;
  onResetToDemo: () => void;
  onClearAllData: () => void;
}

const MOOD_TEXT: Record<FocusMood, string> = {
  great: 'Sangat Fokus',
  good: 'Cukup Stabil',
  tired: 'Mulai Lelah',
};

export const HistoryView: React.FC<HistoryViewProps> = ({
  state,
  onOpenManualLog,
  onDeleteSession,
  onResetToDemo,
  onClearAllData,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [modeFilter, setModeFilter] = useState<'all' | TimerMode>('all');
  const [confirmReset, setConfirmReset] = useState<'none' | 'demo' | 'empty'>('none');

  const filteredSessions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return [...state.sessions]
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
      .filter((s) => {
        if (subjectFilter !== 'all' && s.subjectId !== subjectFilter) return false;
        if (modeFilter !== 'all' && s.mode !== modeFilter) return false;
        if (q) {
          const subjectName =
            state.subjects.find((sub) => sub.id === s.subjectId)?.name.toLowerCase() || '';
          const match =
            s.taskTitle.toLowerCase().includes(q) ||
            s.note.toLowerCase().includes(q) ||
            subjectName.includes(q);
          if (!match) return false;
        }
        return true;
      });
  }, [state.sessions, state.subjects, searchQuery, subjectFilter, modeFilter]);

  const totalFilteredMinutes = filteredSessions.reduce(
    (acc, s) => acc + s.durationMinutes,
    0
  );

  const handleExportCsv = () => {
    const headers = [
      'Tanggal',
      'Waktu Mulai',
      'Mata Pelajaran',
      'Topik',
      'Mode',
      'Durasi (Menit)',
      'Kualitas Fokus',
      'XP',
      'Catatan',
    ];
    const rows = filteredSessions.map((s) => {
      const d = new Date(s.startedAt);
      const subName = state.subjects.find((sub) => sub.id === s.subjectId)?.name || 'Umum';
      const escape = (val: string) => `"${val.replace(/"/g, '""')}"`;
      return [
        d.toLocaleDateString('id-ID'),
        d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        escape(subName),
        escape(s.taskTitle),
        MODE_LABELS[s.mode],
        s.durationMinutes,
        MOOD_TEXT[s.mood],
        s.xpEarned,
        escape(s.note),
      ].join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mochibelajar-riwayat-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <section className="relative kawaii-card rounded-3xl p-6 sm:p-8 space-y-6">
        <WashiTape className="absolute -top-3 right-12 rotate-2" />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <VibeMascotSticker vibe={state.settings.vibe} className="w-10 h-10 shrink-0" />
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                Riwayat &amp; Jurnal Belajar
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
                Menampilkan {filteredSessions.length} sesi · Total{' '}
                {formatMinutesHuman(totalFilteredMinutes)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={filteredSessions.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 border border-[var(--vibe-border)] bg-[var(--vibe-card-alt)] hover:opacity-90 disabled:opacity-40 rounded-xl transition-colors whitespace-nowrap min-h-[40px]"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>Ekspor CSV</span>
            </button>

            <button
              type="button"
              onClick={onOpenManualLog}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl kawaii-btn-primary whitespace-nowrap min-h-[40px]"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Catat Manual</span>
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-4 border-t border-[var(--vibe-border)]">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari topik atau catatan refleksi..."
                aria-label="Cari riwayat belajar"
                className="w-full pl-9 pr-3.5 py-2 text-sm bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)] rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--vibe-accent)]"
              />
            </div>

            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              aria-label="Filter mata pelajaran"
              className="px-3.5 py-2 text-sm bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)] rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[var(--vibe-accent)]"
            >
              <option value="all">Semua Mata Pelajaran</option>
              {state.subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Segmented Filter */}
          <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)] rounded-xl">
            {(['all', 'pomodoro', 'deep', 'custom', 'stopwatch'] as const).map((m) => {
              const active = modeFilter === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModeFilter(m)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-[var(--vibe-card)] text-[var(--vibe-accent-text)] shadow-xs border border-[var(--vibe-border)]'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {m === 'all' ? 'Semua Mode' : MODE_LABELS[m]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Session Log Rows */}
        {filteredSessions.length === 0 ? (
          <div className="py-14 text-center space-y-3 border-t border-[var(--vibe-border)]">
            <p className="text-base font-medium text-slate-700 dark:text-slate-200">
              Belum ada catatan sesi yang cocok.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Mulai timer fokus pertamamu atau catat sesi belajar secara manual untuk membangun jurnal belajarmu.
            </p>
            <button
              type="button"
              onClick={onOpenManualLog}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl kawaii-btn-primary"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Catat Sesi Pertama</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[var(--vibe-border)] border-t border-[var(--vibe-border)]">
            {filteredSessions.map((session) => {
              const sub = state.subjects.find((s) => s.id === session.subjectId);
              const palette = sub ? SUBJECT_COLOR_MAP[sub.color] : SUBJECT_COLOR_MAP.rose;
              const startedDate = new Date(session.startedAt);
              const dateLabel = startedDate.toLocaleDateString('id-ID', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              });
              const timeLabel = startedDate.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <article
                  key={session.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-100">
                        <span className={`w-2.5 h-2.5 rounded-full ${palette.dot}`} />
                        {sub?.name || 'Belajar Umum'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{MODE_LABELS[session.mode]}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        {dateLabel}, {timeLabel}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{MOOD_TEXT[session.mood]}</span>
                    </div>

                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                      {session.taskTitle}
                    </h3>

                    {session.note && (
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                        {session.note}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-1 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span className="block font-mono-nums text-base font-semibold text-slate-900 dark:text-white">
                        {formatMinutesHuman(session.durationMinutes)}
                      </span>
                      <span className="block font-mono-nums text-xs font-semibold text-[var(--vibe-accent-text)]">
                        +{session.xpEarned} XP
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteSession(session.id)}
                      aria-label={`Hapus sesi ${session.taskTitle}`}
                      className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Data Management Footer */}
        <div className="pt-5 border-t border-[var(--vibe-border)] flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Semua data tersimpan otomatis di peramban ini.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {confirmReset === 'none' ? (
              <>
                <button
                  type="button"
                  onClick={() => setConfirmReset('demo')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-[var(--vibe-border)] bg-[var(--vibe-card-alt)] rounded-xl"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Muat Ulang Data Contoh</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset('empty')}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-xl"
                >
                  Mulai Dari Nol
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                  {confirmReset === 'demo'
                    ? 'Kembalikan data contoh awal?'
                    : 'Hapus seluruh riwayat & mulai kosong?'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (confirmReset === 'demo') onResetToDemo();
                    else onClearAllData();
                    setConfirmReset('none');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
                >
                  Ya, Lanjutkan
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset('none')}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
