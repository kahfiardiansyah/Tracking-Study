import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FocusStudio } from './components/FocusStudio';
import { HistoryView } from './components/HistoryView';
import { KpiStrip } from './components/KpiStrip';
import { ManualLogModal } from './components/ManualLogModal';
import { MotivationBoard } from './components/MotivationBoard';
import { SessionCompleteModal } from './components/SessionCompleteModal';
import { StatsView } from './components/StatsView';
import { TargetsView } from './components/TargetsView';
import { TopBar } from './components/TopBar';
import { WorkspaceToolbar } from './components/WorkspaceToolbar';
import {
  calculateSessionXp,
  computeLevelInfo,
  computeStreakDays,
  createEmptyState,
  createSeedState,
  DEFAULT_QUOTES,
  formatClock,
  getStartOfWeek,
  loadStudyState,
  saveStudyState,
  toLocalDateKey,
  VIBE_THEMES,
} from './data/studyStore';
import {
  AmbientSound,
  AppTab,
  FocusMood,
  StudySession,
  StudyState,
  SubjectColor,
  TimerMode,
  VibeTheme,
} from './types/study';
import { soundEngine } from './utils/soundEngine';

const DEFAULT_TITLE = 'MochiBelajar — Teman Fokus & Pelacak Belajar';

export default function App() {
  const [state, setState] = useState<StudyState>(() => loadStudyState());
  const [activeTab, setActiveTab] = useState<AppTab>('focus');

  // Timer state
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [extraSeconds, setExtraSeconds] = useState(0);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    () => loadStudyState().subjects[0]?.id || ''
  );
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // Modals & transient feedback
  const [pendingCompletion, setPendingCompletion] = useState<{
    durationMinutes: number;
    mode: TimerMode;
    startedAtIso: string;
  } | null>(null);
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualModalMode, setManualModalMode] = useState<'session' | 'subject'>('session');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const sessionStartRef = useRef<string | null>(null);
  const lastTickRef = useRef<number | null>(null);

  // Persist state changes
  useEffect(() => {
    saveStudyState(state);
  }, [state]);

  // Sync dark mode class and data-vibe attribute on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (state.settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.setAttribute('data-vibe', state.settings.vibe || 'strawberry');
  }, [state.settings.darkMode, state.settings.vibe]);

  // Ensure selectedSubjectId remains valid if subjects are modified
  useEffect(() => {
    if (!state.subjects.some((s) => s.id === selectedSubjectId)) {
      setSelectedSubjectId(state.subjects[0]?.id || '');
    }
  }, [state.subjects, selectedSubjectId]);

  // Cleanup ambient sound on unmount
  useEffect(() => {
    return () => {
      soundEngine.stopAmbient();
    };
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const t = window.setTimeout(() => setToastMessage(null), 3500);
    return () => window.clearTimeout(t);
  }, [toastMessage]);

  const baseTargetMinutes = useMemo(() => {
    switch (mode) {
      case 'pomodoro':
        return state.settings.pomodoroMinutes;
      case 'deep':
        return state.settings.deepWorkMinutes;
      case 'break':
        return state.settings.breakMinutes;
      case 'custom':
        return state.settings.customMinutes;
      case 'stopwatch':
        return 0;
    }
  }, [mode, state.settings]);

  const targetSeconds = baseTargetMinutes * 60 + extraSeconds;
  const secondsRemaining = Math.max(0, targetSeconds - elapsedSeconds);

  // Live document title while running
  useEffect(() => {
    if (!isRunning) {
      document.title = DEFAULT_TITLE;
      return;
    }
    const clock =
      mode === 'stopwatch'
        ? formatClock(elapsedSeconds)
        : formatClock(secondsRemaining);
    document.title = `${clock} · MochiBelajar`;
  }, [isRunning, mode, elapsedSeconds, secondsRemaining]);

  // Drift-free timer tick
  useEffect(() => {
    if (!isRunning) {
      lastTickRef.current = null;
      return;
    }

    lastTickRef.current = Date.now();
    const interval = window.setInterval(() => {
      const now = Date.now();
      const prev = lastTickRef.current ?? now;
      const deltaSec = Math.floor((now - prev) / 1000);
      if (deltaSec >= 1) {
        lastTickRef.current = prev + deltaSec * 1000;
        setElapsedSeconds((curr) => curr + deltaSec);
      }
    }, 250);

    return () => window.clearInterval(interval);
  }, [isRunning]);

  // Handle countdown completion
  useEffect(() => {
    if (!isRunning || mode === 'stopwatch' || targetSeconds <= 0) return;
    if (elapsedSeconds >= targetSeconds) {
      setIsRunning(false);
      soundEngine.playCompletionChime(state.settings.soundEffectsEnabled);

      if (mode === 'break') {
        const breakSession: StudySession = {
          id: `ses-${Date.now()}`,
          subjectId: selectedSubjectId || state.subjects[0]?.id || '',
          taskTitle: 'Istirahat Menyegarkan Pikiran',
          mode: 'break',
          durationMinutes: Math.max(1, Math.round(targetSeconds / 60)),
          xpEarned: 10,
          mood: 'good',
          note: '',
          startedAt: sessionStartRef.current || new Date().toISOString(),
          endedAt: new Date().toISOString(),
        };
        setState((prev) => ({
          ...prev,
          sessions: [breakSession, ...prev.sessions],
        }));
        setElapsedSeconds(0);
        setExtraSeconds(0);
        sessionStartRef.current = null;
        setMode('pomodoro');
        showToast('Waktu istirahat selesai! Siap lanjut fokus (+10 XP).');
      } else {
        const completedMins = Math.max(1, Math.round(targetSeconds / 60));
        setPendingCompletion({
          durationMinutes: completedMins,
          mode,
          startedAtIso:
            sessionStartRef.current ||
            new Date(Date.now() - completedMins * 60000).toISOString(),
        });
      }
    }
  }, [
    elapsedSeconds,
    targetSeconds,
    isRunning,
    mode,
    selectedSubjectId,
    state.subjects,
    state.settings.soundEffectsEnabled,
    showToast,
  ]);

  // Computed metrics
  const todayKey = toLocalDateKey(new Date());
  const todayMinutes = useMemo(
    () =>
      state.sessions
        .filter((s) => s.mode !== 'break' && toLocalDateKey(s.startedAt) === todayKey)
        .reduce((acc, s) => acc + s.durationMinutes, 0),
    [state.sessions, todayKey]
  );

  const weekStart = getStartOfWeek();
  const weeklyFocusSessions = useMemo(
    () =>
      state.sessions.filter(
        (s) => s.mode !== 'break' && new Date(s.startedAt) >= weekStart
      ),
    [state.sessions, weekStart]
  );
  const weeklyMinutes = weeklyFocusSessions.reduce(
    (acc, s) => acc + s.durationMinutes,
    0
  );

  const streak = useMemo(() => computeStreakDays(state.sessions), [state.sessions]);
  const levelInfo = useMemo(
    () => computeLevelInfo(state.sessions, state.bonusXp),
    [state.sessions, state.bonusXp]
  );

  // Timer & Audio handlers
  const handleSelectMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setElapsedSeconds(0);
    setExtraSeconds(0);
    sessionStartRef.current = null;
    setMode(newMode);
  };

  const handleToggleRun = () => {
    if (!isRunning && elapsedSeconds === 0) {
      sessionStartRef.current = new Date().toISOString();
    }
    setIsRunning((r) => !r);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
    setExtraSeconds(0);
    sessionStartRef.current = null;
  };

  const handleFinishEarly = () => {
    if (elapsedSeconds < 60 || mode === 'break') return;
    setIsRunning(false);
    soundEngine.playCompletionChime(state.settings.soundEffectsEnabled);
    const completedMins = Math.max(1, Math.round(elapsedSeconds / 60));
    setPendingCompletion({
      durationMinutes: completedMins,
      mode,
      startedAtIso:
        sessionStartRef.current ||
        new Date(Date.now() - completedMins * 60000).toISOString(),
    });
  };

  const handleAddFiveMinutes = () => {
    setExtraSeconds((prev) => prev + 300);
    showToast('Ditambahkan 5 menit ke timer saat ini.');
  };

  const handleSaveCompletedSession = ({
    mood,
    note,
    taskTitle,
    startBreakAfter,
  }: {
    mood: FocusMood;
    note: string;
    taskTitle: string;
    startBreakAfter: boolean;
  }) => {
    if (!pendingCompletion) return;
    const xp = calculateSessionXp(
      pendingCompletion.durationMinutes,
      mood,
      pendingCompletion.mode
    );
    const newSession: StudySession = {
      id: `ses-${Date.now()}`,
      subjectId: selectedSubjectId || state.subjects[0]?.id || '',
      taskTitle,
      mode: pendingCompletion.mode,
      durationMinutes: pendingCompletion.durationMinutes,
      xpEarned: xp,
      mood,
      note,
      startedAt: pendingCompletion.startedAtIso,
      endedAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      sessions: [newSession, ...prev.sessions],
    }));

    setPendingCompletion(null);
    setElapsedSeconds(0);
    setExtraSeconds(0);
    sessionStartRef.current = null;

    if (startBreakAfter) {
      setMode('break');
      sessionStartRef.current = new Date().toISOString();
      setIsRunning(true);
      showToast(`+${xp} XP tersimpan! Selamat menikmati jeda istirahat.`);
    } else {
      showToast(`Sesi tersimpan! Kamu mendapatkan +${xp} XP.`);
    }
  };

  const handleDiscardCompletion = () => {
    setPendingCompletion(null);
    setElapsedSeconds(0);
    setExtraSeconds(0);
    sessionStartRef.current = null;
  };

  const handleChangeVibe = (vibe: VibeTheme) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, vibe },
    }));
    showToast(`Vibe diganti ke ${VIBE_THEMES[vibe].name}!`);
  };

  const handleChangeAmbient = (sound: AmbientSound) => {
    soundEngine.setAmbient(sound, state.settings.ambientVolume);
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ambientSound: sound },
    }));
  };

  const handleChangeVolume = (volume: number) => {
    soundEngine.updateVolume(volume);
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ambientVolume: volume },
    }));
  };

  const handleToggleDarkMode = () => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, darkMode: !prev.settings.darkMode },
    }));
  };

  const handleToggleSoundEffects = () => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        soundEffectsEnabled: !prev.settings.soundEffectsEnabled,
      },
    }));
  };

  // Task handlers
  const handleAddTask = (title: string, subjectId: string) => {
    const newTask = {
      id: `task-${Date.now()}`,
      subjectId,
      title,
      completed: false,
      estimatedPomodoros: 1,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
    setActiveTaskId(newTask.id);
  };

  const handleToggleTask = (taskId: string) => {
    const target = state.tasks.find((t) => t.id === taskId);
    if (!target) return;
    const becomingCompleted = !target.completed;
    if (becomingCompleted) {
      soundEngine.playPop(state.settings.soundEffectsEnabled);
      showToast('Tugas selesai! +15 XP bonus.');
    }
    setState((prev) => ({
      ...prev,
      bonusXp: becomingCompleted ? prev.bonusXp + 15 : Math.max(0, prev.bonusXp - 15),
      tasks: prev.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ),
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    if (activeTaskId === taskId) setActiveTaskId(null);
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
  };

  // Motivation Quotes handlers
  const handleShuffleQuote = () => {
    if (state.quotes.length <= 1) return;
    const others = state.quotes.filter((q) => q.id !== state.activeQuoteId);
    const next = others[Math.floor(Math.random() * others.length)] || state.quotes[0];
    setState((prev) => ({
      ...prev,
      activeQuoteId: next.id,
    }));
  };

  const handleAddQuote = (text: string, author: string) => {
    const newQ = {
      id: `q-${Date.now()}`,
      text,
      author,
      pinned: false,
    };
    setState((prev) => ({
      ...prev,
      quotes: [newQ, ...prev.quotes],
      activeQuoteId: newQ.id,
    }));
    showToast('Kata motivasi baru ditambahkan!');
  };

  const handleUpdateQuote = (id: string, text: string, author: string) => {
    setState((prev) => ({
      ...prev,
      quotes: prev.quotes.map((q) =>
        q.id === id ? { ...q, text, author } : q
      ),
    }));
    showToast('Kata motivasi diperbarui.');
  };

  const handleDeleteQuote = (id: string) => {
    setState((prev) => {
      const remaining = prev.quotes.filter((q) => q.id !== id);
      if (remaining.length === 0) return prev;
      return {
        ...prev,
        quotes: remaining,
        activeQuoteId:
          prev.activeQuoteId === id ? remaining[0].id : prev.activeQuoteId,
      };
    });
  };

  const handleTogglePinQuote = (id: string) => {
    setState((prev) => ({
      ...prev,
      quotes: prev.quotes.map((q) =>
        q.id === id ? { ...q, pinned: !q.pinned } : q
      ),
    }));
  };

  const handleResetQuotes = () => {
    setState((prev) => ({
      ...prev,
      quotes: DEFAULT_QUOTES,
      activeQuoteId: DEFAULT_QUOTES[0].id,
    }));
    showToast('Kutipan bawaan dipulihkan.');
  };

  // Manual Session & Subject handlers
  const handleAddManualSession = (payload: {
    subjectId: string;
    taskTitle: string;
    durationMinutes: number;
    dateKey: string;
    mood: FocusMood;
    note: string;
  }) => {
    const [y, m, d] = payload.dateKey.split('-').map(Number);
    const start = new Date(y, m - 1, d, 9, 0, 0);
    const end = new Date(start.getTime() + payload.durationMinutes * 60000);
    const xp = calculateSessionXp(payload.durationMinutes, payload.mood, 'custom');

    const newSession: StudySession = {
      id: `ses-${Date.now()}`,
      subjectId: payload.subjectId,
      taskTitle: payload.taskTitle,
      mode: 'custom',
      durationMinutes: payload.durationMinutes,
      xpEarned: xp,
      mood: payload.mood,
      note: payload.note,
      startedAt: start.toISOString(),
      endedAt: end.toISOString(),
    };

    setState((prev) => ({
      ...prev,
      sessions: [newSession, ...prev.sessions],
    }));
    showToast(`Catatan belajar ditambahkan (+${xp} XP).`);
  };

  const handleAddSubject = (payload: {
    name: string;
    color: SubjectColor;
    weeklyTargetMinutes: number;
  }) => {
    const newSubject = {
      id: `sub-${Date.now()}`,
      name: payload.name,
      color: payload.color,
      weeklyTargetMinutes: payload.weeklyTargetMinutes,
    };
    setState((prev) => ({
      ...prev,
      subjects: [...prev.subjects, newSubject],
    }));
    setSelectedSubjectId(newSubject.id);
    showToast(`Mata pelajaran "${payload.name}" ditambahkan.`);
  };

  const activeTask = state.tasks.find((t) => t.id === activeTaskId);
  const selectedSubject = state.subjects.find((s) => s.id === selectedSubjectId);

  return (
    <div className="min-h-screen flex flex-col vibe-canvas text-[#1E242B] dark:text-[#EEF2F6]">
      <TopBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenManualLog={() => {
          setManualModalMode('session');
          setManualModalOpen(true);
        }}
      />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 pt-5 pb-12 space-y-6">
        <WorkspaceToolbar
          vibe={state.settings.vibe}
          ambientSound={state.settings.ambientSound}
          ambientVolume={state.settings.ambientVolume}
          darkMode={state.settings.darkMode}
          soundEffectsEnabled={state.settings.soundEffectsEnabled}
          onChangeVibe={handleChangeVibe}
          onChangeAmbient={handleChangeAmbient}
          onChangeVolume={handleChangeVolume}
          onToggleDarkMode={handleToggleDarkMode}
          onToggleSoundEffects={handleToggleSoundEffects}
        />

        {activeTab === 'focus' && (
          <div className="space-y-6">
            <MotivationBoard
              quotes={state.quotes}
              activeQuoteId={state.activeQuoteId}
              vibe={state.settings.vibe}
              onSelectQuote={(id) =>
                setState((prev) => ({ ...prev, activeQuoteId: id }))
              }
              onShuffleQuote={handleShuffleQuote}
              onAddQuote={handleAddQuote}
              onUpdateQuote={handleUpdateQuote}
              onDeleteQuote={handleDeleteQuote}
              onTogglePin={handleTogglePinQuote}
              onResetQuotes={handleResetQuotes}
            />

            <FocusStudio
              vibe={state.settings.vibe}
              ambientSound={state.settings.ambientSound}
              mode={mode}
              isRunning={isRunning}
              secondsRemaining={secondsRemaining}
              elapsedSeconds={elapsedSeconds}
              targetSeconds={targetSeconds}
              customMinutes={state.settings.customMinutes}
              todayMinutes={todayMinutes}
              dailyGoalMinutes={state.settings.dailyGoalMinutes}
              subjects={state.subjects}
              selectedSubjectId={selectedSubjectId}
              tasks={state.tasks}
              activeTaskId={activeTaskId}
              onSelectMode={handleSelectMode}
              onChangeCustomMinutes={(minutes) =>
                setState((prev) => ({
                  ...prev,
                  settings: { ...prev.settings, customMinutes: minutes },
                }))
              }
              onToggleRun={handleToggleRun}
              onReset={handleReset}
              onFinishEarly={handleFinishEarly}
              onAddFiveMinutes={handleAddFiveMinutes}
              onSelectSubject={setSelectedSubjectId}
              onOpenNewSubject={() => {
                setManualModalMode('subject');
                setManualModalOpen(true);
              }}
              onSelectActiveTask={setActiveTaskId}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onChangeDailyGoal={(minutes) =>
                setState((prev) => ({
                  ...prev,
                  settings: { ...prev.settings, dailyGoalMinutes: minutes },
                }))
              }
            />

            <KpiStrip
              vibe={state.settings.vibe}
              todayMinutes={todayMinutes}
              dailyGoalMinutes={state.settings.dailyGoalMinutes}
              currentStreak={streak.current}
              longestStreak={streak.longest}
              levelInfo={levelInfo}
              weeklySessionsCount={weeklyFocusSessions.length}
              weeklyMinutes={weeklyMinutes}
            />
          </div>
        )}

        {activeTab === 'targets' && (
          <TargetsView
            state={state}
            onStartSubjectFocus={(subjectId) => {
              setSelectedSubjectId(subjectId);
              setActiveTab('focus');
            }}
            onOpenNewSubject={() => {
              setManualModalMode('subject');
              setManualModalOpen(true);
            }}
            onUpdateSubjectTarget={(subjectId, weeklyTargetMinutes) =>
              setState((prev) => ({
                ...prev,
                subjects: prev.subjects.map((s) =>
                  s.id === subjectId ? { ...s, weeklyTargetMinutes } : s
                ),
              }))
            }
            onDeleteSubject={(subjectId) =>
              setState((prev) => ({
                ...prev,
                subjects: prev.subjects.filter((s) => s.id !== subjectId),
              }))
            }
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            state={state}
            onOpenManualLog={() => {
              setManualModalMode('session');
              setManualModalOpen(true);
            }}
            onDeleteSession={(sessionId) =>
              setState((prev) => ({
                ...prev,
                sessions: prev.sessions.filter((s) => s.id !== sessionId),
              }))
            }
            onResetToDemo={() => {
              const demo = createSeedState();
              setState(demo);
              setSelectedSubjectId(demo.subjects[0]?.id || '');
              showToast('Data contoh berhasil dimuat ulang.');
            }}
            onClearAllData={() => {
              const empty = createEmptyState();
              setState(empty);
              setSelectedSubjectId(empty.subjects[0]?.id || '');
              showToast('Riwayat dikosongkan. Selamat memulai lembaran baru!');
            }}
          />
        )}

        {activeTab === 'stats' && <StatsView state={state} />}
      </main>

      <footer className="border-t border-[var(--vibe-border)] bg-[var(--vibe-card)]/60 py-5 px-4 sm:px-6 text-center text-xs text-slate-600 dark:text-slate-300">
        MochiBelajar · Ruang fokus manis untuk menjaga ritme dan semangat belajarmu.
      </footer>

      {/* Session Complete Celebration & Reflection Modal */}
      <SessionCompleteModal
        key={pendingCompletion ? pendingCompletion.startedAtIso : 'closed'}
        isOpen={Boolean(pendingCompletion)}
        durationMinutes={pendingCompletion?.durationMinutes || 25}
        mode={pendingCompletion?.mode || 'pomodoro'}
        subject={selectedSubject}
        defaultTaskTitle={activeTask?.title || selectedSubject?.name || ''}
        onSave={handleSaveCompletedSession}
        onDiscard={handleDiscardCompletion}
      />

      {/* Manual Log / Add Subject Modal */}
      <ManualLogModal
        isOpen={manualModalOpen}
        initialMode={manualModalMode}
        subjects={state.subjects}
        defaultSubjectId={selectedSubjectId}
        onClose={() => setManualModalOpen(false)}
        onAddManualSession={handleAddManualSession}
        onAddSubject={handleAddSubject}
      />

      {/* Subtle Toast Feedback */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-40 px-4 py-3 rounded-2xl bg-[var(--vibe-card)] text-slate-900 dark:text-white text-sm font-semibold shadow-lg border-2 border-[var(--vibe-accent)]"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
