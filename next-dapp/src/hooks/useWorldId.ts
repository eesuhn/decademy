import { useState } from 'react';
import { useIDKit } from '@worldcoin/idkit';
import type { ISuccessResult } from '@worldcoin/idkit';
import { verify } from './actions/verify';
import { useVerifyUser } from '@/hooks/useVerifyUser';

const useWorldId = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setOpen } = useIDKit();
  const { verifyUser } = useVerifyUser();

  const handleProof = async (result: ISuccessResult) => {
    setLoading(true);
    try {
      // Log the proof received from IDKit
      console.log(`Proof received from IDKit: ${JSON.stringify(result)}`);

      const data = await verify(result);
      if (data.success) {
        // Log the response from World backend
        console.log(
          `Successful response from backend: ${JSON.stringify(data)}`
        );
        verifyUser();
      } else {
        // Use when error persists
        // setError(`Verification failed: ${JSON.stringify(data)}`);

        // User already verified
        if (data.code === 'max_verifications_reached') {
          console.log('Max verifications reached');
        }

        // Invalid proof / Unverified user
        if (data.code === 'invalid_merkle_root') {
          console.log('Unverified user');
        }
      }
    } catch (err) {
      setError('An error occurred while verifying the proof.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initialize the World ID widget
   */
  const openWorldId = () => {
    setOpen(true);
  };

  return {
    loading,
    error,
    handleProof,
    openWorldId,
  };
};

export default useWorldId;
