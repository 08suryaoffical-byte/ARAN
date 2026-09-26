import React from 'react';

interface AranLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
  variant?: 'emblem' | 'full' | 'compact';
}

export const AranLogo: React.FC<AranLogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = true,
  className = '',
  variant = 'compact',
}) => {
  // Dimensions for emblem
  const sizeMap = {
    xs: { emblem: 'w-6 h-6', text: 'text-sm', sub: 'text-[9px]' },
    sm: { emblem: 'w-9 h-9', text: 'text-base', sub: 'text-[10px]' },
    md: { emblem: 'w-11 h-11', text: 'text-xl', sub: 'text-[11px]' },
    lg: { emblem: 'w-14 h-14', text: 'text-2xl', sub: 'text-xs' },
    xl: { emblem: 'w-20 h-20', text: 'text-3xl', sub: 'text-sm' },
    hero: { emblem: 'w-28 h-28', text: 'text-4xl', sub: 'text-base' },
  };

  const { emblem: emblemClass, text: textClass, sub: subClass } = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official App Logo Image */}
      <div
        className={`${emblemClass} relative rounded-2xl bg-[#0B1117] p-1 flex items-center justify-center shadow-lg shadow-black/50 border border-[#263541] overflow-hidden shrink-0 group transition-transform hover:scale-105`}
        title="ARAN - Every Heartbeat Deserves Safety."
      >
        <img
          src="/ARAN.png"
          alt="ARAN App Logo"
          className="w-full h-full object-contain rounded-xl"
          onError={(e) => {
            // Fallback to logo.png or svg if ARAN.png has any issue
            (e.currentTarget as HTMLImageElement).src = '/logo.png';
          }}
        />
      </div>

      {/* Brand Name & Tagline */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className={`${textClass} font-black tracking-tight text-[#F5F7FA] leading-none`}>
              ARAN
            </span>
            <span className="hidden sm:inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#D97706] bg-[#713F12]/30 border border-[#A16207]/40 px-2 py-0.5 rounded-full">
              Care
            </span>
          </div>

          {showTagline && (
            <p className={`${subClass} text-[#A8B3BE] font-bold tracking-tight mt-0.5 leading-tight`}>
              Every Heartbeat Deserves Safety.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
