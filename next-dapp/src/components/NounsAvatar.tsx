import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useNounImage } from '@/hooks/useNounImage';
import { cn } from '@/lib/utils';

interface NounsAvatarProps {
  walletAddress: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-24 w-24',
};

export function NounsAvatar({
  walletAddress,
  className,
  size = 'md',
}: NounsAvatarProps) {
  const { nounImage } = useNounImage(walletAddress);

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage
        src={
          nounImage
            ? `data:image/svg+xml;utf8,${encodeURIComponent(nounImage)}`
            : undefined
        }
        alt="Noun Avatar"
      />
    </Avatar>
  );
}
