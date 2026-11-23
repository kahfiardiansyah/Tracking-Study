export type AppTab = 'focus' | 'targets' | 'history' | 'stats';

export type TimerMode = 'pomodoro' | 'deep' | 'break' | 'stopwatch' | 'custom';

export type FocusMood = 'great' | 'good' | 'tired';

export type AmbientSound = 'none' | 'lofi' | 'lofi_rain' | 'rain' | 'tick';

export type VibeTheme = 'strawberry' | 'matcha' | 'taro' | 'honey';

export type SubjectColor =
  | 'emerald'
  | 'indigo'
  | 'amber'
  | 'rose'
  | 'sky'
  | 'teal';

export interface Subject {
  id: string;
  name: string;
  color: SubjectColor;
  weeklyTargetMinutes: number;
}

export interface StudyTask {
  id: string;
  subjectId: string;
  title: string;
  completed: boolean;
  estimatedPomodoros: number;
  createdAt: string;
}

export interface StudySession {
  id: string;
  subjectId: string;
  taskTitle: string;
  mode: TimerMode;
  durationMinutes: number;
  xpEarned: number;
  mood: FocusMood;
  note: string;
  startedAt: string; // ISO string
  endedAt: string;   // ISO string
}

export interface MotivationQuote {
  id: string;
  text: string;
  author: string;
  pinned?: boolean;
}

export interface UserSettings {
  dailyGoalMinutes: number;
  pomodoroMinutes: number;
  deepWorkMinutes: number;
  breakMinutes: number;
  customMinutes: number;
  ambientSound: AmbientSound;
  ambientVolume: number; // 0 to 1
  darkMode: boolean;
  soundEffectsEnabled: boolean;
  vibe: VibeTheme;
}

export interface StudyState {
  subjects: Subject[];
  tasks: StudyTask[];
  sessions: StudySession[];
  quotes: MotivationQuote[];
  activeQuoteId: string;
  settings: UserSettings;
  bonusXp: number;
}

export interface BadgeProgress {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  currentValue: number;
  targetValue: number;
  unit: string;
}

export interface LevelInfo {
  level: number;
  title: string;
  totalXp: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
}
