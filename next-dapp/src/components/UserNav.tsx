'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { NounsAvatar } from './NounsAvatar';
import { useRouter } from 'next/navigation';

interface iAppProps {
  walletAddress: string;
  name: string;
}

export function UserNav({ walletAddress, name }: iAppProps) {
  const router = useRouter();

  const handleProfileClick = () => {
    router.push('/profile/learner');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <NounsAvatar walletAddress={walletAddress} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" forceMount>
        <DropdownMenuItem className="font-normal">
          <Button
            variant="ghost"
            className="w-full justify-start px-2 py-1.5 h-auto"
            onClick={handleProfileClick}
          >
            <div className="flex flex-col items-start">
              <p className="text-sm font-medium">{name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {walletAddress.length > 12
                  ? `${walletAddress.substring(0, 12)}...`
                  : walletAddress}
              </p>
            </div>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutLink>Log out</LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
