'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IDKitWidget, VerificationLevel } from '@worldcoin/idkit';
import type { ISuccessResult } from '@worldcoin/idkit';
import useWorldId from '@/hooks/useWorldId';
import { app_id, action } from '@/config/worldId';

export default function WorldIdButton() {
  const { handleProof, openWorldId, loading, error } = useWorldId();
  const [verified, setVerified] = useState(false);

  const onSuccess = async (result: ISuccessResult) => {
    console.log(
      'Successfully verified with World ID! Your nullifier hash is: ' +
        result.nullifier_hash
    );
    setVerified(true);
  };

  return (
    <div className="relative">
      <IDKitWidget
        action={action}
        app_id={app_id}
        onSuccess={onSuccess}
        handleVerify={handleProof}
        verification_level={VerificationLevel.Orb}
      >
        {({ open }) => (
          <Button
            onClick={open}
            disabled={loading || verified}
            variant={verified ? 'outline' : 'default'}
            className="text-black inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-base font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50"
          >
            {verified ? 'Verified' : 'World ID'}
          </Button>
        )}
      </IDKitWidget>
      {loading && (
        <div className="absolute top-full left-0 mt-2 text-sm text-muted-foreground">
          Verifying...
        </div>
      )}
      {error && (
        <div className="absolute top-full left-0 mt-2 text-sm text-destructive">
          Error: {error}
        </div>
      )}
    </div>
  );
}
