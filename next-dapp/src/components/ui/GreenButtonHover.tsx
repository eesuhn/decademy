import React from 'react';
import { Button } from '@/components/ui/button';
import { ButtonProps } from '@/components/ui/button';

interface GreenButtonProps extends ButtonProps {
  children: React.ReactNode;
  className?: string;
}

const GreenButtonHover: React.FC<GreenButtonProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <Button
      className={`h-12 px-8 bg-[#80fd82] text-[#1a2b3c] font-semibold rounded-full text-lg
        transform transition-all duration-200 ease-out
        hover:bg-[#80fd82] hover:translate-y-[-4px] hover:shadow-lg
        active:translate-y-[2px] active:shadow-sm
        border-b-4 border-[#5ad15c] hover:border-b-2 active:border-b-0
        ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
};

export { GreenButtonHover };
