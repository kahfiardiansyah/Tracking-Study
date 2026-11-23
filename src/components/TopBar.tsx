import React from 'react';
import { Plus } from 'lucide-react';
import { AppTab } from '../types/study';

interface TopBarProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onOpenManualLog: () => void;
}

const NAV_ITEMS: { id: AppTab; label: string }[] = [
  { id: 'focus', label: 'Fokus' },
  { id: 'targets', label: 'Target' },
  { id: 'history', label: 'Riwayat' },
  { id: 'stats', label: 'Statistik' },
];

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onSelectTab,
  onOpenManualLog,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[var(--vibe-card)]/90 backdrop-blur-md border-b border-[var(--vibe-border)]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('focus')}
          className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--vibe-accent-text)] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vibe-accent)] rounded-lg px-1"
        >
          MochiBelajar
        </button>

        {/* Zone 2: Clean single-line text nav links */}
        <nav
          aria-label="Navigasi utama"
          className="hidden md:flex items-center gap-7"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`relative py-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vibe-accent)] rounded-sm ${
                  isActive
                    ? 'text-[var(--vibe-accent-text)]'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[2px] h-1 bg-[var(--vibe-accent)] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action CTA */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenManualLog}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl kawaii-btn-primary whitespace-nowrap shrink-0 min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vibe-accent)] focus-visible:ring-offset-2"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Catat Sesi</span>
          </button>
        </div>
      </div>

      {/* Mobile compact single-line nav bar */}
      <nav
        aria-label="Navigasi seluler"
        className="flex md:hidden items-center justify-around border-t border-[var(--vibe-border)] px-2"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`py-2.5 px-3 text-xs font-semibold whitespace-nowrap shrink-0 border-b-2 transition-colors ${
                isActive
                  ? 'border-[var(--vibe-accent)] text-[var(--vibe-accent-text)]'
                  : 'border-transparent text-slate-500 dark:text-slate-400'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
