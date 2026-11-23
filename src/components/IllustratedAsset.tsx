import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface IllustratedAssetProps {
  src: string;
  alt: string;
  titleFallback: string;
  className?: string;
}

export const IllustratedAsset: React.FC<IllustratedAssetProps> = ({
  src,
  alt,
  titleFallback,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-stone-100 to-amber-50 dark:from-slate-800 dark:via-slate-900 dark:to-emerald-950/40 text-slate-700 dark:text-slate-200 p-4 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <BookOpen className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-2" />
        <span className="text-xs font-medium">{titleFallback}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
