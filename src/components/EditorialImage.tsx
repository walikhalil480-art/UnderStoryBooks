import React, { useState } from 'react';
import { ImageSubjectType, SUBJECT_FALLBACK_IMAGES } from '../data/imageRegistry';

interface EditorialImageProps {
  src: string;
  alt: string;
  caption?: string;
  priority?: boolean;
  className?: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square' | 'editorial';
  subjectType?: ImageSubjectType;
}

export const EditorialImage: React.FC<EditorialImageProps> = ({
  src,
  alt,
  caption,
  priority = false,
  className = '',
  aspectRatio = 'landscape',
  subjectType = 'person-reading'
}) => {
  const [stage, setStage] = useState<'primary' | 'subject-fallback' | 'neutral-plate'>('primary');

  const fallbackUrl = SUBJECT_FALLBACK_IMAGES[subjectType];
  const currentSrc =
    stage === 'primary'
      ? src
      : stage === 'subject-fallback' && fallbackUrl && fallbackUrl !== src
      ? fallbackUrl
      : '';

  const handleError = () => {
    if (stage === 'primary' && fallbackUrl && fallbackUrl !== src) {
      setStage('subject-fallback');
    } else {
      setStage('neutral-plate');
    }
  };

  return (
    <div className={`editorial-image-wrapper ratio-${aspectRatio} ${className}`}>
      {stage !== 'neutral-plate' && currentSrc ? (
        <img
          src={currentSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={handleError}
          className="editorial-image"
        />
      ) : (
        <div className="editorial-image-fallback" role="img" aria-label={alt}>
          <div className="editorial-image-fallback-content">
            <span className="editorial-fallback-tag">ARCHIVAL PLATE</span>
            <p className="editorial-fallback-text">{alt}</p>
            {caption && <span className="editorial-fallback-caption">{caption}</span>}
          </div>
        </div>
      )}
    </div>
  );
};
