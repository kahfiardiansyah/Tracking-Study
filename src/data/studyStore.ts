import {
  BadgeProgress,
  LevelInfo,
  MotivationQuote,
  StudySession,
  StudyState,
  Subject,
  SubjectColor,
  TimerMode,
  VibeTheme,
} from '../types/study';

export const STORAGE_KEY = 'mochibelajar_state_v1';

export const VIBE_THEMES: Record<
  VibeTheme,
  {
    id: VibeTheme;
    name: string;
    subtitle: string;
    swatch: string;
    secondarySwatch: string;
  }
> = {
  strawberry: {
    id: 'strawberry',
    name: 'Stroberi Susu',
    subtitle: 'Pink lembut & manis',
    swatch: '#F43F5E',
    secondarySwatch: '#FBCFE8',
  },
  matcha: {
    id: 'matcha',
    name: 'Matcha Krim',
    subtitle: 'Hijau segar menenangkan',
    swatch: '#10B981',
    secondarySwatch: '#A7F3D0',
  },
  taro: {
    id: 'taro',
    name: 'Taro Boba',
    subtitle: 'Ungu pastel impian',
    swatch: '#8B5CF6',
    secondarySwatch: '#F472B6',
  },
  honey: {
    id: 'honey',
    name: 'Madu Lemon',
    subtitle: 'Kuning cerah penuh energi',
    swatch: '#F59E0B',
    secondarySwatch: '#FDE68A',
  },
};

export const DEFAULT_QUOTES: MotivationQuote[] = [
  {
    id: 'q-1',
    text: 'Langkah kecil hari ini adalah hadiah manis untuk dirimu di masa depan.',
    author: 'Catatan Mochi',
    pinned: false,
  },
  {
    id: 'q-2',
    text: 'Tidak perlu langsung sempurna, yang penting duduk manis dan mulai satu halaman dulu.',
    author: 'Pengingat Hangat',
    pinned: false,
  },
  {
    id: 'q-3',
    text: 'Setiap menit fokusmu diam-diam sedang merangkai versi dirimu yang lebih hebat.',
    author: 'Teman Belajar',
    pinned: false,
  },
  {
    id: 'q-4',
    text: 'Pelan tidak apa-apa, asalkan kamu tidak berhenti menyiram mimpimu.',
    author: 'Kebun Ilmu',
    pinned: false,
  },
  {
    id: 'q-5',
    text: 'Lelah itu wajar. Istirahat sebentar, minum teh hangat, lalu lanjutkan perlahan.',
    author: 'Catatan Mochi',
    pinned: false,
  },
];

export const SUBJECT_COLOR_MAP: Record<
  SubjectColor,
  {
    label: string;
    dot: string;
    bar: string;
    text: string;
    softBg: string;
    ring: string;
  }
> = {
  emerald: {
    label: 'Matcha',
    dot: 'bg-emerald-500 dark:bg-emerald-400',
    bar: 'bg-emerald-500 dark:bg-emerald-400',
    text: 'text-emerald-700 dark:text-emerald-300',
    softBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    ring: 'stroke-emerald-500 dark:stroke-emerald-400',
  },
  indigo: {
    label: 'Taro',
    dot: 'bg-violet-500 dark:bg-violet-400',
    bar: 'bg-violet-500 dark:bg-violet-400',
    text: 'text-violet-700 dark:text-violet-300',
    softBg: 'bg-violet-50 dark:bg-violet-950/40',
    ring: 'stroke-violet-500 dark:stroke-violet-400',
  },
  amber: {
    label: 'Madu',
    dot: 'bg-amber-500 dark:bg-amber-400',
    bar: 'bg-amber-500 dark:bg-amber-400',
    text: 'text-amber-700 dark:text-amber-300',
    softBg: 'bg-amber-50 dark:bg-amber-950/40',
    ring: 'stroke-amber-500 dark:stroke-amber-400',
  },
  rose: {
    label: 'Stroberi',
    dot: 'bg-rose-500 dark:bg-rose-400',
    bar: 'bg-rose-500 dark:bg-rose-400',
    text: 'text-rose-700 dark:text-rose-300',
    softBg: 'bg-rose-50 dark:bg-rose-950/40',
    ring: 'stroke-rose-500 dark:stroke-rose-400',
  },
  sky: {
    label: 'Langit',
    dot: 'bg-sky-500 dark:bg-sky-400',
    bar: 'bg-sky-500 dark:bg-sky-400',
    text: 'text-sky-700 dark:text-sky-300',
    softBg: 'bg-sky-50 dark:bg-sky-950/40',
    ring: 'stroke-sky-500 dark:stroke-sky-400',
  },
  teal: {
    label: 'Mint',
    dot: 'bg-teal-500 dark:bg-teal-400',
    bar: 'bg-teal-500 dark:bg-teal-400',
    text: 'text-teal-700 dark:text-teal-300',
    softBg: 'bg-teal-50 dark:bg-teal-950/40',
    ring: 'stroke-teal-500 dark:stroke-teal-400',
  },
};

export function toLocalDateKey(dateInput: Date | string): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDaysAgoIso(daysAgo: number, hour = 9, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export function createSeedState(): StudyState {
  const subjects: Subject[] = [
    { id: 'sub-math', name: 'Matematika & Logika', color: 'indigo', weeklyTargetMinutes: 240 },
    { id: 'sub-code', name: 'Pemrograman Web', color: 'emerald', weeklyTargetMinutes: 300 },
    { id: 'sub-eng', name: 'Bahasa Inggris', color: 'sky', weeklyTargetMinutes: 180 },
    { id: 'sub-design', name: 'Desain & Catatan Lucu', color: 'rose', weeklyTargetMinutes: 150 },
  ];

  const sessions: StudySession[] = [
    {
      id: 'ses-1',
      subjectId: 'sub-code',
      taskTitle: 'Latihan TypeScript & React Hooks',
      mode: 'pomodoro',
      durationMinutes: 25,
      xpEarned: 60,
      mood: 'great',
      note: 'Berhasil merapikan custom hook untuk manajemen state timer tanpa re-render berlebih.',
      startedAt: getDaysAgoIso(0, 8, 15),
      endedAt: getDaysAgoIso(0, 8, 40),
    },
    {
      id: 'ses-2',
      subjectId: 'sub-math',
      taskTitle: 'Ringkasan Integral & Probabilitas',
      mode: 'pomodoro',
      durationMinutes: 25,
      xpEarned: 60,
      mood: 'good',
      note: 'Menyelesaikan 8 soal latihan probabilitas bersyarat.',
      startedAt: getDaysAgoIso(0, 10, 5),
      endedAt: getDaysAgoIso(0, 10, 30),
    },
    {
      id: 'ses-3',
      subjectId: 'sub-eng',
      taskTitle: 'Membaca artikel teknologi & kosakata',
      mode: 'pomodoro',
      durationMinutes: 25,
      xpEarned: 55,
      mood: 'great',
      note: 'Mencatat 14 frasa baru dan langsung membuat contoh kalimat.',
      startedAt: getDaysAgoIso(1, 19, 30),
      endedAt: getDaysAgoIso(1, 19, 55),
    },
    {
      id: 'ses-4',
      subjectId: 'sub-code',
      taskTitle: 'Membangun komponen tabel data',
      mode: 'deep',
      durationMinutes: 50,
      xpEarned: 120,
      mood: 'great',
      note: 'Fokus penuh 50 menit ditemani musik lo-fi tanpa distraksi ponsel.',
      startedAt: getDaysAgoIso(1, 9, 0),
      endedAt: getDaysAgoIso(1, 9, 50),
    },
    {
      id: 'ses-5',
      subjectId: 'sub-design',
      taskTitle: 'Sketsa tata letak buku catatan',
      mode: 'custom',
      durationMinutes: 35,
      xpEarned: 80,
      mood: 'good',
      note: 'Eksperimen warna pastel agar catatan lebih menyenangkan dibaca.',
      startedAt: getDaysAgoIso(2, 16, 10),
      endedAt: getDaysAgoIso(2, 16, 45),
    },
    {
      id: 'ses-6',
      subjectId: 'sub-math',
      taskTitle: 'Review materi aljabar linear',
      mode: 'deep',
      durationMinutes: 50,
      xpEarned: 115,
      mood: 'tired',
      note: 'Materi matriks eigen cukup padat, perlu ulangi besok pagi.',
      startedAt: getDaysAgoIso(3, 20, 0),
      endedAt: getDaysAgoIso(3, 20, 50),
    },
    {
      id: 'ses-7',
      subjectId: 'sub-eng',
      taskTitle: 'Latihan mendengarkan podcast edukasi',
      mode: 'pomodoro',
      durationMinutes: 25,
      xpEarned: 55,
      mood: 'good',
      note: 'Kecepatan 1.1x terasa pas untuk melatih pemahaman.',
      startedAt: getDaysAgoIso(4, 7, 45),
      endedAt: getDaysAgoIso(4, 8, 10),
    },
    {
      id: 'ses-8',
      subjectId: 'sub-code',
      taskTitle: 'Membaca dokumentasi Web Audio API',
      mode: 'deep',
      durationMinutes: 45,
      xpEarned: 105,
      mood: 'great',
      note: 'Memahami cara kerja GainNode dan sintesis lo-fi.',
      startedAt: getDaysAgoIso(5, 14, 0),
      endedAt: getDaysAgoIso(5, 14, 45),
    },
    {
      id: 'ses-9',
      subjectId: 'sub-math',
      taskTitle: 'Latihan soal cepat 30 menit',
      mode: 'custom',
      durationMinutes: 30,
      xpEarned: 70,
      mood: 'good',
      note: 'Akurasi meningkat dibanding minggu lalu.',
      startedAt: getDaysAgoIso(8, 10, 0),
      endedAt: getDaysAgoIso(8, 10, 30),
    },
  ];

  const tasks = [
    {
      id: 'task-1',
      subjectId: 'sub-code',
      title: 'Selesaikan modul State Management & Reducer',
      completed: false,
      estimatedPomodoros: 2,
      createdAt: getDaysAgoIso(0, 7, 30),
    },
    {
      id: 'task-2',
      subjectId: 'sub-math',
      title: 'Kerjakan 10 soal latihan Distribusi Normal',
      completed: false,
      estimatedPomodoros: 1,
      createdAt: getDaysAgoIso(0, 7, 35),
    },
    {
      id: 'task-3',
      subjectId: 'sub-eng',
      title: 'Tulis ringkasan 150 kata dalam Bahasa Inggris',
      completed: true,
      estimatedPomodoros: 1,
      createdAt: getDaysAgoIso(0, 7, 40),
    },
  ];

  return {
    subjects,
    tasks,
    sessions,
    quotes: DEFAULT_QUOTES,
    activeQuoteId: DEFAULT_QUOTES[0].id,
    settings: {
      dailyGoalMinutes: 90,
      pomodoroMinutes: 25,
      deepWorkMinutes: 50,
      breakMinutes: 5,
      customMinutes: 35,
      ambientSound: 'none',
      ambientVolume: 0.55,
      darkMode: false,
      soundEffectsEnabled: true,
      vibe: 'strawberry',
    },
    bonusXp: 30,
  };
}

export function createEmptyState(): StudyState {
  return {
    subjects: [
      { id: 'sub-general', name: 'Belajar Umum', color: 'rose', weeklyTargetMinutes: 180 },
    ],
    tasks: [],
    sessions: [],
    quotes: DEFAULT_QUOTES,
    activeQuoteId: DEFAULT_QUOTES[0].id,
    settings: {
      dailyGoalMinutes: 90,
      pomodoroMinutes: 25,
      deepWorkMinutes: 50,
      breakMinutes: 5,
      customMinutes: 35,
      ambientSound: 'none',
      ambientVolume: 0.55,
      darkMode: false,
      soundEffectsEnabled: true,
      vibe: 'strawberry',
    },
    bonusXp: 0,
  };
}

export function loadStudyState(): StudyState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = createSeedState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw) as Partial<StudyState>;
    if (!Array.isArray(parsed.subjects) || !Array.isArray(parsed.sessions)) {
      return createSeedState();
    }
    const defaults = createSeedState();
    const rawSound = (parsed.settings as { ambientSound?: string } | undefined)?.ambientSound;
    const migratedSound = rawSound === 'cafe' ? 'lofi' : parsed.settings?.ambientSound || 'none';

    return {
      subjects: parsed.subjects,
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      sessions: parsed.sessions,
      quotes:
        Array.isArray(parsed.quotes) && parsed.quotes.length > 0
          ? parsed.quotes
          : defaults.quotes,
      activeQuoteId: parsed.activeQuoteId || defaults.activeQuoteId,
      settings: {
        ...defaults.settings,
        ...parsed.settings,
        ambientSound: migratedSound,
        vibe: parsed.settings?.vibe || 'strawberry',
      },
      bonusXp: typeof parsed.bonusXp === 'number' ? parsed.bonusXp : 0,
    };
  } catch {
    return createSeedState();
  }
}

export function saveStudyState(state: StudyState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors
  }
}

export function formatMinutesHuman(totalMinutes: number): string {
  if (totalMinutes <= 0) return '0m';
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}j`;
  return `${hours}j ${mins}m`;
}

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hrs = Math.floor(safe / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  if (hrs > 0) {
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function calculateSessionXp(minutes: number, mood: 'great' | 'good' | 'tired', mode: TimerMode): number {
  const base = Math.max(5, minutes * 2);
  const moodBonus = mood === 'great' ? 12 : mood === 'good' ? 6 : 2;
  const deepBonus = mode === 'deep' && minutes >= 45 ? 15 : 0;
  return base + moodBonus + deepBonus;
}

const LEVEL_TITLES = [
  'Pengamat Penasaran',
  'Pemula Rajin',
  'Pencatat Tekun',
  'Penjelajah Ilmu',
  'Kutu Buku Hangat',
  'Perangkai Fokus',
  'Cendekia Muda',
  'Arsitek Pengetahuan',
  'Penjaga Konsistensi',
  'Master Fokus',
];

export function computeLevelInfo(sessions: StudySession[], bonusXp: number): LevelInfo {
  const sessionXp = sessions.reduce((acc, s) => acc + s.xpEarned, 0);
  const totalXp = sessionXp + bonusXp;
  const xpPerLevel = 200;
  const level = Math.floor(totalXp / xpPerLevel) + 1;
  const currentLevelXp = totalXp % xpPerLevel;
  const progressPercent = Math.min(100, Math.round((currentLevelXp / xpPerLevel) * 100));
  const titleIndex = Math.min(LEVEL_TITLES.length - 1, level - 1);

  return {
    level,
    title: LEVEL_TITLES[titleIndex],
    totalXp,
    currentLevelXp,
    nextLevelXp: xpPerLevel,
    progressPercent,
  };
}

export function computeStreakDays(sessions: StudySession[]): { current: number; longest: number } {
  const focusDays = new Set<string>();
  sessions.forEach((s) => {
    if (s.mode !== 'break' && s.durationMinutes > 0) {
      focusDays.add(toLocalDateKey(s.startedAt));
    }
  });

  if (focusDays.size === 0) return { current: 0, longest: 0 };

  const todayKey = toLocalDateKey(new Date());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = toLocalDateKey(yesterday);

  let current = 0;
  if (focusDays.has(todayKey) || focusDays.has(yesterdayKey)) {
    const cursor = new Date();
    if (!focusDays.has(todayKey)) {
      cursor.setDate(cursor.getDate() - 1);
    }
    while (focusDays.has(toLocalDateKey(cursor))) {
      current++;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  const sortedDays = Array.from(focusDays).sort();
  let longest = 0;
  let run = 0;
  let prevDate: Date | null = null;

  for (const key of sortedDays) {
    const [y, m, d] = key.split('-').map(Number);
    const currDate = new Date(y, m - 1, d);
    if (prevDate) {
      const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        run++;
      } else {
        run = 1;
      }
    } else {
      run = 1;
    }
    if (run > longest) longest = run;
    prevDate = currDate;
  }

  return { current, longest };
}

export function getStartOfWeek(date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function computeBadges(state: StudyState): BadgeProgress[] {
  const focusSessions = state.sessions.filter((s) => s.mode !== 'break');
  const totalMinutes = focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const maxSingleSession = focusSessions.reduce((max, s) => Math.max(max, s.durationMinutes), 0);
  const streak = computeStreakDays(focusSessions);
  const uniqueSubjectsUsed = new Set(focusSessions.map((s) => s.subjectId)).size;
  const morningSessions = focusSessions.filter((s) => new Date(s.startedAt).getHours() < 9).length;
  const completedTasks = state.tasks.filter((t) => t.completed).length;

  return [
    {
      id: 'badge-first',
      title: 'Langkah Pertama',
      description: 'Menyelesaikan minimal 1 sesi belajar terfokus.',
      unlocked: focusSessions.length >= 1,
      currentValue: Math.min(1, focusSessions.length),
      targetValue: 1,
      unit: 'sesi',
    },
    {
      id: 'badge-deep',
      title: 'Penyelam Fokus',
      description: 'Menyelesaikan 1 sesi berdurasi minimal 45 menit tanpa henti.',
      unlocked: maxSingleSession >= 45,
      currentValue: Math.min(45, maxSingleSession),
      targetValue: 45,
      unit: 'menit',
    },
    {
      id: 'badge-streak',
      title: 'Api Konsistensi',
      description: 'Menjaga streak belajar selama 5 hari berturut-turut.',
      unlocked: streak.longest >= 5,
      currentValue: Math.min(5, streak.longest),
      targetValue: 5,
      unit: 'hari',
    },
    {
      id: 'badge-hours',
      title: 'Kutu Buku Sejati',
      description: 'Mengumpulkan total 5 jam (300 menit) waktu belajar.',
      unlocked: totalMinutes >= 300,
      currentValue: Math.min(300, totalMinutes),
      targetValue: 300,
      unit: 'menit',
    },
    {
      id: 'badge-morning',
      title: 'Embun Pagi',
      description: 'Menyelesaikan 3 sesi belajar sebelum pukul 09.00 pagi.',
      unlocked: morningSessions >= 3,
      currentValue: Math.min(3, morningSessions),
      targetValue: 3,
      unit: 'sesi',
    },
    {
      id: 'badge-explorer',
      title: 'Penjelajah Multi-Topik',
      description: 'Belajar di minimal 3 mata pelajaran berbeda & selesaikan 3 tugas.',
      unlocked: uniqueSubjectsUsed >= 3 && completedTasks >= 3,
      currentValue: Math.min(3, uniqueSubjectsUsed),
      targetValue: 3,
      unit: 'mapel',
    },
  ];
}

export const MODE_LABELS: Record<TimerMode, string> = {
  pomodoro: 'Pomodoro',
  deep: 'Deep Work',
  break: 'Istirahat',
  stopwatch: 'Stopwatch',
  custom: 'Kustom',
};

export function getBuddyMessage(params: {
  isRunning: boolean;
  mode: TimerMode;
  progressRatio: number;
  todayMinutes: number;
  dailyGoalMinutes: number;
}): { headline: string; body: string } {
  const { isRunning, mode, progressRatio, todayMinutes, dailyGoalMinutes } = params;

  if (mode === 'break') {
    return isRunning
      ? {
          headline: 'Saatnya meregangkan bahu',
          body: 'Minum air putih, lihat benda jauh selama 20 detik, lalu biarkan otakmu mencerna materi tadi.',
        }
      : {
          headline: 'Istirahat sejenak itu bagian dari belajar',
          body: 'Tekan Mulai untuk jeda tenang agar sesi berikutnya kembali segar.',
        };
  }

  if (isRunning) {
    if (progressRatio >= 0.75) {
      return {
        headline: 'Sedikit lagi sampai garis akhir!',
        body: 'Pertahankan ritme tenangmu. Kamu hampir menuntaskan sesi ini dengan gemilang.',
      };
    }
    if (progressRatio >= 0.35) {
      return {
        headline: 'Ritme fokusmu mulai stabil',
        body: 'Biarkan notifikasi menunggu di luar. Satu halaman dan satu konsep pada satu waktu.',
      };
    }
    return {
      headline: 'Mochi sedang menemanimu belajar',
      body: 'Tarik napas pelan, fokus pada tugas yang kamu pilih, dan nikmati prosesnya.',
    };
  }

  if (todayMinutes >= dailyGoalMinutes && dailyGoalMinutes > 0) {
    return {
      headline: 'Target harianmu sudah tercapai!',
      body: 'Luar biasa! Sesi tambahan hari ini akan menjadi tabungan XP dan penguat pemahamanmu.',
    };
  }

  return {
    headline: 'Siap membuka bab baru hari ini?',
    body: 'Pilih mata pelajaran, nyalakan Lo-Fi kalau suka, lalu tekan Mulai saat kamu siap!',
  };
}
