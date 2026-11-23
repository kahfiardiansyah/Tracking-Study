import React, { useMemo, useState } from 'react';
import {
  formatMinutesHuman,
  SUBJECT_COLOR_MAP,
  toLocalDateKey,
} from '../data/studyStore';
import { StudyState } from '../types/study';
import { SparkleDoodle, WashiTape } from './CuteStickers';

interface StatsViewProps {
  state: StudyState;
}

export const StatsView: React.FC<StatsViewProps> = ({ state }) => {
  const [rangeDays, setRangeDays] = useState<7 | 30>(7);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ dateLabel: string; minutes: number } | null>(null);

  const focusSessions = useMemo(
    () => state.sessions.filter((s) => s.mode !== 'break'),
    [state.sessions]
  );

  const dailyMap = useMemo(() => {
    const map = new Map<string, number>();
    focusSessions.forEach((s) => {
      const key = toLocalDateKey(s.startedAt);
      map.set(key, (map.get(key) || 0) + s.durationMinutes);
    });
    return map;
  }, [focusSessions]);

  const chartData = useMemo(() => {
    const days: { key: string; shortLabel: string; fullLabel: string; minutes: number }[] = [];
    for (let i = rangeDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = toLocalDateKey(d);
      const shortLabel =
        rangeDays === 7
          ? d.toLocaleDateString('id-ID', { weekday: 'short' })
          : `${d.getDate()}/${d.getMonth() + 1}`;
      const fullLabel = d.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
      });
      days.push({
        key,
        shortLabel,
        fullLabel,
        minutes: dailyMap.get(key) || 0,
      });
    }
    return days;
  }, [rangeDays, dailyMap]);

  const maxChartMinutes = Math.max(
    state.settings.dailyGoalMinutes,
    ...chartData.map((d) => d.minutes),
    60
  );

  const heatmapWeeks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayOfWeek = (today.getDay() + 6) % 7;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (11 * 7 + dayOfWeek));

    const weeks: {
      key: string;
      dateLabel: string;
      minutes: number;
      isFuture: boolean;
    }[][] = [];

    for (let w = 0; w < 12; w++) {
      const col = [];
      for (let r = 0; r < 7; r++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + w * 7 + r);
        const key = toLocalDateKey(d);
        const isFuture = d > today;
        col.push({
          key,
          dateLabel: d.toLocaleDateString('id-ID', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          }),
          minutes: isFuture ? 0 : dailyMap.get(key) || 0,
          isFuture,
        });
      }
      weeks.push(col);
    }
    return weeks;
  }, [dailyMap]);

  const subjectBreakdown = useMemo(() => {
    const totalMinutes = focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    return state.subjects
      .map((sub) => {
        const mins = focusSessions
          .filter((s) => s.subjectId === sub.id)
          .reduce((acc, s) => acc + s.durationMinutes, 0);
        const pct = totalMinutes > 0 ? Math.round((mins / totalMinutes) * 100) : 0;
        return { subject: sub, minutes: mins, pct };
      })
      .sort((a, b) => b.minutes - a.minutes);
  }, [focusSessions, state.subjects]);

  const insights = useMemo(() => {
    const buckets = [
      { id: 'morning', label: 'Pagi (05.00 - 11.59)', minutes: 0 },
      { id: 'afternoon', label: 'Siang (12.00 - 16.59)', minutes: 0 },
      { id: 'evening', label: 'Sore/Malam (17.00 - 21.59)', minutes: 0 },
      { id: 'night', label: 'Larut Malam (22.00 - 04.59)', minutes: 0 },
    ];

    let greatCount = 0;
    let totalMinutes = 0;

    focusSessions.forEach((s) => {
      totalMinutes += s.durationMinutes;
      if (s.mood === 'great') greatCount++;
      const hour = new Date(s.startedAt).getHours();
      if (hour >= 5 && hour < 12) buckets[0].minutes += s.durationMinutes;
      else if (hour >= 12 && hour < 17) buckets[1].minutes += s.durationMinutes;
      else if (hour >= 17 && hour < 22) buckets[2].minutes += s.durationMinutes;
      else buckets[3].minutes += s.durationMinutes;
    });

    const bestBucket = [...buckets].sort((a, b) => b.minutes - a.minutes)[0];
    const avgDuration =
      focusSessions.length > 0 ? Math.round(totalMinutes / focusSessions.length) : 0;
    const greatRate =
      focusSessions.length > 0 ? Math.round((greatCount / focusSessions.length) * 100) : 0;

    return {
      totalMinutes,
      sessionCount: focusSessions.length,
      avgDuration,
      greatRate,
      bestWindow: bestBucket.minutes > 0 ? bestBucket.label : 'Belum cukup data',
    };
  }, [focusSessions]);

  const getHeatOpacity = (minutes: number, isFuture: boolean): React.CSSProperties => {
    if (isFuture) {
      return {
        backgroundColor: 'transparent',
        border: '1px dashed var(--vibe-border)',
      };
    }
    if (minutes === 0) {
      return { backgroundColor: 'var(--vibe-card-alt)' };
    }
    if (minutes < 30) return { backgroundColor: 'var(--vibe-accent)', opacity: 0.35 };
    if (minutes < 60) return { backgroundColor: 'var(--vibe-accent)', opacity: 0.6 };
    if (minutes < 120) return { backgroundColor: 'var(--vibe-accent)', opacity: 0.82 };
    return { backgroundColor: 'var(--vibe-accent)', opacity: 1 };
  };

  return (
    <div className="space-y-6">
      {/* Top Bar Summary Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 kawaii-card rounded-3xl divide-y sm:divide-y-0 sm:divide-x divide-[var(--vibe-border)] overflow-hidden">
        <div className="p-5 space-y-1">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Total Waktu Belajar
          </span>
          <p className="font-mono-nums text-2xl font-semibold text-slate-900 dark:text-white">
            {formatMinutesHuman(insights.totalMinutes)}
          </p>
          <span className="block text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            Dari {insights.sessionCount} sesi tercatat
          </span>
        </div>

        <div className="p-5 space-y-1">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Rata-rata Durasi Sesi
          </span>
          <p className="font-mono-nums text-2xl font-semibold text-slate-900 dark:text-white">
            {insights.avgDuration} menit
          </p>
          <span className="block text-xs text-slate-500 dark:text-slate-400">
            Per satu kali duduk fokus
          </span>
        </div>

        <div className="p-5 space-y-1">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Rasio Fokus Prima
          </span>
          <p className="font-mono-nums text-2xl font-semibold text-slate-900 dark:text-white">
            {insights.greatRate}%
          </p>
          <span className="block text-xs text-slate-500 dark:text-slate-400">
            Sesi dengan kualitas Sangat Fokus
          </span>
        </div>

        <div className="p-5 space-y-1">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Jam Paling Produktif
          </span>
          <p className="text-base sm:text-lg font-bold text-[var(--vibe-accent-text)] pt-1">
            {insights.bestWindow}
          </p>
          <span className="block text-xs text-slate-500 dark:text-slate-400">
            Berdasarkan akumulasi menit fokus
          </span>
        </div>
      </section>

      {/* Main Bar Chart + Subject Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Interactive Daily Bar Chart */}
        <section className="relative lg:col-span-7 kawaii-card rounded-3xl p-6 flex flex-col justify-between gap-5">
          <WashiTape className="absolute -top-3 left-8 -rotate-1" />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Tren Waktu Belajar Harian
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                Garis putus-putus menandakan target harian ({state.settings.dailyGoalMinutes} menit)
              </p>
            </div>

            <div className="inline-flex items-center p-1 bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)] rounded-xl">
              <button
                type="button"
                onClick={() => setRangeDays(7)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  rangeDays === 7
                    ? 'bg-[var(--vibe-card)] text-[var(--vibe-accent-text)] shadow-xs border border-[var(--vibe-border)]'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                7 Hari
              </button>
              <button
                type="button"
                onClick={() => setRangeDays(30)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  rangeDays === 30
                    ? 'bg-[var(--vibe-card)] text-[var(--vibe-accent-text)] shadow-xs border border-[var(--vibe-border)]'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                30 Hari
              </button>
            </div>
          </div>

          {/* Hover readout */}
          <div className="h-5 text-xs text-slate-600 dark:text-slate-300 tabular-nums">
            {hoveredBarIndex !== null && chartData[hoveredBarIndex] ? (
              <span>
                <strong className="text-slate-900 dark:text-white">
                  {chartData[hoveredBarIndex].fullLabel}:
                </strong>{' '}
                {chartData[hoveredBarIndex].minutes} menit (
                {formatMinutesHuman(chartData[hoveredBarIndex].minutes)})
              </span>
            ) : (
              <span className="text-slate-400 dark:text-slate-500">
                Arahkan kursor ke batang grafik untuk melihat detail harian.
              </span>
            )}
          </div>

          <div className="relative h-56 flex items-end gap-1.5 sm:gap-2 pt-4 pb-6 border-b border-[var(--vibe-border)]">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 border-t-2 border-dashed border-amber-400/80 pointer-events-none"
              style={{
                bottom: `calc(24px + ${Math.min(
                  100,
                  (state.settings.dailyGoalMinutes / maxChartMinutes) * 100
                )}% * 0.78)`,
              }}
            />

            {chartData.map((item, idx) => {
              const heightPct = Math.round((item.minutes / maxChartMinutes) * 100);
              const hitGoal = item.minutes >= state.settings.dailyGoalMinutes;
              return (
                <div
                  key={item.key}
                  onMouseEnter={() => setHoveredBarIndex(idx)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                  className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer"
                >
                  <div className="w-full flex-1 flex items-end justify-center">
                    <div
                      className="w-full max-w-[34px] rounded-t-xl transition-all duration-200 group-hover:brightness-95"
                      style={{
                        height: `${Math.max(item.minutes > 0 ? 7 : 3, heightPct)}%`,
                        backgroundColor:
                          item.minutes === 0
                            ? 'var(--vibe-card-alt)'
                            : 'var(--vibe-accent)',
                        opacity: item.minutes === 0 ? 1 : hitGoal ? 1 : 0.65,
                      }}
                    />
                  </div>
                  {(rangeDays === 7 || idx % 5 === 0 || idx === chartData.length - 1) && (
                    <span className="absolute bottom-0 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      {item.shortLabel}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Subject Distribution */}
        <section className="lg:col-span-5 kawaii-card rounded-3xl p-6 flex flex-col justify-between gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Distribusi Mata Pelajaran
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Porsi waktu belajar dari seluruh sesi tersimpan.
              </p>
            </div>
            <SparkleDoodle className="w-5 h-5" />
          </div>

          <div className="space-y-4 flex-1">
            {subjectBreakdown.map(({ subject, minutes, pct }) => {
              const palette = SUBJECT_COLOR_MAP[subject.color];
              return (
                <div key={subject.id} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100 truncate">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${palette.dot}`} />
                      <span className="truncate">{subject.name}</span>
                    </span>
                    <span className="font-mono-nums text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {formatMinutesHuman(minutes)} · {pct}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${palette.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* 12-Week Consistency Heatmap */}
      <section className="kawaii-card rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Peta Konsistensi 12 Minggu Terakhir
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {hoveredCell
                ? `${hoveredCell.dateLabel}: ${hoveredCell.minutes} menit fokus`
                : 'Setiap kotak mewakili satu hari belajarmu.'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>Sedikit</span>
            <span className="w-3.5 h-3.5 rounded-sm bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)]" />
            <span className="w-3.5 h-3.5 rounded-sm bg-[var(--vibe-accent)] opacity-35" />
            <span className="w-3.5 h-3.5 rounded-sm bg-[var(--vibe-accent)] opacity-60" />
            <span className="w-3.5 h-3.5 rounded-sm bg-[var(--vibe-accent)] opacity-85" />
            <span className="w-3.5 h-3.5 rounded-sm bg-[var(--vibe-accent)]" />
            <span>Intens</span>
          </div>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="inline-flex items-start gap-2 min-w-full">
            <div className="grid grid-rows-7 gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 pr-1 pt-0.5">
              <span>Sen</span>
              <span className="opacity-0">Sel</span>
              <span>Rab</span>
              <span className="opacity-0">Kam</span>
              <span>Jum</span>
              <span className="opacity-0">Sab</span>
              <span>Min</span>
            </div>

            <div className="grid grid-cols-12 gap-1.5 flex-1">
              {heatmapWeeks.map((week, wIdx) => (
                <div key={wIdx} className="grid grid-rows-7 gap-1.5">
                  {week.map((cell) => (
                    <button
                      key={cell.key}
                      type="button"
                      disabled={cell.isFuture}
                      onMouseEnter={() =>
                        !cell.isFuture &&
                        setHoveredCell({ dateLabel: cell.dateLabel, minutes: cell.minutes })
                      }
                      onMouseLeave={() => setHoveredCell(null)}
                      onFocus={() =>
                        !cell.isFuture &&
                        setHoveredCell({ dateLabel: cell.dateLabel, minutes: cell.minutes })
                      }
                      aria-label={`${cell.dateLabel}: ${cell.minutes} menit`}
                      style={getHeatOpacity(cell.minutes, cell.isFuture)}
                      className="h-4 sm:h-5 w-full rounded-md transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--vibe-accent)]"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
