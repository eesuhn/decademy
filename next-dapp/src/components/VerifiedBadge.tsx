import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface VerifiedBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function VerifiedBadge({ className, size = 'sm' }: VerifiedBadgeProps) {
  const sizes = {
    sm: 20,
    md: 24,
    lg: 28,
  };

  const imageSize = sizes[size];

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm',
        size === 'sm' ? 'p-1' : size === 'md' ? 'p-1.5' : 'p-2',
        className
      )}
    >
      <div
        className="relative"
        style={{
          width: imageSize,
          height: imageSize,
        }}
      >
        <Image
          src="/wc-icon-1.svg"
          alt="Verified Badge"
          fill
          className="object-contain"
          sizes={`${imageSize}px`}
        />
      </div>
    </div>
  );
}
