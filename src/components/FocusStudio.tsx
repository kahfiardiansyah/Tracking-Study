import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Circle,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from 'lucide-react';
import {
  formatClock,
  formatMinutesHuman,
  getBuddyMessage,
  MODE_LABELS,
  SUBJECT_COLOR_MAP,
  VIBE_THEMES,
} from '../data/studyStore';
import { AmbientSound, StudyTask, Subject, TimerMode, VibeTheme } from '../types/study';
import {
  HeartDoodle,
  LoFiEqualizer,
  SparkleDoodle,
  VibeMascotSticker,
  WashiTape,
} from './CuteStickers';
import { IllustratedAsset } from './IllustratedAsset';

const FOCUS_MASCOT_IMG = '/src/assets/images/mascot_study_focus_1795446190310.jpg';
const BREAK_MASCOT_IMG = '/src/assets/images/mascot_break_rest_1795446189617.jpg';
const LOFI_MASCOT_IMG = '/src/assets/images/mascot_lofi_cat_1795447603947.jpg';

interface FocusStudioProps {
  vibe: VibeTheme;
  ambientSound: AmbientSound;
  mode: TimerMode;
  isRunning: boolean;
  secondsRemaining: number;
  elapsedSeconds: number;
  targetSeconds: number;
  customMinutes: number;
  todayMinutes: number;
  dailyGoalMinutes: number;
  subjects: Subject[];
  selectedSubjectId: string;
  tasks: StudyTask[];
  activeTaskId: string | null;
  onSelectMode: (mode: TimerMode) => void;
  onChangeCustomMinutes: (minutes: number) => void;
  onToggleRun: () => void;
  onReset: () => void;
  onFinishEarly: () => void;
  onAddFiveMinutes: () => void;
  onSelectSubject: (subjectId: string) => void;
  onOpenNewSubject: () => void;
  onSelectActiveTask: (taskId: string | null) => void;
  onAddTask: (title: string, subjectId: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onChangeDailyGoal: (minutes: number) => void;
}

const MODES: TimerMode[] = ['pomodoro', 'deep', 'break', 'stopwatch', 'custom'];

export const FocusStudio: React.FC<FocusStudioProps> = ({
  vibe,
  ambientSound,
  mode,
  isRunning,
  secondsRemaining,
  elapsedSeconds,
  targetSeconds,
  customMinutes,
  todayMinutes,
  dailyGoalMinutes,
  subjects,
  selectedSubjectId,
  tasks,
  activeTaskId,
  onSelectMode,
  onChangeCustomMinutes,
  onToggleRun,
  onReset,
  onFinishEarly,
  onAddFiveMinutes,
  onSelectSubject,
  onOpenNewSubject,
  onSelectActiveTask,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onChangeDailyGoal,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const selectedSubject =
    subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const activeTask = tasks.find((t) => t.id === activeTaskId) || null;

  const isStopwatch = mode === 'stopwatch';
  const isLofiActive = ambientSound === 'lofi' || ambientSound === 'lofi_rain';
  const displaySeconds = isStopwatch ? elapsedSeconds : secondsRemaining;

  const progressRatio = isStopwatch
    ? Math.min(1, (elapsedSeconds % 3600) / 3600)
    : targetSeconds > 0
      ? Math.min(1, elapsedSeconds / targetSeconds)
      : 0;

  const radius = 98;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  const buddy = getBuddyMessage({
    isRunning,
    mode,
    progressRatio,
    todayMinutes,
    dailyGoalMinutes,
  });

  const canSaveSession = elapsedSeconds >= 60 && mode !== 'break';

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTaskTitle.trim();
    if (!trimmed || !selectedSubject) return;
    onAddTask(trimmed, selectedSubject.id);
    setNewTaskTitle('');
  };

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const mascotImageSrc =
    mode === 'break'
      ? BREAK_MASCOT_IMG
      : isLofiActive
        ? LOFI_MASCOT_IMG
        : FOCUS_MASCOT_IMG;

  const mascotAlt =
    mode === 'break'
      ? 'Ilustrasi kucing Mochi meregangkan badan di dekat secangkir teh hangat saat istirahat belajar'
      : isLofiActive
        ? 'Ilustrasi kucing pastel memakai headphone mint sambil minum boba dan mendengarkan musik lo-fi'
        : 'Ilustrasi kucing Mochi berkacamata sedang fokus belajar di meja kayu dengan buku catatan dan teh matcha';

  return (
    <section
      aria-label="Studio Timer Belajar"
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
    >
      {/* Left / Main Focus Stage (8 cols) */}
      <div className="relative lg:col-span-7 xl:col-span-8 kawaii-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6">
        <WashiTape className="absolute -top-3 left-1/2 -translate-x-1/2 -rotate-1" />

        {/* Mode Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            role="tablist"
            aria-label="Mode timer belajar"
            className="inline-flex flex-wrap items-center gap-1 p-1 bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)] rounded-2xl"
          >
            {MODES.map((m) => {
              const active = mode === m;
              return (
                <button
                  key={m}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => onSelectMode(m)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 min-h-[36px] ${
                    active
                      ? 'bg-[var(--vibe-card)] text-[var(--vibe-accent-text)] shadow-xs border border-[var(--vibe-border)]'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {MODE_LABELS[m]}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 tabular-nums">
            <SparkleDoodle className="w-4 h-4" />
            <span>
              {isRunning
                ? 'Sedang fokus'
                : elapsedSeconds > 0
                  ? `Terjeda · ${Math.floor(elapsedSeconds / 60)}m`
                  : `Vibe ${VIBE_THEMES[vibe].name}`}
            </span>
          </div>
        </div>

        {/* Custom duration slider when Custom mode is active & idle */}
        {mode === 'custom' && !isRunning && elapsedSeconds === 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 px-4 bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)] rounded-2xl">
            <label
              htmlFor="custom-minutes-slider"
              className="text-sm font-semibold text-slate-800 dark:text-slate-100"
            >
              Durasi Kustom:{' '}
              <span className="font-mono-nums text-[var(--vibe-accent-text)]">
                {customMinutes} menit
              </span>
            </label>
            <input
              id="custom-minutes-slider"
              type="range"
              min={5}
              max={120}
              step={5}
              value={customMinutes}
              onChange={(e) => onChangeCustomMinutes(Number(e.target.value))}
              className="w-full sm:w-56 accent-[var(--vibe-accent)] cursor-pointer"
            />
          </div>
        )}

        {/* Centerpiece: Cute Circular Timer Ring + Mascot Study Buddy */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-2">
          {/* Circular Timer */}
          <div className="md:col-span-6 flex flex-col items-center justify-center">
            <div className="relative w-60 h-60 sm:w-64 sm:h-64 flex items-center justify-center">
              {/* Cute floating corner doodles */}
              <SparkleDoodle className="w-6 h-6 absolute top-3 left-4 animate-kawaii-float" />
              <HeartDoodle className="w-5 h-5 absolute bottom-4 right-5 animate-kawaii-float" />

              <svg
                className="w-full h-full -rotate-90"
                viewBox="0 0 220 220"
                aria-hidden="true"
              >
                {/* Soft pastel inner backdrop ring */}
                <circle
                  cx="110"
                  cy="110"
                  r={radius - 10}
                  fill="var(--vibe-card-alt)"
                  fillOpacity="0.6"
                />
                <circle
                  cx="110"
                  cy="110"
                  r={radius}
                  fill="none"
                  strokeWidth="12"
                  stroke="var(--vibe-border)"
                />
                <circle
                  cx="110"
                  cy="110"
                  r={radius}
                  fill="none"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{
                    stroke: mode === 'break' ? '#0EA5E9' : 'var(--vibe-accent)',
                  }}
                  className="transition-[stroke-dashoffset] duration-500 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <span className="text-xs font-semibold text-[var(--vibe-accent-text)] mb-1">
                  {MODE_LABELS[mode]}
                </span>
                <div
                  aria-live="polite"
                  className="font-mono-nums text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white"
                >
                  {formatClock(displaySeconds)}
                </div>
                <span className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-300 truncate max-w-[165px]">
                  {mode === 'break'
                    ? 'Tarik napas & rileks'
                    : selectedSubject?.name || 'Belajar Umum'}
                </span>
              </div>
            </div>

            {activeTask && mode !== 'break' && (
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 text-center max-w-xs truncate">
                Fokus tugas:{' '}
                <span className="font-semibold text-[var(--vibe-accent-text)]">
                  {activeTask.title}
                </span>
              </p>
            )}
          </div>

          {/* Cute Mochi Study Buddy Companion */}
          <div className="md:col-span-6 flex flex-col gap-4">
            <div className="relative aspect-square max-w-[236px] mx-auto w-full rounded-3xl overflow-hidden border-2 border-[var(--vibe-border)] bg-[var(--vibe-card-alt)] shadow-sm">
              <IllustratedAsset
                src={mascotImageSrc}
                alt={mascotAlt}
                titleFallback="Teman Belajar Mochi"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center md:text-left space-y-1.5 bg-[var(--vibe-card-alt)]/75 border border-[var(--vibe-border)] rounded-2xl p-4">
              <div className="flex items-center justify-center md:justify-between gap-2">
                <h2 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white text-balance">
                  {buddy.headline}
                </h2>
                {isLofiActive && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--vibe-accent-text)] shrink-0">
                    <LoFiEqualizer active={true} />
                    <span>Lo-Fi</span>
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {buddy.body}
              </p>
            </div>
          </div>
        </div>

        {/* Timer Action Controls */}
        <div className="pt-4 border-t border-[var(--vibe-border)] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onToggleRun}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-2xl kawaii-btn-primary whitespace-nowrap shrink-0 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vibe-accent)]"
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" aria-hidden="true" />
                  <span>Jeda</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" aria-hidden="true" />
                  <span>{elapsedSeconds > 0 ? 'Lanjutkan' : 'Mulai Belajar'}</span>
                </>
              )}
            </button>

            {canSaveSession && (
              <button
                type="button"
                onClick={onFinishEarly}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100 bg-[var(--vibe-card-alt)] hover:opacity-90 border border-[var(--vibe-border)] rounded-2xl transition-colors whitespace-nowrap shrink-0 min-h-[44px]"
              >
                <Save className="w-4 h-4 text-[var(--vibe-accent)]" aria-hidden="true" />
                <span>Selesai &amp; Simpan</span>
              </button>
            )}

            <button
              type="button"
              onClick={onReset}
              disabled={elapsedSeconds === 0 && !isRunning}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:pointer-events-none rounded-2xl transition-colors whitespace-nowrap shrink-0 min-h-[44px]"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Reset</span>
            </button>
          </div>

          {!isStopwatch && (
            <button
              type="button"
              onClick={onAddFiveMinutes}
              className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-[var(--vibe-accent-text)] bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)] hover:opacity-90 rounded-xl transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>5 Menit</span>
            </button>
          )}
        </div>
      </div>

      {/* Right Control & Checklist Deck (4 cols) */}
      <div className="lg:col-span-5 xl:col-span-4 kawaii-card rounded-3xl p-6 flex flex-col justify-between gap-6">
        {/* Subject Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <VibeMascotSticker vibe={vibe} className="w-6 h-6" />
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                Mata Pelajaran
              </h3>
            </div>
            <button
              type="button"
              onClick={onOpenNewSubject}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--vibe-accent-text)] hover:underline whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Tambah Mapel</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
            {subjects.map((sub) => {
              const isSelected = sub.id === selectedSubject?.id;
              const palette = SUBJECT_COLOR_MAP[sub.color];
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => onSelectSubject(sub.id)}
                  className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl text-left transition-all min-h-[42px] border ${
                    isSelected
                      ? 'border-[var(--vibe-accent)] bg-[var(--vibe-accent-soft)] text-slate-900 dark:text-white'
                      : 'border-[var(--vibe-border)] bg-[var(--vibe-card-alt)]/50 hover:bg-[var(--vibe-card-alt)] text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span
                      aria-hidden="true"
                      className={`w-3 h-3 rounded-full shrink-0 ${palette.dot}`}
                    />
                    <span className="text-sm font-semibold truncate">{sub.name}</span>
                  </span>
                  {isSelected && (
                    <Check
                      className="w-4 h-4 text-[var(--vibe-accent-text)] shrink-0"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Today's Checklist */}
        <div className="pt-5 border-t border-[var(--vibe-border)] space-y-3 flex-1 flex flex-col">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
              Rencana Belajar
            </h3>
            <span className="text-xs font-semibold text-[var(--vibe-accent-text)] tabular-nums">
              {completedTasks.length}/{tasks.length} selesai
            </span>
          </div>

          <form onSubmit={handleTaskSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Tulis tugas lucu hari ini..."
              aria-label="Tulis tugas belajar baru"
              className="flex-1 min-w-0 px-3.5 py-2 text-sm bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)] rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--vibe-accent)]"
            />
            <button
              type="submit"
              disabled={!newTaskTitle.trim()}
              aria-label="Tambah tugas"
              className="px-3.5 py-2 kawaii-btn-primary rounded-xl text-sm font-semibold disabled:opacity-40 shrink-0 min-h-[38px]"
            >
              Tambah
            </button>
          </form>

          <div className="space-y-1.5 overflow-y-auto max-h-52 pr-1 flex-1">
            {tasks.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
                Belum ada daftar tugas. Tambahkan satu target kecil biar makin semangat!
              </p>
            ) : (
              [...pendingTasks, ...completedTasks].map((task) => {
                const sub = subjects.find((s) => s.id === task.subjectId);
                const isActive = activeTaskId === task.id;
                return (
                  <div
                    key={task.id}
                    className={`group flex items-start gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-[var(--vibe-accent-soft)]'
                        : 'hover:bg-[var(--vibe-card-alt)]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onToggleTask(task.id)}
                      aria-label={
                        task.completed
                          ? `Tandai ${task.title} belum selesai`
                          : `Tandai ${task.title} selesai`
                      }
                      className="mt-0.5 text-slate-400 hover:text-[var(--vibe-accent)] shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-[var(--vibe-accent)]" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onSelectActiveTask(isActive ? null : task.id)
                      }
                      className="flex-1 min-w-0 text-left"
                    >
                      <span
                        className={`block text-sm leading-snug ${
                          task.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-100 font-medium'
                        }`}
                      >
                        {task.title}
                      </span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {sub?.name || 'Umum'}
                        {isActive && !task.completed ? ' · Sedang dipilih' : ''}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteTask(task.id)}
                      aria-label={`Hapus tugas ${task.title}`}
                      className="opacity-60 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-opacity shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Daily Goal Adjuster */}
        <div className="pt-4 border-t border-[var(--vibe-border)] flex items-center justify-between gap-3">
          <div>
            <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
              Target Harian
            </span>
            <span className="font-mono-nums text-sm font-semibold text-slate-900 dark:text-white">
              {formatMinutesHuman(dailyGoalMinutes)} ({dailyGoalMinutes} menit)
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onChangeDailyGoal(Math.max(15, dailyGoalMinutes - 15))}
              className="px-2.5 py-1.5 text-xs font-semibold border border-[var(--vibe-border)] bg-[var(--vibe-card-alt)] rounded-xl text-slate-700 dark:text-slate-200 hover:opacity-90"
              aria-label="Kurangi target harian 15 menit"
            >
              -15m
            </button>
            <button
              type="button"
              onClick={() => onChangeDailyGoal(Math.min(480, dailyGoalMinutes + 15))}
              className="px-2.5 py-1.5 text-xs font-semibold border border-[var(--vibe-border)] bg-[var(--vibe-card-alt)] rounded-xl text-slate-700 dark:text-slate-200 hover:opacity-90"
              aria-label="Tambah target harian 15 menit"
            >
              +15m
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
