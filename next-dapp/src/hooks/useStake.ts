import { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3Auth } from './useWeb3Auth';
import config from '@/config/sc';

type StakeHookReturn = {
  stake: (topicId: number) => Promise<void>;
  loading: boolean;
  error: string | null;
};

export const useStake = (): StakeHookReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getSigner } = useWeb3Auth();

  const stake = async (topicId: number) => {
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

      // Initialize the contract instance for the staking contract
      const contract = new ethers.Contract(
        config.CONTRACT_ADDRESS,
        config.CONTRACT_ABI,
        signer
      );

      const amount = ethers.utils.parseEther('0.003');

      // Call the stake function on the contract with the topicId and amount
      const tx = await contract.stake(topicId, {
        value: amount,
      });

      // Wait for the transaction to be mined
      await tx.wait();

      console.log(
        `Staked successfully for topic ID ${topicId} with amount ${ethers.utils.formatEther(amount)} ETH`
      );

      // You can add any additional logic here (like updating UI, showing success message, etc.)
    } catch (error: any) {
      console.error('Error staking for topic:', error);
      setError(error.message || 'Error staking for topic');
    } finally {
      setLoading(false);
    }
  };

  return { stake, loading, error };
};
