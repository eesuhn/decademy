import React from 'react';
import { Button } from '@/components/ui/button';
import { ButtonProps } from '@/components/ui/button';

interface GreenButtonProps extends ButtonProps {
  children: React.ReactNode;
  className?: string;
}

const GrayButtonHover: React.FC<GreenButtonProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <Button
      className={`h-12 px-8 bg-gray-900 text-white font-medium rounded-full text-lg
      transform transition-all duration-200 ease-out
      hover:bg-gray-800 hover:translate-y-[-4px] hover:shadow-lg hover:text-white
      active:translate-y-[2px] active:shadow-sm
      border-b-4 border-gray-70 hover:border-b-2 active:border-b-0
        ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
};

export { GrayButtonHover };
