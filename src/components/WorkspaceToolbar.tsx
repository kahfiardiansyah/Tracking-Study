import React from 'react';
import {
  Bell,
  BellOff,
  CloudRain,
  Disc3,
  Moon,
  Music,
  Palette,
  Sun,
  Volume2,
  VolumeX,
  Watch,
} from 'lucide-react';
import { VIBE_THEMES } from '../data/studyStore';
import { AmbientSound, VibeTheme } from '../types/study';
import { LoFiEqualizer } from './CuteStickers';

interface WorkspaceToolbarProps {
  vibe: VibeTheme;
  ambientSound: AmbientSound;
  ambientVolume: number;
  darkMode: boolean;
  soundEffectsEnabled: boolean;
  onChangeVibe: (vibe: VibeTheme) => void;
  onChangeAmbient: (sound: AmbientSound) => void;
  onChangeVolume: (volume: number) => void;
  onToggleDarkMode: () => void;
  onToggleSoundEffects: () => void;
}

const SOUND_OPTIONS: { id: AmbientSound; label: string; icon: React.ReactNode }[] = [
  { id: 'none', label: 'Sunyi', icon: <VolumeX className="w-3.5 h-3.5" aria-hidden="true" /> },
  { id: 'lofi', label: 'Lo-Fi Chill', icon: <Disc3 className="w-3.5 h-3.5" aria-hidden="true" /> },
  { id: 'lofi_rain', label: 'Lo-Fi Hujan', icon: <Music className="w-3.5 h-3.5" aria-hidden="true" /> },
  { id: 'rain', label: 'Hujan', icon: <CloudRain className="w-3.5 h-3.5" aria-hidden="true" /> },
  { id: 'tick', label: 'Detik', icon: <Watch className="w-3.5 h-3.5" aria-hidden="true" /> },
];

const VIBES: VibeTheme[] = ['strawberry', 'matcha', 'taro', 'honey'];

export const WorkspaceToolbar: React.FC<WorkspaceToolbarProps> = ({
  vibe,
  ambientSound,
  ambientVolume,
  darkMode,
  soundEffectsEnabled,
  onChangeVibe,
  onChangeAmbient,
  onChangeVolume,
  onToggleDarkMode,
  onToggleSoundEffects,
}) => {
  const isLofiPlaying = ambientSound === 'lofi' || ambientSound === 'lofi_rain';

  return (
    <div className="kawaii-card rounded-2xl p-3.5 sm:px-5 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3.5">
      {/* Left: Vibe Theme Selector */}
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap shrink-0">
          <Palette className="w-3.5 h-3.5 text-[var(--vibe-accent)]" aria-hidden="true" />
          <span>Vibe Warna:</span>
        </span>

        <div
          role="group"
          aria-label="Pilih tema warna lucu"
          className="inline-flex flex-wrap items-center gap-1.5"
        >
          {VIBES.map((vKey) => {
            const theme = VIBE_THEMES[vKey];
            const active = vibe === vKey;
            return (
              <button
                key={vKey}
                type="button"
                onClick={() => onChangeVibe(vKey)}
                title={theme.subtitle}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap shrink-0 min-h-[34px] ${
                  active
                    ? 'bg-[var(--vibe-accent-soft)] border-[var(--vibe-accent)] text-[var(--vibe-accent-text)] scale-[1.02]'
                    : 'bg-[var(--vibe-card-alt)]/70 border-[var(--vibe-border)] text-slate-700 dark:text-slate-200 hover:opacity-90'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="w-3 h-3 rounded-full border border-white/80 shadow-xs shrink-0"
                  style={{ backgroundColor: theme.swatch }}
                />
                <span>{theme.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Lo-Fi Player + Chime + Day/Night */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div
          role="group"
          aria-label="Pemutar Lo-Fi dan suara latar"
          className="inline-flex flex-wrap items-center gap-1 p-1 bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)] rounded-xl"
        >
          {isLofiPlaying && (
            <span className="pl-2 pr-1 flex items-center">
              <LoFiEqualizer active={true} />
            </span>
          )}
          {SOUND_OPTIONS.map((opt) => {
            const active = ambientSound === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChangeAmbient(opt.id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[var(--vibe-card)] text-[var(--vibe-accent-text)] shadow-xs border border-[var(--vibe-border)]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {ambientSound !== 'none' && (
          <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[var(--vibe-card-alt)] border border-[var(--vibe-border)] text-xs">
            <Volume2 className="w-3.5 h-3.5 text-[var(--vibe-accent)]" aria-hidden="true" />
            <span className="sr-only">Volume suara</span>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={ambientVolume}
              onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
              className="w-16 sm:w-20 accent-[var(--vibe-accent)] cursor-pointer"
            />
          </label>
        )}

        <button
          type="button"
          onClick={onToggleSoundEffects}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-[var(--vibe-border)] bg-[var(--vibe-card-alt)] text-slate-700 dark:text-slate-200 hover:opacity-90 transition-colors whitespace-nowrap shrink-0 min-h-[36px]"
          title={soundEffectsEnabled ? 'Matikan bel selesai sesi' : 'Nyalakan bel selesai sesi'}
        >
          {soundEffectsEnabled ? (
            <Bell className="w-3.5 h-3.5 text-[var(--vibe-accent)]" aria-hidden="true" />
          ) : (
            <BellOff className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          )}
          <span>{soundEffectsEnabled ? 'Bel Aktif' : 'Bel Senyap'}</span>
        </button>

        <button
          type="button"
          onClick={onToggleDarkMode}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-[var(--vibe-border)] bg-[var(--vibe-card-alt)] text-slate-700 dark:text-slate-200 hover:opacity-90 transition-colors whitespace-nowrap shrink-0 min-h-[36px]"
        >
          {darkMode ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span>Mode Cerah</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-[var(--vibe-accent)]" aria-hidden="true" />
              <span>Mode Malam</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
