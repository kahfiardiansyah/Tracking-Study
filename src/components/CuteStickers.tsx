import React from 'react';
import { VibeTheme } from '../types/study';

export const WashiTape: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 110 26"
    className={`w-24 h-6 pointer-events-none select-none ${className}`}
  >
    <path
      d="M4 3 L106 2 L102 8 L108 14 L103 22 L6 23 L2 16 L7 10 Z"
      fill="var(--vibe-accent-soft)"
      stroke="var(--vibe-border)"
      strokeWidth="1.5"
    />
    <path
      d="M16 3 L24 23 M34 2 L42 23 M52 2 L60 23 M70 2 L78 23 M88 2 L96 23"
      stroke="var(--vibe-accent)"
      strokeOpacity="0.28"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export const VibeMascotSticker: React.FC<{ vibe: VibeTheme; className?: string }> = ({
  vibe,
  className = 'w-11 h-11',
}) => {
  if (vibe === 'strawberry') {
    return (
      <svg aria-hidden="true" viewBox="0 0 64 64" className={className}>
        {/* Leaf crown */}
        <path d="M20 18 Q32 8 44 18 Q36 22 32 18 Q28 22 20 18 Z" fill="#34D399" stroke="#065F46" strokeWidth="2.2" strokeLinejoin="round" />
        {/* Strawberry body */}
        <path
          d="M16 24 C16 16, 48 16, 48 24 C48 40, 38 54, 32 54 C26 54, 16 40, 16 24 Z"
          fill="#FB7185"
          stroke="#881337"
          strokeWidth="2.5"
        />
        {/* Cute face */}
        <circle cx="26" cy="31" r="2.2" fill="#881337" />
        <circle cx="38" cy="31" r="2.2" fill="#881337" />
        <ellipse cx="22" cy="34" rx="2.8" ry="1.6" fill="#FDA4AF" />
        <ellipse cx="42" cy="34" rx="2.8" ry="1.6" fill="#FDA4AF" />
        <path d="M29 35 Q32 38.5 35 35" fill="none" stroke="#881337" strokeWidth="2" strokeLinecap="round" />
        {/* Seeds */}
        <circle cx="24" cy="43" r="1.1" fill="#FFF1F2" />
        <circle cx="32" cy="46" r="1.1" fill="#FFF1F2" />
        <circle cx="40" cy="42" r="1.1" fill="#FFF1F2" />
      </svg>
    );
  }

  if (vibe === 'matcha') {
    return (
      <svg aria-hidden="true" viewBox="0 0 64 64" className={className}>
        {/* Steam */}
        <path d="M24 14 Q21 10 25 7" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M36 13 Q33 9 37 6" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" />
        {/* Mug handle */}
        <path d="M46 27 C54 27, 54 41, 46 41" fill="none" stroke="#065F46" strokeWidth="2.5" strokeLinecap="round" />
        {/* Cup body */}
        <rect x="14" y="20" width="33" height="30" rx="11" fill="#A7F3D0" stroke="#065F46" strokeWidth="2.5" />
        {/* Matcha top */}
        <ellipse cx="30.5" cy="22" rx="14" ry="4" fill="#10B981" stroke="#065F46" strokeWidth="2" />
        {/* Cute face */}
        <circle cx="25" cy="34" r="2.1" fill="#065F46" />
        <circle cx="36" cy="34" r="2.1" fill="#065F46" />
        <ellipse cx="21" cy="37" rx="2.5" ry="1.4" fill="#FB7185" fillOpacity="0.6" />
        <ellipse cx="40" cy="37" rx="2.5" ry="1.4" fill="#FB7185" fillOpacity="0.6" />
        <path d="M28 37 Q30.5 40 33 37" fill="none" stroke="#065F46" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (vibe === 'taro') {
    return (
      <svg aria-hidden="true" viewBox="0 0 64 64" className={className}>
        {/* Straw */}
        <path d="M33 20 L38 7 L43 8 L38 20" fill="#F472B6" stroke="#4C1D95" strokeWidth="2.2" strokeLinejoin="round" />
        {/* Cup */}
        <path d="M18 20 L46 20 L42 52 C42 54, 22 54, 22 52 Z" fill="#DDD6FE" stroke="#4C1D95" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Lid */}
        <rect x="15" y="16" width="34" height="6" rx="3" fill="#C4B5FD" stroke="#4C1D95" strokeWidth="2.2" />
        {/* Boba pearls */}
        <circle cx="27" cy="47" r="2.8" fill="#4C1D95" />
        <circle cx="33" cy="49" r="2.8" fill="#4C1D95" />
        <circle cx="38" cy="46" r="2.8" fill="#4C1D95" />
        {/* Cute face */}
        <circle cx="27" cy="32" r="2.1" fill="#4C1D95" />
        <circle cx="37" cy="32" r="2.1" fill="#4C1D95" />
        <ellipse cx="23.5" cy="35" rx="2.4" ry="1.4" fill="#F472B6" fillOpacity="0.7" />
        <ellipse cx="40.5" cy="35" rx="2.4" ry="1.4" fill="#F472B6" fillOpacity="0.7" />
        <path d="M29.5 35 Q32 38 34.5 35" fill="none" stroke="#4C1D95" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // Honey Lemon Sun Daisy
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className={className}>
      {/* Rays */}
      <g stroke="#F59E0B" strokeWidth="3" strokeLinecap="round">
        <line x1="32" y1="6" x2="32" y2="12" />
        <line x1="32" y1="52" x2="32" y2="58" />
        <line x1="6" y1="32" x2="12" y2="32" />
        <line x1="52" y1="32" x2="58" y2="32" />
        <line x1="14" y1="14" x2="18" y2="18" />
        <line x1="46" y1="46" x2="50" y2="50" />
        <line x1="50" y1="14" x2="46" y2="18" />
        <line x1="18" y1="46" x2="14" y2="50" />
      </g>
      <circle cx="32" cy="32" r="16" fill="#FDE047" stroke="#92400E" strokeWidth="2.5" />
      <circle cx="27" cy="30" r="2.1" fill="#92400E" />
      <circle cx="37" cy="30" r="2.1" fill="#92400E" />
      <ellipse cx="23" cy="33.5" rx="2.6" ry="1.5" fill="#FB923C" fillOpacity="0.65" />
      <ellipse cx="41" cy="33.5" rx="2.6" ry="1.5" fill="#FB923C" fillOpacity="0.65" />
      <path d="M29 34 Q32 37.5 35 34" fill="none" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export const SparkleDoodle: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
    <path
      d="M12 2 L14.4 9.6 L22 12 L14.4 14.4 L12 22 L9.6 14.4 L2 12 L9.6 9.6 Z"
      fill="var(--vibe-secondary)"
      fillOpacity="0.85"
    />
  </svg>
);

export const HeartDoodle: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
    <path
      d="M12 21s-7.5-4.7-9.6-9C.6 8.3 3 4.5 6.8 4.5c2 0 3.7 1.1 5.2 2.9 1.5-1.8 3.2-2.9 5.2-2.9 3.8 0 6.2 3.8 4.4 7.5-2.1 4.3-9.6 9-9.6 9z"
      fill="var(--vibe-accent)"
      fillOpacity="0.8"
    />
  </svg>
);

export const LoFiEqualizer: React.FC<{ active: boolean }> = ({ active }) => (
  <span aria-hidden="true" className="inline-flex items-end gap-0.5 h-3.5 w-4">
    <span
      className={`w-1 rounded-full bg-[var(--vibe-accent)] ${active ? 'h-full eq-bar-1' : 'h-1.5 opacity-40'}`}
    />
    <span
      className={`w-1 rounded-full bg-[var(--vibe-secondary)] ${active ? 'h-full eq-bar-2' : 'h-2.5 opacity-40'}`}
    />
    <span
      className={`w-1 rounded-full bg-[var(--vibe-accent)] ${active ? 'h-full eq-bar-3' : 'h-1 opacity-40'}`}
    />
  </span>
);
