import { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3Auth } from './useWeb3Auth';
import config from '@/config/sc';

type EmitAttestTopicHookReturn = {
  emitAttestTopic: (topicId: number) => Promise<void>;
  loading: boolean;
  error: string | null;
};

export const useEmitAttestTopic = (): EmitAttestTopicHookReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getSigner } = useWeb3Auth();

  const emitAttestTopic = async (topicId: number) => {
    setLoading(true);
    setError(null);

    try {
      const signer = await getSigner();
      const userAddress = await signer.getAddress();

      // Create Web3Provider instance
      const web3Provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
        {
          name: 'Scroll Sepolia',
          chainId: 534351,
        }
      );

      // Initialize the contract instance for the topic (this assumes you have the ABI and address configured)
      const contract = new ethers.Contract(
        config.CONTRACT_ADDRESS,
        config.CONTRACT_ABI,
        signer
      );

      // Call the emitAttestTopic function
      const tx = await contract.emitAttestTopic(topicId);
      await tx.wait(); // Wait for the transaction to be mined

      console.log('Topic attested successfully');
    } catch (error: any) {
      console.error('Error emitting attest topic:', error);
      setError(error.message || 'Error emitting attest topic');
    } finally {
      setLoading(false);
    }
  };

  return { emitAttestTopic, loading, error };
};
