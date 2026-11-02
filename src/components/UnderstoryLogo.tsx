import React from 'react';

export interface UnderstoryLogoProps {
  variant?: 'full' | 'mark' | 'app-icon';
  theme?: 'dark' | 'light';
  size?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
}

/**
 * Understory Brand Logo & Mark Component
 * Uses the authentic brand identity (3-layered leaf/book pages & elegant serif wordmark).
 */
export const UnderstoryLogo: React.FC<UnderstoryLogoProps> = ({
  variant = 'full',
  theme = 'dark',
  size,
  height = 34,
  className = '',
  style = {}
}) => {
  const actualHeight = size || height;

  if (variant === 'app-icon') {
    const iconSize = actualHeight;
    return (
      <img
        src="/brand/understory-app-icon.png"
        alt="Understory"
        width={iconSize}
        height={iconSize}
        className={`understory-brand-app-icon ${className}`}
        style={{
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          borderRadius: '8px',
          objectFit: 'contain',
          display: 'inline-block',
          flexShrink: 0,
          ...style
        }}
      />
    );
  }

  if (variant === 'mark') {
    // Aspect ratio of the mark is approx 119/113 = 1.05
    const markWidth = Math.round(actualHeight * 1.05);
    return (
      <img
        src="/brand/understory-mark.png"
        alt="Understory Mark"
        width={markWidth}
        height={actualHeight}
        className={`understory-brand-mark ${className}`}
        style={{
          width: `${markWidth}px`,
          height: `${actualHeight}px`,
          objectFit: 'contain',
          display: 'inline-block',
          flexShrink: 0,
          ...style
        }}
      />
    );
  }

  // variant === 'full' (Mark + "UNDERSTORY" serif wordmark)
  // Aspect ratio is 613 / 113 ≈ 5.42
  const fullWidth = Math.round(actualHeight * 5.42);
  const src = theme === 'light' ? '/brand/understory-logo-white.png' : '/brand/understory-logo.png';

  return (
    <div
      className={`understory-brand-lockup ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        lineHeight: 1,
        ...style
      }}
    >
      <img
        src={src}
        alt="Understory"
        width={fullWidth}
        height={actualHeight}
        className="understory-brand-logo-img"
        style={{
          width: 'auto',
          height: `${actualHeight}px`,
          maxWidth: '100%',
          objectFit: 'contain',
          display: 'block'
        }}
      />
    </div>
  );
};

// Backward-compatible aliases for seamless transition
export const EBaroLogoMark: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <UnderstoryLogo variant="app-icon" size={size} />
);

export const FolioLogoMark = EBaroLogoMark;
