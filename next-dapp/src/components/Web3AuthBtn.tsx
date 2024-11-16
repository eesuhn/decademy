'use client';

import { useWeb3Auth } from '@/hooks/useWeb3Auth';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function Web3AuthButton() {
  const { login, loggedIn, loading } = useWeb3Auth();

  if (loading) {
    return (
      <Button disabled variant="outline" size="sm">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading
      </Button>
    );
  }

  if (loggedIn) {
    return null;
  }

  return (
    <Button
      onClick={login}
      size="sm"
      className="font-bold bg-blue-800 hover:bg-blue-700 text-white"
    >
      Login
    </Button>
  );
}
