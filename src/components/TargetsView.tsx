import React from 'react';
import { Award, Lock, Play, Plus, Trash2 } from 'lucide-react';
import {
  computeBadges,
  formatMinutesHuman,
  getStartOfWeek,
  SUBJECT_COLOR_MAP,
} from '../data/studyStore';
import { StudyState } from '../types/study';
import { SparkleDoodle, VibeMascotSticker, WashiTape } from './CuteStickers';
import { IllustratedAsset } from './IllustratedAsset';

const COVER_DESK_IMG = '/src/assets/images/cover_study_desk_1795446192156.jpg';
const EMBLEM_IMG = '/src/assets/images/badge_scholar_crown_1795446191110.jpg';

interface TargetsViewProps {
  state: StudyState;
  onStartSubjectFocus: (subjectId: string) => void;
  onOpenNewSubject: () => void;
  onUpdateSubjectTarget: (subjectId: string, weeklyTargetMinutes: number) => void;
  onDeleteSubject: (subjectId: string) => void;
}

export const TargetsView: React.FC<TargetsViewProps> = ({
  state,
  onStartSubjectFocus,
  onOpenNewSubject,
  onUpdateSubjectTarget,
  onDeleteSubject,
}) => {
  const weekStart = getStartOfWeek();
  const weeklyFocusSessions = state.sessions.filter(
    (s) => s.mode !== 'break' && new Date(s.startedAt) >= weekStart
  );

  const totalWeeklyTarget = state.subjects.reduce(
    (acc, s) => acc + s.weeklyTargetMinutes,
    0
  );
  const totalWeeklyActual = weeklyFocusSessions.reduce(
    (acc, s) => acc + s.durationMinutes,
    0
  );
  const overallPct =
    totalWeeklyTarget > 0
      ? Math.min(100, Math.round((totalWeeklyActual / totalWeeklyTarget) * 100))
      : 0;

  const badges = computeBadges(state);
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-8">
      {/* Editorial Header Banner with Generated Desk Illustration */}
      <section className="relative rounded-3xl overflow-hidden kawaii-card">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--vibe-accent-text)]">
                <SparkleDoodle className="w-4 h-4" />
                <span>Perencanaan Mingguan</span>
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-balance">
                Target Mata Pelajaran &amp; Pencapaian
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                Atur porsi waktu mingguan untuk setiap topik yang sedang kamu pelajari agar kemajuanmu tetap seimbang dan menyenangkan.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-6">
              <div>
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  Realisasi Minggu Ini
                </span>
                <span className="font-mono-nums text-xl font-semibold text-slate-900 dark:text-white">
                  {formatMinutesHuman(totalWeeklyActual)}{' '}
                  <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                    / {formatMinutesHuman(totalWeeklyTarget)} ({overallPct}%)
                  </span>
                </span>
              </div>

              <button
                type="button"
                onClick={onOpenNewSubject}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-2xl kawaii-btn-primary whitespace-nowrap shrink-0 min-h-[40px]"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Tambah Mata Pelajaran</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 min-h-[200px] lg:min-h-[240px] relative border-t lg:border-t-0 lg:border-l border-[var(--vibe-border)]">
            <IllustratedAsset
              src={COVER_DESK_IMG}
              alt="Ilustrasi meja belajar rapi dengan buku catatan grid, pulpen, dan cahaya pagi"
              titleFallback="Meja Belajar Rapi"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Subject Targets List */}
      <section className="relative kawaii-card rounded-3xl p-6 sm:p-8 space-y-6">
        <WashiTape className="absolute -top-3 left-10 -rotate-2" />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <VibeMascotSticker vibe={state.settings.vibe} className="w-8 h-8" />
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Daftar Target Mingguan
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Sesuaikan durasi target mingguan atau langsung mulai sesi fokus dari sini.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[var(--vibe-accent-text)] tabular-nums">
            {state.subjects.length} mata pelajaran aktif
          </span>
        </div>

        <div className="divide-y divide-[var(--vibe-border)]">
          {state.subjects.map((subject) => {
            const palette = SUBJECT_COLOR_MAP[subject.color];
            const loggedMinutes = weeklyFocusSessions
              .filter((s) => s.subjectId === subject.id)
              .reduce((acc, s) => acc + s.durationMinutes, 0);
            const totalAllTimeMinutes = state.sessions
              .filter((s) => s.mode !== 'break' && s.subjectId === subject.id)
              .reduce((acc, s) => acc + s.durationMinutes, 0);
            const pct =
              subject.weeklyTargetMinutes > 0
                ? Math.min(100, Math.round((loggedMinutes / subject.weeklyTargetMinutes) * 100))
                : 0;

            return (
              <div
                key={subject.id}
                className="py-5 first:pt-2 last:pb-2 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full shrink-0 ${palette.dot}`} />
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate">
                      {subject.name}
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      · Total sepanjang waktu {formatMinutesHuman(totalAllTimeMinutes)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 max-w-lg">
                    <div className="flex-1 h-2.5 bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${palette.bar}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="font-mono-nums text-xs font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                      {formatMinutesHuman(loggedMinutes)} / {formatMinutesHuman(subject.weeklyTargetMinutes)} ({pct}%)
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <div className="inline-flex items-center border border-[var(--vibe-border)] bg-[var(--vibe-card-alt)] rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateSubjectTarget(
                          subject.id,
                          Math.max(30, subject.weeklyTargetMinutes - 30)
                        )
                      }
                      className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:opacity-80"
                      title="Kurangi target 30 menit"
                    >
                      -30m
                    </button>
                    <span className="px-2.5 py-1.5 text-xs font-mono-nums text-slate-500 dark:text-slate-400 border-x border-[var(--vibe-border)]">
                      Target
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateSubjectTarget(
                          subject.id,
                          Math.min(2400, subject.weeklyTargetMinutes + 30)
                        )
                      }
                      className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:opacity-80"
                      title="Tambah target 30 menit"
                    >
                      +30m
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onStartSubjectFocus(subject.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl kawaii-btn-primary whitespace-nowrap min-h-[36px]"
                  >
                    <Play className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Fokuskan</span>
                  </button>

                  {state.subjects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDeleteSubject(subject.id)}
                      aria-label={`Hapus mata pelajaran ${subject.name}`}
                      className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Achievement Milestones */}
      <section className="kawaii-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              Lencana Pencapaian
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Terbuka otomatis dari konsistensi dan durasi belajarmu.
            </p>
          </div>
          <span className="font-mono-nums text-sm font-semibold text-[var(--vibe-accent-text)]">
            {unlockedCount} / {badges.length} Terbuka
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => {
            const pct = Math.min(100, Math.round((badge.currentValue / badge.targetValue) * 100));
            return (
              <div
                key={badge.id}
                className={`p-5 rounded-2xl border transition-colors flex flex-col justify-between gap-4 ${
                  badge.unlocked
                    ? 'border-[var(--vibe-accent)] bg-[var(--vibe-accent-soft)]/60'
                    : 'border-[var(--vibe-border)] bg-[var(--vibe-card-alt)]/50 opacity-85'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[var(--vibe-border)] shrink-0 bg-[var(--vibe-card)] flex items-center justify-center">
                    {badge.unlocked ? (
                      <IllustratedAsset
                        src={EMBLEM_IMG}
                        alt={`Lencana ${badge.title}`}
                        titleFallback={badge.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Lock className="w-5 h-5 text-slate-400" aria-hidden="true" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {badge.title}
                      </h3>
                      {badge.unlocked && (
                        <Award
                          className="w-4 h-4 text-[var(--vibe-accent)] shrink-0"
                          aria-label="Terbuka"
                        />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 tabular-nums">
                    <span>{badge.unlocked ? 'Tercapai' : 'Progres'}</span>
                    <span className="font-mono-nums font-semibold">
                      {badge.currentValue}/{badge.targetValue} {badge.unit}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[var(--vibe-card)] border border-[var(--vibe-border)] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        badge.unlocked
                          ? 'bg-[var(--vibe-accent)]'
                          : 'bg-slate-400 dark:bg-slate-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
