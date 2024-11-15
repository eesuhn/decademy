'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      'relative h-4 w-full overflow-hidden rounded-full bg-gray-100',
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn('h-full w-full flex-1 transition-all relative')}
      style={{
        transform: `translateX(-${100 - (value || 0)}%)`,
        backgroundColor: '#b8d1d2', // Darker version of #d6e6e7
        backgroundImage: `linear-gradient(45deg, 
          #d6e6e7 25%, 
          transparent 25%, 
          transparent 50%, 
          #d6e6e7 50%, 
          #d6e6e7 75%, 
          transparent 75%, 
          transparent)`,
        backgroundSize: '1rem 1rem',
        animation: 'progress-stripes 1s linear infinite',
      }}
    />
    <style>
      {`
        @keyframes progress-stripes {
          from { background-position: 1rem 0; }
          to { background-position: 0 0; }
        }
      `}
    </style>
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
