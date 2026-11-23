import React from 'react';
import { formatMinutesHuman } from '../data/studyStore';
import { LevelInfo, VibeTheme } from '../types/study';
import { HeartDoodle, SparkleDoodle, VibeMascotSticker } from './CuteStickers';

interface KpiStripProps {
  vibe: VibeTheme;
  todayMinutes: number;
  dailyGoalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  levelInfo: LevelInfo;
  weeklySessionsCount: number;
  weeklyMinutes: number;
}

export const KpiStrip: React.FC<KpiStripProps> = ({
  vibe,
  todayMinutes,
  dailyGoalMinutes,
  currentStreak,
  longestStreak,
  levelInfo,
  weeklySessionsCount,
  weeklyMinutes,
}) => {
  const goalPct =
    dailyGoalMinutes > 0
      ? Math.min(100, Math.round((todayMinutes / dailyGoalMinutes) * 100))
      : 0;

  return (
    <section
      aria-label="Ringkasan pencapaian belajar"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 kawaii-card rounded-3xl divide-y sm:divide-y-0 sm:divide-x divide-[var(--vibe-border)] overflow-hidden"
    >
      <div className="p-5 flex flex-col justify-between gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Fokus Hari Ini
          </span>
          <SparkleDoodle className="w-4 h-4" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono-nums text-2xl font-semibold text-slate-900 dark:text-white">
            {formatMinutesHuman(todayMinutes)}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            / {formatMinutesHuman(dailyGoalMinutes)} ({goalPct}%)
          </span>
        </div>
        <div className="w-full h-2 bg-[var(--vibe-card-alt)] rounded-full overflow-hidden mt-1 border border-[var(--vibe-border)]">
          <div
            className="h-full bg-[var(--vibe-accent)] rounded-full transition-all duration-300"
            style={{ width: `${goalPct}%` }}
          />
        </div>
      </div>

      <div className="p-5 flex flex-col justify-between gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Streak Belajar
          </span>
          <HeartDoodle className="w-4 h-4" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono-nums text-2xl font-semibold text-slate-900 dark:text-white">
            {currentStreak} Hari
          </span>
          <span className="text-xs text-[var(--vibe-accent-text)] font-semibold">
            {currentStreak > 0 ? 'Api Aktif' : 'Mulai Hari Ini'}
          </span>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
          Rekor terbaik · {longestStreak} hari berturut-turut
        </span>
      </div>

      <div className="p-5 flex flex-col justify-between gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Level Pelajar
          </span>
          <VibeMascotSticker vibe={vibe} className="w-5 h-5" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono-nums text-2xl font-semibold text-slate-900 dark:text-white">
            Lv. {levelInfo.level}
          </span>
          <span className="text-xs text-[var(--vibe-accent-text)] font-semibold truncate">
            {levelInfo.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-[var(--vibe-card-alt)] rounded-full overflow-hidden border border-[var(--vibe-border)]">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-300"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
          <span className="font-mono-nums text-xs text-slate-600 dark:text-slate-300">
            {levelInfo.totalXp} XP
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col justify-between gap-2">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          Minggu Ini
        </span>
        <div className="flex items-baseline gap-2">
          <span className="font-mono-nums text-2xl font-semibold text-slate-900 dark:text-white">
            {weeklySessionsCount} Sesi
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            · {formatMinutesHuman(weeklyMinutes)}
          </span>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Senin hingga hari ini
        </span>
      </div>
    </section>
  );
};
